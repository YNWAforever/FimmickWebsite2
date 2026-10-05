import { hansPairs, hansPhrases } from "./hans-table";

/**
 * Traditional (Hong Kong) → Simplified Chinese conversion for the /zh-hans
 * pages. Uses a generated table (scripts/i18n/build-hans-table.mjs) so the
 * server and the browser produce identical text.
 */

/**
 * A converter from a pair string (Traditional, Simplified, Traditional, …) and a phrase list. Phrases
 * are matched literally (the pattern is escaped), longest first, and masked before the character map
 * runs, so a phrase's own Simplified form is kept; an empty phrase list skips the masking.
 */
export function createConverter(pairs: string, phrases: [string, string][]): (text: string) => string {
  const charMap = new Map<string, string>();
  const chars = [...pairs];
  for (let i = 0; i + 1 < chars.length; i += 2) charMap.set(chars[i], chars[i + 1]);
  const phraseMap = new Map(phrases);
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const phrasePattern = phrases.length
    ? new RegExp(phrases.map(([from]) => from).sort((a, b) => b.length - a.length).map(escape).join("|"), "g")
    : null;
  return (text) => {
    if (!/[㐀-鿿豈-﫿]/.test(text)) return text;
    // Protect phrases first (placeholders cannot collide with CJK text), then map characters.
    const kept: string[] = [];
    const masked = phrasePattern
      ? text.replace(phrasePattern, (m) => {
          kept.push(phraseMap.get(m)!);
          return `\u0000${kept.length - 1}\u0000`;
        })
      : text;
    let result = "";
    for (const ch of masked) result += charMap.get(ch) ?? ch;
    return kept.length ? result.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]) : result;
  };
}

let convert: ((text: string) => string) | null = null;

export function toHans(text: string): string {
  convert ??= createConverter(hansPairs, hansPhrases);
  return convert(text);
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
