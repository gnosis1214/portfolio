#!/usr/bin/env node
/*
 * Builds the separate zana-g.com pages into paste-ready Elementor HTML widgets.
 *
 * CSS comes from the home page widget, so the look has one source of truth:
 * every rule whose classes, IDs and tags the page does not use is dropped.
 *
 * Usage: node pages/build.js
 * Output: pages/dist/<slug>.html, pages/dist/<slug>.content.html, pages/dist/new-copy.md
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { pages, newCopy, SITE } = require("./content");
const { renderPage, renderMain, renderSchema } = require("./template");
const { WIDGET, stripComments, compact, collectUsed, purge, printCss, widgetStyles } = require("./css");

const HERE = __dirname;
const DIST = path.join(HERE, "dist");

/* ---------- Checks: fail the build rather than ship a bad page ---------- */

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function checkPage(page, main, errors) {
  const say = (msg) => errors.push(`${page.slug}: ${msg}`);
  const h1s = main.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) say(`has ${h1s.length} H1 tags`);
  if (page.seoTitle.length > 60) say(`SEO title is ${page.seoTitle.length} characters`);
  if (page.seoDescription.length < 120 || page.seoDescription.length > 160) {
    say(`SEO description is ${page.seoDescription.length} characters`);
  }
  const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  levels.forEach((level, i) => {
    if (i && level > levels[i - 1] + 1) say(`heading jumps from H${levels[i - 1]} to H${level}`);
  });
  for (const m of main.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]+"/.test(m[0])) say(`image without alt text: ${m[0].slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(m[0]) || !/\sheight="\d+"/.test(m[0])) say(`image without dimensions: ${m[0].slice(0, 80)}`);
  }
}

/* Every service card must light up a part of its drawing, and every part needs a card. */
function checkParts(page, main, errors) {
  if (page.type !== "service") return;
  const inCards = new Set(page.cards.map((card) => card.part));
  const inArt = new Set([...main.matchAll(/class="zg-pg-part" data-part="([^"]+)"/g)].map((m) => m[1]));
  for (const name of inCards) if (!inArt.has(name)) errors.push(`${page.slug}: card part "${name}" has no matching drawing part`);
  for (const name of inArt) if (!inCards.has(name)) errors.push(`${page.slug}: drawing part "${name}" has no matching card`);
}

function checkLinks(page, html, widgetHtml, errors) {
  const slugs = new Set(pages.map((p) => p.slug));
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith("#")) {
      if (!html.includes(`id="${href.slice(1)}"`)) errors.push(`${page.slug}: broken anchor ${href}`);
      continue;
    }
    if (!href.startsWith(SITE)) continue;
    const rest = href.slice(SITE.length);
    if (rest === "") continue;
    if (rest.startsWith("#")) {
      if (!widgetHtml.includes(`id="${rest.slice(1)}"`)) errors.push(`${page.slug}: home page has no anchor ${rest}`);
      continue;
    }
    if (!slugs.has(rest.replace(/\/$/, ""))) errors.push(`${page.slug}: unknown internal link ${href}`);
  }
}

function checkUnique(errors) {
  for (const field of ["seoTitle", "seoDescription", "h1", "slug"]) {
    const seen = new Set();
    for (const p of pages) {
      if (seen.has(p[field])) errors.push(`${p.slug}: duplicate ${field}`);
      seen.add(p[field]);
    }
  }
}

/* ---------- Build ---------- */

function build() {
  const widgetHtml = fs.readFileSync(WIDGET, "utf8");
  const styles = widgetStyles();
  const ownCss = fs.readFileSync(path.join(HERE, "pages.css"), "utf8");
  const runtime = fs.readFileSync(path.join(HERE, "runtime.js"), "utf8");
  const errors = [];

  fs.mkdirSync(DIST, { recursive: true });
  checkUnique(errors);

  const rows = pages.map((page) => {
    const main = renderMain(page);
    const shell = renderPage(page, { css: "", runtime: "", schema: "" });
    const css = `${printCss(purge(styles, collectUsed(shell)))}\n${compact(stripComments(ownCss))}`;
    const html = renderPage(page, { css, runtime, schema: renderSchema(page) });

    checkPage(page, main, errors);
    checkParts(page, main, errors);
    checkLinks(page, html, widgetHtml, errors);

    fs.writeFileSync(path.join(DIST, `${page.slug}.html`), html);
    fs.writeFileSync(path.join(DIST, `${page.slug}.content.html`), `${main}\n`);

    return {
      slug: page.slug,
      kb: (Buffer.byteLength(html) / 1024).toFixed(1),
      cssKb: (Buffer.byteLength(css) / 1024).toFixed(1),
      words: textOf(main).split(" ").length,
      title: page.seoTitle.length,
      desc: page.seoDescription.length,
    };
  });

  const notes = ["# New copy for Zeno to review", "", "Everything else on these pages is reused word for word from the home page.", ""];
  for (const key of Object.keys(newCopy)) {
    notes.push(`## ${key}`, "");
    notes.push(...newCopy[key].map((line) => `- ${line}`), "");
  }
  fs.writeFileSync(path.join(DIST, "new-copy.md"), notes.join("\n"));

  console.table(rows);
  if (errors.length) {
    console.error(`\n${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  console.log("Build OK: all checks passed.");
}

build();
