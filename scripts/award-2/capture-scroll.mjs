#!/usr/bin/env node
/**
 * Viewport-by-viewport scroll frames (never fullPage: content-visibility leaves lower bands as
 * placeholders in a full-page capture). For each page and width it writes the fold frame and a
 * contact sheet of every frame, plus the open states the audit looked at.
 *
 *   OUT=before node scripts/award-2/capture-scroll.mjs
 *   OUT=after ONLY=home,platform WIDTHS=390,1440 node scripts/award-2/capture-scroll.mjs
 *   OUT=after STATES=0 ...   # skip the mega-menu / drawer states
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { auditPages, base, frames, jumpTo, outDir } from "./lib.mjs";

const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
const widths = process.env.WIDTHS ? process.env.WIDTHS.split(",").map(Number) : [1440, 1200, 390];
const sizes = { 1440: [1440, 900], 1200: [1200, 800], 390: [390, 844], 820: [820, 1180], 1920: [1920, 1080], 1024: [1024, 768], 320: [320, 640] };
const dir = outDir("frames");

/** Contact sheet: frames scaled down and laid out left to right, top to bottom. */
async function sheet(buffers, width, height, file) {
  const scale = width >= 1000 ? 1 / 3 : 0.4;
  const cols = width >= 1000 ? 4 : 6;
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const gap = 8;
  const rows = Math.ceil(buffers.length / cols);
  const tiles = await Promise.all(buffers.map((b) => sharp(b).resize(w, h).toBuffer()));
  const composite = tiles.map((input, i) => ({ input, left: gap + (i % cols) * (w + gap), top: gap + Math.floor(i / cols) * (h + gap) }));
  await sharp({ create: { width: gap + cols * (w + gap), height: gap + rows * (h + gap), channels: 3, background: "#d9dbe2" } })
    .composite(composite)
    .webp({ quality: 62 })
    .toFile(file);
}

async function captureFrames(page, url, name, width, height, settle = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(base + url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(settle);
  const shots = [];
  for (let i = 0; i < 40; i++) {
    shots.push(await page.screenshot({ type: "png" }));
    const done = await page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2);
    if (done) break;
    await page.evaluate(() => window.scrollBy({ top: window.innerHeight, behavior: "instant" }));
    await frames(page);
    await page.waitForTimeout(settle);
  }
  await sharp(shots[0]).webp({ quality: 80 }).toFile(path.join(dir, `${name}-${width}-fold.webp`));
  await sheet(shots, width, height, path.join(dir, `${name}-${width}-sheet.webp`));
  return shots.length;
}

async function state(page, file) {
  const png = await page.screenshot({ type: "png" });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(dir, `${file}.webp`));
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
for (const [name, url] of auditPages) {
  if (only && !only.has(name)) continue;
  for (const width of widths) {
    const [w, h] = sizes[width];
    const n = await captureFrames(page, url, name, w, h);
    console.log(`${name.padEnd(14)} ${String(width).padStart(4)}  ${n} frames`);
  }
}

if (process.env.STATES !== "0") {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + "/en", { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: "Services", exact: true }).click();
  await page.waitForTimeout(500);
  await state(page, "state-mega-menu-1440");
  for (const [w, h] of [[390, 844], [1200, 800]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(base + "/en", { waitUntil: "load" });
    await page.waitForTimeout(900);
    await jumpTo(page, 0);
    await page.getByRole("button", { name: "Menu" }).click();
    await page.waitForTimeout(700);
    await state(page, `state-drawer-${w}`);
  }
  console.log("states: mega menu 1440, drawer 390 and 1200");
}
await browser.close();
if (!fs.existsSync(dir)) process.exit(1);
