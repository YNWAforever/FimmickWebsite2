#!/usr/bin/env node
/**
 * Measures the homepage bands' real heights (content-visibility forced off) per locale at the three
 * placeholder breakpoints and prints the custom-property block used by award-home.css for
 * `contain-intrinsic-block-size`. Re-run after any copy or layout change to the homepage bands,
 * then paste the output over the "Measured content-box heights" block in app/styles/award-home.css.
 *
 *   node scripts/award-2/bands.mjs
 */
import { chromium } from "@playwright/test";
import { base } from "./lib.mjs";

const bands = {
  outputs: ".cine-outputs",
  evidence: ".cine-evidence",
  night: ".chapter-night",
  paths: ".cine-paths",
  industries: ".cine-industries",
  eco: ".cine-eco",
  resources: ".cine-resources",
  start: ".cine-start",
  faq: ".home-faq",
  closing: ".closing",
  footer: "main:has(.closing) + .site-footer",
};
// One representative viewport per placeholder breakpoint: <700, 700–999, ≥1000.
const widths = [["", 390, 844], ["(min-width: 700px)", 820, 1180], ["(min-width: 1000px)", 1440, 900]];
const round = (n) => Math.round(n / 10) * 10;

const browser = await chromium.launch();
const out = [];
for (const [media, width, height] of widths) {
  const sets = {};
  for (const locale of ["en", "zh-hant"]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${base}/${locale}`, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "* { content-visibility: visible !important; }" });
    await page.waitForTimeout(400);
    // contain-intrinsic-block-size sizes the content box: padding and borders are added on top.
    sets[locale] = await page.evaluate(
      (b) =>
        Object.fromEntries(
          Object.entries(b).map(([k, s]) => {
            const el = document.querySelector(s);
            if (!el) return [k, 0];
            const cs = getComputedStyle(el);
            const chrome = ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"].reduce((n, p) => n + parseFloat(cs[p]), 0);
            return [k, el.getBoundingClientRect().height - chrome];
          }),
        ),
      bands,
    );
    await page.close();
  }
  const decl = (set) => Object.keys(bands).map((k) => `--band-${k}: ${round(set[k])}px;`).join(" ");
  const block = [`html { ${decl(sets.en)} }`, `html:lang(zh-Hant-HK), html:lang(zh-Hans) { ${decl(sets["zh-hant"])} }`];
  out.push(media ? `@media ${media} {\n  ${block.join("\n  ")}\n}` : block.join("\n"));
}
await browser.close();
console.log(out.join("\n"));
