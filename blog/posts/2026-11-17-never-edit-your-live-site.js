"use strict";

module.exports = {
  slug: "never-edit-your-live-site",
  key: "staging_first",
  date: "2026-11-17",
  category: "websites",
  title: "Why website changes should never go straight to the live site",
  seoTitle: "Why Website Changes Should Never Go Straight to Live",
  seoDescription: "Editing a live website risks broken pages, lost orders and lost leads. How staging, Git backups and rollbacks work in plain English, and what to ask for.",
  excerpt: "Most website disasters start with a small edit made on the live site. Here's how I use staging, Git backups and a rollback plan so changes go out safely, and the questions to ask anyone who works on your site.",
  tags: ["staging", "backups", "Git", "rollback", "WordPress", "Shopify", "website maintenance", "small business"],
  image: {
    unsplash: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67",
    alt: "Developer writing code on a laptop at a wooden desk",
    credit: { name: "Danial Igdery", url: "https://unsplash.com/@ricaros", site: "Unsplash", siteUrl: "https://unsplash.com/" },
  },
  services: ["wordpress-elementor-developer", "shopify-developer"],
  takeaways: [
    "Edits made straight on the live site put your sales on the line: one bad plugin update or layout change and visitors see a broken page.",
    "Staging is a private copy of your site where changes get built and tested first. Git and backups mean any change can be undone.",
    "Ask anyone who works on your site three questions: where do you make changes, how do you back up, and how do you undo a mistake?",
  ],
  body: [
    { h2: "The edit that takes the site down" },
    { p: "It usually starts small. Someone updates a plugin, tweaks the header or pastes in a new tracking script. They hit save on the live site, and for the next hour the menu is broken on phones, or the checkout button stops working, or the contact form quietly stops sending." },
    { p: "Nobody notices right away, because the person who made the change checked it on their laptop and moved on. Meanwhile real customers are hitting the problem." },
    { p: "That's why I don't make changes on a live site. I build and test them on a staging copy first, and I always have a way back. This post explains how that works in plain English, so you know what to expect from anyone who touches your website." },
    { h2: "What goes wrong when edits happen live" },
    { p: "Working on the live site isn't always a disaster. Most small edits go fine. The problem is that when one doesn't, your customers find out before you do." },
    {
      ul: [
        "**Broken layouts.** A change that looks right on a laptop pushes the menu over the logo on a phone.",
        "**Plugin and theme conflicts.** An update to one plugin breaks another, and pages show errors or go blank.",
        "**Forms and checkout.** A script or setting change stops forms from sending or payments from going through. I covered why this one is so costly in [7 signs your website is costing you leads](/signs-your-website-is-costing-you-leads/).",
        "**No way back.** Without a recent backup, \"just undo it\" means rebuilding from memory.",
      ],
    },
    { h2: "Staging, backups and rollbacks in plain English" },
    { p: "Three ideas do most of the work. None of them are complicated." },
    { p: "**Staging** is a private copy of your website. It looks and works like the real one, but customers never see it. I make changes there, test them, and only move them to the live site once they work. On WordPress, many hosts include a staging tool; I've used Hostinger's. On [Shopify stores](/shopify-developer/), the same idea is a duplicate theme: you edit and preview the copy, then publish it when it's ready." },
    { p: "**Backups** are saved copies of the site you can restore. A good setup has a fresh backup right before any big change, not just a weekly one from five days ago." },
    { p: "**Git** is a tool developers use to record every change to code, with a note on what changed and why. If a custom section or snippet causes trouble, I can see exactly what changed and put the previous version back in minutes." },
    { p: "Together, they give you a **rollback**: a tested way to undo a change if something goes wrong after launch." },
    {
      compare: {
        title: "Same change, two ways to make it",
        options: [
          {
            label: "Edit the live site",
            points: [
              "Customers see every half-finished step",
              "Testing happens after the change is already public",
              "A bad update can break pages or checkout during business hours",
              "Undo depends on whatever backup happens to exist",
              "Hard to tell later what changed, when, or why",
            ],
          },
          {
            label: "Staging first",
            good: true,
            points: [
              "Changes are built and checked where nobody can see them",
              "Phones, tablets, forms and checkout get tested before launch",
              "Updates are tried on the copy first, so conflicts show up there",
              "A fresh backup and Git history make undo a known step",
              "You approve the change before it goes live",
            ],
          },
        ],
      },
    },
    { h2: "A real example" },
    {
      callout: {
        label: "from real work",
        text: "For Simple Forwarding, I worked in a Hostinger staging environment to review and improve the website before changes went live: fixing links, refining Calendly calls to action, improving mobile navigation and handling general updates. The live site kept taking bookings while the work happened on the copy.",
      },
    },
    { h2: "Common myths about staging" },
    {
      flip: {
        intro: "Tap each card to see the reality.",
        cards: [
          { myth: "Staging is only for big sites.", fact: "Small businesses have the least room for a broken contact form or checkout. A staging copy costs little and protects every lead." },
          { myth: "It's a small change, it's fine to do live.", fact: "Small changes break things too: a menu tweak, a plugin update, a pasted script. Size doesn't predict risk." },
          { myth: "My host backs up, so I'm covered.", fact: "Maybe. But when was the last backup, does it include the database, and has anyone tried restoring it? Check before you need it." },
          { myth: "Staging makes everything slower.", fact: "It adds a short test and a publish step. That's far less time than fixing a broken live site in a hurry." },
        ],
      },
    },
    { h2: "How I move a change from staging to live" },
    { p: "This is the process I follow on WordPress and Shopify work, whether it's a one-hour fix or a full redesign." },
    {
      steps: [
        { title: "Back up first", copy: "Take a fresh backup of the live site and commit any code to Git before starting." },
        { title: "Build on the copy", copy: "Make the change on staging, a duplicate theme or a duplicate page, never on the live version." },
        { title: "Test like a customer", copy: "Check phones, tablets and laptops, click every changed link and button, and submit the forms." },
        { title: "Get your approval", copy: "Send a preview so you can see the change before anything goes live." },
        { title: "Publish and check again", copy: "Move the change live at a quiet time, then retest the key pages, forms and tracking straight away." },
      ],
    },
    {
      callout: {
        label: "watch for this",
        text: "On many staging tools, publishing copies the whole site, files and database, over the live one. [Hostinger's staging guide](https://www.hostinger.com/support/5720286-how-to-create-a-wordpress-staging-environment/) warns that changes made on the live site after the staging copy was created get overwritten. If your site takes orders, bookings or form entries in the meantime, those need a plan before you publish. This is one of the main reasons to have someone experienced handle the push.",
      },
    },
    { h2: "How safe is your current setup?" },
    {
      checklist: {
        kicker: "staging_check",
        title: "Website safety check",
        intro: "Tick each one that's true for your site today.",
        items: [
          "Changes to my site are usually made directly on the live site",
          "I don't know when my site was last backed up",
          "Nobody has ever tested restoring a backup",
          "There's no staging site or duplicate theme to test changes on",
          "Plugin, theme or app updates go out without anyone checking forms and checkout afterwards",
          "If something broke tonight, I'm not sure who would fix it or how",
        ],
        results: [
          { upTo: 0, title: "You're in good shape", text: "Your site has the basics covered. Keep testing your backups now and then so they work when you need them." },
          { upTo: 2, title: "A few gaps to close", text: "These are usually quick to fix: set up staging or a duplicate theme, and make sure backups run before every change.", cta: "Help me close the gaps" },
          { upTo: 6, title: "Your site is exposed", text: "One bad update could cost you a day of sales or leads. A safe setup with staging, backups and a rollback plan is a small job worth doing now.", cta: "Set up a safe workflow" },
        ],
      },
    },
    { h2: "Questions to ask anyone who works on your site" },
    { p: "Whether you hire me or someone else, these three questions tell you a lot:" },
    {
      ol: [
        "**Where will you make the changes?** The answer you want is staging, a duplicate theme or a duplicate page.",
        "**How do you back up before you start?** Look for a fresh backup and, for custom code, Git.",
        "**If something breaks after launch, how do you undo it?** A clear answer here is worth more than a fast quote.",
      ],
    },
    { p: "If you're working with several freelancers, ask each of them. When nobody owns the whole site, nobody owns the backup either, which is one of the gaps I wrote about in [One developer or five freelancers?](/one-web-developer-vs-five-freelancers/)" },
    { h2: "Questions, answered" },
    {
      faq: [
        { q: "Do I need to pay for a separate staging site?", a: "Often not. Many WordPress hosts include a staging tool on some plans, and Shopify lets you duplicate and preview a theme. If your host has no staging tool, a staging copy can be set up on a subdomain." },
        { q: "Can you work on my site without taking it offline?", a: "Yes. That's the point of staging. Your live site keeps working while I build and test changes on the copy, and you approve them before they go live." },
        { q: "What happens if something breaks after launch?", a: "I roll it back to the backup or the previous Git version, then fix the problem on staging before trying again. Taking a backup before every change is what makes that possible." },
      ],
    },
    {
      cta: {
        title: "Want changes made without risking your live site?",
        copy: "Tell me what needs doing. I'll work on staging or a duplicate first, back up before every change, and confirm with you before anything goes live.",
        button: "Book a call",
        link: { slug: "wordpress-elementor-developer", text: "See WordPress services" },
      },
    },
  ],
};
