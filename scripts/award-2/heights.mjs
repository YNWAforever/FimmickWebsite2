#!/usr/bin/env node
/**
 * Document-height drift during a first scroll-through (audit item: content-visibility placeholders).
 * drift = the largest |scrollHeight − scrollHeight at load| seen while scrolling top to bottom.
 *
 *   OUT=before node scripts/award-2/heights.mjs
 *   ASSERT=1 node scripts/award-2/heights.mjs     # exits 1 when a page exceeds the Phase 1.3 budget
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import { base, outDir, scrollThrough, writeJson } from "./lib.mjs";

const pages = ["/en", "/zh-hant", "/en/platform", "/en/services", "/en/solutions/content-production"];
const widths = [[1440, 900], [390, 844]];
/** Phase 1.3 acceptance: max drift per page and width. */
const budget = { "/en": { 390: 400, 1440: 150 }, "/zh-hant": { 390: 400, 1440: 150 }, "/en/platform": { 390: 0, 1440: 0 }, "/en/services": { 390: 0, 1440: 0 } };

const browser = await chromium.launch();
const rows = [];
let failed = false;
for (const [width, height] of widths) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const load = await page.evaluate(() => document.documentElement.scrollHeight);
    let min = load;
    let max = load;
    let drift = 0;
    await scrollThrough(page, {
      onStep: ({ h }) => {
        min = Math.min(min, h);
        max = Math.max(max, h);
        drift = Math.max(drift, Math.abs(h - load));
      },
    });
    const end = await page.evaluate(() => document.documentElement.scrollHeight);
    const limit = budget[p]?.[width];
    const ok = limit === undefined || drift <= limit;
    if (!ok) failed = true;
    rows.push({ page: p, viewport: `${width}x${height}`, load, end, min, max, drift, budget: limit ?? null, ok });
    console.log(`${ok ? "ok  " : "FAIL"} ${String(width).padStart(4)} ${p.padEnd(34)} load ${load}  end ${end}  range ${min}–${max}  drift ${drift}${limit !== undefined ? `  (budget ${limit})` : ""}`);
  }
  await context.close();
}
await browser.close();
writeJson(path.join(outDir(), "heights.json"), rows);
if (process.env.ASSERT === "1" && failed) process.exit(1);
