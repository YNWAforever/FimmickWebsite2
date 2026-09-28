#!/usr/bin/env node
/**
 * Captures review screenshots (desktop 1440×900, mobile 390×844) of each page
 * type into docs/redesign/screenshots. Requires a running server:
 *   npx next start -p 3100  (then)  node scripts/capture-screens.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs", "redesign", "screenshots");
fs.mkdirSync(out, { recursive: true });
const base = process.env.BASE_URL || "http://localhost:3100";

const pages = [
  ["home", "/en"], ["home-zh", "/zh-hant"], ["platform", "/en/platform"], ["product", "/en/products/creativemax"],
  ["transformation", "/en/ai-transformation"], ["transformation-detail", "/en/ai-transformation/ai-readiness-maturity"],
  ["services", "/en/services"], ["service", "/en/services/crm-sales"], ["industry", "/en/industries/property-real-estate"],
  ["case", "/en/case-studies/real-estate-sales-follow-up"], ["resources", "/en/resources"], ["ecosystem", "/en/fimmick-ecosystem"],
  ["contact", "/en/contact?intent=configuration&product=creativemax"],
];

const browser = await chromium.launch();
try {
  for (const [vw, vh, tag] of [[1440, 900, "desktop"], [390, 844, "mobile"]]) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [name, url] of pages) {
      await page.goto(base + url, { waitUntil: "networkidle" });
      const png = await page.screenshot({ fullPage: false });
      await sharp(png).webp({ quality: 72 }).toFile(path.join(out, `${tag}-${name}.webp`));
    }
    if (tag === "desktop") {
      await page.goto(base + "/en", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Services", exact: true }).click();
      await sharp(await page.screenshot()).webp({ quality: 72 }).toFile(path.join(out, "desktop-nav-open.webp"));
      await page.keyboard.press("Escape");
      await page.locator("#inspect").scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -80));
      await sharp(await page.screenshot()).webp({ quality: 72 }).toFile(path.join(out, "desktop-example.webp"));
    } else {
      await page.goto(base + "/en", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Menu" }).click();
      await sharp(await page.screenshot()).webp({ quality: 72 }).toFile(path.join(out, "mobile-nav-open.webp"));
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(fs.readdirSync(out).length, "screenshots");
