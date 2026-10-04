import { gzipSync } from "node:zlib";
import { expect, test, type Page } from "@playwright/test";

/** Award pass 2, Phase 7 (Option A): the hero sample card is live. */

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
});

/** Tab forward from the hero's last button until `selector` has focus. */
async function tabTo(page: Page, selector: string) {
  await page.locator(".cine-hero .btn-row a").last().focus();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    if (await page.locator(selector).evaluateAll((els) => els.some((el) => el === document.activeElement))) return;
  }
  throw new Error(`Tab never reached ${selector}`);
}

test("keyboard: a fact chip lights the words it supplied; Approve toggles the stamp and the export step", async ({ page }) => {
  await page.goto("/en");
  await tabTo(page, ".hero-fact");
  const chip = page.locator(".hero-fact").first();
  await expect(chip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  const lit = page.locator(".hero-card [data-lit]");
  await expect(lit).toHaveCount(2); // the English and the Chinese caption
  await expect(lit.first()).toHaveText("750 ml");

  // One tab stop for the chip group: the next Tab reaches Approve.
  await page.keyboard.press("Tab");
  const approve = page.locator(".hero-card__approved");
  await expect(approve).toBeFocused();
  await expect(approve).toHaveAttribute("aria-pressed", "true"); // the server renders the finished state
  await page.keyboard.press("Enter");
  await expect(approve).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator('.hero-ledger [data-role="result"]')).toHaveAttribute("data-state", "pending");
  await page.keyboard.press("Enter");
  await expect(approve).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.hero-ledger [data-role="result"]')).toHaveAttribute("data-state", "done");
  await expect(page.locator(".hero-card__record")).toContainText("REC-0412");
});

test("arrow keys move between fact chips; hover lights the words too", async ({ page }) => {
  await page.goto("/en");
  const chips = page.locator(".hero-fact");
  await chips.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(chips.nth(1)).toBeFocused();
  await expect(chips.nth(1)).toHaveAttribute("tabindex", "0");
  await expect(chips.first()).toHaveAttribute("tabindex", "-1");
  await page.keyboard.press("End");
  await expect(chips.last()).toBeFocused();
  await chips.nth(2).hover();
  await expect(page.locator(".hero-card [data-lit]").first()).toHaveText("lid that locks");
});

test("without JavaScript the card shows the finished state", async ({ request }) => {
  const html = await (await request.get("/en")).text();
  const card = html.slice(html.indexOf('class="hero-card"'), html.indexOf("hero-card__notice"));
  expect(card).toContain('aria-pressed="true"');
  expect(card).toContain("REC-0412");
  expect(card).toContain("Double-wall stainless steel");
});

test("reduced motion: the underline and the stamp appear without animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const text = page.locator(".hero-card [data-fact]").first();
  expect(await text.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
});

test("the card's island is at most 6 KB gzipped", async ({ page }) => {
  const scripts: string[] = [];
  page.on("response", async (res) => {
    if (res.url().includes("/_next/static/chunks/") && res.url().endsWith(".js")) scripts.push(res.url());
  });
  await page.goto("/en", { waitUntil: "networkidle" });
  const chunks = await Promise.all(scripts.map(async (url) => ({ url, body: await (await page.request.get(url)).text() })));
  const island = chunks.filter((c) => c.body.includes("hero-fact"));
  expect(island.length).toBeGreaterThan(0);
  for (const c of island) expect(gzipSync(c.body).length, c.url).toBeLessThanOrEqual(6 * 1024);
});

test("on phones the whole card shows: nothing is clipped by the hero", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const { cardBottom, heroBottom } = await page.locator(".cine-hero").evaluate((hero) => ({
    cardBottom: hero.querySelector(".hero-card")!.getBoundingClientRect().bottom,
    heroBottom: hero.getBoundingClientRect().bottom,
  }));
  expect(cardBottom).toBeLessThanOrEqual(heroBottom);
  await page.locator(".hero-card__notice").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-card__notice")).toBeInViewport();
});
