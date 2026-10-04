#!/usr/bin/env node
/**
 * Phase 3 evidence: the homepage hero and its sample notice, inner-page headlines with their accent
 * (serif italic in English, emphasis dots in Chinese), and a case page's status panel, its what-changed
 * block and its closing block (outcome and reusable asset before; now offered as after).
 * Run once against main (OUT=before, BASE_URL=http://localhost:3101) and once against the branch.
 *
 *   OUT=after node scripts/award-2/capture-copy.mjs
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, outDir } from "./lib.mjs";

const dir = outDir("phase-3");
const shots = [
  // name, path, width, element to centre (null = top of page)
  ["home-hero-en-1440", "/en", 1440, null],
  ["home-hero-en-390", "/en", 390, null],
  ["home-hero-card-en-390", "/en", 390, ".hero-card"],
  ["home-hero-zh-hant-1440", "/zh-hant", 1440, null],
  ["home-hero-zh-hant-390", "/zh-hant", 390, null],
  ["platform-en-1440", "/en/platform", 1440, null],
  ["service-en-1440", "/en/services/digitalmarketing", 1440, null],
  ["service-zh-hant-390", "/zh-hant/services/digitalmarketing", 390, null],
  ["solution-en-1440", "/en/solutions/market-intelligence", 1440, null],
  ["case-studies-en-1440", "/en/case-studies", 1440, null],
  ["case-panel-en-1440", "/en/case-studies/omni-channel-retail-intelligence", 1440, ".status-panel"],
  ["case-changed-en-1440", "/en/case-studies/omni-channel-retail-intelligence", 1440, "main .section-head >> text=Before and after"],
  ["case-close-en-1440", "/en/case-studies/omni-channel-retail-intelligence", 1440, "main .split .stack"],
];

const browser = await chromium.launch();
for (const [name, route, width, selector] of shots) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
  await page.goto(base + route, { waitUntil: "networkidle" });
  if (selector) {
    await page.locator(selector).first().evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollBy({ top: r.top + r.height / 2 - window.innerHeight / 2, behavior: "instant" });
    });
  }
  await page.waitForTimeout(900);
  const png = await page.screenshot({ type: "png" });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
  console.log(name);
  await page.close();
}
await browser.close();
