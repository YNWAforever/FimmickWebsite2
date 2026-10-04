#!/usr/bin/env node
/**
 * Item-level evidence for Phase 1: one screenshot per craft-break, taken in the state the test
 * measures. Run once on the unfixed build (OUT=before) and once on the fixed build (OUT=after).
 *
 *   OUT=before node scripts/award-2/capture-items.mjs
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, jumpTo, outDir } from "./lib.mjs";

const dir = outDir("items");
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function shot(name, clip) {
  const png = await page.screenshot({ type: "png", ...(clip ? { clip } : {}) });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
  console.log(name);
}
async function open(url, width, height, wait = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(base + url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(wait);
}

// 1.1 Locale 404
await open("/zh-hant/platform/nope", 1440, 900);
await shot("1.1-404-zh-hant-platform-nope-1440");
await open("/en/nope", 390, 844);
await shot("1.1-404-en-nope-390");

// 1.2 Navigation at 1024 / 1200 and the drawer at 820
await open("/en", 1024, 768);
await shot("1.2-header-1024", { x: 0, y: 0, width: 1024, height: 140 });
await open("/zh-hant", 1200, 800);
await shot("1.2-header-zh-hant-1200", { x: 0, y: 0, width: 1200, height: 140 });
await open("/en", 820, 1180);
await page.locator(".header-actions .menu-toggle").click();
await page.waitForTimeout(700);
await shot("1.2-drawer-820");

// 1.4 Utility-row focus after scrolling
await open("/en", 1440, 900);
await jumpTo(page, 1500);
await page.waitForTimeout(300);
await jumpTo(page, 1200);
await page.waitForTimeout(700);
await page.locator(".header-main .brand").focus();
await page.keyboard.press("Shift+Tab");
await page.waitForTimeout(700);
await shot("1.4-utility-focus-after-scroll", { x: 0, y: 0, width: 1440, height: 160 });

// 1.4 Focus ring in forced-colours mode
await page.emulateMedia({ forcedColors: "active" });
await open("/en/contact", 1440, 900);
const send = page.getByRole("button", { name: "Send request" });
await send.scrollIntoViewIfNeeded();
await send.focus();
await page.keyboard.press("Shift+Tab");
await page.keyboard.press("Tab");
await page.waitForTimeout(200);
const box = await send.boundingBox();
await shot("1.4-forced-colors-focus", { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 30), width: box.width + 80, height: box.height + 60 });
await page.emulateMedia({ forcedColors: "none" });

// 1.5 Drawer 200 ms into opening after a scroll down/up
await open("/en", 390, 844);
await jumpTo(page, 2000);
await page.waitForTimeout(400);
await jumpTo(page, 1700);
await page.waitForTimeout(800);
await page.evaluate(() => document.querySelector(".header-actions .menu-toggle").click());
await page.waitForTimeout(200);
await shot("1.5-drawer-200ms-390");

// 1.6 Hero badge on phones, marquee at chapter entry, video failure, poster
await open("/en", 390, 844, 1600);
await shot("1.6-hero-390");
await open("/en", 1440, 900);
const top = await page.locator(".chapter-night").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
await jumpTo(page, top);
await page.waitForTimeout(800);
await shot("1.6-marquee-chapter-entry-1440");
await page.route(/\.mp4$/, (route) => route.abort());
await open("/en/resources/videos", 1440, 900);
await page.getByRole("button", { name: /Play video/ }).scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /Play video/ }).click();
await page.waitForTimeout(3000);
const player = await page.locator(".player").boundingBox();
await shot("1.6-video-mp4-failed", { x: player.x, y: player.y, width: player.width, height: Math.min(player.height + 60, 900 - player.y) });
await page.unroute(/\.mp4$/);
await open("/en/resources/videos", 1440, 900);
await page.locator(".player").scrollIntoViewIfNeeded();
await shot("1.6-poster", await page.locator(".player").boundingBox());

// 1.7 Article title, archive banner, leadership page
await open("/en/knowledge-hub/4-types-of-crm-system", 1440, 900);
await shot("1.7-article-title-amp");
await open("/en/knowledge-hub/answer-engine-optimization-complete-guide", 1440, 900);
await shot("1.7-archive-banner-2026-guide");
await open("/en/about/team", 1440, 900);
const leaders = await page.locator("main h1").evaluate((h1) => h1.closest("section").nextElementSibling.getBoundingClientRect().top + window.scrollY);
await jumpTo(page, leaders - 120);
await page.waitForTimeout(900);
await shot("1.7-team");

await browser.close();
