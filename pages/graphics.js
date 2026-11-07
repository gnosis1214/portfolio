"use strict";

/*
 * Line art for the separate pages. Everything uses currentColor, so it follows the theme.
 *
 * ART: self-drawing hero illustrations, the same drawings as the home page's service cards.
 * ANATOMY: drawings whose parts light up with the matching service card. Each group's
 * data-part must match a card's `part` in content.js. data-with also lights a part when
 * that other card is active. The build fails if a card has no matching part.
 */

const part = (name, hit, body, also) =>
  `<g class="zg-pg-part" data-part="${name}"${also ? ` data-with="${also}"` : ""}><rect class="zg-pg-hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}"/>${body}</g>`;

const dot = (x, y) => `<circle class="zg-pg-dot" cx="${x}" cy="${y}" r="5"/>`;

const svg = (body) =>
  `<svg viewBox="0 0 480 340" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const star = (x) =>
  `<path transform="translate(${x} 0)" d="M44 204l2.5 5.5 6 .6-4.5 4 1.3 5.9-5.3-3-5.3 3 1.3-5.9-4.5-4 6-.6z"/>`;

const ART = {
  wordpress:
    '<rect pathLength="100" x="16" y="26" width="168" height="126" rx="11"/><path pathLength="100" d="M16 55h168"/><circle pathLength="100" cx="32" cy="41" r="3"/><circle pathLength="100" cx="45" cy="41" r="3"/><circle pathLength="100" cx="58" cy="41" r="3"/><circle pathLength="100" cx="100" cy="105" r="34"/><path pathLength="100" d="M77 91l9 39 14-27 14 27 9-39M38 167h124M61 178h78"/>',
  shopify:
    '<path pathLength="100" d="M50 65h108l9 104H41L50 65Z"/><path pathLength="100" d="M77 72V51a27 27 0 0 1 54 0v21"/><path pathLength="100" d="M79 113h45M79 129h35"/><circle pathLength="100" cx="148" cy="39" r="18"/><path pathLength="100" d="M140 39h16m-8-8v16"/>',
  seo:
    '<circle pathLength="100" cx="88" cy="88" r="52"/><path pathLength="100" d="m126 126 44 44M62 96l18 18 34-38"/>',
};

const ANATOMY = {
  /* A website in a browser, with a phone beside it. */
  wordpress: svg(
    part("build", [6, 6, 368, 40], `<rect x="6" y="6" width="368" height="328" rx="12"/><path d="M6 40h368M92 23h150"/><circle cx="26" cy="23" r="4"/><circle cx="42" cy="23" r="4"/><circle cx="58" cy="23" r="4"/>${dot(358, 23)}`) +
      part("agency", [24, 52, 70, 30], `<rect x="24" y="54" width="70" height="24" rx="5"/><text class="zg-pg-svg-t" x="59" y="70" text-anchor="middle">your logo</text>${dot(102, 66)}`, "build") +
      part("layout", [24, 88, 332, 88], `<path d="M236 66h24M274 66h24M312 66h44"/><rect x="24" y="90" width="332" height="84" rx="7"/><path d="M44 114h130M44 130h92"/><rect x="44" y="144" width="66" height="18" rx="4"/><rect x="232" y="102" width="108" height="60" rx="5"/><path d="m232 148 30-24 22 16 18-12 38 26"/>${dot(200, 152)}`, "build") +
      part("plugins", [24, 184, 332, 78], `<rect x="24" y="188" width="160" height="72" rx="7"/>${star(0)}${star(22)}${star(44)}${star(66)}${star(88)}<path d="M40 240h128"/><rect x="196" y="188" width="160" height="72" rx="7"/><path d="M196 208h160M220 226h16M252 226h16M284 226h16M316 226h16M220 244h16M252 244h16"/>${dot(190, 224)}`, "build") +
      part("seo", [24, 270, 332, 50], `<rect x="24" y="274" width="332" height="44" rx="7"/><path d="M44 306l28-12 26 6 32-16M170 296h110"/><circle cx="318" cy="294" r="9"/><path d="m325 301 9 9"/>${dot(146, 284)}`, "build") +
      part("fixes", [386, 80, 94, 180], `<rect x="392" y="84" width="82" height="170" rx="12"/><path d="M404 108h58M404 120h58M404 132h58M404 158h58M404 172h40"/><circle cx="433" cy="238" r="4"/>${dot(433, 200)}`)
  ),

  /* A store page: theme, product with a 360° ring, catalog, Printful, Liquid and speed. */
  shopify: svg(
    part("theme", [6, 6, 468, 44], `<rect x="6" y="6" width="468" height="328" rx="12"/><path d="M6 44h468"/><rect x="24" y="16" width="56" height="18" rx="4"/><circle cx="396" cy="25" r="7"/><circle cx="418" cy="25" r="7"/><circle cx="440" cy="25" r="7"/>${dot(100, 25)}`) +
      part("interactive", [30, 58, 250, 166], `<path d="M92 92l58-26 58 26v66l-58 28-58-28zM92 92l58 28 58-28M150 120v66"/><ellipse cx="150" cy="150" rx="110" ry="26" stroke-dasharray="6 8"/><path d="m262 164-4 16-14-8"/><text class="zg-pg-svg-t" x="150" y="214" text-anchor="middle">drag to rotate</text>${dot(40, 150)}`) +
      part("catalog", [292, 56, 170, 92], `<rect x="296" y="62" width="70" height="62" rx="6"/><rect x="386" y="62" width="70" height="62" rx="6"/><path d="M376 86v14M369 93h14M296 138h70M386 138h46"/>${dot(376, 62)}`) +
      part("printful", [300, 152, 170, 90], `<path d="M314 176l20-14h12a14 14 0 0 0 28 0h12l20 14-12 18-12-6v44h-44v-44l-12 6z"/>${dot(424, 198)}`) +
      part("liquid", [24, 230, 260, 92], `<rect x="24" y="234" width="256" height="84" rx="7"/><text class="zg-pg-svg-t" x="40" y="260">{% section 'zg-bundle' %}</text><text class="zg-pg-svg-t" x="40" y="282">{{ product.title }}</text><text class="zg-pg-svg-t" x="40" y="304">{{ product.price | money }}</text>${dot(280, 234)}`) +
      part("speed", [296, 262, 170, 60], `<path d="M306 312a34 34 0 0 1 68 0m-34 0 18-20M392 306h56M392 290h40"/>${dot(392, 274)}`)
  ),

  /* How a crawler moves through a site: llms.txt, schema, internal links, speed and reports. */
  seo: svg(
    part("console", [24, 16, 134, 100], `<path d="M40 110V30M40 110h110M66 110V84M92 110V62M118 110V42"/>${dot(146, 96)}`) +
      part("llms", [186, 14, 84, 116], `<path d="M190 20h52l22 22v52h-74zM242 20v22h22M215 94v36"/><text class="zg-pg-svg-t" x="227" y="70" text-anchor="middle">llms.txt</text>${dot(190, 94)}`) +
      part("crawl", [270, 2, 170, 94], `<rect x="330" y="30" width="84" height="60" rx="10"/><circle cx="354" cy="58" r="6"/><circle cx="390" cy="58" r="6"/><path d="M372 30V16M360 76h24"/><circle cx="372" cy="11" r="4"/><path d="M330 60h-62" stroke-dasharray="4 6"/>${dot(298, 60)}`) +
      part("schema", [20, 126, 150, 66], `<rect x="24" y="130" width="112" height="58" rx="7"/><text class="zg-pg-svg-t" x="80" y="164" text-anchor="middle">{ JSON-LD }</text><path d="M136 159h34" stroke-dasharray="4 6"/>${dot(24, 130)}`) +
      part("links", [36, 128, 360, 184], `<rect x="170" y="130" width="90" height="58" rx="7"/><text class="zg-pg-svg-t" x="215" y="164" text-anchor="middle">home</text><rect x="40" y="250" width="90" height="58" rx="7"/><rect x="170" y="250" width="90" height="58" rx="7"/><rect x="300" y="250" width="90" height="58" rx="7"/><path d="M215 188v62M85 250v-30h260v30M58 272h54M58 288h34M188 272h54M188 288h34M318 272h54M318 288h34"/>${dot(345, 220)}`) +
      part("vitals", [290, 136, 170, 72], `<path d="M300 190a40 40 0 0 1 80 0m-40 0 20-24M398 190h56M398 172h36"/>${dot(398, 152)}`)
  ),
};

module.exports = { ART, ANATOMY };
