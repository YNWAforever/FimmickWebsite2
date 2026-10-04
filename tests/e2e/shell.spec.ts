import { expect, test, type Page } from "@playwright/test";

/** Award pass 2, Phase 4: footer, mega menu, contact disclosure, share images and the wide hero. */

/** Distinct left edges of the footer group headings: one per visual column. */
async function footerColumns(page: Page) {
  return page.locator(".footer-cols").evaluate((nav) => {
    const heads = [...nav.querySelectorAll("h2")];
    const lefts = [...new Set(heads.map((h) => Math.round(h.getBoundingClientRect().left)))].sort((a, b) => a - b);
    // The first link under the first heading of each column.
    const firstLinkTops = lefts.map((left) => {
      const head = heads.find((h) => Math.round(h.getBoundingClientRect().left) === left)!;
      const link = head.parentElement!.querySelector("a")!;
      return Math.round(link.getBoundingClientRect().top + window.scrollY);
    });
    return { lefts, firstLinkTops };
  });
}

test.describe("4.1 footer", () => {
  test("four columns of two groups at 1440, lists aligned", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/platform");
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    const { lefts, firstLinkTops } = await footerColumns(page);
    expect(lefts).toHaveLength(4);
    expect(Math.max(...firstLinkTops) - Math.min(...firstLinkTops)).toBeLessThanOrEqual(2);
  });

  test("one column of groups at 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/platform");
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    expect((await footerColumns(page)).lefts).toHaveLength(1);
  });

  test("social links are labelled 44 px icons", async ({ page }) => {
    await page.goto("/en/platform");
    const links = page.locator(".footer-social a");
    await expect(links).toHaveCount(4);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("aria-label", /\S/);
      await expect(link.locator("svg")).toHaveCount(1);
      const box = (await link.boundingBox())!;
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
    }
  });

  test("footer links do not prefetch", async ({ page }) => {
    const prefetched: string[] = [];
    page.on("request", (req) => {
      if (!req.headers()["next-router-prefetch"]) return;
      const url = new URL(req.url());
      url.searchParams.delete("_rsc");
      prefetched.push(url.pathname + url.search);
    });
    await page.goto("/en/privacy");
    await page.waitForTimeout(1500);
    prefetched.length = 0;
    // Jump straight to the footer so nothing in between enters the viewport.
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(2000);
    // Routes linked from the footer and nowhere else on the page.
    const footerOnly = await page.evaluate(() => {
      const paths = (selector: string) => new Set([...document.querySelectorAll<HTMLAnchorElement>(selector)].map((a) => a.pathname + a.search));
      // Mega-panel links stay hidden, so only the header's visible links can prefetch.
      const elsewhere = paths("main a[href], .utility-bar a[href], a.brand, .header-actions a[href]");
      return [...paths(".site-footer a[href]")].filter((p) => !elsewhere.has(p));
    });
    expect(footerOnly.length).toBeGreaterThan(20);
    expect(prefetched.filter((p) => footerOnly.includes(p))).toEqual([]);
  });
});

test.describe("4.2 mega menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("opens on hover intent and closes after the pointer leaves", async ({ page }) => {
    await page.goto("/en");
    const trigger = page.locator(".pillar-trigger").first();
    await trigger.hover();
    await page.waitForTimeout(250);
    expect(await trigger.getAttribute("aria-expanded")).toBe("true");
    await page.mouse.move(700, 880);
    await page.waitForTimeout(400);
    expect(await trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("an open panel has a scrim and its featured card uses the right-hand column", async ({ page }) => {
    await page.goto("/en");
    await page.locator(".pillar-trigger").first().click();
    const scrim = page.locator(".mega-scrim");
    await expect(scrim).toBeVisible();
    expect(await scrim.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgba(7, 11, 31, 0.24)");
    const gap = await page.locator(".mega:not([hidden]) .mega-inner").evaluate((inner) => {
      const columns = [...inner.querySelectorAll(".mega-groups > *")];
      const last = columns[columns.length - 1];
      return Math.round(inner.getBoundingClientRect().right - last.getBoundingClientRect().right);
    });
    expect(gap).toBeLessThanOrEqual(40);
  });

  test("Tab out of the nav closes the panel", async ({ page }) => {
    await page.goto("/en");
    const triggers = page.locator(".pillar-trigger:visible");
    const last = triggers.last();
    await last.click();
    await expect(last).toHaveAttribute("aria-expanded", "true");
    await page.locator(".mega:not([hidden]) a").last().focus();
    await page.keyboard.press("Tab");
    await expect(page.locator(".header-cta")).toBeFocused();
    expect(await last.getAttribute("aria-expanded")).toBe("false");
  });

  test("a link to the current page closes the panel", async ({ page }) => {
    await page.goto("/en/platform");
    const trigger = page.locator(".pillar-trigger").first();
    await trigger.click();
    await page.locator(".mega:not([hidden]) .mega-overview a").click();
    await page.waitForTimeout(300);
    expect(await trigger.getAttribute("aria-expanded")).toBe("false");
  });
});

test.describe("4.3 contact", () => {
  test("the disclosure has the FAQ indicator and the prepared email is a card in the body face", async ({ page }) => {
    await page.goto("/en/contact");
    const summary = page.locator("form summary").first();
    expect(await summary.evaluate((el) => getComputedStyle(el, "::after").content)).not.toMatch(/^(none|normal)$/);
    await expect(page.getByRole("button", { name: "Prepare email instead" })).toBeEnabled();
    await page.getByLabel(/^Name/).fill("Test Person");
    await page.getByLabel(/^Company/).fill("Example Ltd");
    await page.getByLabel(/^Work email/).fill("test@example.com");
    await page.getByLabel(/What work do you want to improve/).fill("Launch content approvals");
    await page.getByRole("button", { name: "Prepare email instead" }).click();
    const preview = page.locator(".email-preview");
    await expect(preview).toBeVisible();
    expect(await preview.evaluate((el) => getComputedStyle(el).fontFamily)).not.toMatch(/mono/i);
    await expect(page.locator(".email-handoff").getByRole("button", { name: /copy/i })).toBeVisible();
  });

  test("an office without an address has no empty line", async ({ page }) => {
    await page.goto("/en/contact");
    const office = page.locator(".office", { hasText: "Singapore" });
    const gap = await office.evaluate((el) => {
      const name = el.querySelector("strong")!.getBoundingClientRect();
      const link = el.querySelector("a")!.getBoundingClientRect();
      return Math.round(link.top - name.bottom);
    });
    expect(gap).toBeLessThan(8);
  });
});

/** Width and height from a PNG's IHDR chunk. */
function pngSize(body: Buffer) {
  expect(body.subarray(1, 4).toString()).toBe("PNG");
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

test.describe("4.4 share images", () => {
  for (const path of ["/en/opengraph-image", "/zh-hant/case-studies/omni-channel-retail-intelligence/opengraph-image"]) {
    test(`${path} is a 1200×630 PNG`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toBe("image/png");
      expect(pngSize(await res.body())).toEqual({ width: 1200, height: 630 });
    });
  }

  test("an article shares its own image; other pages keep the fallback", async ({ page }) => {
    await page.goto("/en/knowledge-hub/4-types-of-crm-system");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/en\/knowledge-hub\/4-types-of-crm-system\/opengraph-image/);
    await page.goto("/en/platform");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
  });

  test("Open Graph names the alternate locales", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveCount(2);
  });
});

test.describe("4.5 hero at 1920", () => {
  test("the headline sits on at most two lines in a copy column at least 640 px wide", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/en");
    await page.waitForTimeout(1500);
    const { lines, column } = await page.locator("h1").evaluate((h1) => {
      const range = document.createRange();
      range.selectNodeContents(h1);
      const size = parseFloat(getComputedStyle(h1).fontSize);
      const tops = [...range.getClientRects()].map((r) => r.top).sort((a, b) => a - b);
      let lines = 0;
      let current = -Infinity;
      for (const top of tops) if (top > current + size * 0.6) { lines++; current = top; }
      const copy = h1.closest(".cine-hero__copy")!;
      const cs = getComputedStyle(copy);
      return { lines, column: copy.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
    });
    expect(lines).toBeLessThanOrEqual(2);
    expect(column).toBeGreaterThanOrEqual(640);
  });
});
