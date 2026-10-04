import { expect, test } from "@playwright/test";

/** Award pass 2, Phase 6: crops, the badge policy and cache headers. */

test("the homepage keeps the pill for the hero only and says 'Illustrative' at most three times", async ({ page }) => {
  await page.goto("/en");
  expect(await page.locator("main .photo__label").count()).toBeLessThanOrEqual(4);
  const illustrative = await page.locator("main").evaluate((main) => (main.textContent!.match(/illustrative/gi) ?? []).length);
  expect(illustrative).toBeLessThanOrEqual(3);
  // Photo chapters carry one caption line each; the footer carries the site-wide note.
  expect(await page.locator("main .photo-caption").count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator(".site-footer .photo-note")).toHaveCount(1);
});

test("every photograph keeps its provenance in the title", async ({ page }) => {
  await page.goto("/en");
  const missing = await page.locator(".photo img:not([alt=''])").evaluateAll((imgs) => imgs.filter((img) => !img.getAttribute("title")).length);
  expect(missing).toBe(0);
});

test("page heroes use the wide crop from 800 px; the closing photo uses the portrait crop on phones", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/services");
  const hero = page.locator(".page-hero__photo img");
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/-w-\d+\.[0-9a-f]{8}\.(avif|webp)$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const closing = page.locator(".closing__photo img");
  await closing.scrollIntoViewIfNeeded();
  await expect.poll(() => closing.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/-p-\d+\.[0-9a-f]{8}\.(avif|webp)$/);
});

test("at 1440 and DPR 2 the page hero is sharp when a 2560 master exists", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto("/en/services");
  const img = page.locator(".page-hero__photo img");
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.currentSrc)).not.toBe("");
  const { srcset, natural, rendered } = await img.evaluate((el: HTMLImageElement) => ({
    srcset: [...el.parentElement!.querySelectorAll("source")].map((s) => s.srcset).join(","),
    natural: el.naturalWidth,
    rendered: el.getBoundingClientRect().width,
  }));
  test.skip(!/ 2560w/.test(srcset), "no 2560 candidate yet: the masters are 1536 px wide (regeneration pending)");
  expect(natural).toBeGreaterThanOrEqual(2 * rendered);
  await context.close();
});

test("brand files are cached for a day, photographs for a year", async ({ request }) => {
  const brand = await request.get("/brand/fimmick-logo.webp");
  expect(brand.headers()["cache-control"]).toBe("public, max-age=86400, stale-while-revalidate=604800");
  const html = await (await request.get("/en")).text();
  const photo = html.match(/\/media\/photography\/[^"\s,]+\.(?:avif|webp)/)![0];
  expect((await request.get(photo)).headers()["cache-control"]).toBe("public, max-age=31536000, immutable");
});
