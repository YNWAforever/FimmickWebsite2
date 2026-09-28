#!/usr/bin/env node
/**
 * Before/after audit for the cinematic redesign.
 * Captures viewport + full-page screenshots (desktop 1440×900, mobile 390×844)
 * and measures the visible homepage prose, so wording changes are measured
 * rather than estimated.
 *
 *   BASE_URL=https://fimmick-website2.vercel.app OUT=before node scripts/capture-audit.mjs
 *   BASE_URL=http://localhost:3100 OUT=after node scripts/capture-audit.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tag = process.env.OUT || "after";
const out = path.join(root, "docs", "redesign", "cinematic", tag);
fs.mkdirSync(out, { recursive: true });
const base = process.env.BASE_URL || "http://localhost:3100";
const onlyMetrics = process.env.METRICS_ONLY === "1";

const pages = [
  ["home", "/en"],
  ["home-zh-hant", "/zh-hant"],
  ["home-zh-hans", "/zh-hans"],
  ["solution", "/en/solutions/content-production"],
  ["platform", "/en/platform"],
  ["transformation", "/en/ai-transformation"],
  ["services", "/en/services"],
  ["industry", "/en/industries/property-real-estate"],
  ["case", "/en/case-studies/real-estate-sales-follow-up"],
  ["ecosystem", "/en/fimmick-ecosystem"],
  ["resources", "/en/resources"],
];

/**
 * Visible-text metrics for <main>. Hidden tab panels, closed <details> and aria-hidden decoration are excluded.
 * `artefact` counts text inside sample outputs and data (working examples, output artefacts, heatmaps,
 * the film card) on both old and new pages; `explanatory` is everything else.
 */
function measure() {
  const main = document.querySelector("main") || document.body;
  const visible = (el) => {
    if (!(el instanceof Element)) return true;
    if (el.closest("[aria-hidden='true']")) return false;
    if (typeof el.checkVisibility === "function") return el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true });
    return el.getClientRects().length > 0;
  };
  const count = (s) => {
    const cjk = (s.match(/[㐀-鿿]/g) || []).length;
    const latin = (s.replace(/[㐀-鿿]/g, " ").match(/[A-Za-z0-9][A-Za-z0-9'’.,%-]*/g) || []).length;
    return { cjk, latin };
  };
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const artefactSelector = ".artifact, .frame, .hero-card, .mini-heat, .svc-sample, .workbench, .heatmap, .hero-pipeline, .player";
  const totals = { all: { cjk: 0, latin: 0 }, prose: { cjk: 0, latin: 0 }, headings: { cjk: 0, latin: 0 }, artefact: { cjk: 0, latin: 0 }, explanatory: { cjk: 0, latin: 0 } };
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || !visible(el) || el.closest("script,style,noscript,svg,video")) continue;
    const c = count(text);
    totals.all.cjk += c.cjk;
    totals.all.latin += c.latin;
    const kind = el.closest(artefactSelector) ? totals.artefact : totals.explanatory;
    kind.cjk += c.cjk;
    kind.latin += c.latin;
    const heading = el.closest("h1,h2,h3,h4,h5,h6");
    const bucket = heading ? totals.headings : el.closest("p,li,dd,dt,blockquote,td,th,figcaption,summary") ? totals.prose : null;
    if (bucket) {
      bucket.cjk += c.cjk;
      bucket.latin += c.latin;
    }
  }
  const imgs = [...main.querySelectorAll("img")].filter(visible);
  const pictures = imgs.filter((i) => !i.src.endsWith(".svg") && i.naturalWidth > 200);
  return {
    totals,
    sections: main.querySelectorAll(":scope > section").length,
    photographs: pictures.length,
    svgs: [...main.querySelectorAll("svg")].filter(visible).length,
    videos: main.querySelectorAll("video").length,
    height: document.documentElement.scrollHeight,
  };
}

const browser = await chromium.launch();
const metrics = {};
try {
  for (const [vw, vh, device] of [[1440, 900, "desktop"], [390, 844, "mobile"]]) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [name, url] of pages) {
      if (device === "mobile" && !name.startsWith("home") && !["solution", "platform", "services"].includes(name)) continue;
      await page.goto(base + url, { waitUntil: "networkidle" });
      // Trigger lazy media, then return to the top.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      if (name.startsWith("home")) metrics[`${device}-${name}`] = await page.evaluate(measure);
      if (onlyMetrics) continue;
      const shot = await page.screenshot({ fullPage: false });
      await sharp(shot).webp({ quality: 74 }).toFile(path.join(out, `${device}-${name}.webp`));
      const full = await page.screenshot({ fullPage: true });
      const meta = await sharp(full).metadata();
      const scale = device === "desktop" ? 960 / vw : 1;
      // WebP caps at 16383 px, so very long pages are scaled to fit.
      const height = Math.min(16000, Math.round(meta.height * scale));
      await sharp(full).resize({ width: Math.round(vw * scale), height, fit: "fill" }).webp({ quality: 62 }).toFile(path.join(out, `${device}-${name}-full.webp`));
    }
    await page.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(out, "metrics.json"), JSON.stringify({ base, capturedAt: new Date().toISOString(), metrics }, null, 2));
console.log(JSON.stringify(metrics, null, 2));
