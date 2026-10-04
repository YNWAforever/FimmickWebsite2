/**
 * Shared helpers for the award-pass-2 measurement scripts.
 * Every script runs against a production build served on port 3100 (`npx next start -p 3100`)
 * unless BASE_URL says otherwise, and writes into docs/redesign/award-2/<OUT>/ (OUT=before|after).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const base = process.env.BASE_URL || "http://localhost:3100";
export const tag = process.env.OUT || "after";

export function outDir(...parts) {
  const dir = path.join(root, "docs", "redesign", "award-2", tag, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** The page list from the brief's Phase 0 step 3 (plus /zh-hans, which every PR's axe gate covers). */
export const auditPages = [
  ["home", "/en"],
  ["home-zh-hant", "/zh-hant"],
  ["home-zh-hans", "/zh-hans"],
  ["platform", "/en/platform"],
  ["services", "/en/services"],
  ["solution", "/en/solutions/content-production"],
  ["industries", "/en/industries"],
  ["case", "/en/case-studies/real-estate-sales-follow-up"],
  ["contact", "/en/contact"],
  ["article", "/en/knowledge-hub/4-types-of-crm-system"],
  ["team", "/en/about/team"],
  ["404", "/en/nonexistent"],
];

export const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1200, height: 800 },
  mobile: { width: 390, height: 844 },
};

/** Two animation frames: enough for content-visibility to render a band that just entered. */
export const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

/** Jump without the page's `scroll-behavior: smooth` (a smooth scroll is still moving when we measure). */
export const jumpTo = (page, y) => page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);

/**
 * Scroll the whole document viewport by viewport, re-reading scrollHeight each step because
 * content-visibility placeholders resize as bands render. Calls `onStep` after each settle.
 */
export async function scrollThrough(page, { step = 0.9, pause = 120, onStep } = {}) {
  await jumpTo(page, 0);
  await frames(page);
  for (let i = 0; i < 80; i++) {
    const { y, h, vh } = await page.evaluate(() => ({ y: window.scrollY, h: document.documentElement.scrollHeight, vh: window.innerHeight }));
    if (onStep) await onStep({ i, y, h, vh });
    if (y + vh >= h - 2) break;
    await page.evaluate((dy) => window.scrollBy({ top: dy, behavior: "instant" }), Math.round(vh * step));
    await frames(page);
    await page.waitForTimeout(pause);
  }
}

export function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}
