import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Accessibility gate for every award-pass-2 PR: zero axe violations on the audit page list at
 * 1440×900 and 390×844, after a full scroll and a 1.5 s settle, analysed at the top with every rule.
 * axe only sizes tap targets that are on screen, so a second pass at the bottom (footer in view)
 * runs target-size alone, on targets wholly inside the viewport: a target cut by the viewport edge
 * reads as "obscured", and at that scroll position the hero copy has, by design, faded out.
 */
const pages = [
  "/en", "/zh-hant", "/zh-hans", "/en/platform", "/en/services", "/en/solutions/content-production", "/en/industries",
  "/en/case-studies/real-estate-sales-follow-up", "/en/contact", "/en/knowledge-hub/4-types-of-crm-system", "/en/about/team",
  "/en/nonexistent",
];
const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"];

type Results = Awaited<ReturnType<AxeBuilder["analyze"]>>;

/** Instant scrolling: the page sets `scroll-behavior: smooth`, which would still be moving when axe runs. */
async function scrollThrough(page: Page) {
  for (let i = 0; i < 80; i++) {
    const done = await page.evaluate(() => {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.9), behavior: "instant" });
      return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    });
    await page.waitForTimeout(60);
    if (done) break;
  }
}

/** Keep only violations whose element lies wholly inside the viewport. */
async function onScreen(page: Page, results: Results): Promise<Results> {
  const violations: Results["violations"] = [];
  for (const v of results.violations) {
    const nodes = [];
    for (const n of v.nodes) {
      const inside = await page.evaluate((sel) => {
        const r = document.querySelector(sel)?.getBoundingClientRect();
        return !!r && r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth;
      }, n.target.join(" "));
      if (inside) nodes.push(n);
    }
    if (nodes.length) violations.push({ ...v, nodes });
  }
  return { ...results, violations };
}

function summarise(results: Results) {
  return results.violations.flatMap((v) =>
    v.nodes.map((n) => `${v.id}: ${n.target.join(" ")} — ${(n.failureSummary || "").split("\n").slice(1).join(" ").trim()}`),
  );
}

for (const [label, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
  test.describe(`axe at ${label}`, () => {
    test.use({ viewport });
    for (const path of pages) {
      test(`${path} has no violations`, async ({ page }) => {
        await page.goto(path, { waitUntil: "load" });
        await scrollThrough(page);
        await page.waitForTimeout(1500);
        const bottom = await onScreen(page, await new AxeBuilder({ page }).withRules(["target-size"]).analyze());
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(1500);
        const top = await new AxeBuilder({ page }).withTags(tags).analyze();
        expect([...summarise(top), ...summarise(bottom)]).toEqual([]);
      });
    }
  });
}
