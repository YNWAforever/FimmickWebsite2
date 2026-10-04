#!/usr/bin/env node
/**
 * Phase 4 evidence: the footer at 1440 and 390, the open mega panel at 1440, the contact form's
 * disclosure and prepared email, an office without an address, and the hero at 1920. Run against
 * main (OUT=before) and the branch (OUT=after); the share images are saved by their own routes.
 *
 *   OUT=after node scripts/award-2/capture-shell.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, jumpTo, outDir } from "./lib.mjs";

const dir = outDir("phase-4");
const browser = await chromium.launch();

async function save(page, name) {
  await page.waitForTimeout(600);
  const png = await page.screenshot({ type: "png" });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
  console.log(name);
}

/** Centre an element in the viewport (the header is sticky). */
async function centre(page, selector) {
  await page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    window.scrollBy({ top: r.top + r.height / 2 - window.innerHeight / 2, behavior: "instant" });
  });
}

for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
  await page.goto(`${base}/en/platform`, { waitUntil: "networkidle" });
  await jumpTo(page, "max");
  await page.locator(".footer-cols").evaluate((el, phone) => el.scrollIntoView({ block: phone ? "start" : "center", behavior: "instant" }), width < 700);
  await save(page, `footer-${width}`);
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/en`, { waitUntil: "networkidle" });
  await page.locator(".pillar-trigger").first().click();
  await save(page, "mega-platform-1440");
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/en/contact`, { waitUntil: "networkidle" });
  await centre(page, "form summary");
  await save(page, "contact-disclosure-1440");
  await page.getByLabel(/^Name/).fill("Test Person");
  await page.getByLabel(/^Company/).fill("Example Ltd");
  await page.getByLabel(/^Work email/).fill("test@example.com");
  await page.getByLabel(/What work do you want to improve/).fill("Launch content approvals");
  await page.getByRole("button", { name: "Prepare email instead" }).click();
  await centre(page, ".email-handoff");
  await save(page, "contact-email-1440");
  await centre(page, ".office-list");
  await save(page, "contact-offices-1440");
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${base}/en`, { waitUntil: "networkidle" });
  await save(page, "hero-1920");
  await page.close();
}

// Share images (absent on main: the status is printed instead).
for (const [name, route] of [["og-en", "/en/opengraph-image"], ["og-zh-hant", "/zh-hant/opengraph-image"], ["og-case-zh-hant", "/zh-hant/case-studies/omni-channel-retail-intelligence/opengraph-image"], ["og-article-en", "/en/knowledge-hub/4-types-of-crm-system/opengraph-image"], ["og-solution-en", "/en/solutions/market-intelligence/opengraph-image"]]) {
  const res = await fetch(base + route);
  if (res.ok && res.headers.get("content-type") === "image/png") fs.writeFileSync(path.join(dir, `${name}.png`), Buffer.from(await res.arrayBuffer()));
  console.log(name, res.status, res.headers.get("content-type"));
}
await browser.close();
