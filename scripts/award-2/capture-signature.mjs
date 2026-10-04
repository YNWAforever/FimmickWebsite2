#!/usr/bin/env node
/**
 * Phase 7 evidence: the hero sample card at 1440 and 390 (finished state, as served) and, with
 * RECORD=1, a ~10-second recording of the interaction (hover a fact, pin another, reset and approve).
 *
 *   OUT=after RECORD=1 node scripts/award-2/capture-signature.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, outDir } from "./lib.mjs";

const dir = outDir("phase-7");
const browser = await chromium.launch();
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}/en`, { waitUntil: "networkidle" });
  await page.locator(".hero-card").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(2200);
  await sharp(await page.screenshot({ type: "png" })).webp({ quality: 80 }).toFile(path.join(dir, `hero-card-${width}.webp`));
  console.log("shot", width);
  await page.close();
}
if (process.env.RECORD) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir, size: { width: 1440, height: 900 } } });
  const page = await context.newPage();
  await page.goto(`${base}/en`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const chips = page.locator(".hero-fact");
  for (const i of [0, 1, 2, 3]) {
    await chips.nth(i).hover();
    await page.waitForTimeout(700);
  }
  await chips.nth(3).click();
  await page.waitForTimeout(700);
  const approve = page.locator(".hero-card__approved");
  await approve.hover();
  await approve.click();
  await page.waitForTimeout(1100);
  await approve.click();
  await page.waitForTimeout(1600);
  const video = page.video();
  await context.close();
  fs.renameSync(await video.path(), path.join(dir, "hero-card-interaction.webm"));
  console.log("recorded hero-card-interaction.webm");
}
await browser.close();
