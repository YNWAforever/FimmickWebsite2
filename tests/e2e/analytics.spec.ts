import { expect, test, type Page } from "@playwright/test";

// Post-launch measurement (docs/analytics.md). Test builds load no GTM, so the dataLayer is created
// here; navigation is held back (bubble phase, after the capture-phase tracker) so the events stay
// readable on the page that sent them.
type Push = Record<string, unknown> & { event?: string };

async function prepare(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    document.addEventListener("click", (e) => {
      if ((e.target as Element | null)?.closest?.("a[href]")) e.preventDefault();
    });
  });
}
const events = (page: Page, name: string) =>
  page.evaluate((n) => ((window as unknown as { dataLayer: Push[] }).dataLayer || []).filter((p) => p.event === n), name);

test.beforeEach(async ({ page }) => prepare(page));

test("a call to action that opens the form reports its intent and placement", async ({ page }) => {
  await page.goto("/en/services");
  await page.locator(".cta-band a[href*='/contact']").first().click();
  const [hit] = await events(page, "cta_clicked");
  expect(hit).toMatchObject({ cta: "contact", placement: "closing_band" });
  expect(String(hit.intent)).toMatch(/^[a-z0-9-]+$/);
});

test("the header's demo button reports the header as its placement", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/platform");
  await page.locator(".site-header a[href*='/contact?intent=demo']").first().click();
  expect(await events(page, "cta_clicked")).toEqual([expect.objectContaining({ intent: "demo", placement: "header" })]);
});

test("switching language reports from and to", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/services");
  await page.locator(".lang-switch a[href^='/zh-hant']").first().click();
  expect(await events(page, "locale_switched")).toEqual([expect.objectContaining({ from: "en", to: "zh-hant" })]);
});

test("links that leave the site report the host, email and phone links their kind", async ({ page }) => {
  await page.goto("/en/contact");
  await page.locator(".site-footer a[href^='mailto:']").first().click();
  await page.locator(".site-footer a[href^='tel:']").first().click();
  const external = page.locator("main a[href^='https://']").first();
  const host = new URL((await external.getAttribute("href"))!).hostname;
  await external.click();
  const out = await events(page, "outbound_clicked");
  expect(out).toEqual([
    expect.objectContaining({ kind: "email", placement: "footer" }),
    expect.objectContaining({ kind: "phone", placement: "footer" }),
    expect.objectContaining({ kind: "link", host }),
  ]);
  // Never the address or number itself.
  expect(JSON.stringify(out)).not.toMatch(/@|\+852/);
});

test("an empty submit is reported as a validation failure, without any field content", async ({ page }) => {
  await page.goto("/en/contact");
  const send = page.getByRole("button", { name: /send request/i });
  await expect(send).toBeEnabled();
  await page.getByLabel(/work email/i).fill("someone@example.com");
  await send.click();
  expect(await events(page, "enquiry_failed")).toEqual([expect.objectContaining({ reason: "validation" })]);
  const all = JSON.stringify(await page.evaluate(() => (window as unknown as { dataLayer: unknown[] }).dataLayer));
  expect(all).not.toContain("example.com");
});

test("a dead end reports its path and where the visitor came from", async ({ page }) => {
  await page.goto("/en/no-such-page");
  await expect.poll(() => events(page, "page_not_found")).toEqual([expect.objectContaining({ path: "/en/no-such-page", referrer: "direct" })]);
});
