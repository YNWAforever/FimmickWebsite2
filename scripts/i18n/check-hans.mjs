#!/usr/bin/env node
/**
 * Check the Simplified Chinese pages of a running build for leftover
 * Traditional characters (default http://localhost:3100):
 *
 *   node scripts/i18n/check-hans.mjs
 *
 * Every /zh-hans URL in the sitemap is fetched (except preserved archive
 * articles, whose native Simplified text is kept verbatim); visible text outside
 * elements marked lang="zh-Hant…" or lang="en" is compared with a full
 * OpenCC (hk → cn) conversion. Any difference is reported with context.
 * Exit code 1 when something is found.
 */
import * as OpenCC from "opencc-js";

const base = process.env.BASE_URL || "http://localhost:3100";
const convert = OpenCC.Converter({ from: "hk", to: "cn" });
/** Differences OpenCC reports that are deliberate (kept words). */
const allowed = [/著名/, /显著/, /著作/];

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...new Set([...sitemap.matchAll(/<loc>https:\/\/www\.fimmick\.com(\/zh-hans[^<]*)<\/loc>/g)].map((m) => m[1]))].filter((p) => !/^\/zh-hans\/knowledge-hub\/(?!category\/)[^/]+$/.test(p));

function visibleText(html) {
  let body = html.replace(/[\s\S]*?<body[^>]*>/i, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  // Drop elements explicitly marked as another language (language switch, original-language content).
  for (let i = 0; i < 4; i++) body = body.replace(/<(\w+)[^>]*\slang="(?:zh-Hant[^"]*|en)"[^>]*>[\s\S]*?<\/\1>/g, " ");
  return body.replace(/<[^>]+>/g, "\n").replace(/&[a-z#0-9]+;/gi, " ");
}

const problems = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const path = queue.pop();
      const res = await fetch(base + path);
      if (res.status !== 200) {
        problems.push(`${res.status} ${path}`);
        continue;
      }
      const lines = visibleText(await res.text()).split("\n").map((l) => l.trim()).filter((l) => /[㐀-鿿]/.test(l));
      for (const line of lines) {
        const converted = convert(line);
        if (converted !== line && !allowed.some((re) => re.test(line))) problems.push(`${path}: ${line.slice(0, 80)}  →  ${converted.slice(0, 80)}`);
      }
    }
  }),
);

console.log(`zh-hans pages checked: ${urls.length}`);
if (problems.length) {
  const unique = [...new Set(problems.map((p) => p.replace(/^[^:]+: /, "")))];
  console.log(`${problems.length} findings (${unique.length} unique):\n${unique.slice(0, 80).join("\n")}`);
  process.exit(1);
}
console.log("no Traditional characters found outside marked elements");
