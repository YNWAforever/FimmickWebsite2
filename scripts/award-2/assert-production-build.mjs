#!/usr/bin/env node
/**
 * Release gate: is the build in .next safe to serve as www.fimmick.com? Indexability is baked in at
 * build time (SITE_ENV), so a preview build promoted to production would ship noindex and a
 * disallow-all robots.txt. This reads the built output, not a server.
 *
 *   SITE_ENV=production npx next build && node scripts/award-2/assert-production-build.mjs
 *
 * Checks: robots.txt allows crawling and names the sitemap; no prerendered page carries a noindex
 * robots meta (404 and error pages excepted); no header rule sends X-Robots-Tag; /en, /zh-hant and
 * /zh-hans carry self-canonicals on https://www.fimmick.com.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const app = path.join(root, ".next", "server", "app");
const origin = "https://www.fimmick.com";
const failures = [];
const fail = (message) => failures.push(message);

if (!fs.existsSync(app)) {
  console.error("No build found in .next/server/app: run `SITE_ENV=production npx next build` first.");
  process.exit(2);
}

// robots.txt
const robots = fs.existsSync(path.join(app, "robots.txt.body")) ? fs.readFileSync(path.join(app, "robots.txt.body"), "utf8") : "";
if (!/^Allow: \/$/m.test(robots)) fail("robots.txt has no `Allow: /` (is SITE_ENV=production set for this build?)");
if (/^Disallow: \/$/m.test(robots)) fail("robots.txt disallows everything");
if (!/^Sitemap: https:\/\/www\.fimmick\.com\/sitemap\.xml$/m.test(robots)) fail("robots.txt has no `Sitemap:` line for the production origin");

// Header rules
const manifest = fs.readFileSync(path.join(root, ".next", "routes-manifest.json"), "utf8");
if (/X-Robots-Tag/i.test(manifest)) fail("a header rule sends X-Robots-Tag");

// Prerendered pages
const exempt = /(^|[\\/])(_not-found|_global-error|404|500)\.html$/;
let pages = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html") && !exempt.test(full)) {
      pages++;
      const html = fs.readFileSync(full, "utf8");
      const robotsMeta = html.match(/<meta name="robots" content="([^"]*)"/);
      if (robotsMeta && /noindex/i.test(robotsMeta[1])) fail(`noindex in ${path.relative(app, full)}`);
    }
  }
};
walk(app);

// Self-canonicals on the three homes
for (const locale of ["en", "zh-hant", "zh-hans"]) {
  const file = path.join(app, `${locale}.html`);
  const html = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (!html.includes(`<link rel="canonical" href="${origin}/${locale}"/>`)) fail(`/${locale} has no self-canonical on ${origin}`);
}

if (failures.length) {
  const shown = failures.slice(0, 20);
  console.error(`Production build check FAILED (${failures.length}):\n- ${shown.join("\n- ")}${failures.length > shown.length ? `\n- … ${failures.length - shown.length} more` : ""}`);
  process.exit(1);
}
console.log(`Production build check passed: robots allows crawling with a sitemap, ${pages} prerendered pages without noindex, no X-Robots-Tag rule, self-canonicals on /en, /zh-hant, /zh-hans.`);
