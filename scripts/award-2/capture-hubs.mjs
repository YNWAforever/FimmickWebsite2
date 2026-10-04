#!/usr/bin/env node
/**
 * Phase 5 evidence: the four hubs (services, platform, products, functions) as full pages at 1440 and
 * 390 px. The hubs do not use content-visibility, so full-page screenshots are reliable here; the page
 * is scrolled through first so lazy images load. Run against main (OUT=before) and the branch.
 *
 *   OUT=after node scripts/award-2/capture-hubs.mjs
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, outDir, scrollThrough } from "./lib.mjs";

const dir = outDir("phase-5");
const browser = await chromium.launch();
for (const hub of ["services", "platform", "products", "functions"]) {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
    await page.goto(`${base}/en/${hub}`, { waitUntil: "networkidle" });
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(800);
    const png = await page.screenshot({ type: "png", fullPage: true });
    // WebP caps a side at 16,383 px: very tall phone pages are scaled to fit.
    await sharp(png).resize({ width: Math.min(width, 1440), height: 16000, fit: "inside" }).webp({ quality: 70 }).toFile(path.join(dir, `${hub}-${width}.webp`));
    console.log(hub, width);
    await page.close();
  }
}
await browser.close();
