#!/usr/bin/env node
/**
 * Motion evidence for the cinematic homepage (requires a running server).
 *   BASE_URL=http://localhost:3100 node scripts/capture-motion.mjs
 *
 * Writes to docs/redesign/cinematic/motion:
 *   - hero-entrance.webm, signature-sequence.webm (Playwright recordings)
 *   - signature-step-{1..4}.webp and signature-static.webp (reduced motion)
 *   - motion-checks.json: behaviour assertions (autoplay once, pause, step
 *     selection by keyboard, static storyboard, reduced motion, headline and
 *     CTA visible without waiting for animation).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs", "redesign", "cinematic", "motion");
fs.mkdirSync(out, { recursive: true });
const base = process.env.BASE_URL || "http://localhost:3100";
const checks = {};
const webp = async (buf, name) => sharp(buf).webp({ quality: 76 }).toFile(path.join(out, name));

const browser = await chromium.launch();
try {
  // 1. Hero entrance, motion allowed. Headline and CTA must be visible immediately.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto(base + "/en", { waitUntil: "commit" });
    await page.waitForSelector("h1");
    checks.headlineOpacityAtLoad = await page.evaluate(() => getComputedStyle(document.querySelector(".cine-hero__title")).opacity);
    checks.ctaAnimationAtLoad = await page.evaluate(() => getComputedStyle(document.querySelector(".cine-hero .btn")).animationName);
    await page.waitForTimeout(2600);
    const video = page.video();
    await context.close();
    fs.renameSync(await video.path(), path.join(out, "hero-entrance.webm"));
  }

  // 2. Signature sequence with motion allowed.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto(base + "/en", { waitUntil: "networkidle" });
    const sig = page.locator(".sig");
    checks.stageModeWithMotion = await sig.evaluate((el) => el.classList.contains("sig--stage"));
    await page.locator("#signature").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -40));
    const activeIndex = () => page.locator(".sig__step").evaluateAll((els) => els.findIndex((e) => e.getAttribute("aria-current") === "step"));
    const seen = [];
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(i === 0 ? 1600 : 5000);
      seen.push(await activeIndex());
      await webp(await sig.screenshot(), `signature-step-${i + 1}.webp`);
    }
    checks.autoplayVisitedSteps = seen;
    await page.waitForTimeout(5600);
    checks.stopsAfterLastStep = { active: await activeIndex(), playing: await page.locator(".sig__btn").first().getAttribute("aria-pressed") };
    const video = page.video();
    await context.close();
    fs.renameSync(await video.path(), path.join(out, "signature-sequence.webm"));
  }

  // 3. Controls: pause, keyboard step selection, show-all storyboard.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
    await page.goto(base + "/en", { waitUntil: "networkidle" });
    await page.locator("#signature").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const play = page.locator(".sig__btn").first();
    checks.playingWhenVisible = await play.getAttribute("aria-pressed");
    await play.click();
    const pausedAt = await page.locator(".sig__step[aria-current='step']").textContent();
    await page.waitForTimeout(6000);
    checks.pauseHolds = pausedAt === (await page.locator(".sig__step[aria-current='step']").textContent());
    await page.locator(".sig__step").nth(2).focus();
    await page.keyboard.press("Enter");
    checks.keyboardSelectsStep3 = (await page.locator(".sig__step").nth(2).getAttribute("aria-current")) === "step";
    checks.onlyActiveFrameExposed = await page.locator(".sig__frame:not([hidden])").count();
    await page.getByRole("button", { name: "Show all four" }).click();
    checks.showAllExposesFrames = await page.locator(".sig__frame:not([hidden])").count();
    await page.close();
  }

  // 4. Reduced motion: static storyboard, no autoplay, no hero animation.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await page.goto(base + "/en", { waitUntil: "networkidle" });
    await page.locator("#signature").scrollIntoViewIfNeeded();
    await page.waitForTimeout(6000);
    checks.reducedMotion = {
      storyboard: await page.locator(".sig").evaluate((el) => el.classList.contains("sig--all")),
      framesVisible: await page.locator(".sig__frame:not([hidden])").count(),
      playing: await page.locator(".sig__btn").first().getAttribute("aria-pressed"),
      heroCardAnimation: await page.evaluate(() => getComputedStyle(document.querySelector(".hero-card")).animationName),
    };
    await webp(await page.locator(".sig").screenshot(), "signature-static.webp");
    await page.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(out, "motion-checks.json"), JSON.stringify({ base, capturedAt: new Date().toISOString(), checks }, null, 2));
console.log(JSON.stringify(checks, null, 2));
