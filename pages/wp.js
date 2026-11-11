"use strict";
/*
 * WordPress REST helpers shared by pages/deploy.js and the blog scripts.
 * Needs ZG_WP_BASIC_AUTH in the environment. Never put the value in this repo.
 */

const crypto = require("crypto");

const API = "https://zana-g.com/wp-json";
const AUTH = process.env.ZG_WP_BASIC_AUTH;

function requireAuth() {
  if (!AUTH) {
    console.error("ZG_WP_BASIC_AUTH is not set.");
    process.exit(1);
  }
}

async function api(method, route, body) {
  const res = await fetch(`${API}${route}`, {
    method,
    headers: {
      Authorization: `Basic ${AUTH}`,
      "Content-Type": "application/json",
      "User-Agent": "zg-pages-deploy",
    },
    body: body ? JSON.stringify(body) : undefined,
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

const ability = (name, input) => api("POST", `/wp-abilities/v1/abilities/${name}/run`, { input });

/* Stable IDs, so a redeploy doesn't look like a new layout to Elementor. */
function stableId(seed) {
  return crypto.createHash("md5").update(seed).digest("hex").slice(0, 7);
}

/* Same structure as the home page: one flexbox with no padding, holding one HTML widget. */
function elementorData(slug, html) {
  const cls = `e-${stableId(`${slug}:class`)}`;
  return [
    {
      id: stableId(`${slug}:container`),
      elType: "e-flexbox",
      settings: { classes: { $$type: "classes", value: [cls] } },
      elements: [
        {
          id: stableId(`${slug}:widget`),
          elType: "widget",
          settings: { html },
          elements: [],
          widgetType: "html",
        },
      ],
      isInner: false,
      styles: {
        [cls]: {
          id: cls,
          label: "local",
          type: "class",
          variants: [
            {
              meta: { breakpoint: "desktop", state: null },
              props: {
                padding: { $$type: "size", value: { size: 0, unit: "px" } },
                "flex-direction": { $$type: "string", value: "column" },
              },
              custom_css: null,
            },
          ],
        },
      },
      version: "0.0",
    },
  ];
}

/* Clears LiteSpeed and the Hostinger CDN, so visitors get the new HTML. */
const clearCache = () => api("DELETE", "/hostinger-tools-plugin/v1/clear-cache");

module.exports = { API, requireAuth, api, ability, stableId, elementorData, clearCache };
