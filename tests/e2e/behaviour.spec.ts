import { expect, test, type Page } from "@playwright/test";

/** Award pass 2, Phase 9 (fix plan 21): behaviours the earlier phases left without a test. */

test.describe("language switch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  const traditional = (page: Page) => page.locator(".utility-bar .lang-switch a[hreflang='zh-Hant-HK']");

  test("keeps the hash, with and without a query", async ({ page }) => {
    await page.goto("/en/platform#how-it-works");
    await traditional(page).click();
    await expect(page).toHaveURL(/\/zh-hant\/platform#how-it-works$/);

    await page.goto("/en/contact?intent=service&service=seo-aeo#form");
    await traditional(page).click();
    await expect(page).toHaveURL(/\/zh-hant\/contact\?intent=service&service=seo-aeo#form$/);
  });

  test("a modified click opens the other language in a new tab and leaves this page alone", async ({ page, context }) => {
    await page.goto("/en/contact?intent=service&service=seo-aeo");
    const link = traditional(page);
    await expect(link).toHaveAttribute("href", "/zh-hant/contact?intent=service&service=seo-aeo");
    const [tab] = await Promise.all([context.waitForEvent("page"), link.click({ modifiers: ["ControlOrMeta"] })]);
    await tab.waitForURL(/\/zh-hant\/contact/);
    expect(new URL(tab.url()).pathname + new URL(tab.url()).search).toBe("/zh-hant/contact?intent=service&service=seo-aeo");
    expect(new URL(page.url()).pathname).toBe("/en/contact");
  });
});

test.describe("signature stage", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });

  /** The active step's progress bar, 0–1, read from its scaleX transform. */
  const progress = (page: Page) =>
    page.locator('.sig__step[aria-current="step"] .sig__fill').evaluate((el) => {
      const t = getComputedStyle(el).transform;
      return t === "none" ? 1 : Number(t.match(/matrix\(([^,]+)/)?.[1] ?? 0);
    });

  test("pausing holds the step's progress and playing again resumes from there", async ({ page }) => {
    await page.goto("/en");
    const play = page.locator(".sig__btn").first();
    await page.locator(".sig__frames").scrollIntoViewIfNeeded();
    await expect(play).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => progress(page)).toBeGreaterThan(0.15);
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "false");
    const paused = await progress(page);
    expect(paused).toBeGreaterThan(0.1);
    await page.waitForTimeout(800);
    expect(Math.abs((await progress(page)) - paused)).toBeLessThan(0.02);
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "true");
    // Resumed, not restarted: the bar never drops back below where it paused.
    expect(await progress(page)).toBeGreaterThanOrEqual(paused - 0.02);
    await expect.poll(() => progress(page)).toBeGreaterThan(paused + 0.05);
  });
});

test("the hero accent is the serif in English and emphasis marks in both Chinese scripts", async ({ page }) => {
  await page.goto("/en");
  const en = page.locator("h1 .accent").first();
  expect(await en.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Instrument Serif/);
  for (const route of ["/zh-hant", "/zh-hans"]) {
    await page.goto(route);
    const style = await page.locator("h1 em.accent").evaluate((el) => {
      const s = getComputedStyle(el);
      return { family: s.fontFamily, emphasis: s.getPropertyValue("text-emphasis-style") || s.getPropertyValue("-webkit-text-emphasis-style") };
    });
    expect(style.emphasis, route).toContain("circle");
    expect(style.family, route).not.toMatch(/Instrument Serif/);
  }
});
