# Separate pages for zana-g.com

Service pages and case studies, each built as one Elementor HTML widget on the Elementor Canvas template, the same setup as the home page.

| File | What it holds |
|---|---|
| `content.js` | All page copy, SEO titles and descriptions |
| `template.js` | Shared page markup |
| `graphics.js` | Line drawings: the hero art and the drawings that light up with the service cards |
| `pages.css` | Layout and graphics rules only these pages use |
| `runtime.js` | Menu, theme toggle, tabs, card highlights, the demo cube and dataLayer events |
| `build.js` | Takes the CSS these pages need from `../zeno-portfolio-elementor.html` and writes `dist/` |
| `deploy.js` | Creates or updates the pages through the REST API |

## Change a page

1. Edit `content.js`, then build. The build fails on a missing or repeated H1, title or description, a skipped heading level, or a broken internal link.

```bash
node pages/build.js
```

2. Deploy. Pages stay drafts unless you pass `--publish`, and a published page can't be overwritten without it. `ZG_WP_BASIC_AUTH` must be in the environment.

```bash
node pages/deploy.js --only shopify-developer
```

Rebuild and redeploy after changing shared styles in the home widget, so these pages pick them up.

## Copy rule

Project facts are reused word for word from the home page. Anything new is wrapped in `N()` in `content.js`, which lists it in `dist/new-copy.md` for review. Don't add clients, results or metrics that aren't already on the site.
