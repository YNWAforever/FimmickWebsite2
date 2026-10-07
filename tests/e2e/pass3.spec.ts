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
  // Centred, so the pointer is not over the sticky header.
  await first.evaluate((el) => el.scrollIntoView({ behavior: "instant", block: "center" }));
  const peek = first.locator(".sector-row__peek .photo");
  await expect(peek).toHaveCSS("opacity", "0");
  // Re-hover until it opens: an instant jump into lazily rendered bands can shift the row from under
  // the pointer while the bands above it lay out.
  await expect(async () => {
    await first.hover();
    await expect(peek).toHaveCSS("opacity", "1", { timeout: 1500 });
  }).toPass({ timeout: 10_000 });
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

test("the chapter rail marks the current chapter from 1480 px and stays out of the way elsewhere", async ({ page }) => {
  await page.setViewportSize({ width: 1512, height: 900 });
  await page.goto("/en");
  const rail = page.locator(".chapter-rail");
  // Over the hero no chapter is current: hidden, and so not focusable.
  await expect(rail).toBeHidden();
  await page.locator("#cases").evaluate((el) => el.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(rail).toBeVisible();
  await expect(rail.locator('a[aria-current="true"]')).toHaveAttribute("href", "#cases");
  await page.locator("#signature").evaluate((el) => el.scrollIntoView({ behavior: "instant", block: "center" }));
  await expect(rail).toHaveAttribute("data-tone", "dark");
  await expect(rail.locator('a[aria-current="true"]')).toHaveAttribute("href", "#signature");
  // No room in the margin below 1480 px.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(rail).toBeHidden();
});

test("the header is opaque, so scrolled headings never ghost through it", async ({ page }) => {
  await page.goto("/en/services");
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  const fill = await page.locator(".site-header").evaluate((el) => getComputedStyle(el, "::before").backgroundColor);
  expect(fill).toBe("rgb(255, 255, 255)");
});

test("every display headline carries its accent phrase (legal pages and brand names excepted)", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const exempt = /\/(knowledge-hub|events)\/|\/fimmick-ecosystem\/|\/(privacy|terms|cookies)$/;
  const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => p.startsWith("/en") && !exempt.test(p));
  expect(pages.length).toBeGreaterThan(80);
  const bare: string[] = [];
  for (const path of pages) {
    const html = await (await request.get(path)).text();
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    if (!h1.includes('class="accent"')) bare.push(path);
  }
  expect(bare).toEqual([]);
});
