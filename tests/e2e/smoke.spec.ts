import { expect, test, type Page } from "@playwright/test";

/**
 * Smoke set (award pass 2, Phase 9): home, platform, services, contact, 404 and the video, run in
 * every browser project (Chromium, Firefox, WebKit, iPhone 14, iPad landscape). Waits are explicit
 * (an element, a URL, an attribute), never `networkidle` or fixed timeouts.
 */

/** Console errors and uncaught exceptions while the test runs. */
function errors(page: Page) {
  const list: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") list.push(m.text());
  });
  page.on("pageerror", (e) => list.push(e.message));
  return list;
}

/** Narrow screens use the menu button; wide ones show the primary navigation. */
async function navigationWorks(page: Page) {
  const toggle = page.locator(".header-actions .menu-toggle");
  if (await toggle.isVisible()) {
    await toggle.click();
    const drawer = page.locator(".drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator("details").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  } else {
    await expect(page.locator(".primary-nav .pillar-trigger").first()).toBeVisible();
  }
}

test("home renders its hero and sample card, with working navigation", async ({ page }) => {
  const problems = errors(page);
  await page.goto("/en");
  await expect(page.locator("h1")).toHaveText("AI prepares the work. Your people decide.");
  await expect(page.locator(".hero-card")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await navigationWorks(page);
  expect(problems).toEqual([]);
});

test("platform lists its editorial rows", async ({ page }) => {
  await page.goto("/en/platform");
  await expect(page.locator("h1")).toBeVisible();
  expect(await page.locator(".editorial-row").count()).toBeGreaterThanOrEqual(10);
});

test("the services filter narrows the list in place", async ({ page }) => {
  await page.goto("/en/services");
  const rows = page.locator(".editorial-row:visible");
  const all = await rows.count();
  await page.locator(".filter-pill").nth(1).click();
  await expect(page).toHaveURL(/\?objective=/);
  await expect.poll(() => rows.count()).toBeLessThan(all);
});

test("contact: the form enables, and an empty submit is reported on the first field", async ({ page }) => {
  await page.goto("/en/contact?intent=demo");
  const name = page.locator("#f-name");
  await expect(name).toBeEnabled();
  await expect(page.locator("#f-intent")).toHaveValue("demo");
  await page.locator("form.form button[type='submit']").click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
});

test("an unknown page is a localised 404 inside the site shell", async ({ page }) => {
  const response = await page.goto("/zh-hant/nope");
  expect(response?.status()).toBe(404);
  await expect(page.locator(".site-header")).toBeVisible();
  await expect(page.locator("main h1")).toContainText("找不到");
});

test("the video either plays or offers its transcript, never a broken frame", async ({ page }) => {
  await page.goto("/en/resources/videos");
  await page.getByRole("button", { name: /Play video/ }).click();
  const video = page.locator("video");
  const error = page.locator(".player__error");
  // Engines without a codec for either source fall back to the message and transcript link.
  await expect.poll(async () => (await error.isVisible()) || (await video.evaluate((v: HTMLVideoElement) => !v.paused || v.readyState >= 2))).toBe(true);
  if (await error.isVisible()) await expect(error.getByRole("link")).toBeVisible();
  else await expect(video.locator("track[srclang='en']")).toHaveAttribute("default", "");
});
