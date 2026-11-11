"use strict";

/*
 * Markup for blog posts and the /blog/ archive. The header, contact section and
 * footer come from pages/template.js, so the blog matches the rest of the site.
 */

const { header, contact, footer, esc, pageUrl, EXTERNAL } = require("../pages/template");
const { pages } = require("../pages/content");
const { SITE, BLOG_URL, AUTHOR, CATEGORIES, BOOK_URL, UNSPLASH_UTM, WORDS_PER_MINUTE } = require("./config");

/* ---------- helpers ---------- */

const postUrl = (post) => `${SITE}${post.slug}/`;
const catOf = (post) => CATEGORIES.find((c) => c.key === post.category);

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/* Inline marks in copy: **bold**, `code` and [text](url). A leading "/" means a page on this site. */
function inline(text) {
  let out = esc(text);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
    const url = href.startsWith("/") ? `${SITE}${href.slice(1)}` : href;
    const external = /^https?:/.test(url) && !url.startsWith(SITE);
    return `<a href="${url}"${external ? ` ${EXTERNAL}` : ""}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

const plainText = (text) => String(text).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "");

function fmtDate(iso) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/* Every word a reader sees in the body, for the reading time. */
function bodyText(post) {
  const parts = [post.excerpt, ...(post.takeaways || [])];
  for (const b of post.body) {
    if (b.h2 || b.h3 || b.p || b.quote) parts.push(b.h2 || b.h3 || b.p || b.quote);
    if (b.ul || b.ol) parts.push(...(b.ul || b.ol));
    if (b.callout) parts.push(b.callout.text);
    if (b.checklist) parts.push(b.checklist.title, b.checklist.intro || "", ...b.checklist.items);
    if (b.flip) parts.push(...b.flip.cards.flatMap((c) => [c.myth, c.fact]));
    if (b.compare) parts.push(...b.compare.options.flatMap((o) => [o.label, ...o.points]));
    if (b.steps) parts.push(...b.steps.flatMap((s) => [s.title, s.copy]));
    if (b.faq) parts.push(...b.faq.flatMap((f) => [f.q, f.a]));
    if (b.cta) parts.push(b.cta.title, b.cta.copy);
  }
  return plainText(parts.join(" "));
}

const readMinutes = (post) => Math.max(1, Math.round(bodyText(post).split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));

/* A WordPress image with its generated sizes as a srcset. */
function picture(media, alt, { sizes, eager, cls } = {}) {
  const set = media.sizes.map((s) => `${s.src} ${s.w}w`).join(", ");
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  const klass = cls ? ` class="${cls}"` : "";
  return `<img${klass} src="${media.src}" srcset="${set}" sizes="${sizes || "100vw"}" alt="${esc(alt)}" width="${media.width}" height="${media.height}" ${load}>`;
}

function credit(image) {
  const c = image.credit;
  if (!c) return "";
  const utm = c.site === "Unsplash" ? `?${UNSPLASH_UTM}` : "";
  const who = c.url ? `<a href="${esc(c.url)}${utm}" ${EXTERNAL}>${esc(c.name)}</a>` : esc(c.name);
  const site = c.siteUrl ? `<a href="${esc(c.siteUrl)}${utm}" ${EXTERNAL}>${esc(c.site)}</a>` : esc(c.site);
  return `Photo: ${who} on ${site}`;
}

function crumbs(trail) {
  const items = trail
    .map(([label, href], i) => {
      const sep = i ? '<span aria-hidden="true">/</span>' : "";
      return href ? `${sep}<a href="${href}">${esc(label)}</a>` : `${sep}<span aria-current="page">${esc(label)}</span>`;
    })
    .join("");
  return `<nav class="zg-pg-crumb" aria-label="Breadcrumb">${items}</nav>`;
}

const ICONS = {
  linkedin: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>',
  x: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 16M20 4 4 20"/></svg>',
  facebook: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/></svg>',
  link: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/></svg>',
  share: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  search: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  clock: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  up: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11v9H4v-9h3Zm0 0 4-8a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2l-1.5 7a2 2 0 0 1-2 2H7"/></svg>',
  down: '<svg class="zg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 13V4h3v9h-3Zm0 0-4 8a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2l1.5-7a2 2 0 0 1 2-2H17"/></svg>',
};

/* ---------- post body blocks ---------- */

function heading(level, text, id) {
  return `<h${level} id="${id}" class="zg-bl-h">${inline(text)}<a class="zg-bl-anchor" href="#${id}" aria-label="Copy a link to this section" data-zg-copy-anchor>#</a></h${level}>`;
}

function checklist(b, post, n) {
  const c = b.checklist;
  const id = `zg-bl-check-${n}`;
  const items = c.items
    .map((item, i) => `<li><label><input type="checkbox" value="${i}"><span class="zg-bl-box" aria-hidden="true"></span><span>${inline(item)}</span></label></li>`)
    .join("");
  const results = c.results
    .map((r) => {
      const cta = r.cta
        ? `<a class="z-btn z-btn-primary zg-bl-res-cta" href="${BOOK_URL}" data-zg-event="book_call" data-zg-label="blog_check_${post.key}">${esc(r.cta)} <span>→</span></a>`
        : "";
      return `<div class="zg-bl-res" data-upto="${r.upTo}"><p class="zg-bl-res-t">${esc(r.title)}</p><p>${inline(r.text)}</p>${cta}</div>`;
    })
    .join("");
  return `<section class="zg-bl-check zg-pg-grid" data-zg-check="${post.key}-${n}" aria-labelledby="${id}">
  <span class="zg-kicker">// ${esc(c.kicker || "quick_check")}</span>
  <h3 id="${id}">${esc(c.title)}</h3>
  ${c.intro ? `<p class="zg-bl-check-intro">${inline(c.intro)}</p>` : ""}
  <div class="zg-bl-check-grid">
    <ul class="zg-bl-check-list">${items}</ul>
    <div class="zg-bl-score" aria-live="polite">
      <div class="zg-bl-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="zg-bl-ring-bg" cx="60" cy="60" r="52"/><circle class="zg-bl-ring-fg" cx="60" cy="60" r="52" pathLength="100"/></svg><p class="zg-bl-ring-n"><strong>0</strong><span>/${c.items.length}</span></p></div>
      <div class="zg-bl-results"><div class="zg-bl-res zg-bl-res-prompt"><p class="zg-bl-res-t">Your result shows here</p><p>Tick the boxes that fit. Nothing is sent anywhere: your answers stay in this browser.</p></div>${results}</div>
    </div>
  </div>
</section>`;
}

function flips(b, post) {
  const cards = b.flip.cards
    .map(
      (card, i) => `<button type="button" class="zg-bl-flip" aria-pressed="false" data-zg-label="${post.key}_${i}"><span class="zg-bl-flip-in"><span class="zg-bl-face zg-bl-front"><span class="zg-kicker">Myth</span><span class="zg-bl-flip-t">${inline(card.myth)}</span><span class="zg-bl-flip-hint" aria-hidden="true">Flip for the fact ↻</span></span><span class="zg-bl-face zg-bl-back"><span class="zg-kicker">Fact</span><span class="zg-bl-flip-t">${inline(card.fact)}</span></span></span></button>`
    )
    .join("");
  const intro = b.flip.intro ? `<p class="zg-bl-flips-intro">${inline(b.flip.intro)}</p>` : "";
  return `<div class="zg-bl-flips-wrap">${intro}<div class="zg-bl-flips" data-n="${b.flip.cards.length}">${cards}</div></div>`;
}

function compare(b, post, n) {
  const c = b.compare;
  const base = `zg-bl-c${n}`;
  const tabs = c.options
    .map((o, i) => `<button type="button" class="zg-pg-tab" role="tab" id="${base}-t${i}" aria-controls="${base}-p${i}" aria-selected="${i === 0}" data-zg-event="blog_compare" data-zg-label="${post.key}_${i}">${esc(o.label)}</button>`)
    .join("");
  const panels = c.options
    .map((o, i) => {
      const points = o.points.map((p) => `<li>${inline(p)}</li>`).join("");
      return `<div class="zg-pg-view zg-bl-cmp-panel${o.good ? " is-good" : ""}" role="tabpanel" id="${base}-p${i}" aria-labelledby="${base}-t${i}"><ul class="zg-bl-ticks">${points}</ul></div>`;
    })
    .join("");
  return `<div class="zg-bl-cmp" data-zg-tabs>
  <p class="zg-bl-cmp-t">${esc(c.title)}</p>
  <div class="zg-pg-tabs" role="tablist" aria-label="${esc(c.title)}">${tabs}</div>
  ${panels}
</div>`;
}

function steps(b) {
  const items = b.steps
    .map((s, i) => `<li class="zg-rv"><span class="zg-bl-step-n">${String(i + 1).padStart(2, "0")}</span><div><p class="zg-bl-step-t">${esc(s.title)}</p><p>${inline(s.copy)}</p></div></li>`)
    .join("");
  return `<ol class="zg-bl-steps">${items}</ol>`;
}

function faq(b) {
  const items = b.faq
    .map((f) => `<details><summary>${esc(f.q)}<span class="zg-plus" aria-hidden="true"></span></summary><div class="zg-faq-a"><p>${inline(f.a)}</p></div></details>`)
    .join("");
  return `<div class="zg-faq zg-pg-faq zg-bl-faq">${items}</div>`;
}

function cta(b, post) {
  const c = b.cta;
  const second = c.link
    ? `<a class="z-btn z-btn-dark" href="${pageUrl(c.link.slug)}">${esc(c.link.text)}</a>`
    : "";
  return `<aside class="zg-bl-cta zg-pg-grid">
  <span class="zg-kicker">// next_step</span>
  <p class="zg-bl-cta-t">${esc(c.title)}</p>
  <p>${inline(c.copy)}</p>
  <div class="zg-actions"><a class="z-btn z-btn-primary" href="${BOOK_URL}" data-zg-event="book_call" data-zg-label="blog_${post.key}">${esc(c.button || "Book a call")} <span>→</span></a>${second}</div>
</aside>`;
}

function renderBlocks(post) {
  let n = 0;
  return post.body
    .map((b) => {
      n += 1;
      if (b.h2) return heading(2, b.h2, b.id || slugify(b.h2));
      if (b.h3) return heading(3, b.h3, b.id || slugify(b.h3));
      if (b.p) return `<p>${inline(b.p)}</p>`;
      if (b.ul) return `<ul class="zg-bl-list">${b.ul.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`;
      if (b.ol) return `<ol class="zg-bl-list">${b.ol.map((li) => `<li>${inline(li)}</li>`).join("")}</ol>`;
      if (b.callout) return `<aside class="zg-bl-callout"><span class="zg-kicker">// ${esc(b.callout.label || "tip")}</span><p>${inline(b.callout.text)}</p></aside>`;
      if (b.quote) return `<blockquote class="zg-bl-quote"><p>${inline(b.quote)}</p></blockquote>`;
      if (b.checklist) return checklist(b, post, n);
      if (b.flip) return flips(b, post);
      if (b.compare) return compare(b, post, n);
      if (b.steps) return steps(b);
      if (b.faq) return faq(b);
      if (b.cta) return cta(b, post);
      throw new Error(`${post.slug}: unknown block ${JSON.stringify(Object.keys(b))}`);
    })
    .join("\n");
}

const tocItems = (post) => post.body.filter((b) => b.h2).map((b) => ({ id: b.id || slugify(b.h2), text: plainText(b.h2) }));

function toc(post, mins) {
  const links = tocItems(post)
    .map((item) => `<li><a href="#${item.id}" data-zg-toc>${esc(item.text)}</a></li>`)
    .join("");
  return {
    side: `<nav class="zg-bl-toc" aria-label="On this page"><p class="zg-bl-toc-t">// on_this_page</p><ol>${links}</ol><p class="zg-bl-left">${ICONS.clock}<span><b data-zg-left>${mins}</b> min left</span></p></nav>`,
    mobile: `<details class="zg-bl-toc-m"><summary>On this page<span class="zg-plus" aria-hidden="true"></span></summary><ol>${links}</ol></details>`,
  };
}

function share(post, where) {
  const url = encodeURIComponent(postUrl(post));
  const text = encodeURIComponent(post.title);
  const ev = (label) => `data-zg-event="blog_share" data-zg-label="${label}_${where}"`;
  return `<div class="zg-bl-share">
  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" ${EXTERNAL} ${ev("linkedin")} aria-label="Share on LinkedIn">${ICONS.linkedin}</a>
  <a href="https://twitter.com/intent/tweet?url=${url}&amp;text=${text}" ${EXTERNAL} ${ev("x")} aria-label="Share on X">${ICONS.x}</a>
  <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" ${EXTERNAL} ${ev("facebook")} aria-label="Share on Facebook">${ICONS.facebook}</a>
  <button type="button" data-zg-copy-page ${ev("copy")} aria-label="Copy the link to this post">${ICONS.link}</button>
  <button type="button" data-zg-native-share ${ev("native")} aria-label="Share this post" hidden>${ICONS.share}</button>
</div>`;
}

/* ---------- cards ---------- */

function postCard(post, media, { level = 3, lead = false } = {}) {
  const cat = catOf(post);
  const words = [post.title, post.excerpt, cat.name, ...(post.tags || [])].join(" ").toLowerCase();
  const sizes = lead ? "(min-width: 960px) 640px, 100vw" : "(min-width: 960px) 380px, (min-width: 640px) 50vw, 100vw";
  return `<article class="zg-bl-card zg-rv${lead ? " zg-bl-lead" : ""}" data-topic="${cat.slug}" data-date="${post.date}" data-text="${esc(words)}">
  <div class="zg-bl-card-img">${picture(media, post.image.alt, { sizes })}</div>
  <div class="zg-bl-card-body">
    <p class="zg-bl-card-meta"><span class="zg-kicker">${esc(cat.name)}</span><span><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readMinutes(post)} min read</span></p>
    <h${level} class="zg-bl-card-t"><a href="${postUrl(post)}" data-zg-event="blog_open" data-zg-label="${post.key}">${esc(post.title)}</a></h${level}>
    <p class="zg-bl-card-x">${esc(post.excerpt)}</p>
    <span class="zg-bl-card-go" aria-hidden="true">Read the post <i>→</i></span>
  </div>
</article>`;
}

function serviceCard(slug) {
  const target = pages.find((p) => p.slug === slug);
  if (!target) throw new Error(`Unknown page slug: ${slug}`);
  const kicker = target.type === "service" ? "SERVICE" : "CASE STUDY";
  return `<a class="zg-card zg-pg-link zg-bl-svc zg-rv" href="${pageUrl(slug)}"><span class="zg-kicker">${kicker}</span><strong>${esc(target.crumb)}</strong><span class="zg-bl-svc-x">${esc(target.seoDescription)}</span><span class="zg-pg-arrow" aria-hidden="true">→</span></a>`;
}

/* Up to three: posts on the same topic first, then the newest others, then the post's services. */
function related(post, posts, mediaFor) {
  const others = posts.filter((p) => p.slug !== post.slug);
  const picked = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  const cards = picked.map((p) => postCard(p, mediaFor(p)));
  for (const slug of post.services || []) {
    if (cards.length >= 3) break;
    cards.push(serviceCard(slug));
  }
  return `<section class="zg-sec zg-alt" aria-labelledby="zg-bl-more">
    <div class="z-wrap">
      <div class="z-head zg-rv"><span class="z-label">// keep_reading</span><h2 class="z-title" id="zg-bl-more">Keep reading.</h2></div>
      <div class="zg-bl-grid zg-bl-related">
${cards.join("\n")}
      </div>
      <p class="zg-bl-all"><a class="z-btn z-btn-dark" href="${BLOG_URL}">All posts <span>→</span></a></p>
    </div>
  </section>`;
}

/* ---------- pages ---------- */

function postMain(post, posts, mediaFor) {
  const cat = catOf(post);
  const media = mediaFor(post);
  const mins = readMinutes(post);
  const t = toc(post, mins);
  const tldr = (post.takeaways || []).map((x) => `<li>${inline(x)}</li>`).join("");
  return `<main id="zg-bl-main">
  <article class="zg-bl-post" data-zg-post="${post.key}" data-zg-mins="${mins}">
    <header class="zg-sec zg-bl-hero">
      <div class="z-wrap">
        ${crumbs([["Home", SITE], ["Blog", BLOG_URL], [cat.name, `${BLOG_URL}?topic=${cat.slug}`]])}
        <p class="zg-bl-hero-meta"><a class="zg-bl-chip-link" href="${BLOG_URL}?topic=${cat.slug}" data-zg-event="blog_topic" data-zg-label="${cat.slug}">${esc(cat.name)}</a><span>${ICONS.clock}${mins} min read</span></p>
        <h1 class="zg-pg-h1 zg-bl-h1">${esc(post.title)}</h1>
        <p class="zg-pg-lead zg-bl-lead-p">${esc(post.excerpt)}</p>
        <div class="zg-bl-byline">
          <img src="${AUTHOR.photo}" alt="${esc(AUTHOR.name)}" width="44" height="44" loading="lazy">
          <p><a href="${AUTHOR.url}">${esc(AUTHOR.name)}</a><span>Published <time datetime="${post.date}">${fmtDate(post.date)}</time>${post.updated ? ` · Updated <time datetime="${post.updated}">${fmtDate(post.updated)}</time>` : ""}</span></p>
        </div>
        <figure class="zg-bl-figure">
          <div class="zg-bl-hero-img" data-zg-parallax>${picture(media, post.image.alt, { eager: true, sizes: "(min-width: 1228px) 1180px, calc(100vw - 48px)" })}</div>
          <figcaption>${credit(post.image)}</figcaption>
        </figure>
      </div>
    </header>
    <div class="zg-sec zg-bl-body-sec">
      <div class="z-wrap zg-bl-layout">
        <aside class="zg-bl-side">
          ${t.side}
          <div class="zg-bl-side-share"><p class="zg-bl-toc-t">// share</p>${share(post, "side")}</div>
        </aside>
        <div class="zg-bl-body">
          ${t.mobile}
          <aside class="zg-bl-tldr"><p class="zg-kicker">// key_takeaways</p><ul>${tldr}</ul></aside>
${renderBlocks(post)}
          <div class="zg-bl-end">
            <div class="zg-bl-feedback" data-zg-feedback="${post.key}">
              <p class="zg-bl-fb-q">Was this post useful?</p>
              <div class="zg-bl-fb-btns"><button type="button" data-zg-vote="yes">${ICONS.up}Yes</button><button type="button" data-zg-vote="no">${ICONS.down}Not really</button></div>
              <p class="zg-bl-fb-thanks" role="status" hidden></p>
            </div>
            <div class="zg-bl-end-share"><p class="zg-bl-fb-q">Share it with someone who needs it</p>${share(post, "end")}</div>
          </div>
          <div class="zg-bl-author">
            <img src="${AUTHOR.photo}" alt="" width="88" height="88" loading="lazy">
            <div><span class="zg-kicker">// written_by</span><p class="zg-bl-author-n">${esc(AUTHOR.name)} <span>(${esc(AUTHOR.short)})</span></p><p>${esc(AUTHOR.bio)}</p><a class="zg-pg-more" href="${AUTHOR.url}">More about me <span aria-hidden="true">→</span></a></div>
          </div>
        </div>
      </div>
    </div>
  </article>
${related(post, posts, mediaFor)}
  <div class="zg-bl-toast" role="status" aria-live="polite"></div>
</main>`;
}

function archiveMain(posts, mediaFor) {
  const counts = new Map();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) || 0) + 1);
  const chips = [`<button type="button" class="zg-bl-chip" aria-pressed="true" data-topic="">All <span>${posts.length}</span></button>`]
    .concat(
      CATEGORIES.filter((c) => counts.has(c.key)).map(
        (c) => `<button type="button" class="zg-bl-chip" aria-pressed="false" data-topic="${c.slug}" title="${esc(c.description)}">${esc(c.name)} <span>${counts.get(c.key)}</span></button>`
      )
    )
    .join("");
  const cards = posts.map((p, i) => postCard(p, mediaFor(p), { level: 2, lead: i === 0 })).join("\n");
  return `<main id="zg-bl-main">
  <section class="zg-sec zg-bl-ahero">
    <div class="z-wrap">
      ${crumbs([["Home", SITE], ["Blog", null]])}
      <span class="z-label">// blog</span>
      <h1 class="zg-pg-h1">Notes on websites, stores and AI search</h1>
      <p class="zg-pg-lead">Plain-English guides for business owners and agencies: what makes a website bring in leads, how search and AI tools find you, and what to expect when you hire a developer. New post every week.</p>
      <div class="zg-bl-tools" role="search">
        <label class="zg-bl-search">${ICONS.search}<span class="zg-bl-sr">Search posts</span><input type="search" placeholder="Search posts" autocomplete="off" data-zg-q></label>
        <div class="zg-bl-chips" role="group" aria-label="Filter by topic">${chips}</div>
      </div>
    </div>
  </section>
  <section class="zg-sec zg-bl-list-sec" aria-label="Posts">
    <div class="z-wrap">
      <div class="zg-bl-bar"><p class="zg-bl-count" role="status">Showing all ${posts.length} posts</p><label class="zg-bl-sort">Sort<select data-zg-sort><option value="new">Newest first</option><option value="old">Oldest first</option></select></label></div>
      <div class="zg-bl-grid zg-bl-archive">
${cards}
      </div>
      <div class="zg-bl-empty" hidden><p>No posts match that yet.</p><button type="button" class="z-btn z-btn-dark" data-zg-reset>Clear search and filters</button></div>
    </div>
  </section>
  <section class="zg-sec zg-alt">
    <div class="z-wrap zg-bl-ask zg-rv">
      <div><span class="z-label">// ask_me</span><h2 class="z-title">Want a topic covered?</h2><p class="z-copy">If there's a website, Shopify, tracking or AI search question you keep running into, send it over. The best ones become posts.</p></div>
      <div class="zg-actions"><a class="z-btn z-btn-primary" href="mailto:lenogenesis@gmail.com?subject=Blog%20topic%20idea" data-zg-event="email_click" data-zg-label="blog_topic">Suggest a topic <span>→</span></a><a class="z-btn z-btn-dark" href="${BOOK_URL}" data-zg-event="book_call" data-zg-label="blog_archive">Book a call</a></div>
    </div>
  </section>
</main>`;
}

/* ---------- plain HTML for post_content: RSS readers, Yoast and search tools ---------- */

function plainBlocks(post) {
  const li = (items) => items.map((x) => `<li>${inline(x)}</li>`).join("");
  return post.body
    .map((b) => {
      if (b.h2) return `<h2>${inline(b.h2)}</h2>`;
      if (b.h3) return `<h3>${inline(b.h3)}</h3>`;
      if (b.p) return `<p>${inline(b.p)}</p>`;
      if (b.ul) return `<ul>${li(b.ul)}</ul>`;
      if (b.ol) return `<ol>${li(b.ol)}</ol>`;
      if (b.callout) return `<p><strong>${esc(b.callout.label || "Tip")}:</strong> ${inline(b.callout.text)}</p>`;
      if (b.quote) return `<blockquote><p>${inline(b.quote)}</p></blockquote>`;
      if (b.checklist) {
        const r = b.checklist.results.map((x) => `<li><strong>${esc(x.title)}</strong> ${inline(x.text)}</li>`).join("");
        return `<h3>${esc(b.checklist.title)}</h3>${b.checklist.intro ? `<p>${inline(b.checklist.intro)}</p>` : ""}<ul>${li(b.checklist.items)}</ul><ul>${r}</ul>`;
      }
      if (b.flip) return `<ul>${b.flip.cards.map((c) => `<li><strong>Myth:</strong> ${inline(c.myth)} <strong>Fact:</strong> ${inline(c.fact)}</li>`).join("")}</ul>`;
      if (b.compare) return b.compare.options.map((o) => `<h3>${esc(o.label)}</h3><ul>${li(o.points)}</ul>`).join("");
      if (b.steps) return `<ol>${b.steps.map((s) => `<li><strong>${esc(s.title)}.</strong> ${inline(s.copy)}</li>`).join("")}</ol>`;
      if (b.faq) return b.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${inline(f.a)}</p>`).join("");
      if (b.cta) return `<p><strong>${esc(b.cta.title)}</strong> ${inline(b.cta.copy)} <a href="${SITE}#zeno-contact">Get in touch</a>.</p>`;
      return "";
    })
    .join("\n");
}

function postPlain(post) {
  const tldr = (post.takeaways || []).map((x) => `<li>${inline(x)}</li>`).join("");
  return `<p>${esc(post.excerpt)}</p>\n<h2>Key takeaways</h2><ul>${tldr}</ul>\n${plainBlocks(post)}\n<p>${credit(post.image)}</p>`;
}

function archivePlain(posts) {
  const items = posts.map((p) => `<li><a href="${postUrl(p)}">${esc(p.title)}</a>: ${esc(p.excerpt)}</li>`).join("");
  return `<h1>Notes on websites, stores and AI search</h1>\n<ul>${items}</ul>`;
}

/* ---------- full widget ---------- */

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">`;

function renderShell(label, main, { css, runtime }) {
  const theme = `<script>try{if(localStorage.getItem("zg-theme")==="light")document.getElementById("zeno-portfolio").setAttribute("data-zg-theme","light")}catch(e){}</script>`;
  return `<!-- Zana-G blog: ${label}. Generated by blog/build.js. Edit blog/posts/, then rebuild. -->
${FONTS}
<style>
${css}
</style>
<div id="zeno-portfolio" data-zg-theme="dark">
${theme}
${header({ type: "blog", navActive: "Blog" })}

${main}

${contact()}

${footer()}
</div>
<script>
${runtime}</script>
`;
}

module.exports = {
  postUrl,
  catOf,
  readMinutes,
  bodyText,
  slugify,
  tocItems,
  postMain,
  archiveMain,
  postPlain,
  archivePlain,
  renderShell,
};
