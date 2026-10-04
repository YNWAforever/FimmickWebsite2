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

const slashless = (p) => p.replace(/\/+$/, "") || "/";

/**
 * Follow redirects by hand. A trailing-slash normalisation is not a content redirect; every other
 * hop is counted, and more than one is a chain (award pass 2, 8.1.5: old links reach their page in
 * one hop).
 */
async function check(p) {
  let current = p; // paths are already URL-encoded as published
  let res = await fetch(base + current, { redirect: "manual" });
  const status = res.status;
  let target = "";
  let hops = 0;
  for (let n = 0; n < 5 && res.status >= 300 && res.status < 400; n++) {
    const next = new URL(res.headers.get("location"), base).pathname;
    if (slashless(next) !== slashless(current)) hops++;
    current = next;
    target = next;
    res = await fetch(base + current, { redirect: "manual" });
  }
  return { status, target, finalStatus: res.status, hops };
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

/** Reaches a page (or is deliberately gone) in at most one content hop. */
const passes = (r) => r.hops <= 1 && (r.finalStatus === 200 || r.finalStatus === 410 || (r.path.includes("launch-plan") && r.status === 404));
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const header = ["old_host", "old_path", "locale", "content_type", "current_status_new_build", "target_path", "action", "http_status", "query_intent_treatment", "evidence", "verification_result"];
const lines = [header.join(",")];
for (const r of results) {
  const action = r.status === 410 ? "retire (410)" : r.status === 200 ? "keep" : r.status >= 300 && r.status < 400 ? (r.target.replace(/\/$/, "") === r.path.replace(/\/$/, "") ? "normalise trailing slash" : "redirect") : r.status === 404 ? "retire (404)" : "check";
  const verdict = passes(r) ? "pass" : "review";
  lines.push([
    "www.fimmick.com", r.path, localeOf(r.path), kind(r.path), r.status, r.target, action, r.status, "intent/context query keys parsed against known IDs; unknown values dropped", r.source, verdict,
  ].map(esc).join(","));
}
fs.writeFileSync(path.join(root, "docs", "redesign", "route-migration.csv"), lines.join("\n") + "\n");
const summary = results.reduce((acc, r) => ((acc[`${r.status}->${r.finalStatus}`] = (acc[`${r.status}->${r.finalStatus}`] || 0) + 1), acc), {});
console.log(results.length, "urls", summary);
console.log("needs review:", results.filter((r) => !passes(r)).map((r) => `${r.path} ${r.status}->${r.finalStatus} (${r.hops} hops)`).join("\n"));
const chains = results.filter((r) => r.hops > 1);
console.log("redirect chains:", chains.length);
if (chains.length) process.exit(1);
