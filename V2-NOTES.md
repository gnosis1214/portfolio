# Portfolio v2: notes and deliverables

File: `zeno-portfolio-elementor.html` (one Elementor HTML widget). A copy is saved as `zeno-portfolio-elementor.txt`. v1 backup: `zeno-portfolio-elementor.v1.html`.

## Assumptions
- v1 copy, layout logic and scripts are kept. v2 adds a second `<style>` and `<script>` block with `zg-` classes and IDs. It also makes two small edits to the v1 script: active nav links, and project cards.
- New copy is marked `<!-- DRAFT: Zeno to review -->` or `<!-- DRAFT: added in v2 -->`. The "What I did" text in the case studies is your existing project copy.
- Stats, results and case-study images are placeholders. Nothing is invented.
- "Visit site" links on project cards are built from each card's browser-bar domain (`https://<domain>`). Check that each one resolves. Cards whose domain starts with `[` get no link.
- Size: about 229 KB raw, about 52 KB gzipped. That's over the 200 KB target because v1 alone is 125 KB. I left the source readable rather than minifying it.

## Section order
Sticky nav → Hero → Trust bar → Tech strip → About → Stats → Project orbit → Workflow story → Services → AI & automation → Toolbox → Projects (filter tabs) → Case studies (modals) → Process (pinned on desktop, with the former CTA-band background) → Ways to work with me → FAQ → Contact → Footer · Floating: back-to-top, optional FAQ assistant.

**Removed (round 2):** testimonials, the contact form, the Quick details panel (local time, copy email, CV), package prices and package delivery times.

**Round 3:** removed the About fact tiles and the "Have a project?" CTA band (its gradient + code-bracket graphic now sit on the Process section). Location is now "Mindanao, Philippines" everywhere. Every placeholder is replaced: stats are 15+ projects, 8+ platforms, 3+ years and 5+ countries (estimates; adjust if needed). Case-study results are factual outcomes, not invented metrics. Phone mockups and the empty LinkedIn links are removed, and GitHub links to `github.com/gnosis1214`.

## Round 2 upgrades to the original sections
| Section | Design / graphics | Added items (DRAFT) |
|---|---|---|
| Hero | Third floating chip (`✓ staging → live`) | Highlights row: WordPress · Shopify · Next.js / AI & automation / Remote · GMT+8 |
| Tech strip | Gradient band, faded edges | React, Next.js, TypeScript, Tailwind, WooCommerce, GoHighLevel, n8n, Claude Code, GA4 / GTM, Vercel |
| About | Sand glow + dot pattern, rotating `</>` badge | 4 tags (Next.js / React, n8n Automation, Technical SEO, GA4 & GTM), extra `$ stack` line |
| Project orbit | Concentric ring background + glow | — |
| Workflow story | Glow + grid background, screen glow, progress dots | Steps 06 Automation & AI Agents, 07 Full-Stack Builds |
| Services | Glow + grid background | Full-Stack Web Apps, Automation & AI Agents, Technical SEO & AI Search (now 9 cards) |
| Toolbox | Glow + diagonal line background | React, Next.js, TypeScript, Tailwind CSS, Node.js, PHP, WooCommerce, Gutenberg, GoHighLevel, Git & GitHub, Vercel, Meta Pixel, Figma, n8n, MCP |
| Projects | Dot pattern + bottom glow | Lov Spa (Shopify) and BankReady Boardroom (GoHighLevel) cards. They need a screenshot and domain. |
| Contact | Rotating ring graphic | "Open to new projects · GMT+8" + Book a call button |
| Footer | — | Brand line: "Zana-G · Websites, stores and automations, built remotely from Mindanao, Philippines." |

**Process section:** at ≥1050 px, if the content fits the screen, the section pins while you scroll. Steps light up one by one with the progress line, then it releases after all five are on. Mobile and tablet keep normal scrolling. Reduced-motion users get no pin.

## 1. Still to set

**Config (top of the last `<script>`, `window.ZG_CONFIG`)**: `calendlyUrl` (until it is set, "Book a call" scrolls to Contact) and `upworkUrl` (Upwork links stay hidden until it is set). `assistantUrl` is optional.

**Worth checking:** the stat numbers, FAQ answers (turnaround 1–3 days / 2–4 weeks, 2 revision rounds, Wise or PayPal, 50/50), package limits (8 pages, 5 hours/month), and the draft Lov Spa / BankReady Boardroom card text. Those two cards still need a screenshot `<img>`. If you edit an FAQ answer, update the FAQPage JSON-LD too.

## 2. SEO pack

**Yoast / Rank Math**
- Title (60 chars): `Zeno Montilla | WordPress, Shopify & AI Automation Developer`
- Meta description (142 chars): `Remote WordPress, Shopify and Next.js developer (GMT+8) building fast sites, stores and n8n + Claude AI automations for agencies and startups.`

**On-page:** one `h1`, `h2` → `h3` order, lazy images with alt text, `#zeno-*` anchors, and all motion off under `prefers-reduced-motion`. No libraries added.

**JSON-LD** (inside the widget): `Person`, `ProfessionalService`, `WebSite`, `FAQPage`. Yoast and Rank Math also output `Person` / `WebSite`, so turn off the plugin's schema for this page or delete the `WebSite` node. Then test in the Rich Results Test.

**llms.txt**: draft in `llms.txt`. Upload it to `https://zana-g.com/llms.txt`.

## 3. GTM / GA4 events

The page pushes `{ event: "zg_event", zg_event, zg_label, zg_url }` to the dataLayer for every `[data-zg-event]` click.

| `zg_event` | Fired by | Key event? |
|---|---|---|
| `book_call` | Nav, CTA band, packages, contact, case modals | ✅ |
| `email_click` | mailto links | ✅ |
| `upwork_click` / `onlinejobs_click` | Profile links | ✅ |
| `social_click` | LinkedIn / GitHub | |
| `project_click` | "Visit site" on cards and modals (label = domain) | |
| `case_study_open` | Case study buttons | |
| `project_filter` | Filter tabs | |
| `view_projects` / `contact_click` | Hero buttons | |
| `assistant_open` / `assistant_question` | FAQ assistant | |
| `theme_toggle` | Light/dark toggle | |

**GTM setup (no IDs in the page)**
1. Variables → Data Layer Variable: `zg_event`, `zg_label`, `zg_url` (name each `DLV - <name>`).
2. Trigger → Custom Event `zg_event` (`CE - zg_event`).
3. Tag → GA4 Event → your GA4 Measurement ID variable → Event name `{{DLV - zg_event}}` → params `label = {{DLV - zg_label}}`, `link_url = {{DLV - zg_url}}` → trigger `CE - zg_event`.
4. Test in Tag Assistant, then publish.
5. GA4 → Custom definitions: event-scoped `label`. Mark the ✅ rows as key events once they appear.

## 4. Elementor swap-in (staging or duplicate first)
1. WP Admin → Pages → **Duplicate** the portfolio page (or use Hostinger/GoDaddy staging). Work on the copy.
2. **Edit with Elementor** → click the HTML widget → Ctrl+A, delete, paste the whole file → **Update**.
3. Page settings → Page Layout = **Elementor Canvas** or **Full Width**. Hide the theme header if it doubles up.
4. Preview: nav and mobile menu, filters, a case study, the FAQ, the process pin on desktop, and the theme toggle.
5. Caching plugins (LiteSpeed, WP Rocket, Hostinger): exclude this page's inline scripts from "Delay JS". Purge the cache.
6. Set the Yoast/Rank Math title + meta. Remove duplicate schema.
7. **Confirm before touching the live page.** Then swap the widget or publish the copy as the homepage.
8. Search Console → Request indexing. Run PageSpeed Insights (mobile).

## 5. QA results (round 2)
| Check | Result |
|---|---|
| 360 px | ✅ No horizontal scroll. Fact tiles stack. Process doesn't pin (by design). |
| 768 px | ✅ No overflow. Process doesn't pin (by design). |
| 1280 px | ✅ Process pins. Steps light 1 → 5 across the pinned scroll, then it releases. About pin still works. 9 services, 7 story steps with dots, 47 tools in the toolbox. |
| Removed parts | ✅ No testimonials, form, quick-details panel or prices left in the page or scripts. |
| Lighthouse | ⚠️ Not run (local preview). Run PageSpeed on staging. |
| External links | ⚠️ "Visit site" domains not checked live. |

## Later
- Contact form + n8n workflow (removed for now; outline in Git history, commit `b1c856f`).
- Real AI assistant backend (`ZG_CONFIG.assistantUrl`).
- Calendly inline embed.
