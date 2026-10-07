import { expect, test } from "@playwright/test";

// Award pass 3: behaviours a juror meets in the first minute.

test("a page that closes on its own call to action has no second one in the footer", async ({ page }) => {
  await page.goto("/en/services");
  await expect(page.locator("main .cta-band")).toHaveCount(1);
  await expect(page.locator(".site-footer .footer-cta")).toBeHidden();
  // A page without a band keeps the footer's.
  await page.goto("/en/knowledge-hub");
  await expect(page.locator("main .cta-band")).toHaveCount(0);
  await expect(page.locator(".site-footer .footer-cta")).toBeVisible();
});

test("chapter 05 is a sector index: four linked rows, scenes only as hover previews", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const rows = page.locator(".sector-index .sector-row");
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) await expect(row).toHaveAttribute("href", /^\/en\/industries\/[a-z0-9-]+$/);
  const first = rows.first();
  await first.scrollIntoViewIfNeeded();
  const peek = first.locator(".sector-row__peek .photo");
  await expect(peek).toHaveCSS("opacity", "0");
  await first.hover();
  await expect(peek).toHaveCSS("opacity", "1");
  await expect(page.locator(".industry-shot")).toHaveCount(0);
});

test("the English hero accent sits on its own line beside the photo, clear of the card", async ({ page }) => {
  // Reduced motion: the words are measured at rest, not mid-entrance.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await page.evaluate(() => document.fonts.ready);
  const box = await page.locator(".cine-hero__title .accent").evaluate((el) => {
    // The accent is a block; measure its text, not its box.
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0);
    // Word masks nest spans whose tops differ by a few pixels: a new line is a jump of most of a line height (~64 px).
    const tops = rects.map((r) => r.top).sort((x, y) => x - y);
    const lines = tops.filter((top, i) => i === 0 || top - tops[i - 1] > 30).length;
    const card = document.querySelector(".hero-card")!.getBoundingClientRect();
    return { lines, right: Math.max(...rects.map((r) => r.right)), card: card.left };
  });
  expect(box.lines).toBe(1);
  expect(box.right).toBeLessThan(box.card - 16);
});

test("the 404 returns the address as a request record", async ({ page }) => {
  await page.goto("/zh-hant/no-such-page");
  const record = page.locator(".nf__record");
  await expect(record).toBeVisible();
  await expect(record).toHaveAttribute("aria-hidden", "true");
  await expect(record.locator(".nf__path")).toHaveText("/zh-hant/no-such-page");
  await expect(record.locator(".nf__stamp")).toHaveText("已退回");
  await expect(record).toHaveCSS("border-radius", "22px");
});
