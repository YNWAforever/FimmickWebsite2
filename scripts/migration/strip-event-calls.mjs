#!/usr/bin/env node
/**
 * Award pass 2, 8.1.6: every legacy event is in the past, so "Register now" no longer applies. In each
 * summary a standalone "Register now!" / "Register now to …!" sentence is dropped and
 * "Register now for the X!" becomes "The X." Applied to the committed events.json (the source export
 * is not in the repo); idempotent.
 *
 *   node scripts/migration/strip-event-calls.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "content", "legacy", "events.json");
const events = JSON.parse(fs.readFileSync(file, "utf8"));
const strip = (summary) =>
  summary
    .replace(/Register now for (the [^!.?]+)[!.]/g, (_, rest) => `${rest[0].toUpperCase()}${rest.slice(1)}.`)
    .replace(/\s*Register now(?: to [^!.?]+)?[!.]/g, "")
    .trim();
let changed = 0;
for (const e of events) {
  const next = strip(e.summary);
  if (next !== e.summary) {
    e.summary = next;
    changed++;
  }
}
fs.writeFileSync(file, JSON.stringify(events));
console.log(`${changed} summaries updated`);
