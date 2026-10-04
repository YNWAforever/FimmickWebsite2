#!/usr/bin/env node
/**
 * Phase 2 evidence: the contact form in the states its tests measure (no JavaScript, an invalid
 * field inside the collapsed details, success, the email handoff). The API is mocked per state.
 *
 *   OUT=after node scripts/award-2/capture-form.mjs
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { base, outDir } from "./lib.mjs";

const dir = outDir("phase-2");
const browser = await chromium.launch();

/** Centre the element the state is about, then take the viewport (the header is sticky). */
async function shot(page, name, selector) {
  await page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    window.scrollBy({ top: r.top + r.height / 2 - window.innerHeight / 2, behavior: "instant" });
  });
  await page.waitForTimeout(500);
  const png = await page.screenshot({ type: "png" });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
  console.log(name);
}
async function fill(page) {
  await page.getByLabel(/^Name/).fill("Test Person");
  await page.getByLabel(/^Company/).fill("Example Ltd");
  await page.getByLabel(/^Work email/).fill("test@example.com");
  await page.getByLabel(/What work do you want to improve/).fill("Launch content approvals");
}

// No JavaScript: disabled controls and the email link.
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false })).newPage();
  await page.goto(base + "/en/contact");
  await shot(page, "form-no-javascript", "form.form button[type='submit']");
  await page.context().close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
// Invalid phone inside the collapsed details.
{
  const page = await context.newPage();
  await page.goto(base + "/en/contact");
  await fill(page);
  await page.locator("form.form summary").click();
  await page.locator("#f-phone").fill("abc");
  await page.locator("form.form summary").click();
  await page.locator("form.form button[type='submit']").click();
  await page.waitForTimeout(300);
  await shot(page, "form-error-in-details", "#f-phone");
  await page.close();
}
// Success (mocked acceptance).
{
  const page = await context.newPage();
  await page.route("**/api/enquiries", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"status":"accepted"}' }));
  await page.goto(base + "/en/contact");
  await fill(page);
  await page.locator("form.form button[type='submit']").click();
  await page.waitForTimeout(400);
  await shot(page, "form-success-focused", ".form--done");
  await page.close();
}
// Email handoff after "unavailable" (no forwarder), with a long message: Copy first.
{
  const page = await context.newPage();
  await page.goto(base + "/en/contact");
  await fill(page);
  await page.locator("form.form summary").click();
  await page.locator("#f-message").fill("Details. ".repeat(250));
  await page.locator("form.form button[type='submit']").click();
  await page.waitForTimeout(600);
  await shot(page, "form-unavailable-email-handoff", ".email-handoff .btn-row");
  await page.close();
}
await browser.close();
