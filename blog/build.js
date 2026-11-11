#!/usr/bin/env node
/*
 * Builds the zana-g.com blog: one Elementor HTML widget per post, plus the /blog/ archive.
 * The build fails rather than ship a post with a broken link, a missing image,
 * a bad SEO title or description, or a skipped heading level.
 *
 * Usage:
 *   node blog/build.js            build everything into blog/dist/
 *   node blog/build.js --preview  also write full HTML documents to blog/dist/preview/ for local checks
 *
 * Output per post: dist/<slug>.html (the widget), dist/<slug>.content.html (plain post_content),
 * plus dist/blog.html, dist/blog.content.html and dist/index.json for the deploy.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pages } = require("../pages/content");
const { stripComments, compact, parseCss, collectUsed, purge, printCss, widgetStyles, WIDGET } = require("../pages/css");
const { SITE, BLOG_SLUG, CATEGORIES } = require("./config");
const T = require("./template");

const HERE = __dirname;
const DIST = path.join(HERE, "dist");
const POSTS_DIR = path.join(HERE, "posts");
const MEDIA_FILE = path.join(HERE, "media.json");
const PREVIEW = process.argv.includes("--preview");

/* Classes the blog script adds at runtime. */
const BLOG_RUNTIME_CLASSES = ["on", "is-started", "zg-bl-lead", "zg-in"];

function loadPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".js"))
    .map((f) => {
      const file = path.join(POSTS_DIR, f);
      delete require.cache[require.resolve(file)];
      return { ...require(file), file: f };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/* ---------- checks ---------- */

function checkPost(post, errors) {
  const say = (msg) => errors.push(`${post.slug || post.file}: ${msg}`);
  for (const field of ["slug", "key", "date", "category", "title", "seoTitle", "seoDescription", "excerpt", "image", "body"]) {
    if (!post[field]) say(`missing ${field}`);
  }
  if (!post.slug || !post.body) return;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) say("slug must be lowercase words joined by hyphens");
  if (!/^[a-z0-9_]+$/.test(post.key)) say("key must be lowercase letters, numbers and underscores (it labels analytics events)");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(Date.parse(post.date))) say(`bad date ${post.date}`);
  if (!post.file.startsWith(post.date)) say(`file name should start with the post date (${post.date})`);
  if (!CATEGORIES.some((c) => c.key === post.category)) say(`unknown category ${post.category}`);
  if (post.seoTitle.length > 60) say(`SEO title is ${post.seoTitle.length} characters (max 60)`);
  if (post.seoDescription.length < 120 || post.seoDescription.length > 160) say(`SEO description is ${post.seoDescription.length} characters (120-160)`);
  if (post.excerpt.length > 240) say(`excerpt is ${post.excerpt.length} characters (max 240)`);
  if (!post.takeaways || post.takeaways.length < 2) say("needs at least 2 takeaways");
  if (!post.image.alt || post.image.alt.length < 10) say("image needs real alt text");
  if (!post.image.credit || !post.image.credit.name || !post.image.credit.site) say("image needs a credit (name and site)");
  if (!post.body.some((b) => b.cta)) say("needs a cta block");
  if (post.body.filter((b) => b.h2).length < 3) say("needs at least 3 H2 sections");
  const words = T.bodyText(post).split(/\s+/).filter(Boolean).length;
  if (words < 700) say(`only ${words} words (min 700)`);
  /* Copy rule: no long dashes, they read as machine-written on this site. */
  const raw = JSON.stringify(post);
  if (/[—–]/.test(raw)) say("uses an em or en dash; rewrite with commas, colons or full stops");
  for (const s of post.services || []) if (!pages.some((p) => p.slug === s)) say(`unknown service page ${s}`);
}

function checkHtml(label, main, errors) {
  const say = (msg) => errors.push(`${label}: ${msg}`);
  const h1s = main.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) say(`has ${h1s.length} H1 tags`);
  const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  levels.forEach((level, i) => {
    if (i && level > levels[i - 1] + 1) say(`heading jumps from H${levels[i - 1]} to H${level}`);
  });
  for (const m of main.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(m[0])) say(`image without alt attribute: ${m[0].slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(m[0]) || !/\sheight="\d+"/.test(m[0])) say(`image without dimensions: ${m[0].slice(0, 80)}`);
  }
  const ids = [...main.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) say(`duplicate ids: ${[...new Set(dupes)].join(", ")}`);
}

function checkLinks(label, html, known, widgetHtml, errors) {
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (href.startsWith("#")) {
      if (href.length > 1 && !html.includes(`id="${href.slice(1)}"`)) errors.push(`${label}: broken anchor ${href}`);
      continue;
    }
    if (!href.startsWith(SITE)) continue;
    const rest = href.slice(SITE.length).split("?")[0];
    if (rest === "") continue;
    if (rest.startsWith("#")) {
      if (!widgetHtml.includes(`id="${rest.slice(1)}"`)) errors.push(`${label}: home page has no anchor ${rest}`);
      continue;
    }
    if (rest.startsWith("wp-content/uploads/")) continue;
    const slug = rest.replace(/\/$/, "").split("#")[0];
    if (!known.has(slug)) errors.push(`${label}: unknown internal link ${href}`);
    if (!rest.split("#")[0].endsWith("/")) errors.push(`${label}: internal link without trailing slash ${href}`);
  }
}

/* ---------- CSS ---------- */

function cssFor(shell, styles, ownNodes) {
  const used = collectUsed(shell, BLOG_RUNTIME_CLASSES);
  return `${printCss(purge(styles, used))}\n${printCss(purge(ownNodes, used))}`;
}

const hash = (text) => crypto.createHash("sha1").update(text).digest("hex").slice(0, 12);

function previewDoc(title, widget) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body style="margin:0">\n${widget}</body></html>\n`;
}

/* ---------- build ---------- */

function build() {
  const posts = loadPosts();
  const media = fs.existsSync(MEDIA_FILE) ? JSON.parse(fs.readFileSync(MEDIA_FILE, "utf8")) : {};
  const widgetHtml = fs.readFileSync(WIDGET, "utf8");
  const styles = widgetStyles();
  const ownCss = ["../pages/pages.css", "blog.css"].map((f) => fs.readFileSync(path.join(HERE, f), "utf8")).join("\n");
  const ownNodes = parseCss(stripComments(ownCss));
  const runtime = [
    fs.readFileSync(path.join(HERE, "..", "pages", "runtime.js"), "utf8"),
    fs.readFileSync(path.join(HERE, "runtime.js"), "utf8"),
  ].join("\n");
  const errors = [];

  const pageSlugs = pages.map((p) => p.slug);
  const known = new Set([...pageSlugs, BLOG_SLUG, ...posts.map((p) => p.slug)]);
  for (const field of ["slug", "key", "title", "seoTitle", "seoDescription"]) {
    const seen = new Set(field === "slug" ? [...pageSlugs, BLOG_SLUG] : []);
    for (const p of posts) {
      if (seen.has(p[field])) errors.push(`${p.slug}: duplicate ${field} "${p[field]}"`);
      seen.add(p[field]);
    }
  }

  const missingMedia = [];
  const mediaFor = (post) => {
    const m = media[post.slug];
    if (m) return m;
    missingMedia.push(post.slug);
    /* Placeholder so the rest of the build can still be checked. */
    return { id: 0, src: `${SITE}missing-image.jpg`, width: 1600, height: 900, sizes: [{ w: 1600, src: `${SITE}missing-image.jpg` }] };
  };

  fs.mkdirSync(DIST, { recursive: true });
  if (PREVIEW) fs.mkdirSync(path.join(DIST, "preview"), { recursive: true });

  const index = [];
  const rows = [];
  for (const post of posts) {
    checkPost(post, errors);
    if (!post.body) continue;
    const main = T.postMain(post, posts, mediaFor);
    const shell = T.renderShell(post.slug, main, { css: "", runtime: "" });
    const html = T.renderShell(post.slug, main, { css: cssFor(shell, styles, ownNodes), runtime });
    checkHtml(post.slug, main, errors);
    checkLinks(post.slug, html, known, widgetHtml, errors);
    const content = `${T.postPlain(post)}\n`;
    fs.writeFileSync(path.join(DIST, `${post.slug}.html`), html);
    fs.writeFileSync(path.join(DIST, `${post.slug}.content.html`), content);
    if (PREVIEW) fs.writeFileSync(path.join(DIST, "preview", `${post.slug}.html`), previewDoc(post.seoTitle, html));
    const cat = CATEGORIES.find((c) => c.key === post.category);
    index.push({
      slug: post.slug,
      title: post.title,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      excerpt: post.excerpt,
      date: post.date,
      category: cat ? cat.slug : null,
      mediaId: (media[post.slug] || {}).id || null,
      hash: hash(html + content),
    });
    rows.push({ slug: post.slug, date: post.date, words: T.bodyText(post).split(/\s+/).length, mins: T.readMinutes(post), kb: (Buffer.byteLength(html) / 1024).toFixed(1), title: post.seoTitle.length, desc: post.seoDescription.length });
  }

  /* Archive */
  const amain = T.archiveMain(posts, mediaFor);
  const ashell = T.renderShell("archive", amain, { css: "", runtime: "" });
  const ahtml = T.renderShell("archive", amain, { css: cssFor(ashell, styles, ownNodes), runtime });
  checkHtml(BLOG_SLUG, amain, errors);
  checkLinks(BLOG_SLUG, ahtml, known, widgetHtml, errors);
  const acontent = `${T.archivePlain(posts)}\n`;
  fs.writeFileSync(path.join(DIST, `${BLOG_SLUG}.html`), ahtml);
  fs.writeFileSync(path.join(DIST, `${BLOG_SLUG}.content.html`), acontent);
  if (PREVIEW) fs.writeFileSync(path.join(DIST, "preview", `${BLOG_SLUG}.html`), previewDoc("Blog", ahtml));
  rows.push({ slug: BLOG_SLUG, date: "", words: "", mins: "", kb: (Buffer.byteLength(ahtml) / 1024).toFixed(1), title: "", desc: "" });

  const archive = {
    slug: BLOG_SLUG,
    title: "Blog",
    seoTitle: "Blog: Websites, Shopify and AI Search Tips | Zana-G",
    seoDescription: "Plain-English guides on websites, Shopify, tracking and AI search for business owners and agencies, from remote web developer Genesis Montilla.",
    mediaId: posts.length ? (media[posts[0].slug] || {}).id || null : null,
    hash: hash(ahtml + acontent),
  };
  if (archive.seoTitle.length > 60) errors.push(`archive: SEO title is ${archive.seoTitle.length} characters`);
  if (archive.seoDescription.length < 120 || archive.seoDescription.length > 160) errors.push(`archive: SEO description is ${archive.seoDescription.length} characters`);

  fs.writeFileSync(path.join(DIST, "index.json"), `${JSON.stringify({ posts: index, archive }, null, 2)}\n`);

  console.table(rows);
  if (missingMedia.length) errors.push(`no uploaded image yet for: ${[...new Set(missingMedia)].join(", ")} (run node blog/media.js --slug <slug>)`);
  if (errors.length) {
    console.error(`\n${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  console.log(`Build OK: ${posts.length} post(s) and the archive passed every check.`);
}

build();
