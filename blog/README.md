# zana-g.com blog

Weekly posts on why businesses and agencies should hire Zana-G, published at `https://zana-g.com/<slug>/` with an archive at `https://zana-g.com/blog/`. Each post is a WordPress post on the Elementor Canvas template holding one HTML widget, built the same way as the service pages in `../pages/`.

| File | What it holds |
|---|---|
| `posts/YYYY-MM-DD-<slug>.js` | One post: copy, SEO title and description, image source and credit, body blocks |
| `topics.json` | The queue of upcoming topics, and which ones are published |
| `config.js` | Topics (categories), byline, booking link |
| `template.js` | Post and archive markup |
| `blog.css` / `runtime.js` | Blog styles and interactions (contents list, checklists, flip cards, archive filters) |
| `media.js` | Downloads the post's stock photo and uploads it to the media library |
| `build.js` | Builds `dist/` and fails on anything that would ship a broken post |
| `deploy.js` | Publishes changed posts and the archive, then clears the cache |
| `wp-snippet-archives.php` | Code Snippets #7 on the site: sends category, author and date archives to `/blog/` |

## Weekly post

1. Take the first `queued` topic in `topics.json`.
2. Find a photo on Unsplash with the free license only (`unsplash.com/s/photos/<words>?license=free&orientation=landscape`). Look at it before choosing. Copy the `images.unsplash.com/photo-...` URL and the photographer's name and profile. Backup source: StockSnap (CC0) through the Openverse API, `https://api.openverse.org/v1/images/?q=<one word>&source=stocksnap`.
3. Copy an existing post file and write the new one. Rules:
   - 1,000 to 1,400 words, first person ("I"), plain English, short paragraphs.
   - At least two interactive blocks: `checklist`, `flip`, `compare` or `steps`. Always a `faq` and one `cta`.
   - Link to at least one service page and one older post. Internal links start with `/`, like `[text](/shopify-developer/)`.
   - Only use client facts already on the site (see `../pages/content.js`). No invented clients, results, numbers or quotes. Cite or leave out any statistic.
   - No em or en dashes (the build rejects them).
4. Upload the image, build, publish:

```bash
node blog/media.js --slug <slug>
node blog/build.js --preview
node blog/deploy.js
```

5. Check the live URL, mark the topic `published` in `topics.json`, commit and push.

`deploy.js` only sends posts whose HTML changed, so older posts keep an honest "last modified" date. Pass `--draft` to stage a new post as a draft instead.

## Blocks

`{ h2 }`, `{ h3 }`, `{ p }`, `{ ul: [] }`, `{ ol: [] }`, `{ callout: { label, text } }`, `{ quote }`,
`{ checklist: { kicker, title, intro, items: [], results: [{ upTo, title, text, cta? }] } }`,
`{ flip: { intro, cards: [{ myth, fact }] } }`,
`{ compare: { title, options: [{ label, good?, points: [] }] } }`,
`{ steps: [{ title, copy }] }`, `{ faq: [{ q, a }] }`, `{ cta: { title, copy, button, link: { slug, text } } }`.

Copy supports `**bold**`, `` `code` `` and `[links](/slug/)`.

## Analytics

Posts push `zg_event` to the dataLayer like the rest of the site: `blog_open`, `blog_toc`, `blog_share`, `blog_copy_section`, `blog_flip`, `blog_compare`, `blog_checklist` (score), `blog_feedback`, `blog_read_complete`, `blog_filter`, `blog_search` (result count only, never the query), `blog_sort`, plus the existing `book_call` and `email_click`.
