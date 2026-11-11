#!/usr/bin/env node
/*
 * Creates or updates the separate pages on zana-g.com through the REST API.
 * Pages stay drafts unless --publish is passed, and a published page is never
 * overwritten without it.
 *
 * Needs ZG_WP_BASIC_AUTH in the environment. Never put the value in this repo.
 *
 * Usage:
 *   node pages/build.js
 *   node pages/deploy.js [--only <slug>] [--publish] [--preview-out <file>]
 *
 * --preview-out saves signed preview links to a file. They work without a login,
 * so keep that file out of this public repo.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { pages } = require("./content");

const HERE = __dirname;
const DIST = path.join(HERE, "dist");
const IDS_FILE = path.join(HERE, "page-ids.json");

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);

const { requireAuth, api, ability, elementorData } = require("./wp");

requireAuth();

async function findExisting(slug) {
  const found = await api(
    "GET",
    `/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=publish,draft,private,pending,trash&context=edit&_fields=id,slug,status`
  );
  return found[0] || null;
}

async function deployPage(page, publish) {
  const html = fs.readFileSync(path.join(DIST, `${page.slug}.html`), "utf8");
  const content = fs.readFileSync(path.join(DIST, `${page.slug}.content.html`), "utf8");
  const existing = await findExisting(page.slug);

  if (existing && existing.status === "trash") {
    throw new Error(`${page.slug}: a trashed page holds this slug (ID ${existing.id}). Restore or delete it first.`);
  }
  if (existing && existing.status === "publish" && !publish) {
    throw new Error(`${page.slug}: already published (ID ${existing.id}). Pass --publish to overwrite it.`);
  }

  const body = {
    title: page.title,
    slug: page.slug,
    status: publish ? "publish" : "draft",
    template: "elementor_canvas",
    content,
    excerpt: page.seoDescription,
    featured_media: page.mediaId,
    comment_status: "closed",
    ping_status: "closed",
    meta: {
      _elementor_edit_mode: "builder",
      _elementor_template_type: "wp-page",
      _elementor_data: JSON.stringify(elementorData(page.slug, html)),
      _elementor_page_settings: { hide_title: "yes" },
    },
  };

  const saved = existing
    ? await api("POST", `/wp/v2/pages/${existing.id}`, body)
    : await api("POST", "/wp/v2/pages", body);

  if (saved.slug !== page.slug) {
    throw new Error(`${page.slug}: WordPress changed the slug to ${saved.slug}.`);
  }

  await ability("yoast-seo/update-post-seo-data", {
    post_id: saved.id,
    seo_title: page.seoTitle,
    meta_description: page.seoDescription,
  });

  /* Clears Elementor's document cache so the new widget HTML is what gets served. */
  await ability("elementor/update-page-settings", {
    post_id: saved.id,
    settings: { hide_title: "yes" },
  });

  return { slug: page.slug, id: saved.id, status: saved.status, action: existing ? "updated" : "created" };
}

async function main() {
  const only = option("--only");
  const publish = flag("--publish");
  const previewOut = option("--preview-out");
  const targets = only ? pages.filter((p) => p.slug === only) : pages;
  if (!targets.length) throw new Error(`No page with slug ${only}`);

  const ids = fs.existsSync(IDS_FILE) ? JSON.parse(fs.readFileSync(IDS_FILE, "utf8")) : {};
  const results = [];
  for (const page of targets) {
    const result = await deployPage(page, publish);
    ids[page.slug] = result.id;
    results.push(result);
  }
  fs.writeFileSync(IDS_FILE, `${JSON.stringify(ids, null, 2)}\n`);
  console.table(results);

  if (previewOut) {
    const previews = {};
    for (const result of results) {
      const link = await ability("elementor/create-preview-link", { post_id: result.id });
      previews[result.slug] = { id: result.id, url: link.url, edit_url: link.edit_url };
    }
    fs.writeFileSync(previewOut, JSON.stringify(previews, null, 2));
    console.log(`Preview links saved outside the repo: ${previewOut}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
