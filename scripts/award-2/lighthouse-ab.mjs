#!/usr/bin/env node
/**
 * Interleaved Lighthouse A/B: a `main` build on BASE_A (default :3101) against the branch build on
 * BASE_B (default :3100), alternating single runs so machine noise lands on both sides equally.
 * Compares medians; this is the "within 2 points of the baseline" check for each PR, because single
 * runs on this machine swing by up to 10 points.
 *
 *   PAIRS=5 PAGE=/en FORM=mobile OUT=after node scripts/award-2/lighthouse-ab.mjs
 *   (Git Bash: prefix MSYS_NO_PATHCONV=1 so PAGE is not rewritten into a Windows path.)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import { outDir, writeJson } from "./lib.mjs";

const pairs = Number(process.env.PAIRS || 5);
const page = process.env.PAGE || "/en";
const form = process.env.FORM || "mobile";
const sides = { main: process.env.BASE_A || "http://localhost:3101", branch: process.env.BASE_B || "http://localhost:3100" };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lh-ab-"));
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

function run(url, file) {
  const args = ["-y", "lighthouse@13.5.0", url, "--only-categories=performance", "--output=json", `--output-path=${file}`, "--quiet", "--chrome-flags=--headless=new"];
  if (form === "desktop") args.push("--preset=desktop");
  // chrome-launcher may exit non-zero on Windows after writing the report; the file decides.
  spawnSync("npx", args, { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, shell: true, stdio: "ignore" });
  if (!fs.existsSync(file)) return null;
  const lhr = JSON.parse(fs.readFileSync(file, "utf8"));
  return { score: Math.round(lhr.categories.performance.score * 100), lcp: Math.round(lhr.audits["largest-contentful-paint"].numericValue), tbt: Math.round(lhr.audits["total-blocking-time"].numericValue) };
}

const samples = { main: [], branch: [] };
for (let i = 0; i < pairs; i++) {
  // Alternate which side goes first in each pair.
  const order = i % 2 ? ["branch", "main"] : ["main", "branch"];
  for (const side of order) {
    const r = run(sides[side] + page, path.join(tmp, `${side}-${i}.json`));
    if (r) samples[side].push(r);
    console.log(`pair ${i + 1} ${side.padEnd(6)} ${r ? `${r.score}  LCP ${r.lcp}  TBT ${r.tbt}` : "failed"}`);
  }
}
const summary = Object.fromEntries(
  Object.entries(samples).map(([k, s]) => [k, { score: median(s.map((x) => x.score)), lcp: median(s.map((x) => x.lcp)), tbt: median(s.map((x) => x.tbt)), scores: s.map((x) => x.score) }]),
);
console.log(`median ${form} ${page}: main ${summary.main.score} (LCP ${summary.main.lcp}, TBT ${summary.main.tbt}) · branch ${summary.branch.score} (LCP ${summary.branch.lcp}, TBT ${summary.branch.tbt}) · delta ${summary.branch.score - summary.main.score}`);
writeJson(path.join(outDir(), `lighthouse-ab-${form}-${page.replace(/\W+/g, "_") || "root"}.json`), { page, form, pairs, ...summary });
fs.rmSync(tmp, { recursive: true, force: true });
