#!/usr/bin/env node
/**
 * One-off repair of the committed Knowledge Hub records: applies the converter's entity decoding
 * (scripts/migration/entities.mjs) to every string in content/legacy/article-index.json and
 * articles-<locale>.json. The original capture is not in the repo, so the converter cannot be
 * re-run; this applies the same function to its output. Idempotent.
 *
 *   node scripts/migration/decode-legacy-entities.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodeEntities } from "./entities.mjs";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../content/legacy");
const walk = (v) => (typeof v === "string" ? decodeEntities(v) : Array.isArray(v) ? v.map(walk) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);

for (const file of ["article-index.json", "articles-en.json", "articles-zh-hant.json", "articles-zh-hans.json"]) {
  const full = path.join(dir, file);
  const before = fs.readFileSync(full, "utf8");
  const after = JSON.stringify(walk(JSON.parse(before)));
  if (after !== before) fs.writeFileSync(full, after);
  console.log(`${file}: ${after === before ? "unchanged" : "decoded"}`);
}
