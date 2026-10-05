#!/usr/bin/env node
/**
 * Award pass 2, 8.1.1: Chinese articles were published under /en. The original capture is not in the
 * repo, so the committed index is corrected in place (the converter applies the same rule on a fresh
 * run): an "en" record whose title, summary and body are more than 30 % CJK gets
 * contentLanguage "zh-hant", and when the article has no zh-hant record one is created from the same
 * text, so its Chinese page is a real page rather than a fallback. Idempotent.
 *
 *   node scripts/migration/fix-article-languages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "content", "legacy");
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
// The committed files are single-line JSON; keep that so the diff shows only what changed.
const write = (f, data) => fs.writeFileSync(path.join(dir, f), JSON.stringify(data));
const index = read("article-index.json");
const en = read("articles-en.json");
const zhHant = read("articles-zh-hant.json");

const CJK = /[㐀-鿿豈-﫿]/g;
const isChinese = (text) => {
  const compact = text.replace(/\s/g, "");
  return (compact.match(CJK) || []).length > compact.length * 0.3;
};
const bodyText = (blocks = []) => blocks.map((b) => (b.t === "ul" ? b.items.join(" ") : b.x)).join(" ");

let marked = 0;
let created = 0;
for (const entry of index) {
  const meta = entry.locales.en;
  if (!meta || !isChinese(`${meta.title} ${meta.summary} ${bodyText(en[entry.slug])}`)) continue;
  if (meta.contentLanguage !== "zh-hant") {
    meta.contentLanguage = "zh-hant";
    marked++;
  }
  if (!entry.locales["zh-hant"]) {
    entry.locales["zh-hant"] = { ...meta };
    zhHant[entry.slug] = en[entry.slug] ?? [];
    created++;
  }
}
write("article-index.json", index);
write("articles-zh-hant.json", zhHant);
console.log(`marked ${marked} Chinese "en" records; created ${created} zh-hant records`);
