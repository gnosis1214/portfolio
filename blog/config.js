"use strict";

/*
 * Blog settings shared by the build, the deploy and the media upload.
 * Posts live in blog/posts/, one file per post.
 */

const SITE = "https://zana-g.com/";
const BLOG_SLUG = "blog";
const BLOG_URL = `${SITE}${BLOG_SLUG}/`;

/* The byline. Facts here are already on the home page. */
const AUTHOR = {
  name: "Genesis Montilla",
  short: "Zeno",
  photo: "https://zana-g.com/wp-content/uploads/2026/11/Anime-profile-in-a-futuristic-black-coat.webp",
  bio: "Web developer and designer behind Zana-G. I build and fix WordPress, Shopify and GoHighLevel sites, set up tracking and AI search basics, and automate the busywork, working remotely from Mindanao, Philippines for clients in 8+ countries.",
  url: `${SITE}#zeno-about`,
};

/*
 * Topics. `slug` is the WordPress category slug and the ?topic= value on the archive.
 * Add a topic here before a post uses it.
 */
const CATEGORIES = [
  { key: "websites", name: "Websites", slug: "websites", description: "Getting more from your website: speed, mobile, forms, content and care." },
  { key: "seo-ai", name: "SEO & AI search", slug: "seo-ai-search", description: "How search engines and AI answer engines find, read and recommend your business." },
  { key: "shopify", name: "Shopify", slug: "shopify", description: "Shopify stores, themes, Liquid sections and the apps around them." },
  { key: "tracking", name: "Tracking & ads", slug: "tracking-ads", description: "GA4, Google Tag Manager, Meta Pixel and landing pages that turn ad spend into leads." },
  { key: "automation", name: "Automation & AI", slug: "automation-ai", description: "n8n workflows, AI assistants and the busywork they take off your plate." },
  { key: "hiring", name: "Hiring a developer", slug: "hiring-a-developer", description: "What to expect when you hire a remote web developer, and how projects run." },
];

/* Swap for the Calendly URL when it is set. Until then it scrolls to the page's contact section. */
const BOOK_URL = "#zg-pg-contact";

/* Unsplash asks for a referral link back to the photographer and to Unsplash. */
const UNSPLASH_UTM = "utm_source=zana-g&utm_medium=referral";

const WORDS_PER_MINUTE = 220;

module.exports = { SITE, BLOG_SLUG, BLOG_URL, AUTHOR, CATEGORIES, BOOK_URL, UNSPLASH_UTM, WORDS_PER_MINUTE };
