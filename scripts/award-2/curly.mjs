#!/usr/bin/env node
/**
 * Typographic apostrophes in visible copy: letter'letter → letter’letter (don't, FIMMICK's, we've).
 * Runs over the content registries and the page/component source, never over content/legal.ts
 * (verbatim legal text) or the legacy article data. The code uses double-quoted strings, so an
 * apostrophe between two letters only occurs in English copy. Idempotent; prints a count per file.
 *
 *   node scripts/award-2/curly.mjs          # rewrite
 *   node scripts/award-2/curly.mjs --check  # exit 1 if any straight apostrophe is left
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const check = process.argv.includes("--check");
const skip = [path.join("content", "legal.ts"), path.join("content", "legacy")];
const pattern = /([A-Za-z])'([A-Za-z])/g;

function* files(dir) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (skip.some((s) => rel === s || rel.startsWith(s + path.sep))) continue;
    if (entry.isDirectory()) yield* files(rel);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield rel;
  }
}

let total = 0;
for (const dir of ["content", "app", "components"]) {
  for (const rel of files(dir)) {
    const full = path.join(root, rel);
    const before = fs.readFileSync(full, "utf8");
    const count = (before.match(pattern) || []).length;
    if (!count) continue;
    total += count;
    if (check) console.log(`${rel}: ${count} straight apostrophe(s)`);
    else {
      fs.writeFileSync(full, before.replace(pattern, "$1’$2"));
      console.log(`${rel}: ${count}`);
    }
  }
}
console.log(`${check ? "found" : "replaced"} ${total}`);
if (check && total) process.exit(1);
