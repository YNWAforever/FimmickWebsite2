import { hansPairs, hansPhrases } from "./hans-table";

/**
 * Traditional (Hong Kong) → Simplified Chinese conversion for the /zh-hans
 * pages. Uses a generated table (scripts/i18n/build-hans-table.mjs) so the
 * server and the browser produce identical text.
 */
let charMap: Map<string, string> | null = null;
let phraseMap: Map<string, string> | null = null;
let phrasePattern: RegExp | null = null;

function init() {
  charMap = new Map();
  const chars = [...hansPairs];
  for (let i = 0; i + 1 < chars.length; i += 2) charMap.set(chars[i], chars[i + 1]);
  phraseMap = new Map(hansPhrases);
  phrasePattern = new RegExp(hansPhrases.map(([from]) => from).sort((a, b) => b.length - a.length).join("|"), "g");
}

export function toHans(text: string): string {
  if (!charMap) init();
  if (!/[㐀-鿿豈-﫿]/.test(text)) return text;
  const map = charMap!;
  // Protect phrases first (placeholders cannot collide with CJK text), then map characters.
  const kept: string[] = [];
  const masked = text.replace(phrasePattern!, (m) => {
    kept.push(phraseMap!.get(m)!);
    return `\u0000${kept.length - 1}\u0000`;
  });
  let result = "";
  for (const ch of masked) result += map.get(ch) ?? ch;
  return result.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]);
}

/** Convert every string inside a value (strings, arrays, tuples, plain objects). */
export function toHansDeep<T>(value: T): T {
  if (typeof value === "string") return toHans(value) as T;
  if (Array.isArray(value)) return value.map((v) => toHansDeep(v)) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, toHansDeep(v)])) as T;
  }
  return value;
}
