#!/usr/bin/env node
/*
 * Downloads a post's stock photo, uploads it to the WordPress media library with its
 * alt text and credit, and records the generated sizes in blog/media.json.
 *
 * The post file says where the photo comes from:
 *   image: { unsplash: "https://images.unsplash.com/photo-...", alt, credit: { name, url, site, siteUrl } }
 *   image: { url: "https://cdn.stocksnap.io/img-thumbs/960w/XXXX.jpg", alt, credit: {...} }
 *
 * Usage: node blog/media.js --slug <post-slug> [--force]
 * Needs ZG_WP_BASIC_AUTH in the environment. Never put the value in this repo.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const API = "https://zana-g.com/wp-json";
const HERE = __dirname;
const MEDIA_FILE = path.join(HERE, "media.json");
const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);

const AUTH = process.env.ZG_WP_BASIC_AUTH;
if (!AUTH) {
  console.error("ZG_WP_BASIC_AUTH is not set.");
  process.exit(1);
}

function findPost(slug) {
  for (const f of fs.readdirSync(path.join(HERE, "posts"))) {
    if (!f.endsWith(".js")) continue;
    const post = require(path.join(HERE, "posts", f));
    if (post.slug === slug) return post;
  }
  throw new Error(`No post with slug ${slug} in blog/posts/`);
}

/* 1600x900 crop for Unsplash (imgix does the resize), otherwise the file as it is. */
function sourceUrl(image) {
  if (image.unsplash) {
    const base = image.unsplash.split("?")[0];
    if (!/^https:\/\/images\.unsplash\.com\/photo-[\w-]+$/.test(base)) throw new Error(`Not an images.unsplash.com photo URL: ${base}`);
    return `${base}?w=1600&h=900&fit=crop&crop=entropy&fm=jpg&q=78`;
  }
  if (image.url) return image.url;
  throw new Error("image needs an unsplash or url field");
}

async function wp(method, route, body, headers = {}) {
  const res = await fetch(`${API}${route}`, {
    method,
    headers: { Authorization: `Basic ${AUTH}`, "User-Agent": "zg-blog-media", ...headers },
    body,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`${method} ${route}: HTTP ${res.status}, not JSON: ${text.slice(0, 200)}`);
  }
  if (!res.ok) throw new Error(`${method} ${route}: HTTP ${res.status}: ${data.message || text.slice(0, 200)}`);
  return data;
}

function sizesOf(item) {
  const d = item.media_details || {};
  const list = Object.values(d.sizes || {})
    .filter((s) => s.width >= 300 && s.source_url && Math.abs(s.width / s.height - d.width / d.height) < 0.05)
    .map((s) => ({ w: s.width, src: s.source_url }));
  list.push({ w: d.width, src: item.source_url });
  const seen = new Set();
  return list.filter((s) => !seen.has(s.w) && seen.add(s.w)).sort((a, b) => a.w - b.w);
}

async function main() {
  const slug = option("--slug");
  if (!slug) throw new Error("Pass --slug <post-slug>");
  const post = findPost(slug);
  const media = fs.existsSync(MEDIA_FILE) ? JSON.parse(fs.readFileSync(MEDIA_FILE, "utf8")) : {};
  const from = sourceUrl(post.image);

  if (media[slug] && media[slug].from === from && !args.includes("--force")) {
    console.log(`${slug}: already uploaded as media ${media[slug].id}. Pass --force to upload again.`);
    return;
  }

  const res = await fetch(from, { headers: { "User-Agent": "zg-blog-media" } });
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status} for ${from}`);
  const type = res.headers.get("content-type") || "";
  if (!/^image\/(jpeg|png|webp)$/.test(type)) throw new Error(`Not a JPEG, PNG or WebP image: ${type}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[type];

  const uploaded = await wp("POST", "/wp/v2/media", buffer, {
    "Content-Type": type,
    "Content-Disposition": `attachment; filename="${slug}.${ext}"`,
  });
  const c = post.image.credit;
  const item = await wp(
    "POST",
    `/wp/v2/media/${uploaded.id}`,
    JSON.stringify({
      title: post.title,
      alt_text: post.image.alt,
      caption: `Photo: ${c.name} on ${c.site}`,
      description: `Photo by ${c.name}${c.url ? ` (${c.url})` : ""} on ${c.site}. Source: ${from.split("?")[0]}`,
    }),
    { "Content-Type": "application/json" }
  );

  media[slug] = {
    id: item.id,
    from,
    src: item.source_url,
    width: item.media_details.width,
    height: item.media_details.height,
    sizes: sizesOf(item),
  };
  fs.writeFileSync(MEDIA_FILE, `${JSON.stringify(media, null, 2)}\n`);
  console.log(`${slug}: uploaded media ${item.id} (${(buffer.length / 1024).toFixed(0)} KB, ${media[slug].sizes.length} sizes)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
