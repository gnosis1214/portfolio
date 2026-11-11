"use strict";

module.exports = {
  slug: "is-your-website-ready-for-ai-search",
  key: "ai_ready",
  date: "2026-11-12",
  category: "seo-ai",
  title: "Is your website ready for AI search? A plain-English check",
  seoTitle: "Is Your Website Ready for AI Search? A Plain-English Check",
  seoDescription: "ChatGPT, Perplexity and Google's AI answers now recommend businesses. Here's how they find your website, and an 8-point check you can run today.",
  excerpt: "People now ask ChatGPT, Perplexity and Google's AI answers which business to hire. Those tools can only recommend you if they can reach, read and trust your site. Here's how that works, what helps, and a quick check you can run today.",
  tags: ["ai search", "chatgpt", "perplexity", "ai overviews", "llms.txt", "schema", "geo", "aeo", "robots.txt", "crawlers"],
  image: {
    unsplash: "https://images.unsplash.com/photo-1746883741112-9fbcd2276cb1",
    alt: "Phone open to ChatGPT asking What can I help with, next to a laptop",
    credit: { name: "Tim Witzdam", url: "https://unsplash.com/@timwitzdam", site: "Unsplash", siteUrl: "https://unsplash.com/" },
  },
  services: ["technical-seo-llms-txt", "walker-group-case-study"],
  takeaways: [
    "AI search tools still start with the basics: they need to reach your pages, read the text and understand who you are.",
    "Allow the search crawlers you want, keep key facts in plain HTML, and describe your business with schema markup.",
    "llms.txt is cheap to add, but no major AI search engine has said it relies on it. Don't buy it as a magic fix.",
  ],
  body: [
    { h2: "How AI search finds your business" },
    { p: "When someone asks ChatGPT for a reliable home care agency nearby, or asks Perplexity to compare Shopify developers, the tool doesn't guess. It searches the web, reads a handful of pages and writes an answer that quotes or links the sources it trusted." },
    { p: "So the question is the one SEO has always asked, with higher stakes: **can these tools reach your site, read it and understand what you do?** If the answer is no, you're not on the shortlist, and you never see the search that skipped you." },
    {
      steps: [
        { title: "Reach", copy: "A crawler has to be allowed in. Your robots.txt file, security plugin or CDN decides that." },
        { title: "Read", copy: "It reads the text on the page. Many AI crawlers don't run JavaScript, so content that only appears after scripts load can be invisible to them." },
        { title: "Understand", copy: "Clear headings, direct answers and schema markup tell it what the page is about and who the business is." },
        { title: "Trust", copy: "Matching details across your site, Google Business Profile and directories, plus proof like case studies and reviews, make you safe to recommend." },
      ],
    },
    { h2: "Which crawlers matter" },
    { p: "Each AI company runs its own bots, and most separate the one that **trains models** from the one that **fetches pages for answers**. Blocking a training bot is a fair business choice. Blocking a search bot means you can't be cited." },
    {
      ul: [
        "**OpenAI:** `OAI-SearchBot` powers ChatGPT search results, `GPTBot` collects training data, and `ChatGPT-User` fetches a page when a user asks about it.",
        "**Anthropic:** `Claude-SearchBot` for search, `ClaudeBot` for training and `Claude-User` for user requests.",
        "**Perplexity:** `PerplexityBot` builds its index and `Perplexity-User` handles live lookups.",
        "**Google:** AI Overviews and AI Mode use the normal `Googlebot`. The separate `Google-Extended` setting covers Gemini, not your place in Google Search.",
        "**Microsoft:** Copilot answers lean on the Bing index, so `Bingbot` access and Bing Webmaster Tools still count.",
      ],
    },
    {
      callout: {
        label: "check this first",
        text: "Some security plugins and CDNs block AI crawlers by default. If your site sits behind one, look at its bot settings before anything else. One blocking rule can cancel out every other fix on this list.",
      },
    },
    { h2: "What helps AI tools read and trust your site" },
    {
      ul: [
        "**Put the answer near the top.** Say what you do, for whom and where in the first lines of the page. AI answers favour pages that state facts plainly.",
        "**Keep key facts in the HTML.** Services, prices, locations and contact details should be real text, not baked into images or loaded by a script after the page appears.",
        "**Use schema markup.** Organization or LocalBusiness, Service, Product and FAQ schema describe your business in a format machines read without guessing.",
        "**Give each service its own page.** One page listing everything you do gives an AI tool nothing specific to quote. A focused page per service does, which is why this site has a [separate page for each service](/technical-seo-llms-txt/).",
        "**Make your details match everywhere.** Business name, address, phone number and hours should agree across your site, Google Business Profile and directories.",
        "**Show proof.** Case studies, reviews and named clients give an answer engine a reason to pick you over a competitor making the same claims.",
      ],
    },
    { h2: "What about llms.txt?" },
    { p: "`llms.txt` is a plain text file at the root of your site that sums up who you are and links your most important pages, written for AI tools. It's a proposal, not a standard. Google has said it doesn't use it, and the other big AI search engines haven't confirmed that they read it." },
    { p: "I still add one for most clients. It takes an hour, costs nothing to serve, and forces a useful exercise: writing down in plain words what the business does and which pages matter. I've done this for [The Walker Group](/walker-group-case-study/) and [Graceful Connections Home Care](/graceful-connections-case-study/). Just don't treat it as the fix. Crawler access, readable content and schema do the heavy lifting." },
    {
      flip: {
        intro: "Four things people get wrong about AI search. Tap a card to flip it.",
        cards: [
          { myth: "You need llms.txt to show up in ChatGPT.", fact: "ChatGPT search relies on its own crawler and search partners. llms.txt is optional. Being reachable and readable is not." },
          { myth: "Blocking GPTBot keeps you out of ChatGPT answers.", fact: "GPTBot is for training. ChatGPT search uses OAI-SearchBot. You can block one and allow the other." },
          { myth: "AI search replaces SEO.", fact: "It runs on the same foundations: crawlable pages, clear content, structured data and trust. Good SEO is most of the work." },
          { myth: "AI tools only recommend big brands.", fact: "They recommend the clearest, most specific answer they can check. A small business with focused service pages can beat a vague big site." },
        ],
      },
    },
    { h2: "Check your site in five minutes" },
    {
      checklist: {
        kicker: "ai_readiness",
        title: "AI search readiness check",
        intro: "Tick what's true for your site today. Not sure about one? Leave it unticked.",
        items: [
          "robots.txt doesn't block OAI-SearchBot, Claude-SearchBot, PerplexityBot or Googlebot",
          "Your CDN or security plugin isn't blocking AI crawlers by default",
          "Each main service has its own page with a clear heading",
          "The first lines of your home page say what you do, for whom and where",
          "Prices, services and contact details are real text, not images",
          "Organization or LocalBusiness schema is on the site and passes Google's Rich Results Test",
          "Your name, address and phone number match your Google Business Profile",
          "You show case studies, reviews or named clients on the site",
        ],
        results: [
          { upTo: 3, title: "AI tools are probably skipping you", text: "The basics aren't in place yet, so most AI answers can't use your site. The good news: these are quick technical fixes.", cta: "Get these fixed" },
          { upTo: 6, title: "Halfway there", text: "AI tools can find you, but they're missing context. Schema, focused service pages and matching details are usually the next wins.", cta: "Ask about an AI search check" },
          { upTo: 8, title: "In good shape", text: "Your site gives AI tools what they need. Keep it that way: recheck crawler settings after plugin or CDN updates, and keep adding proof." },
        ],
      },
    },
    { h2: "Questions, answered" },
    {
      faq: [
        { q: "Will this get me into ChatGPT answers?", a: "Nobody can promise a place in an AI answer, the same way nobody can promise a Google ranking. What you can do is remove the reasons to skip you. That part is technical, and it's fixable." },
        { q: "How long does an AI search check take?", a: "For most small business sites, the check and the quick fixes (crawler settings, schema, llms.txt and a few content changes) take 1 to 3 days." },
        { q: "Do I need to rewrite my whole site?", a: "Rarely. Most of the work is structure: clearer headings, a short summary at the top of key pages, schema and one page per service. Your existing copy usually stays." },
      ],
    },
    {
      cta: {
        title: "Want to know how AI tools see your site?",
        copy: "I'll check crawler access, schema, llms.txt and your key pages, then send a short list of fixes in order of impact.",
        button: "Book an AI search check",
        link: { slug: "technical-seo-llms-txt", text: "See technical SEO services" },
      },
    },
  ],
};
