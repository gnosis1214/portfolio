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

const HERE = __dirname;
const DIST = path.join(HERE, "dist");
const WIDGET = path.join(HERE, "..", "zeno-portfolio-elementor.html");

/* Classes added by the page script, so they never appear in the markup. */
const RUNTIME_CLASSES = ["open", "zg-scrolled", "z-missing"];

/* ---------- CSS parsing ---------- */

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/* Reads up to the next top-level "{", ";" or "}", skipping strings and parens. */
function readPrelude(css, start) {
  let i = start;
  let quote = null;
  let depth = 0;
  for (; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (depth === 0 && (c === "{" || c === ";" || c === "}")) break;
  }
  return i;
}

function readBlockEnd(css, start) {
  let i = start;
  let quote = null;
  let depth = 1;
  for (; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("Unbalanced braces in the widget CSS");
}

function parseCss(css) {
  let i = 0;
  function block(top) {
    const nodes = [];
    while (i < css.length) {
      while (i < css.length && /\s/.test(css[i])) i++;
      if (i >= css.length) break;
      if (css[i] === "}") {
        if (top) throw new Error("Stray } in the widget CSS");
        i++;
        return nodes;
      }
      const end = readPrelude(css, i);
      const prelude = css.slice(i, end).trim();
      i = end;
      if (css[i] === ";") {
        i++;
        continue;
      }
      if (css[i] !== "{") continue;
      i++;
      if (/^@(media|supports|container)\b/.test(prelude)) {
        nodes.push({ type: "group", prelude, children: block(false) });
      } else {
        const close = readBlockEnd(css, i);
        const body = css.slice(i, close);
        i = close + 1;
        nodes.push(
          prelude.startsWith("@")
            ? { type: "at", prelude, body }
            : { type: "rule", selector: prelude, body }
        );
      }
    }
    if (!top) throw new Error("Unclosed block in the widget CSS");
    return nodes;
  }
  return block(true);
}

function splitSelectors(selector) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const c of selector) {
    if (c === "(" || c === "[") depth++;
    if (c === ")" || c === "]") depth--;
    if (c === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += c;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/* ---------- Purge ---------- */

function collectUsed(html) {
  const used = { classes: new Set(RUNTIME_CLASSES), ids: new Set(), tags: new Set() };
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
    used.tags.add(m[1].toLowerCase());
    const attrs = m[2];
    const cls = attrs.match(/\sclass="([^"]*)"/);
    if (cls) cls[1].split(/\s+/).filter(Boolean).forEach((c) => used.classes.add(c));
    const id = attrs.match(/\sid="([^"]*)"/);
    if (id) used.ids.add(id[1]);
  }
  return used;
}

function keepSelector(selector, used) {
  const plain = selector.replace(/:not\([^)]*\)/g, "").replace(/\[[^\]]*\]/g, "");
  for (const m of plain.matchAll(/\.([A-Za-z_][\w-]*)/g)) {
    if (!used.classes.has(m[1])) return false;
  }
  for (const m of plain.matchAll(/#([A-Za-z_][\w-]*)/g)) {
    if (m[1] !== "zeno-portfolio" && !used.ids.has(m[1])) return false;
  }
  const tagsOnly = plain.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, " ").replace(/[.#][\w-]+/g, " ");
  for (const m of tagsOnly.matchAll(/[a-zA-Z][a-zA-Z0-9]*/g)) {
    const tag = m[0].toLowerCase();
    if (tag !== "html" && tag !== "body" && !used.tags.has(tag)) return false;
  }
  return true;
}

function purge(nodes, used) {
  const out = [];
  for (const node of nodes) {
    if (node.type === "rule") {
      const kept = splitSelectors(node.selector).filter((s) => keepSelector(s, used));
      if (kept.length) out.push({ ...node, selector: kept.join(",") });
    } else if (node.type === "group") {
      const children = purge(node.children, used);
      if (children.length) out.push({ ...node, children });
    } else out.push(node);
  }
  return out;
}

function compact(text) {
  return text.replace(/\s+/g, " ").trim();
}

function printNodes(nodes, keepAt) {
  return nodes
    .map((node) => {
      if (node.type === "rule") return `${compact(node.selector)}{${compact(node.body)}}`;
      if (node.type === "group") return `${compact(node.prelude)}{${printNodes(node.children, keepAt)}}`;
      return keepAt(node) ? `${compact(node.prelude)}{${compact(node.body)}}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

/* Keeps only the @keyframes that a surviving rule refers to. */
function printCss(nodes) {
  const withoutAt = printNodes(nodes, () => false);
  const keepAt = (node) => {
    const m = node.prelude.match(/^@(?:-webkit-)?keyframes\s+([\w-]+)/);
    if (!m) return true;
    return new RegExp(`(^|[\\s:,])${m[1]}([\\s;,}]|$)`, "m").test(withoutAt);
  };
  return printNodes(nodes, keepAt);
}

function widgetStyles() {
  const html = fs.readFileSync(WIDGET, "utf8");
  const blocks = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  if (blocks.length !== 2) throw new Error(`Expected 2 style blocks in the widget, found ${blocks.length}`);
  return parseCss(stripComments(blocks.join("\n")));
}

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
  for (const page of pages) {
    notes.push(`## ${page.slug}`, "");
    notes.push(...(newCopy[page.slug] || []).map((line) => `- ${line}`), "");
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
