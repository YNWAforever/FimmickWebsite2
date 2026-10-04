#!/usr/bin/env node
/**
 * axe-core scan of the audit page list at 1440×900 and 390×844, after a full scroll and a 1.5 s
 * settle so every reveal and scroll-linked effect has fired (the brief's definition of done).
 * Every rule runs at the top; a second pass at the bottom (footer in view) runs target-size alone,
 * on targets wholly inside the viewport (tests/e2e/axe.spec.ts explains why).
 *
 *   OUT=before node scripts/award-2/axe.mjs
 *   PAGES=/en,/en/contact node scripts/award-2/axe.mjs
 */
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { auditPages, base, jumpTo, outDir, scrollThrough, writeJson } from "./lib.mjs";

const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"];
const pages = process.env.PAGES ? process.env.PAGES.split(",") : auditPages.map(([, p]) => p);

async function onScreen(page, results) {
  const violations = [];
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
  return violations;
}

const browser = await chromium.launch();
const rows = [];
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "load" });
    await scrollThrough(page, { pause: 60 });
    await page.waitForTimeout(1500);
    const bottom = await onScreen(page, await new AxeBuilder({ page }).withRules(["target-size"]).analyze());
    await jumpTo(page, 0);
    await page.waitForTimeout(1500);
    const top = (await new AxeBuilder({ page }).withTags(tags).analyze()).violations;
    const violations = [...top, ...bottom].map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 4).map((n) => n.target.join(" ")) }));
    rows.push({ page: p, viewport: `${width}x${height}`, violations });
    const summary = violations.map((v) => `${v.id}×${v.nodes}`).join(", ") || "0";
    console.log(`${String(width).padStart(4)} ${p.padEnd(44)} ${summary}`);
  }
  await context.close();
}
await browser.close();
writeJson(path.join(outDir(), "axe.json"), rows);
const total = rows.reduce((n, r) => n + r.violations.reduce((m, v) => m + v.nodes, 0), 0);
console.log(`total violating nodes: ${total}`);
if (process.env.ASSERT === "1" && total > 0) process.exit(1);
