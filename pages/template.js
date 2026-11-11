"use strict";

const { pages, SITE, BOOK_URL, PROCESS_STEPS, HINTS } = require("./content");
const { ART, ANATOMY, PROCESS_ICONS, PROCESS_ART } = require("./graphics");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const pageUrl = (slug) => `${SITE}${slug}/`;
const bySlug = (slug) => {
  const page = pages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown page slug: ${slug}`);
  return page;
};

const EXTERNAL = 'target="_blank" rel="noopener noreferrer"';

const NAV = [
  ["Home", ""],
  ["About", "#zeno-about"],
  ["Approach", "#zeno-story"],
  ["Services", "#zeno-services"],
  ["AI", "#zeno-ai"],
  ["Work", "#zeno-work"],
  ["Pricing", "#zeno-pricing"],
  ["FAQ", "#zeno-faq"],
  ["Blog", "blog/"],
  ["Contact", "#zeno-contact"],
];

const FOOT_NAV = [
  ["About", "#zeno-about"],
  ["Services", "#zeno-services"],
  ["AI", "#zeno-ai"],
  ["Work", "#zeno-work"],
  ["Case studies", "#zeno-cases"],
  ["Pricing", "#zeno-pricing"],
  ["FAQ", "#zeno-faq"],
  ["Blog", "blog/"],
  ["Contact", "#zeno-contact"],
];

function header(page) {
  const active = page.navActive || (page.type === "service" ? "Services" : "Work");
  const links = NAV.map(([label, hash]) => {
    const cls = label === active ? ' class="active" aria-current="true"' : "";
    return `        <a href="${SITE}${hash}"${cls}>${label}</a>`;
  }).join("\n");
  return `  <div class="zg-progress" aria-hidden="true"></div>
  <header class="z-header">
    <div class="z-wrap z-nav">
      <a class="z-logo" href="${SITE}">
        <img src="https://zana-g.com/wp-content/uploads/2026/10/Minimal-Z-Logo-with-Golden-Accent-e1792539250428.webp" alt="Zeno logo" style="height:46px;width:auto;">
      </a>
      <nav class="z-nav-links" id="zeno-links" aria-label="Main navigation">
${links}
      </nav>
      <div class="zg-nav-actions">
        <button class="zg-theme" type="button" aria-pressed="false" aria-label="Switch to light theme">
          <svg class="zg-ic zg-i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>
          <svg class="zg-ic zg-i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10Z"/></svg>
        </button>
        <a class="z-btn z-btn-primary zg-book" href="${BOOK_URL}" data-zg-event="book_call" data-zg-label="nav">Book a call <span>→</span></a>
      </div>
      <button class="z-menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="zeno-links">☰</button>
    </div>
  </header>`;
}

function crumbs(page) {
  const parent =
    page.type === "service"
      ? `<a href="${SITE}#zeno-services">Services</a>`
      : `<a href="${SITE}#zeno-cases">Case studies</a>`;
  return `<nav class="zg-pg-crumb" aria-label="Breadcrumb"><a href="${SITE}">Home</a><span aria-hidden="true">/</span>${parent}<span aria-hidden="true">/</span><span aria-current="page">${esc(page.crumb)}</span></nav>`;
}

function laptop(img, eager) {
  const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<div class="zg-dev"><div class="zg-laptop-screen"><span class="zg-slot" aria-hidden="true"></span><img src="${img.src}" alt="${esc(img.alt)}" ${load} width="1264" height="585"></div><div class="zg-laptop-base"></div></div>`;
}

function heroArt(page) {
  const chips = page.chips
    .map((chip, i) => `<span class="zg-cs-chip c${i + 1}">${esc(chip)}</span>`)
    .join("");
  return `<div class="zg-pg-art zg-pg-grid" data-zg-tilt aria-hidden="true"><svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${ART[page.art]}</svg>${chips}</div>`;
}

/* Case study hero: switch between the website and what sits behind it. */
function caseViews(page) {
  const id = page.key;
  const tabs = page.views
    .map(
      (view, i) =>
        `<button type="button" class="zg-pg-tab" role="tab" id="zg-pg-v${i}-tab" aria-controls="zg-pg-v${i}" aria-selected="${i === 0}" data-zg-event="view_switch" data-zg-label="${id}_${esc(view.type)}_${i}">${esc(view.label)}</button>`
    )
    .join("");
  const panels = page.views
    .map((view, i) => {
      let body = laptop(page.project, true);
      if (view.type === "code") {
        body = `<div class="zg-pg-code"><div class="zg-pg-code-top"><i></i><i></i><i></i><span>${esc(view.file)}</span></div><pre>${esc(view.code)}</pre></div>`;
      }
      if (view.type === "cube") {
        const faces = view.faces.map((face, n) => `<span class="f${n + 1}">${esc(face)}</span>`).join("");
        body = `<div class="zg-pg-cube-stage zg-pg-grid" data-zg-cube><div class="zg-pg-cube" tabindex="0" role="img" aria-label="Cube you can rotate by dragging or with the arrow keys">${faces}</div></div>`;
      }
      const link = view.link
        ? ` <a href="${view.link.href}" ${EXTERNAL} data-zg-event="project_click" data-zg-label="${id}_file">${esc(view.link.text)}</a>`
        : "";
      const note = view.note ? `<p class="zg-pg-view-note">${esc(view.note)}${link}</p>` : "";
      return `<div class="zg-pg-view" role="tabpanel" id="zg-pg-v${i}" aria-labelledby="zg-pg-v${i}-tab">${body}${note}</div>`;
    })
    .join("");
  return `<div class="zg-pg-views" data-zg-tabs>
        <p class="zg-pg-hint">// ${esc(HINTS.views)}</p>
        <div class="zg-pg-tabs" role="tablist" aria-label="Views of this project">${tabs}</div>
        ${panels}
      </div>`;
}

/*
 * The home page's process section: steps on a line that the scroll fills.
 * On desktop the section pins while the steps light up one by one (see runtime.js).
 * Steps with an icon show it, with the number above the title; the rest show the number in the box.
 */
function procSection({ label, title, copy, steps, event }) {
  const items = steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, "0");
      const box = step.icon || `<span class="zg-pg-stepno">${num}</span>`;
      const kicker = step.icon ? `<span class="zg-kicker">${num}</span>` : "";
      const delay = i ? ` style="--zg-d:${i}"` : "";
      return `        <li class="zg-step zg-rv"${delay} data-zg-label="${esc(step.title)}"><span class="zg-step-ic">${box}</span><div>${kicker}<h3>${esc(step.title)}</h3><p>${esc(step.copy)}</p></div></li>`;
    })
    .join("\n");
  return `  <section class="zg-sec zg-alt" id="zeno-process" aria-labelledby="zg-process-title" data-zg-proc="${event}">
    <div class="z-wrap">
      ${PROCESS_ART}
      ${sectionHead(label, title, copy, "zg-process-title")}
      <ol class="zg-proc" style="--zg-n:${steps.length}">
        <li class="zg-proc-line" aria-hidden="true"><i></i></li>
${items}
      </ol>
    </div>
  </section>`;
}

function hero(page) {
  const isService = page.type === "service";
  const leads = page.lead.map((text) => `<p class="zg-pg-lead">${esc(text)}</p>`).join("\n          ");
  const actions = isService
    ? `<a class="z-btn z-btn-primary" href="${BOOK_URL}" data-zg-event="book_call" data-zg-label="hero_${page.key}">Book a call <span>→</span></a>
            <a class="z-btn z-btn-dark" href="#zg-pg-work">See the work</a>`
    : `<a class="z-btn z-btn-primary" href="${BOOK_URL}" data-zg-event="book_call" data-zg-label="case_${page.key}">Book a call about a similar build</a>
            <a class="z-btn z-btn-dark" href="https://${page.project.domain}" ${EXTERNAL} data-zg-event="project_click" data-zg-label="${page.project.domain}">Visit site ↗</a>`;
  const side = isService ? heroArt(page) : caseViews(page);
  return `  <section class="zg-sec zg-pg-hero">
    <div class="z-wrap zg-pg-hero-in">
      <div>
        ${crumbs(page)}
        <span class="z-label">${esc(page.label)}</span>
        <h1 class="zg-pg-h1">${esc(page.h1)}</h1>
          ${leads}
        <div class="zg-actions zg-pg-actions">
            ${actions}
        </div>
      </div>
      ${side}
    </div>
  </section>`;
}

function sectionHead(label, title, copy, id) {
  const p = copy ? `\n        <p class="z-copy">${esc(copy)}</p>` : "";
  const idAttr = id ? ` id="${id}"` : "";
  return `<div class="z-head zg-rv">
        <span class="z-label">${esc(label)}</span>
        <h2 class="z-title"${idAttr}>${esc(title)}</h2>${p}
      </div>`;
}

/* Service cards, with a drawing whose parts light up to match. */
function cards(page) {
  const items = page.cards
    .map((card) => {
      const link = card.link
        ? `<a class="zg-pg-more" href="${pageUrl(card.link.slug)}">${esc(card.link.text)} <span aria-hidden="true">→</span></a>`
        : "";
      return `          <article class="zg-card zg-pg-item" data-part="${card.part}"><h3>${esc(card.title)}</h3><p>${esc(card.copy)}</p>${link}</article>`;
    })
    .join("\n");
  return `  <section class="zg-sec">
    <div class="z-wrap">
      ${sectionHead("// what_i_do", page.cardsTitle)}
      <div class="zg-pg-explore" data-zg-explore>
        <figure class="zg-pg-fig zg-pg-grid" aria-hidden="true">
          <figcaption class="zg-pg-cap">// <span>${esc(page.cards[0].title)}</span></figcaption>
          ${ANATOMY[page.art]}
          <p class="zg-pg-hint zg-pg-hint-fine">${esc(HINTS.fig)}</p>
          <p class="zg-pg-hint zg-pg-hint-touch">${esc(HINTS.figTouch)}</p>
        </figure>
        <div class="zg-pg-list">
${items}
        </div>
      </div>
    </div>
  </section>`;
}

function note(page) {
  if (!page.note) return "";
  return `  <section class="zg-sec zg-alt">
    <div class="z-wrap zg-pg-note zg-rv">
      <h2>${esc(page.note.title)}</h2>
      <p>${esc(page.note.copy)}</p>
    </div>
  </section>`;
}

function projectRow(item) {
  const p = item.project;
  const links = [];
  if (p.caseSlug) {
    links.push(`<a class="zg-plink" href="${pageUrl(p.caseSlug)}" data-zg-event="case_page_open" data-zg-label="${p.key}">Full case study →</a>`);
  }
  if (p.domain) {
    links.push(`<a class="zg-plink" href="https://${p.domain}" ${EXTERNAL} data-zg-event="project_click" data-zg-label="${p.domain}">Visit site ↗</a>`);
  }
  const plinks = links.length ? `<div class="zg-plinks">${links.join("")}</div>` : "";
  const image = p.src ? `<div data-zg-tilt>${laptop(p, false)}</div>` : "";
  return `        <article class="zg-pg-proj zg-rv${p.src ? "" : " no-img"}">
          ${image}
          <div>
            <span class="zg-kicker">${esc(p.tag)}</span>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.copy)}</p>
            ${plinks}
          </div>
        </article>`;
}

function work(page) {
  return `  <section class="zg-sec zg-alt" id="zg-pg-work">
    <div class="z-wrap">
      ${sectionHead("// selected_work", page.workTitle, "A few websites and projects I've worked on.")}
      <div class="zg-pg-work">
${page.projects.map((project) => projectRow({ project })).join("\n")}
      </div>
    </div>
  </section>`;
}

function process() {
  return procSection({
    label: "// process.run()",
    title: "How a project runs.",
    copy: "Five steps, the same every time, so you always know what happens next.",
    steps: PROCESS_STEPS.map((step, i) => ({ ...step, icon: PROCESS_ICONS[i] })),
    event: "process_step",
  });
}

function buildSteps(page) {
  return procSection({
    label: "// build.log()",
    title: "How it was built.",
    steps: page.caseStudy.pipeline.map((item) => ({ title: item.step, copy: item.copy })),
    event: "build_step",
  });
}

function faq(page) {
  const items = page.faq
    .map(
      (item) =>
        `        <details><summary>${esc(item.q)}<span class="zg-plus" aria-hidden="true"></span></summary><div class="zg-faq-a"><p>${esc(item.a)}</p></div></details>`
    )
    .join("\n");
  return `  <section class="zg-sec zg-alt">
    <div class="z-wrap zg-faq-layout">
      ${sectionHead("// faq.md", "Questions, answered.")}
      <div class="zg-faq zg-pg-faq">
${items}
      </div>
    </div>
  </section>`;
}

function caseBody(page) {
  const c = page.caseStudy;
  const tags = c.stack.map((tag) => `<li>${esc(tag)}</li>`).join("");
  return `  <section class="zg-sec">
    <div class="z-wrap zg-pg-case">
      <div class="zg-pg-block zg-rv"><h2>The challenge</h2><p>${esc(c.challenge)}</p></div>
      <div class="zg-pg-block zg-rv"><h2>What I did</h2><p>${esc(c.did)}</p></div>
      <div class="zg-pg-block zg-rv"><h2>The stack</h2><ul class="zg-tags">${tags}</ul></div>
      <div class="zg-pg-block zg-rv"><h2>The result</h2><p class="zg-result">${esc(c.result)}</p></div>
    </div>
  </section>`;
}

function related(page) {
  const links = page.related
    .map((slug) => {
      const target = bySlug(slug);
      const kicker = target.type === "service" ? "SERVICE" : "CASE STUDY";
      return `        <a class="zg-card zg-pg-link zg-rv" href="${pageUrl(slug)}"><span class="zg-kicker">${kicker}</span><strong>${esc(target.crumb)}</strong><span class="zg-pg-arrow" aria-hidden="true">→</span></a>`;
    })
    .join("\n");
  const cols = page.related.length === 2 ? "c2" : "c3";
  return `  <section class="zg-sec${page.type === "service" ? "" : " zg-alt"}">
    <div class="z-wrap">
      ${sectionHead("// related", "Keep reading.")}
      <div class="zg-grid ${cols}">
${links}
      </div>
    </div>
  </section>`;
}

function contact() {
  return `  <section class="z-section z-contact" id="zg-pg-contact">
    <div class="z-wrap z-contact-box">
      <div class="z-contact-symbol" aria-hidden="true">&lt;/&gt;</div>
      <span class="z-label">// contact</span>
      <h2>Let's build something.</h2>
      <p>Need help with a website, online store, or technical task? Let's talk.</p>
      <a class="z-email" href="mailto:lenogenesis@gmail.com" data-zg-event="email_click" data-zg-label="contact">lenogenesis@gmail.com ↗</a>
      <div class="z-socials">
        <a href="https://www.linkedin.com/in/genesis-leno-montilla-13a103308/" ${EXTERNAL} data-zg-event="social_click" data-zg-label="linkedin">LinkedIn ↗</a>
        <a href="https://github.com/gnosis1214" ${EXTERNAL} data-zg-event="social_click" data-zg-label="github">GitHub ↗</a>
        <a href="https://v2.onlinejobs.ph/jobseekers/info/1188705" ${EXTERNAL} data-zg-event="onlinejobs_click" data-zg-label="contact">OnlineJobs.ph ↗</a>
      </div>
    </div>
  </section>`;
}

function footer() {
  const nav = FOOT_NAV.map(([label, hash]) => `<a href="${SITE}${hash}">${label}</a>`).join("\n        ");
  const more = pages.map((p) => `<a href="${pageUrl(p.slug)}">${esc(p.footLabel)}</a>`).join("\n        ");
  return `  <footer class="z-footer">
    <div class="z-wrap zg-foot-top">
      <p class="zg-foot-blurb"><strong>Zana-G</strong> · Websites, stores and automations, built remotely from Mindanao, Philippines.</p>
      <nav class="zg-foot-nav" aria-label="Footer navigation">
        ${nav}
      </nav>
      <div class="zg-foot-social">
        <a href="https://www.linkedin.com/in/genesis-leno-montilla-13a103308/" ${EXTERNAL} data-zg-event="social_click" data-zg-label="footer_linkedin">LinkedIn ↗</a>
        <a href="https://github.com/gnosis1214" ${EXTERNAL} data-zg-event="social_click" data-zg-label="footer_github">GitHub ↗</a>
        <a href="https://v2.onlinejobs.ph/jobseekers/info/1188705" ${EXTERNAL} data-zg-event="onlinejobs_click" data-zg-label="footer">OnlineJobs.ph ↗</a>
      </div>
      <nav class="zg-foot-nav zg-pg-foot-more" aria-label="Services and case studies">
        ${more}
      </nav>
    </div>
    <div class="z-wrap z-footer-inner">
      <p>© <span class="z-year">2026</span> Genesis Montilla. All rights reserved.</p>
      <a href="#zeno-portfolio">Back to top ↑</a>
    </div>
  </footer>`;
}

/* The indexable part of the page. Also saved as post_content for Yoast and search. */
function renderMain(page) {
  const sections =
    page.type === "service"
      ? [hero(page), cards(page), note(page), work(page), process(), faq(page), related(page)]
      : [hero(page), caseBody(page), buildSteps(page), related(page)];
  return `<main id="zg-pg-main">\n${sections.filter(Boolean).join("\n\n")}\n</main>`;
}

function renderSchema(page) {
  if (page.type !== "service") return "";
  const url = pageUrl(page.slug);
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.schemaName,
    serviceType: page.schemaName,
    description: page.seoDescription,
    url,
    provider: { "@id": `${SITE}#organization` },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderPage(page, { css, runtime, schema }) {
  const theme = `<script>try{if(localStorage.getItem("zg-theme")==="light")document.getElementById("zeno-portfolio").setAttribute("data-zg-theme","light")}catch(e){}</script>`;
  return `<!-- Zana-G page: ${page.slug}. Generated by pages/build.js. Edit pages/content.js, then rebuild. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${css}
</style>
<div id="zeno-portfolio" data-zg-theme="dark">
${theme}
${header(page)}

${renderMain(page)}

${contact()}

${footer()}
</div>
${schema}
<script>
${runtime}</script>
`;
}

module.exports = { renderPage, renderMain, renderSchema, header, contact, footer, esc, pageUrl, EXTERNAL };
