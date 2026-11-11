"use strict";
/*
 * CSS helpers shared by the page and blog builds. Styles come from the home page
 * widget, so the look has one source of truth: every rule whose classes, IDs and
 * tags a page does not use is dropped.
 */

const fs = require("fs");
const path = require("path");

const WIDGET = path.join(__dirname, "..", "zeno-portfolio-elementor.html");

/* Classes added by the page script, so they never appear in the markup. */
const RUNTIME_CLASSES = ["open", "zg-scrolled", "z-missing", "zg-js", "zg-in", "zg-on", "zg-pin"];

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

function collectUsed(html, extraClasses = []) {
  const used = { classes: new Set([...RUNTIME_CLASSES, ...extraClasses]), ids: new Set(), tags: new Set() };
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
  /* Rules aimed outside the widget, like hiding Astra's scroll-to-top button, always stay. */
  if (!selector.startsWith("#zeno-portfolio")) return true;
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

module.exports = { WIDGET, RUNTIME_CLASSES, stripComments, compact, collectUsed, purge, printCss, widgetStyles };
