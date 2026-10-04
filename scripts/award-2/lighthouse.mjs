#!/usr/bin/env node
/**
 * Lighthouse 13 medians (default 3 runs) for mobile and desktop, simulated throttling, using
 * Playwright's Chromium. Single runs on a laptop swing by several points; compare medians only,
 * and stop other servers and test runs while this measures.
 *
 *   OUT=before node scripts/award-2/lighthouse.mjs
 *   RUNS=5 PAGES=/en FORMS=mobile node scripts/award-2/lighthouse.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import { base, outDir, writeJson } from "./lib.mjs";

const runs = Number(process.env.RUNS || 3);
const pages = process.env.PAGES ? process.env.PAGES.split(",") : ["/en", "/en/platform", "/en/services", "/zh-hant"];
const forms = process.env.FORMS ? process.env.FORMS.split(",") : ["mobile", "desktop"];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lh-"));
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const results = {};
for (const form of forms) {
  for (const p of pages) {
    const samples = [];
    for (let i = 0; i < runs; i++) {
      const file = path.join(tmp, `${form}-${p.replace(/\W+/g, "_")}-${i}.json`);
      const args = ["-y", "lighthouse@13.5.0", base + p, "--only-categories=performance", "--output=json", `--output-path=${file}`, "--quiet", "--chrome-flags=--headless=new"];
      if (form === "desktop") args.push("--preset=desktop");
      // On Windows chrome-launcher often exits non-zero after writing the report (EPERM removing its
      // temp profile while Chrome still holds it), so the report file, not the exit code, decides.
      spawnSync("npx", args, { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, shell: true, stdio: "ignore" });
      if (!fs.existsSync(file)) {
        console.log(`  ${form} ${p} run ${i + 1}: failed`);
        continue;
      }
      const lhr = JSON.parse(fs.readFileSync(file, "utf8"));
      samples.push({
        score: Math.round(lhr.categories.performance.score * 100),
        lcp: Math.round(lhr.audits["largest-contentful-paint"].numericValue),
        tbt: Math.round(lhr.audits["total-blocking-time"].numericValue),
        cls: Math.round(lhr.audits["cumulative-layout-shift"].numericValue * 1000) / 1000,
        weightKB: Math.round(lhr.audits["total-byte-weight"].numericValue / 1024),
      });
    }
    const m = { score: median(samples.map((s) => s.score)), lcp: median(samples.map((s) => s.lcp)), tbt: median(samples.map((s) => s.tbt)), cls: median(samples.map((s) => s.cls)), weightKB: median(samples.map((s) => s.weightKB)), scores: samples.map((s) => s.score) };
    results[`${form} ${p}`] = m;
    console.log(`${form.padEnd(7)} ${p.padEnd(14)} score ${m.score} (${m.scores.join("/")})  LCP ${m.lcp} ms  TBT ${m.tbt} ms  CLS ${m.cls}  ${m.weightKB} KB`);
  }
}
writeJson(path.join(outDir(), "lighthouse.json"), results);
fs.rmSync(tmp, { recursive: true, force: true });
