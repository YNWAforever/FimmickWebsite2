import { expect, test } from "@playwright/test";

/** Award pass 2, Phase 5: the hubs read as an editorial list, one row per record. */

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
});

for (const { path, rows } of [
  { path: "/en/services", rows: 16 },
  { path: "/en/products", rows: 6 },
  { path: "/en/functions", rows: 7 },
  { path: "/en/platform", rows: 0 },
]) {
  test(`${path}: editorial rows, no card grid, the row link is named by its headline`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator(".card-grid, .hub-card")).toHaveCount(0);
    const list = page.locator(".editorial-row");
    if (rows) await expect(list).toHaveCount(rows);
    else expect(await list.count()).toBeGreaterThanOrEqual(10);
    for (const row of await list.all()) {
      const links = row.locator("a");
      await expect(links).toHaveCount(1);
      const headline = (await row.locator("h3").innerText()).replace(/\s+/g, " ").trim();
      await expect(links.first()).toHaveAccessibleName(headline);
    }
    await expect(page.locator("main")).not.toContainText(/Learn more/);
  });
}

test("products and functions name what the link opens", async ({ page }) => {
  await page.goto("/en/products");
  await expect(page.locator(".editorial-row__cue").first()).toHaveText(/How it works/);
  await page.goto("/en/functions");
  await expect(page.locator(".editorial-row__cue").first()).toHaveText(/See the workflows/);
});

test("the services filter works in place: no server round trip, URL kept in step", async ({ page }) => {
  const rsc: string[] = [];
  page.on("request", (req) => {
    if (req.headers().rsc) rsc.push(req.url());
  });
  await page.goto("/en/services");
  const pill = page.locator(".filter-pill", { hasText: /^Convert/ });
  const expected = Number(await pill.locator(".count").innerText());
  await page.waitForTimeout(1000);
  rsc.length = 0;
  await pill.click();
  await expect(page).toHaveURL(/[?&]objective=convert/);
  await expect(page.locator(".editorial-row:visible")).toHaveCount(expected);
  await expect(pill).toHaveAttribute("aria-current", "true");
  // Only the hub itself: rows prefetch their detail pages, which is expected.
  expect(rsc.filter((u) => new URL(u).pathname === "/en/services")).toEqual([]);
  // A shared link opens filtered.
  await page.goto("/en/services?objective=convert");
  await expect(page.locator(".editorial-row:visible")).toHaveCount(expected);
});
