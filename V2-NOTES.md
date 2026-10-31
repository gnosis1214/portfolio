# Portfolio v2: notes and deliverables

File: `zeno-portfolio-elementor.html` (one Elementor HTML widget). v1 backup: `zeno-portfolio-elementor.v1.html`.

## Assumptions
- All v1 markup, copy, CSS and JS are kept. v2 adds a second `<style>` and `<script>` block with `zg-` classes and IDs.
- New copy is marked `<!-- DRAFT: Zeno to review -->`. Where case studies say "What I did", the text is your existing project copy.
- Prices, stats, results and testimonials are placeholders. Nothing invented.
- "Visit site" links on project cards are built from each card's browser-bar domain (`https://<domain>`). Check that each one resolves.
- Size: about 227 KB raw, about 51 KB gzipped. The 200 KB target is exceeded because v1 alone is 125 KB. I left the source readable rather than minifying it. Minify on paste if you want it under 200 KB raw.

## New section order
Sticky nav → Hero (+ SVG background, typing stack, cursor spotlight) → **Trust bar** → Tech strip → About → **Stats** → Project orbit → Workflow story → Services → **AI & automation** → Toolbox → Projects (+ **filter tabs**, card links) → **Case studies** (modals) → **Process** → **Ways to work with me** → **Testimonials** → **FAQ** → **Final CTA** → Contact (+ **form, local time, copy email, CV**) → Footer (+ nav, socials) · Floating: back-to-top, optional FAQ assistant, toast.

## 1. Placeholders to fill

**Config (top of the last `<script>`, `window.ZG_CONFIG`)**
| Key | What |
|---|---|
| `webhookUrl` | n8n production webhook URL for the contact form |
| `calendlyUrl` | Calendly link. Until it's set, every "Book a call" scrolls to Contact. |
| `cvUrl` | CV PDF URL. The "Download CV" button stays hidden until it's set. |
| `upworkUrl` | Upwork profile. Upwork links stay hidden until it's set. |
| `assistantUrl` | Optional future n8n/Claude endpoint that returns `{reply}`. Leave it as is for now. |
| `replyHours` | "usually replies within [X] hours" |

**On the page**
- Stats: 4 × `data-zg-to="[X]"` (and the visible `[X]`) for projects shipped, platforms, years and client countries.
- Packages: 4 × `[PRICE]`, timelines `[X]–[X] weeks`, "Up to [X] pages", "[X] hours of edits".
- FAQ: `[HOURS]`, turnaround `[X]`, revisions `[X]`, `[PAYMENT]`. **Update the matching text in the FAQPage JSON-LD too.**
- Case studies: 3 × `[RESULT: …]`, 6 × `[IMAGE: mobile screenshot]` phone slots. To fill one, add an `<img>` inside `.zg-phone`.
- Testimonials: 3 × `[TESTIMONIAL: client quote]`, `[TESTIMONIAL: client name]`, `[ROLE, COMPANY]`.
- AI card: `[CASE STUDY: add first AI/automation project]`.
- Socials: LinkedIn and GitHub still point to `linkedin.com/` and `github.com/` (v1 placeholders), in both the Contact section and the footer.
- Project outcome line: optional. Add `<span class="zg-outcome">…</span>` inside any `.z-project-info`.

**Suggested starting prices (please confirm; current market for remote PH devs serving US/UK/AU clients)**
- Website build (WP/Elementor, ~5 pages): from **$800–1,200**, 2–3 weeks
- Shopify store (theme + custom sections): from **$1,000–1,800**, 2–4 weeks
- AI & automation setup (one n8n workflow + AI step): from **$500–900**, 1–2 weeks
- Monthly care plan: from **$150–250/mo**
These are a suggestion only. The page shows `[PRICE]` until you set them.

## 2. SEO pack

**Yoast / Rank Math**
- Title (60 chars): `Zeno Montilla | WordPress, Shopify & AI Automation Developer`
- Meta description (142 chars): `Remote WordPress, Shopify and Next.js developer (GMT+8) building fast sites, stores and n8n + Claude AI automations for agencies and startups.`

**On-page**
- One `h1` (hero). New sections use `h2` → `h3`. The stats `h2` is visually hidden.
- New images have `loading="lazy"`, width/height set and descriptive alt text.
- Internal anchors: nav, footer and all CTAs point to `#zeno-*` sections.
- Motion: reveals, typing, flow dashes, glyphs and tilt are all off under `prefers-reduced-motion`. No libraries were added.

**JSON-LD** (inside the widget, after the markup): one `@graph` with `Person`, `ProfessionalService`, `WebSite` and `FAQPage`.
- Yoast and Rank Math also output `Person` / `WebSite`. Either turn off the plugin's schema for this page, or delete the `WebSite` node here to avoid duplicates. Then test in the Rich Results Test and the Schema.org validator.
- Google only shows FAQ rich results for some sites now. The `FAQPage` markup still helps AI and search crawlers understand the page.

**llms.txt**: draft in `llms.txt`. Upload it to the site root (`https://zana-g.com/llms.txt`) via cPanel File Manager, or with a plugin that serves it.

## 3. GTM / GA4 events

Every CTA has `data-zg-event` + `data-zg-label`. The page pushes one dataLayer event:
```js
{ event: "zg_event", zg_event: "<name>", zg_label: "<where>", zg_url: "<href if link>" }
```
| `zg_event` | Fired by | Key event? |
|---|---|---|
| `book_call` | Nav, CTA band, packages, contact panel, case modals | ✅ |
| `form_submit` | Contact form submit (valid fields) | |
| `form_submit_success` | Webhook returned 2xx | ✅ |
| `form_submit_error` | Webhook failed | |
| `email_click` | mailto links | ✅ |
| `copy_email` | Copy email button | ✅ |
| `upwork_click` / `onlinejobs_click` | Profile links | ✅ |
| `social_click` | LinkedIn / GitHub | |
| `cv_download` | Download CV | |
| `project_click` | "Visit site" on cards and modals (label = domain) | |
| `case_study_open` | Case study buttons | |
| `project_filter` | Filter tabs (label = filter) | |
| `view_projects` / `contact_click` | Hero buttons | |
| `assistant_open` / `assistant_question` | FAQ assistant | |
| `theme_toggle` | Light/dark toggle | |

Form events also send `zg_project_type` and `zg_budget`.

**GTM setup (no IDs in the page)**
1. Variables → New → Data Layer Variable: `zg_event`, `zg_label`, `zg_url`, `zg_project_type`, `zg_budget`. Name each `DLV - <name>`.
2. Triggers → New → Custom Event → Event name `zg_event` → All custom events. Name it `CE - zg_event`.
3. Tags → New → Google Analytics: GA4 Event → Measurement ID = your existing GA4 constant variable → Event name `{{DLV - zg_event}}` → parameters `label = {{DLV - zg_label}}`, `link_url = {{DLV - zg_url}}`, `project_type = {{DLV - zg_project_type}}`, `budget = {{DLV - zg_budget}}` → trigger `CE - zg_event`.
4. Preview in Tag Assistant: click each CTA and confirm the events, then publish.
5. GA4 → Admin → Custom definitions: add event-scoped dimensions `label`, `project_type`, `budget`. Then Admin → Events → mark the ✅ rows as key events (after they first appear).

## 4. n8n contact-form workflow

Payload: `{ name, email, project_type, budget, message, page, submitted_at }` (JSON POST).

1. **Webhook** node: POST, path `zg-contact`, Respond = "Using Respond to Webhook node". Options → Allowed Origins (CORS) = `https://zana-g.com` (add your staging domain while testing). Put the **production** URL into `ZG_CONFIG.webhookUrl`.
2. **IF / Code (validate)**: email regex, message ≥ 20 chars, name present, length caps. Fail → **Respond to Webhook** with 400 `{ok:false}`.
3. **Optional AI step** (Basic LLM Chain / Claude): classify `project_type` + urgency, draft a reply. Keep it a draft only; no auto-send of AI text.
4. **Google Sheets: Append row** (or your CRM / GoHighLevel: create contact + opportunity). Columns: date, name, email, type, budget, message, page, AI summary.
5. **Gmail: Send** notification to `lenogenesis@gmail.com` (subject `New lead: {{name}} – {{project_type}}`).
6. **Gmail: Send** auto-reply to the lead with a short template: thanks, reply within X hours, Calendly link.
7. **Respond to Webhook**: 200 `{ok:true}`.
8. Error workflow: Settings → Error Workflow → send yourself a Gmail/Slack alert.

Credentials stay in n8n only, never in the page. For spam, the honeypot field `company_website` is dropped client-side. Add a rate limit or a Cloudflare Turnstile check in n8n later if spam shows up.

## 5. Elementor swap-in (staging or duplicate first)

1. **Back up**: in WP Admin → Pages, hover the current portfolio page → **Duplicate** (Yoast Duplicate Post) or use Hostinger/GoDaddy **staging**. Work on the copy, not the live page.
2. Open the copy → **Edit with Elementor** → click the existing HTML widget.
3. In the widget's HTML box: select all (Ctrl+A), delete, then paste the full contents of `zeno-portfolio-elementor.html`. Click **Update**.
4. Page settings (gear icon) → Page Layout = **Elementor Canvas** or **Full Width**, and hide the theme header if it doubles up with the widget's fixed nav.
5. Preview the copy: test nav and the mobile menu, filters, a case study modal, the FAQ, the form (it shows "not connected" until `webhookUrl` is set) and the theme toggle.
6. Caching / optimisation plugins (LiteSpeed, WP Rocket, Hostinger): if JS is delayed or combined, exclude this page's inline scripts or the `zeno-portfolio` keyword from "Delay JS" so the nav and animations run on load. Purge the cache.
7. Set the Yoast/Rank Math title and meta above. Turn off duplicate schema (see SEO pack).
8. When the copy looks right, either swap the live page's widget the same way or publish the copy and set it as the homepage (Settings → Reading). **Check with me (Zeno) before writing to the live page.**
9. After going live: Search Console → URL Inspection → Request indexing. Run PageSpeed Insights (mobile).

## 6. QA results (this pass)
| Check | Result |
|---|---|
| 360 px | ✅ No horizontal scroll. Slide-in menu works (full height, 48 px links). Single-column sections, vertical flow diagram, 2-column stats. |
| 768 px | ✅ No overflow. Burger menu, 2-column packages, 3-column AI cards, horizontal flow. Modal fits (730 px). |
| 1280 px | ✅ Full nav + Book a call. All sections render; reveal, count-up and process line work. |
| Console | ✅ No errors. |
| Filter tabs | ✅ e.g. Shopify → 2 cards in a grid, "All" restores the marquee. |
| Modals | ✅ Open/close, Esc, backdrop click, focus returns to the button. |
| Form | ✅ Validation messages + "not connected" fallback. ⚠️ Webhook not tested (no URL yet). |
| Tap targets | ✅ New controls ≥ 44 px. v1 email, socials and back-to-top links bumped to 44 px. |
| Light theme | ✅ Applies to new + v1 dark sections. ⚠️ First pass; review it visually. Code-window mockups stay dark on purpose. |
| Lighthouse | ⚠️ Not run (local file preview). Run PageSpeed on staging. |
| External links | ⚠️ "Visit site" domains not checked live. |

## Out of scope / later
- Real AI assistant backend (hook is in place: `ZG_CONFIG.assistantUrl`).
- Calendly inline embed (currently links out).
- Phone screenshots for the case-study mockups.
