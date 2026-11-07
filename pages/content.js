"use strict";

/*
 * Copy for the separate zana-g.com pages.
 *
 * Rule: project facts are reused word for word from the home page widget. Anything
 * written new is wrapped in N(), which lists it in dist/new-copy.md for Zeno to review.
 * Never add clients, results or metrics here that aren't already on the site.
 */

const SITE = "https://zana-g.com/";

/* Swap for the Calendly URL when it is set. Until then it scrolls to the page's contact section. */
const BOOK_URL = "#zg-pg-contact";

const newCopy = {};
let currentSlug = "";
function N(text) {
  (newCopy[currentSlug] = newCopy[currentSlug] || []).push(text);
  return text;
}

const IMG = "https://zana-g.com/wp-content/uploads/2026/10/";

/* Tag and copy: the home page's project cards. */
const PROJECTS = {
  graceful: {
    key: "graceful",
    name: "Graceful Connections Home Care",
    domain: "gracefulconnectionshomecare.com",
    src: `${IMG}gracefulconnections.webp`,
    alt: "Graceful Connections Home Care website, desktop view",
    tag: "WordPress / Technical SEO",
    copy: "A full WordPress / Elementor build. Worked on technical SEO improvements, including schema markup and Rich Results validation. Also updated llms.txt and refined Elementor content to help keep the site structured, accessible, and easier for search tools to interpret.",
    caseSlug: "graceful-connections-case-study",
    mediaId: 61,
  },
  mpp: {
    key: "mpp",
    name: "MPP Legal",
    domain: "mpplegal.com",
    src: `${IMG}mpplegal.webp`,
    alt: "MPP Legal website, desktop view",
    tag: "WordPress / Elementor",
    copy: "Worked on website content updates and attorney profile pages, along with SEO improvements and internal linking. These tasks supported clearer navigation, more consistent page content, and ongoing WordPress and Elementor maintenance.",
  },
  appliance: {
    key: "appliance",
    name: "Appliance USA Pro",
    domain: "applianceusapro.com",
    src: `${IMG}applianceusapro.webp`,
    alt: "Appliance USA Pro website screenshot",
    tag: "WordPress / Elementor",
    copy: "Worked on page design and layout improvements, including team sections and Google Reviews integration. Also helped configure Tutor LMS and resolve functionality issues to support a clearer, more reliable website experience.",
  },
  simple: {
    key: "simple",
    name: "Simple Forwarding",
    domain: "simpleforwarding.com",
    src: `${IMG}simpleforwarding.webp`,
    alt: "Simple Forwarding website screenshot",
    tag: "WordPress / Staging / Website Improvements",
    copy: "Worked in a Hostinger staging environment to review and improve the website before changes went live. Tasks included fixing links, refining Calendly calls to action, improving mobile navigation, and handling general website updates.",
  },
  pagulayan: {
    key: "pagulayan",
    name: "Pagulayan Cues (Tallmade)",
    domain: "pagulayancues.com",
    src: `${IMG}Tallmade.webp`,
    alt: "Tallmade product landing page by Pagulayan Cues on a laptop",
    tag: "Shopify / Interactive 3D",
    copy: "Built an advanced Tallmade product showcase with scroll-triggered animations, responsive layouts, and an interactive 360° product viewer. The project combined front-end presentation and motion to create a more engaging way to explore the product.",
    caseSlug: "pagulayan-cues-case-study",
    mediaId: 101,
  },
  mlb: {
    key: "mlb",
    name: "MLB Artist",
    domain: "mlbartist.com",
    src: `${IMG}MLB-ARTIST.webp`,
    alt: "MLB Artist Shopify store, desktop view",
    tag: "Shopify / E-commerce",
    copy: "Worked across Shopify development and storefront improvements, including product listings, custom Liquid sections, product bundles, and Printful integration. Also supported lifestyle imagery, SEO updates, and enhancements to the overall shopping experience.",
  },
  lov: {
    key: "lov",
    name: "Lov Spa",
    tag: "Shopify / Theme Customization",
    copy: "Customized the Shopify theme to match the brand, refining layouts and sections so the store presents its services more clearly.",
  },
  walker: {
    key: "walker",
    name: "The Walker Group",
    domain: "thewalkergroup.com",
    src: `${IMG}thewalkergroup.webp`,
    alt: "The Walker Group website, desktop view",
    tag: "Technical SEO",
    copy: "Worked on llms.txt updates and AI-readable content organization, with a focus on technical SEO and AI crawler optimization. The work centered on making existing website information more clearly structured for automated discovery.",
    caseSlug: "walker-group-case-study",
    mediaId: 68,
  },
};

/* The home page's "How a project runs" section. */
const PROCESS_STEPS = [
  { title: "Discover", copy: "A short call or brief to understand your goals, users, platform and deadline." },
  { title: "Plan", copy: "Scope, task list, time-box and a clear definition of done, agreed before I start." },
  { title: "Build", copy: "Built on staging or a duplicate page first, with Git backups at every milestone." },
  { title: "QA", copy: "Mobile, speed, links, forms and tracking checked before anything goes live." },
  { title: "Launch & support", copy: "Go-live, handoff notes, and optional monthly care so the site stays healthy." },
];

/* The home page's FAQ. */
const FAQ = {
  timezone: {
    q: "What time zone are you in?",
    a: "I'm based in Mindanao, Philippines (GMT+8) and schedule calls around US, UK and AU working hours. I keep a few hours of overlap with your working day for calls and quick replies.",
  },
  length: {
    q: "How long does a project take?",
    a: "Small fixes usually take 1–3 days. A full website or Shopify store usually takes 2–4 weeks. The timeline is agreed up front, before work starts.",
  },
  revisions: {
    q: "How many revisions are included?",
    a: "Each package includes 2 rounds of revisions. Small changes after launch are covered by the monthly care plan.",
  },
  platforms: {
    q: "Which platforms do you work with?",
    a: "WordPress (Elementor, Gutenberg, WooCommerce), Shopify, GoHighLevel, Squarespace and Wix, plus custom builds in React / Next.js and automations in n8n.",
  },
  payment: {
    q: "How does payment work?",
    a: "Through Upwork or OnlineJobs.ph, or by direct invoice through Wise or PayPal. Projects are usually 50% upfront and 50% on launch.",
  },
  agencies: {
    q: "Do you work with agencies?",
    a: "Yes. I can work under your agency's brand, follow your process and tools, and stay behind the scenes.",
  },
  safe: {
    q: "Is my live site safe while you work?",
    a: "Yes. I work on staging or a duplicate page first, back up with Git, and confirm with you before anything changes on the live site.",
  },
};

/* Small prompts shown next to the graphics. */
currentSlug = "every page";
const HINTS = {
  fig: N("Hover a card or click the drawing."),
  figTouch: N("Scroll the cards or tap the drawing."),
  steps: N("Pick a step."),
  views: N("Switch view."),
};

const pages = [];
function add(page) {
  pages.push(page);
}

/* ---------- Service: WordPress and Elementor ---------- */
currentSlug = "wordpress-elementor-developer";
add({
  type: "service",
  key: "wordpress",
  slug: currentSlug,
  title: "WordPress & Elementor Developer",
  crumb: "WordPress & Elementor",
  footLabel: "WordPress & Elementor",
  seoTitle: "Freelance WordPress & Elementor Developer | Genesis Montilla",
  seoDescription: "Remote WordPress and Elementor developer (GMT+8) for agencies and small businesses: site builds, custom pages, fixes and technical SEO, built on staging first.",
  schemaName: "WordPress & Elementor development",
  mediaId: 154,
  label: "// services / wordpress",
  h1: N("Freelance WordPress and Elementor developer"),
  lead: [
    N("I build and fix WordPress sites in Elementor and Gutenberg for agencies, startups and small businesses, working remotely from Mindanao, Philippines."),
    "I work on staging or a duplicate page first, back up with Git, and confirm with you before anything changes on the live site.",
  ],
  art: "wordpress",
  chips: ["Elementor", "Gutenberg", "WooCommerce"],
  cardsTitle: N("What I can do on your WordPress site."),
  cards: [
    { part: "build", title: N("Full site builds"), copy: "Up to 8 responsive pages in Elementor or Gutenberg, with on-page SEO, schema basics and llms.txt, built on staging and launched with a QA checklist." },
    { part: "layout", title: N("Custom pages and layouts"), copy: N("Elementor pages, responsive layouts, navigation, forms and call-to-action buttons, styled to stay consistent with the rest of the site.") },
    { part: "plugins", title: N("Plugins and integrations"), copy: N("Google Reviews, Tutor LMS and Calendly calls to action, set up and troubleshot on real client sites.") },
    { part: "fixes", title: N("Fixes and mobile navigation"), copy: N("Broken links, mobile navigation and general website updates, reviewed in staging before changes go live.") },
    {
      part: "seo", title: N("Technical SEO and tracking"),
      copy: N("Schema markup, Rich Results validation, internal linking, and GA4 + GTM setup with key events."),
      link: { slug: "technical-seo-llms-txt", text: N("Technical SEO service") },
    },
    { part: "agency", title: N("White-label work for agencies"), copy: "I can work under your agency's brand, follow your process and tools, and stay behind the scenes." },
  ],
  workTitle: N("WordPress projects."),
  projects: [PROJECTS.graceful, PROJECTS.mpp, PROJECTS.appliance, PROJECTS.simple],
  faq: [FAQ.agencies, FAQ.length, FAQ.revisions, FAQ.safe],
  related: ["graceful-connections-case-study", "technical-seo-llms-txt", "shopify-developer"],
});

/* ---------- Service: Shopify ---------- */
currentSlug = "shopify-developer";
add({
  type: "service",
  key: "shopify",
  slug: currentSlug,
  title: "Shopify Developer",
  crumb: "Shopify development",
  footLabel: "Shopify development",
  seoTitle: "Freelance Shopify Liquid Developer | Genesis Montilla",
  seoDescription: "Remote Shopify developer (GMT+8): theme customization, custom Liquid sections, bundles, Printful and interactive product pages for agencies and online stores.",
  schemaName: "Shopify development",
  mediaId: 154,
  label: "// services / shopify",
  h1: N("Freelance Shopify Liquid developer"),
  lead: [
    N("I build and customize Shopify stores for agencies, startups and small businesses: themes, custom Liquid sections, product templates and app setup, working remotely from Mindanao, Philippines."),
    "Every project gets a written scope and quote after a short call.",
  ],
  art: "shopify",
  chips: ["Liquid", "Bundles", "Printful"],
  cardsTitle: N("What I can do on your Shopify store."),
  cards: [
    { part: "theme", title: N("Theme setup and customization"), copy: N("Dawn or premium themes, customized to match the brand, with layouts and sections refined so the store presents clearly.") },
    { part: "liquid", title: N("Custom Liquid sections"), copy: N("Custom Liquid sections and product templates, built into your theme.") },
    { part: "catalog", title: N("Products, collections and bundles"), copy: N("Product listings, collections and bundles, plus app setup.") },
    { part: "printful", title: N("Print-on-demand with Printful"), copy: N("Printful integration, so print-on-demand products are fulfilled through the store.") },
    {
      part: "interactive", title: N("Interactive product pages"),
      copy: N("Interactive 360° product viewers, scroll-triggered animations and parallax on landing pages."),
      link: { slug: "pagulayan-cues-case-study", text: N("See the case study") },
    },
    { part: "speed", title: N("Speed, SEO and tracking basics"), copy: N("Speed, SEO and tracking basics, checked before anything goes live.") },
  ],
  workTitle: N("Shopify projects."),
  projects: [PROJECTS.pagulayan, PROJECTS.mlb, PROJECTS.lov],
  faq: [FAQ.length, FAQ.revisions, FAQ.payment, FAQ.agencies],
  related: ["pagulayan-cues-case-study", "wordpress-elementor-developer", "technical-seo-llms-txt"],
});

/* ---------- Service: Technical SEO ---------- */
currentSlug = "technical-seo-llms-txt";
add({
  type: "service",
  key: "seo",
  slug: currentSlug,
  title: "Technical SEO & llms.txt",
  crumb: "Technical SEO & llms.txt",
  footLabel: "Technical SEO & llms.txt",
  seoTitle: "llms.txt & Technical SEO for AI Search | Genesis Montilla",
  seoDescription: "Technical SEO and llms.txt setup from a remote developer (GMT+8): schema markup, Rich Results checks, internal linking and content structure for AI crawlers.",
  schemaName: "Technical SEO and llms.txt setup",
  mediaId: 154,
  label: "// services / technical_seo",
  h1: N("Technical SEO, schema and llms.txt setup"),
  lead: [
    "Structuring site content so AI search tools and crawlers can read it clearly: llms.txt, schema and a clean content hierarchy.",
    N("Used on The Walker Group and Graceful Connections Home Care, with on-page SEO and internal linking for MPP Legal."),
  ],
  art: "seo",
  chips: ["Schema", "llms.txt", "AI crawlers"],
  cardsTitle: N("What the work covers."),
  cards: [
    { part: "schema", title: N("Schema markup"), copy: N("JSON-LD schema, validated in Google's Rich Results Test.") },
    { part: "llms", title: N("llms.txt setup"), copy: N("An llms.txt file that points AI tools straight to the key pages and services.") },
    { part: "crawl", title: N("AI crawler readiness"), copy: N("AI-readable content organization, so existing site information is more clearly structured for automated discovery.") },
    { part: "links", title: N("Internal linking and on-page SEO"), copy: N("On-page SEO and internal links between related pages, so visitors and search engines move through the site more easily.") },
    { part: "vitals", title: N("Core Web Vitals"), copy: N("Core Web Vitals and page speed checks as part of the technical review.") },
    { part: "console", title: N("Search Console and analytics"), copy: "Basic GA4, GTM, Search Console, and Google Business Profile setups." },
  ],
  note: {
    title: N("What llms.txt can and can't do."),
    copy: N("llms.txt is a proposed format, not an official standard, and no AI tool is guaranteed to read it. I set it up as a low-cost extra on top of the basics that come first: crawlable pages, clear structure and valid schema. I don't promise rankings or AI mentions."),
  },
  workTitle: N("Technical SEO projects."),
  projects: [PROJECTS.walker, PROJECTS.graceful, PROJECTS.mpp],
  faq: [FAQ.platforms, FAQ.length, FAQ.safe, FAQ.timezone],
  related: ["walker-group-case-study", "graceful-connections-case-study", "wordpress-elementor-developer"],
});

/* ---------- Case study: Pagulayan Cues ---------- */
currentSlug = "pagulayan-cues-case-study";
add({
  type: "case",
  key: "pagulayan",
  slug: currentSlug,
  title: "Pagulayan Cues Case Study",
  crumb: "Pagulayan Cues",
  footLabel: "Pagulayan Cues case study",
  seoTitle: "Shopify 360° Product Viewer Case Study: Pagulayan Cues",
  seoDescription: "How I built a Shopify landing page for Pagulayan Cues (Tallmade) with an interactive 360° product viewer, parallax, scroll animations and responsive layouts.",
  mediaId: PROJECTS.pagulayan.mediaId,
  label: "// case_study / pagulayan-cues",
  h1: N("Pagulayan Cues (Tallmade): a Shopify landing page with a 360° product viewer"),
  lead: ["A Shopify landing page where visitors rotate the product in 360°, with parallax and scroll animations."],
  project: PROJECTS.pagulayan,
  views: [
    { label: "Website", type: "laptop" },
    {
      label: "360° demo",
      type: "cube",
      faces: ["Shopify", "Liquid", "JavaScript", "CSS animation", "360° viewer", "Parallax"],
      note: N("Drag to spin, or use the arrow keys. A small demo of the idea, made for this page. The real product viewer is on the live site."),
    },
  ],
  caseStudy: {
    challenge: "Present a premium product online in a way that feels close to seeing it in person, without slowing the store down.",
    did: "Built an advanced Tallmade product showcase with scroll-triggered animations, responsive layouts, and an interactive 360° product viewer. The project combined front-end presentation and motion to create a more engaging way to explore the product.",
    stack: ["Shopify", "Liquid", "JavaScript", "CSS animation", "3D / 360° viewer", "Parallax"],
    result: "Launched a product page where visitors can rotate and explore Tallmade in 360°, backed by responsive layouts and scroll animations.",
    pipeline: [
      { step: "3D model", copy: N("The product presented as a 3D model, so it can be seen from every side.") },
      { step: "360° viewer", copy: N("An interactive viewer where visitors rotate and explore the product in 360°.") },
      { step: "Scroll FX", copy: N("Scroll-triggered animations and parallax that move the story along as visitors scroll.") },
      { step: "Shopify", copy: N("All of it built into a Shopify landing page with responsive layouts.") },
    ],
  },
  related: ["shopify-developer", "graceful-connections-case-study", "walker-group-case-study"],
});

/* ---------- Case study: Graceful Connections ---------- */
currentSlug = "graceful-connections-case-study";
add({
  type: "case",
  key: "graceful",
  slug: currentSlug,
  title: "Graceful Connections Case Study",
  crumb: "Graceful Connections",
  footLabel: "Graceful Connections case study",
  seoTitle: "Home Care WordPress Site Case Study: Graceful Connections",
  seoDescription: "How I built the Graceful Connections Home Care WordPress site in Elementor, with schema markup validated in Google's Rich Results Test and an llms.txt file.",
  mediaId: PROJECTS.graceful.mediaId,
  label: "// case_study / graceful-connections",
  h1: N("Graceful Connections Home Care: a WordPress build with schema and llms.txt"),
  lead: ["A full WordPress / Elementor build with schema markup, Rich Results validation and an llms.txt file."],
  project: PROJECTS.graceful,
  views: [
    { label: "Website", type: "laptop" },
    {
      label: "Schema",
      type: "code",
      file: "JSON-LD",
      code: `{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Organization"],
  "name": "Graceful Connections Home Care",
  "url": "https://gracefulconnectionshomecare.com/"
}`,
      note: N("Simplified from the schema on the live home page."),
    },
    {
      label: "llms.txt",
      type: "code",
      file: "llms.txt",
      code: `# Graceful Connections Home Care

## Website
- Home: https://gracefulconnectionshomecare.com/
- About: https://gracefulconnectionshomecare.com/about-us/
- Services: https://gracefulconnectionshomecare.com/services/

## Services
## Organization details
## Notes for AI systems`,
      note: N("Shortened from the live file."),
      link: { href: "https://gracefulconnectionshomecare.com/llms.txt", text: "View the live file ↗" },
    },
  ],
  caseStudy: {
    challenge: "A home care provider needed a clear, trustworthy website that families and search engines can understand quickly.",
    did: "A full WordPress / Elementor build. Worked on technical SEO improvements, including schema markup and Rich Results validation. Also updated llms.txt and refined Elementor content to help keep the site structured, accessible, and easier for search tools to interpret.",
    stack: ["WordPress", "Elementor", "Schema / JSON-LD", "Rich Results", "llms.txt", "Technical SEO"],
    result: "Schema validated in Google's Rich Results Test, plus an llms.txt file so AI search tools can read the site clearly.",
    pipeline: [
      { step: "Elementor build", copy: N("A full WordPress site built in Elementor, kept structured and accessible.") },
      { step: "Schema", copy: N("Schema markup, so search engines can understand the business.") },
      { step: "Rich Results", copy: N("The schema checked in Google's Rich Results Test.") },
      { step: "llms.txt", copy: N("An llms.txt file so AI search tools can read the site clearly.") },
    ],
  },
  related: ["wordpress-elementor-developer", "technical-seo-llms-txt", "walker-group-case-study"],
});

/* ---------- Case study: The Walker Group ---------- */
currentSlug = "walker-group-case-study";
add({
  type: "case",
  key: "walker",
  slug: currentSlug,
  title: "The Walker Group Case Study",
  crumb: "The Walker Group",
  footLabel: "The Walker Group case study",
  seoTitle: "llms.txt Case Study: The Walker Group | Genesis Montilla",
  seoDescription: "How I restructured The Walker Group's site content for AI search: an llms.txt file, technical SEO and a clearer structure that points AI tools to key pages.",
  mediaId: PROJECTS.walker.mediaId,
  label: "// case_study / the-walker-group",
  h1: N("The Walker Group: llms.txt and AI crawler optimization"),
  lead: ["Site content restructured so AI search tools and crawlers can find and read the key pages clearly."],
  project: PROJECTS.walker,
  views: [
    { label: "Website", type: "laptop" },
    {
      label: "llms.txt",
      type: "code",
      file: "llms.txt",
      code: `# The Walker Group

> The Walker Group is a Managed IT Services Provider (MSP)
> based in Farmington, Connecticut...

## Company
## Managed IT Services
## Cybersecurity & Compliance
## Technology Solutions
## Industries Served
## Locations`,
      note: N("Shortened from the live file."),
      link: { href: "https://www.thewalkergroup.com/llms.txt", text: "View the live file ↗" },
    },
  ],
  caseStudy: {
    challenge: "Make the firm's existing website content easy for AI search tools and crawlers to find, read and understand.",
    did: "Worked on llms.txt updates and AI-readable content organization, with a focus on technical SEO and AI crawler optimization. The work centered on making existing website information more clearly structured for automated discovery.",
    stack: ["llms.txt", "Technical SEO", "Content structure", "AI crawlers"],
    result: "An llms.txt file and a clearer content structure that point AI tools straight to the key pages and services.",
    pipeline: [
      { step: "Content audit", copy: N("A review of the firm's existing website content.") },
      { step: "Structure", copy: N("AI-readable content organization, with the information more clearly structured.") },
      { step: "llms.txt", copy: N("An llms.txt file that points AI tools straight to the key pages and services.") },
      { step: "AI crawlers", copy: N("Technical SEO and AI crawler optimization for automated discovery.") },
    ],
  },
  related: ["technical-seo-llms-txt", "graceful-connections-case-study", "pagulayan-cues-case-study"],
});

module.exports = { SITE, BOOK_URL, PROCESS_STEPS, HINTS, pages, newCopy };
