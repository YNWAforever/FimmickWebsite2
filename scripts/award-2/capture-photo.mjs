#!/usr/bin/env node
/**
 * Phase 6 evidence: the photograph surfaces the pipeline and badge policy change (homepage hero,
 * the outputs and evidence chapters, a page hero band at 1440, the closing chapter at 390).
 *
 *   OUT=after node scripts/award-2/capture-photo.mjs
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, outDir } from "./lib.mjs";

const dir = outDir("phase-6");
const browser = await chromium.launch();
const shots = [
  ["home-hero-1440", "/en", 1440, null],
  ["home-outputs-1440", "/en", 1440, ".cine-outputs"],
  ["home-evidence-1440", "/en", 1440, ".cine-evidence"],
  ["home-paths-1440", "/en", 1440, ".cine-paths"],
  ["services-hero-1440", "/en/services", 1440, ".page-hero__photo"],
  ["home-closing-390", "/en", 390, ".closing"],
];
for (const [name, route, width, selector] of shots) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
  await page.goto(base + route, { waitUntil: "networkidle" });
  if (selector) {
    await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
    await page.waitForLoadState("networkidle");
  }
  await page.waitForTimeout(1200);
  await sharp(await page.screenshot({ type: "png" })).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
  console.log(name);
  await page.close();
}
await browser.close();
