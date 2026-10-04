#!/usr/bin/env node
/**
 * Transfer budgets: stylesheet bytes per route (raw and gzip) and the RSC prefetch traffic a full
 * scroll of a page triggers (Next prefetches every <Link> that enters the viewport).
 *
 *   OUT=before node scripts/award-2/bytes.mjs
 */
import path from "node:path";
import zlib from "node:zlib";
import { chromium } from "@playwright/test";
import { base, outDir, scrollThrough, writeJson } from "./lib.mjs";

const routes = ["/en", "/en/platform", "/en/services", "/en/solutions/content-production", "/en/contact", "/en/knowledge-hub/4-types-of-crm-system", "/zh-hant"];
const gz = (buf) => zlib.gzipSync(buf, { level: 9 }).length;
const kb = (n) => Math.round(n / 102.4) / 10;

const css = {};
const cache = new Map();
for (const route of routes) {
  const html = await (await fetch(base + route)).text();
  const hrefs = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
  let raw = 0;
  let zipped = 0;
  for (const href of hrefs) {
    if (!cache.has(href)) cache.set(href, Buffer.from(await (await fetch(base + href)).arrayBuffer()));
    raw += cache.get(href).length;
    zipped += gz(cache.get(href));
  }
  css[route] = { files: hrefs.length, rawKB: kb(raw), gzipKB: kb(zipped) };
  console.log(`css ${route.padEnd(44)} ${hrefs.length} files  ${kb(raw)} KB raw  ${kb(zipped)} KB gz`);
}

const browser = await chromium.launch();
const prefetch = {};
for (const [route, width, height] of [["/en", 1440, 900], ["/en", 390, 844], ["/en/platform", 1440, 900]]) {
  const page = await (await browser.newContext({ viewport: { width, height } })).newPage();
  const seen = [];
  page.on("response", async (res) => {
    const headers = res.request().headers();
    if (!headers["rsc"] && !res.url().includes("_rsc=")) return;
    try {
      const body = await res.body();
      seen.push({ url: res.url(), raw: body.length, gz: gz(body) });
    } catch {
      /* navigation aborted the body */
    }
  });
  await page.goto(base + route, { waitUntil: "load" });
  await page.waitForTimeout(800);
  await scrollThrough(page, { pause: 250 });
  await page.waitForTimeout(1500);
  const raw = seen.reduce((n, s) => n + s.raw, 0);
  const zipped = seen.reduce((n, s) => n + s.gz, 0);
  prefetch[`${route}@${width}`] = { requests: seen.length, rawKB: kb(raw), gzipKB: kb(zipped) };
  console.log(`rsc ${route}@${width}: ${seen.length} requests  ${kb(raw)} KB raw  ${kb(zipped)} KB gz`);
  await page.context().close();
}
await browser.close();
writeJson(path.join(outDir(), "bytes.json"), { css, prefetch });
