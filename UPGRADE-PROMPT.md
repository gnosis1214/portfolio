# Portfolio Upgrade Prompt (v2)

Paste everything below the line into a new Claude Code session opened in `C:\Users\ay\Documents\Personal\portfolio`.

---

## Role and goal

You are upgrading my portfolio page `zeno-portfolio-elementor.html` (one Elementor HTML widget, all CSS/JS inline, scoped under `#zeno-portfolio`, classes prefixed `z-`). It goes live on **zana-g.com**. Goal: a portfolio that wins US/UK/AU/SG/DE agency and startup clients for **WordPress/Elementor, Shopify, full-stack (React/Next.js) and AI/automation (n8n, MCP, Claude agents)** work, and positions me to grow into my own web dev, SEO and AI agency.

## Skills to apply (load each when its part comes up)

1. **ship-it** – start here. Set a time-box (suggest 1 day for v2), a definition of "done" and an out-of-scope list. Flag any polish that goes beyond what the page needs. End with the QA checklist.
2. **github-sync** – repo already exists (`gnosis1214/portfolio`, private). Commit before the big rewrite, then at each milestone. No secrets.
3. **wordpress-elementor-dev** – it must still paste into one Elementor HTML widget: no external build step, no `<html>/<head>/<body>` tags, CSS scoped to `#zeno-portfolio`, no clashes with Elementor/theme styles, works in Elementor's editor preview. Give me click-by-click steps to swap it into the live page (staging/duplicate page first).
4. **technical-seo** – one `h1`, logical `h2/h3` order, descriptive alt text, lazy-loaded images, JSON-LD (`Person` + `ProfessionalService` + `WebSite`, plus `FAQPage` for the new FAQ), internal anchor links, fast load (Core Web Vitals: no layout shift, no heavy libraries, `prefers-reduced-motion` respected). Give me the matching title/meta description to set in Yoast/Rank Math, and a short `llms.txt` for zana-g.com.
5. **tracking-setup** – add `data-zg-event` attributes on every CTA (book a call, email, Upwork, project clicks, form submit) and give me the GTM triggers/tags to send them to GA4 as events. No tracking IDs hardcoded in the HTML.
6. **ai-agent-builder** – design the "AI & automation" showcase section and the optional on-page assistant (see Features). Front-end only for now; no API keys in the page.
7. **n8n-automation** – the contact form posts to an n8n webhook placeholder (`ZG_WEBHOOK_URL`), with the workflow outline (webhook → validate → Google Sheet/CRM → Gmail notify + auto-reply).
8. **shopify-dev** and **nextjs-fullstack** – use for accurate wording and visuals in the Shopify and full-stack parts of Services and Projects.
9. **proposal-and-pricing** – write the "Ways to work with me" packages (starting-from USD prices, scope bullets, timelines) for me to confirm.

## Hard rules

- **Keep my copy.** Don't rewrite existing text unless I ask. New sections get draft copy marked `<!-- DRAFT: Zeno to review -->`.
- **Real projects only.** Use only: Graceful Connections Home Care, MPP Legal, Control V Symphony, MLB Artist, Pagulayan Cues (Tallmade), Lov Spa, Appliance USA Pro, The Walker Group, Luxe Aura Hair, Simple Forwarding, Athedah Staffing, New Leaf Counseling, Heroic Hearts Project, BankReady Boardroom. No invented clients, metrics, testimonials or full-stack/AI projects. Where a number or quote is needed, leave a clear placeholder (`[RESULT: e.g. +X% page speed]`, `[TESTIMONIAL: client name]`).
- Keep the current brand: black background, sand/brown accents (`--brown #B89B7B`, `--accent #D4B494`), Space Grotesk / DM Sans / JetBrains Mono, the code-editor and browser-mockup look. Upgrade it, don't replace it.
- Vanilla HTML/CSS/JS only. Inline SVG for graphics. Total page weight target: under 200 KB of code, images loaded lazily.
- Mobile-first: test at 360, 768, 1280 px. No horizontal scroll. Tap targets ≥ 44 px.
- Accessible: WCAG AA contrast, visible focus states, keyboard-usable menus/tabs/modals, `aria-*` where needed.

## Current sections (keep and improve)

Hero → About → Featured projects orbit → "Different tasks. One workflow." story → Services ("What I work on") → Toolbox marquee → Projects & builds → Contact.

## New sections to add (in this order)

1. **Sticky nav** – logo, section links, "Book a call" button; shrinks on scroll; mobile slide-in menu; active-section highlight.
2. **Trust bar** (under hero) – platform badges (WordPress, Elementor, Shopify, GoHighLevel, Next.js, n8n, Claude) + "Working remotely with US/UK/AU clients · GMT+8" note.
3. **Stats counters** – animated count-up with placeholder values (projects shipped, platforms, years, countries). Placeholders only.
4. **AI & Automation showcase** – animated SVG flow diagram (Form → n8n → AI agent → CRM/Sheet → Email), plus cards for llms.txt/AI-crawler SEO (The Walker Group), MCP/Claude Code workflows, and AI-assisted builds.
5. **Case studies** – 3 deep-dive cards (suggest: Pagulayan Cues 3D viewer, MLB Artist Shopify store, Graceful Connections WP build + SEO). Each: challenge → what I did → stack → result placeholder. Opens in an accessible modal.
6. **Process** – 5 steps (Discover → Plan → Build → QA → Launch & support) with an animated progress line on scroll.
7. **Ways to work with me** – 3 packages (e.g. Website build, Shopify store, AI/automation setup) + "Monthly care plan", starting-from prices as `[PRICE]` placeholders until I confirm.
8. **Testimonials** – slider with placeholder cards only.
9. **FAQ** – accordion, 6–8 questions (time zone, communication, turnaround, revisions, platforms, payment), backed by `FAQPage` schema.
10. **Final CTA band** before Contact – "Have a project? Let's talk" with Calendly placeholder (`ZG_CALENDLY_URL`) and email.
11. **Footer** – nav links, socials (placeholders), © year auto, back-to-top.

## UI/UX upgrades

- Clear visual hierarchy: consistent section spacing scale, max widths, type scale (clamp-based fluid sizes).
- Scroll-reveal animations via IntersectionObserver (fade/slide, staggered), disabled under `prefers-reduced-motion`.
- Micro-interactions: magnetic/glow buttons, card tilt on hover (desktop only), cursor spotlight on hero (desktop only).
- Project grid **filter tabs** (All / WordPress / Shopify / SEO / Tracking / Design / AI) with smooth re-layout.
- Better project cards: platform tag, 1-line outcome, "View case study" / "Visit site" links, hover reveal.
- Scroll progress bar at the top.
- Light/dark toggle (default dark, saved in `localStorage` with try/catch).
- Consistent CTA wording and placement: one primary action ("Book a call") per screen.

## More graphics

- Hero: layered inline-SVG background (grid lines, soft sand gradient blobs, floating code/brackets glyphs), animated typing terminal showing my stack.
- Section dividers: subtle SVG waves/lines in the accent colour.
- Custom line icons (inline SVG, one style) for every service, process step and FAQ.
- Device mockups (laptop + phone frames in SVG/CSS) for case studies, with `[IMAGE: screenshot]` slots.
- Animated SVG for the n8n/AI flow (dashes moving along connectors).
- Optional decorative noise/grain overlay (CSS only, very light).

## More features

- Contact form: name, email, project type (select), budget range, message; client-side validation; honeypot spam field; posts to `ZG_WEBHOOK_URL`; success/error states.
- Copy-email button with "Copied" toast.
- Local time widget: "It's 10:42 AM in Siargao (GMT+8)" + "usually replies within X hours".
- "Download CV" button (`ZG_CV_URL` placeholder).
- Optional mini **AI assistant** button (chat bubble) – UI only, answers from a small built-in FAQ JSON; leave a clear hook for a future n8n/Claude backend. Mark as optional/out-of-scope for v2 if time is short.

## Deliverables

1. Updated `zeno-portfolio-elementor.html` (single paste-ready widget). Keep the old one as `zeno-portfolio-elementor.v1.html`.
2. A short list of every placeholder I must fill (images, prices, stats, testimonials, URLs).
3. SEO pack: title, meta description, JSON-LD (inside the widget), `llms.txt` draft.
4. GTM/GA4 event list for the `data-zg-event` attributes.
5. n8n contact-form workflow outline (or importable JSON).
6. Elementor swap-in steps (staging/duplicate page first).
7. ship-it QA checklist results (mobile, a11y, Lighthouse, links, form) and a Git commit + push per milestone.

## How to work

- Ask me at most 1–2 questions up front, otherwise assume and list assumptions at the top.
- Show me the new section order and time-box first, then build. Working version first, polish second.
- Preview it in the browser pane at mobile and desktop widths before calling it done.
