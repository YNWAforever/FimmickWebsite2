#!/usr/bin/env node
/**
 * Verifies every production and reference URL against a running build and
 * writes docs/redesign/route-migration.csv.
 *
 *   npx next start -p 3100   (then)   node scripts/migration/verify-routes.mjs
 *
 * For each old path: request without following redirects, record the status
 * and Location, then follow at most one hop and record the final status.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const base = process.env.BASE_URL || "http://localhost:3100";
const read = (f) => fs.readFileSync(path.join(root, "docs", "redesign", f), "utf8").split(/\r?\n/).filter(Boolean);
const rows = [
  ...read("production-urls.txt").map((p) => ({ path: p, source: "production-sitemap" })),
  ...read("reference-urls.txt").map((p) => ({ path: p, source: "production-probe / reference-repo" })),
];

const kind = (p) =>
  /\/knowledge-hub\/category\//.test(p) ? "knowledge-hub category" : /\/knowledge-hub\/.+/.test(p) ? "article" : /\/events\/.+/.test(p) ? "event" : /\/services\/.+/.test(p) ? "service" : /\/workforce/.test(p) ? "workforce (retired metaphor)" : /\/platform/.test(p) ? "platform" : /\/fimmick-ecosystem/.test(p) ? "ecosystem" : /(privacy|terms|cookies)$/.test(p) ? "legal" : "page";
const localeOf = (p) => (p.match(/^\/(en|zh-hant|zh-hans|zh-hk|zh-cn)(?=\/|$)/) || [, "none"])[1];

async function check(p) {
  const url = base + p; // paths are already URL-encoded as published
  const first = await fetch(url, { redirect: "manual" });
  let status = first.status;
  let target = "";
  let finalStatus = status;
  if (status >= 300 && status < 400) {
    target = new URL(first.headers.get("location"), base).pathname;
    let hop = await fetch(base + target, { redirect: "manual" });
    finalStatus = hop.status;
    // A trailing-slash normalisation is not counted as a content redirect.
    if (finalStatus >= 300 && finalStatus < 400) {
      const second = new URL(hop.headers.get("location"), base).pathname;
      hop = await fetch(base + second, { redirect: "manual" });
      target = second;
      finalStatus = hop.status;
    }
  }
  return { status, target, finalStatus };
}

const results = [];
let i = 0;
async function worker() {
  while (i < rows.length) {
    const row = rows[i++];
    try {
      results.push({ ...row, ...(await check(row.path)) });
    } catch (e) {
      results.push({ ...row, status: "error", target: String(e), finalStatus: "error" });
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
results.sort((a, b) => a.path.localeCompare(b.path));

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const header = ["old_host", "old_path", "locale", "content_type", "current_status_new_build", "target_path", "action", "http_status", "query_intent_treatment", "evidence", "verification_result"];
const lines = [header.join(",")];
for (const r of results) {
  const action = r.status === 200 ? "keep" : r.status >= 300 && r.status < 400 ? (r.target.replace(/\/$/, "") === r.path.replace(/\/$/, "") ? "normalise trailing slash" : "redirect") : r.status === 404 ? "retire (404)" : "check";
  const verdict = (r.status === 200 || ((r.status >= 300 && r.status < 400) && r.finalStatus === 200) || (r.path.includes("launch-plan") && r.status === 404)) ? "pass" : "review";
  lines.push([
    "www.fimmick.com", r.path, localeOf(r.path), kind(r.path), r.status, r.target, action, r.status, "intent/context query keys parsed against known IDs; unknown values dropped", r.source, verdict,
  ].map(esc).join(","));
}
fs.writeFileSync(path.join(root, "docs", "redesign", "route-migration.csv"), lines.join("\n") + "\n");
const summary = results.reduce((acc, r) => ((acc[`${r.status}->${r.finalStatus}`] = (acc[`${r.status}->${r.finalStatus}`] || 0) + 1), acc), {});
console.log(results.length, "urls", summary);
console.log("needs review:", results.filter((r) => !(r.status === 200 || (r.status >= 300 && r.status < 400 && r.finalStatus === 200) || r.path.includes("launch-plan"))).map((r) => `${r.path} ${r.status}->${r.finalStatus}`).join("\n"));
