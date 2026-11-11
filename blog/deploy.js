#!/usr/bin/env node
/*
 * Publishes the blog to zana-g.com: each post as a WordPress post on the Elementor
 * Canvas template (one HTML widget, like the pages), and the archive as the /blog/ page.
 *
 * Only posts whose built HTML changed since the last deploy are sent, so the
 * "last modified" date of older posts stays honest.
 *
 * Usage:
 *   node blog/build.js
 *   node blog/deploy.js [--draft] [--only <slug>] [--force]
 *
 * --draft   create new posts as drafts instead of publishing them
 * --only    deploy one post (the archive is still refreshed)
 * --force   send every post even if its HTML did not change
 *
 * Needs ZG_WP_BASIC_AUTH in the environment. Never put the value in this repo.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { requireAuth, api, ability, elementorData, clearCache } = require("../pages/wp");
const { CATEGORIES, BLOG_SLUG, SITE } = require("./config");

requireAuth();

const HERE = __dirname;
const DIST = path.join(HERE, "dist");
const IDS_FILE = path.join(HERE, "wp-ids.json");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);

const read = (file) => fs.readFileSync(path.join(DIST, file), "utf8");

async function ensureCategories(ids) {
  ids.categories = ids.categories || {};
  for (const cat of CATEGORIES) {
    if (ids.categories[cat.slug]) continue;
    const found = await api("GET", `/wp/v2/categories?slug=${cat.slug}&_fields=id,slug`);
    const saved = found[0] || (await api("POST", "/wp/v2/categories", { name: cat.name, slug: cat.slug, description: cat.description }));
    ids.categories[cat.slug] = saved.id;
  }
}

async function findExisting(type, slug) {
  const found = await api(
    "GET",
    `/wp/v2/${type}?slug=${encodeURIComponent(slug)}&status=publish,draft,private,pending,future,trash&context=edit&_fields=id,slug,status,link`
  );
  return found[0] || null;
}

/* Publish time for a new post: the post's date (Manila morning), or now if that is still ahead. */
function publishDate(date) {
  const at = Math.min(Date.parse(`${date}T08:00:00+08:00`), Date.now() - 60 * 1000);
  return new Date(at).toISOString().slice(0, 19);
}

async function save(type, item, extra, ids, bucket) {
  const html = read(`${item.slug}.html`);
  const content = read(`${item.slug}.content.html`);
  const existing = await findExisting(type, item.slug);
  if (existing && existing.status === "trash") {
    throw new Error(`${item.slug}: a trashed ${type === "posts" ? "post" : "page"} holds this slug (ID ${existing.id}). Restore or delete it first.`);
  }
  const before = (ids[bucket] || {})[item.slug];
  const unchanged = existing && before && before.hash === item.hash && existing.status === "publish";
  if (unchanged && !flag("--force")) return { slug: item.slug, id: existing.id, status: existing.status, action: "unchanged" };

  const body = {
    title: item.title,
    slug: item.slug,
    template: "elementor_canvas",
    content,
    excerpt: item.excerpt || item.seoDescription,
    comment_status: "closed",
    ping_status: "closed",
    meta: {
      _elementor_edit_mode: "builder",
      _elementor_template_type: type === "posts" ? "wp-post" : "wp-page",
      _elementor_data: JSON.stringify(elementorData(item.slug, html)),
      _elementor_page_settings: { hide_title: "yes" },
    },
    ...extra(existing),
  };
  if (item.mediaId) body.featured_media = item.mediaId;

  const saved = existing ? await api("POST", `/wp/v2/${type}/${existing.id}`, body) : await api("POST", `/wp/v2/${type}`, body);
  if (saved.slug !== item.slug) throw new Error(`${item.slug}: WordPress changed the slug to ${saved.slug}.`);

  await ability("yoast-seo/update-post-seo-data", {
    post_id: saved.id,
    seo_title: item.seoTitle,
    meta_description: item.seoDescription,
  });
  /* Clears Elementor's document cache so the new widget HTML is what gets served. */
  await ability("elementor/update-page-settings", { post_id: saved.id, settings: { hide_title: "yes" } });

  ids[bucket] = ids[bucket] || {};
  ids[bucket][item.slug] = { id: saved.id, hash: item.hash };
  return { slug: item.slug, id: saved.id, status: saved.status, action: existing ? "updated" : "created" };
}

async function main() {
  const { posts, archive } = JSON.parse(read("index.json"));
  const ids = fs.existsSync(IDS_FILE) ? JSON.parse(fs.readFileSync(IDS_FILE, "utf8")) : {};
  const only = option("--only");
  const targets = only ? posts.filter((p) => p.slug === only) : posts;
  if (only && !targets.length) throw new Error(`No built post with slug ${only}. Run node blog/build.js first.`);
  for (const p of targets) if (!p.mediaId) throw new Error(`${p.slug}: no featured image. Run node blog/media.js --slug ${p.slug}.`);

  await ensureCategories(ids);
  const results = [];
  for (const post of targets) {
    const result = await save(
      "posts",
      post,
      (existing) => {
        const extra = { categories: [ids.categories[post.category]] };
        if (!existing) {
          extra.status = flag("--draft") ? "draft" : "publish";
          extra.date_gmt = publishDate(post.date);
        } else if (existing.status !== "publish" && !flag("--draft")) {
          extra.status = "publish";
        }
        return extra;
      },
      ids,
      "posts"
    );
    results.push(result);
  }
  results.push(await save("pages", archive, () => ({ status: "publish" }), ids, "pages"));

  fs.writeFileSync(IDS_FILE, `${JSON.stringify(ids, null, 2)}\n`);
  const changed = results.some((r) => r.action !== "unchanged");
  if (changed) await clearCache();
  console.table(results);
  console.log(changed ? "Cache cleared. Live at:" : "Nothing changed. Live at:");
  for (const r of results) console.log(`  ${SITE}${r.slug === BLOG_SLUG ? BLOG_SLUG : r.slug}/`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
