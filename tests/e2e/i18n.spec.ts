import { expect, test, type Page } from "@playwright/test";
import * as OpenCC from "opencc-js";

/** Award pass 2, Phase 8.3: Simplified Chinese (fix plan 20). */

const toCn = OpenCC.Converter({ from: "hk", to: "cn" });

/** Text in the selected elements that is Traditional and not marked as another language. */
async function unmarkedTraditional(page: Page, selector: string) {
  const texts = await page.locator(selector).evaluateAll((els) =>
    els.filter((el) => !el.closest('[lang^="zh-Hant"], [lang="en"]')).map((el) => (el.textContent ?? "").trim()),
  );
  return texts.filter((t) => /[㐀-鿿]/.test(t) && toCn(t) !== t);
}

test("the homepage's Chinese samples are tagged and labelled for the page's script", async ({ page }) => {
  await page.goto("/zh-hans");
  const meta = page.locator(".artifact--captions .caption-card__meta").nth(1);
  await expect(meta).toHaveText("Instagram · 简中");
  await expect(page.locator(".artifact--captions .caption-card").nth(1).locator("p[lang]")).toHaveAttribute("lang", "zh-Hans");
  const frame = page.locator(".frame--drafts .caption-card").nth(1);
  await expect(frame.locator(".caption-card__meta")).toHaveText("简中");
  await expect(frame.locator("p[lang]")).toHaveAttribute("lang", "zh-Hans");

  await page.goto("/zh-hant");
  await expect(page.locator(".artifact--captions .caption-card__meta").nth(1)).toHaveText("Instagram · 繁中");
  await expect(page.locator(".artifact--captions .caption-card").nth(1).locator("p[lang]")).toHaveAttribute("lang", "zh-Hant-HK");
});

test("the explainer defaults to the page's own caption track", async ({ page }) => {
  for (const [route, track] of [["/zh-hans/resources/videos", "zh-Hans"], ["/zh-hant/resources/videos", "zh-Hant-HK"]] as const) {
    await page.goto(route);
    await page.locator(".player__poster").click();
    await expect(page.locator(`video track[srclang='${track}']`), route).toHaveAttribute("default", "");
    await expect(page.locator("video track[default]"), route).toHaveCount(1);
  }
});

test("Simplified pages use the mainland words", async ({ page }) => {
  await page.goto("/zh-hans/contact");
  await expect(page.getByLabel(/^工作邮件/)).toBeVisible();
  expect(await page.locator("main").innerText()).not.toContain("电邮");
  await page.goto("/zh-hans/resources/videos");
  await expect(page.locator("main")).toContainText("视频");
});

test("Simplified listings mark the Traditional originals they show", async ({ page }) => {
  for (const route of ["/zh-hans/knowledge-hub/category/Instagram", "/zh-hans/knowledge-hub/category/Events", "/zh-hans/knowledge-hub", "/zh-hans/resources"]) {
    await page.goto(route);
    expect(await unmarkedTraditional(page, ".card h2, .card p"), route).toEqual([]);
  }
  await page.goto("/zh-hans/knowledge-hub/category/Instagram");
  expect(await page.locator('.card h2[lang="zh-Hant-HK"]').count()).toBeGreaterThan(0);
  expect(await page.locator(".card .card-meta").allInnerTexts()).not.toContain(expect.stringContaining("英文原文"));
});
