#!/usr/bin/env node
/**
 * QA sweep against a running build (default http://localhost:3100):
 *  - every non-article page in EN, zh-HK and zh-Hans at 360 px and 720 px
 *    (720 px ≈ a 1440 px screen at 200% zoom): horizontal overflow + console errors
 *  - every internal link found on those pages: HTTP status (following redirects)
 *
 *   node scripts/qa-sweep.mjs
 */
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL || "http://localhost:3100";
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const all = [...sitemap.matchAll(/<loc>https:\/\/www\.fimmick\.com([^<]+)<\/loc>/g)].map((m) => m[1]);
const pages = [...new Set(all.filter((p) => !/\/(knowledge-hub|events)\/[^/]+$/.test(p)))];
pages.push("/en/knowledge-hub/ai-workforce-vs-ai-tools", "/zh-hant/events/ai-agent-strategy-seminar", "/en/knowledge-hub/category/CRM");

const browser = await chromium.launch();
const problems = [];
const links = new Set();
for (const width of [360, 720]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  let current = "";
  page.on("console", (m) => m.type() === "error" && problems.push(`console ${width}px ${current}: ${m.text().slice(0, 160)}`));
  page.on("pageerror", (e) => problems.push(`pageerror ${width}px ${current}: ${e.message.slice(0, 160)}`));
  for (const path of pages) {
    current = path;
    const res = await page.goto(base + path, { waitUntil: "domcontentloaded" });
    if (!res || res.status() !== 200) problems.push(`status ${res?.status()} ${path}`);
    const info = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const over = document.documentElement.scrollWidth - W;
      const offenders = over > 0 ? [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > W + 1 && !el.closest(".table-wrap,.diff,[style*='overflow']")).slice(0, 3).map((el) => `${el.tagName}.${String(el.className).slice(0, 40)}`) : [];
      const hrefs = [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href"));
      return { over, offenders, hrefs };
    });
    if (info.over > 0) problems.push(`overflow ${width}px ${path}: ${info.over}px ${info.offenders.join(", ")}`);
    if (width === 360) info.hrefs.forEach((h) => links.add(h.split("#")[0]));
  }
  await page.close();
}
await browser.close();

const bad = [];
const queue = [...links];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const href = queue.pop();
      if (!href) continue;
      const res = await fetch(base + href, { redirect: "follow" }).catch(() => null);
      if (!res || res.status !== 200) bad.push(`${res?.status ?? "ERR"} ${href}`);
    }
  }),
);

console.log(`pages checked: ${pages.length} × 2 widths; internal links checked: ${links.size}`);
console.log(problems.length ? problems.join("\n") : "no overflow / console / status problems");
console.log(bad.length ? `broken links:\n${bad.join("\n")}` : "no broken internal links");
