import { expect, test, type Page } from "@playwright/test";

/** Award pass 2, Phase 3: headlines, hero and disclaimers. */

test("inner-page headlines carry the editorial accent", async ({ page }) => {
  await page.goto("/en/platform");
  await expect(page.locator("h1 em.accent")).toHaveText("One workflow you can run.");
  await page.goto("/en/services/digitalmarketing");
  await expect(page.locator("h1")).toHaveText("Campaigns that run as one system");
  await expect(page.locator("h1 em.accent")).toHaveText("as one system");
  await page.goto("/zh-hant/services/digitalmarketing");
  await expect(page.locator("h1 em.accent")).toHaveText("一體化運作");
});

test("the hero states the idea, and its Chinese accent uses emphasis marks", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("h1")).toHaveText("AI prepares the work. Your people decide.");
  await page.goto("/zh-hant");
  const emphasis = await page.locator("h1 em.accent").evaluate((el) => getComputedStyle(el).getPropertyValue("text-emphasis-style") || getComputedStyle(el).getPropertyValue("-webkit-text-emphasis-style"));
  expect(emphasis).toContain("circle");
});

/** Distinct line tops of a word inside an element: one entry means the word sits on one line. */
async function lineTops(page: Page, selector: string, word: string) {
  return page.locator(selector).first().evaluate((el, word) => {
    const text = el.textContent ?? "";
    const at = text.indexOf(word);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const len = node.textContent!.length;
      if (at >= 0 && at >= offset && at + word.length <= offset + len) {
        const range = document.createRange();
        range.setStart(node, at - offset);
        range.setEnd(node, at - offset + word.length);
        return [...new Set([...range.getClientRects()].map((r) => Math.round(r.top)))];
      }
      offset += len;
    }
    return [];
  }, word);
}

test("Chinese hero text never breaks inside a word at 390 px (決定, 批准)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-hant");
  await page.waitForTimeout(1500);
  expect(await lineTops(page, "h1", "決定")).toHaveLength(1);
  expect(await lineTops(page, ".cine-hero__body", "批准")).toHaveLength(1);
});

test("the homepage carries one sample notice; 'Illustrative' and 'people decide' stay rare", async ({ page }) => {
  await page.goto("/en");
  // DOM text, not innerText: content-visibility skips the off-screen bands in innerText.
  const counts = await page.locator("main").evaluate((main) => {
    let illustrative = 0;
    let decide = 0;
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const text = n.textContent ?? "";
      decide += (text.match(/people decide/gi) ?? []).length;
      // Photo pills belong to the Phase 6 badge policy, whose own test caps the full count.
      if (!n.parentElement?.closest(".photo__label")) illustrative += (text.match(/illustrative/gi) ?? []).length;
    }
    return { illustrative, decide };
  });
  expect(counts.illustrative).toBeLessThanOrEqual(3);
  expect(counts.decide).toBeLessThanOrEqual(2);
  await expect(page.getByText("Everything on this page runs on sample data")).toHaveCount(1);
});

test("case pages read job, what changed, who decided, now offered as", async ({ page }) => {
  await page.goto("/en/case-studies/omni-channel-retail-intelligence");
  const top = (selector: string, text?: RegExp) =>
    (text ? page.locator(selector, { hasText: text }) : page.locator(selector)).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const job = await top("main .eyebrow", /^Problem$/);
  const changed = await top("main .section-head", /Before and after/);
  const decided = await top("main .decision-callout");
  const offered = await top("main .eyebrow", /^Now offered as$/);
  expect([job, changed, decided, offered]).toEqual([...[job, changed, decided, offered]].sort((a, b) => a - b));
  // The outcome is the observable state that leads the what-changed block.
  await expect(page.locator("main .section-head", { hasText: /Before and after/ })).toContainText("Key signals now sit in one view");
  // Now offered as links to the product the case reuses.
  const offeredBlock = page.locator("main .stack", { has: page.locator(".eyebrow", { hasText: /^Now offered as$/ }) });
  await expect(offeredBlock.locator('a[href^="/en/products/"]').first()).toBeVisible();
});

test("detail-page heroes say each thing once (headline and lead appear once in main)", async ({ page }) => {
  for (const path of ["/en/solutions/market-intelligence", "/en/products/social-listening", "/en/services/digitalmarketing", "/en/industries/retail-ecommerce"]) {
    await page.goto(path);
    const repeats = await page.locator("main").evaluate((main) => {
      const norm = (s: string | null) => (s ?? "").replace(/\s+/g, " ").trim();
      const hero = main.querySelector(".page-hero") ?? main;
      const phrases = [hero.querySelector("h1"), hero.querySelector(".lead")].map((el) => norm(el?.textContent ?? null)).filter(Boolean);
      const blocks = [...main.querySelectorAll("h1, h2, h3, p, li, dd")].map((el) => norm(el.textContent));
      return phrases.filter((phrase) => blocks.filter((b) => b === phrase).length > 1);
    });
    expect.soft(repeats, path).toEqual([]);
  }
});
