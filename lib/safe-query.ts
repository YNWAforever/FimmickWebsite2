/**
 * Query keys that may follow a visitor across a language switch. Values are
 * only IDs, filters or search text — never personal data. Kept free of
 * content imports so client components can use it without bundling records.
 */
const allowed = new Set([
  "intent", "solution", "product", "service", "industry", "workstream", "member", "case", "example", "resource",
  "objective", "kind", "capability", "format", "topic", "q", "page",
]);

export function safeQueryForLocaleSwitch(search: string): string {
  const params = new URLSearchParams(search);
  const keep = new URLSearchParams();
  params.forEach((value, key) => {
    if (allowed.has(key) && value.length <= 80) keep.set(key, value);
  });
  const query = keep.toString();
  return query ? `?${query}` : "";
}
