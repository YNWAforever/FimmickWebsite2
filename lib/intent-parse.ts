/**
 * The enquiry-context query contract without the content records it validates against, so the contact
 * form can read `?intent=` in the browser on the static contact page (award pass 2, 8.2.1). lib/intent.ts
 * supplies the known IDs on the server; the form supplies the ones the page gave it.
 */
export const intents = ["demo", "configuration", "deployment", "managed", "transformation", "service", "partnership", "workshop", "event", "general"] as const;
export type Intent = (typeof intents)[number];

export const contextKeys = ["solution", "product", "service", "industry", "workstream", "member", "case", "example", "resource"] as const;
export type ContextKey = (typeof contextKeys)[number];

export type EnquiryContext = { intent: Intent } & Partial<Record<ContextKey, string>>;

/** Legacy intents from the previous sites mapped to their meaning today. */
const legacyIntent: Record<string, Intent> = {
  benchmark: "transformation",
  audit: "transformation",
  consultation: "general",
  ecosystem: "partnership",
  "ai-workshop": "workshop",
  seminar: "event",
};

export type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function read(source: ParamSource, key: string): string | undefined {
  if (source instanceof URLSearchParams) return source.get(key) ?? undefined;
  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

/** Parse a context, keeping only the values `known` accepts. */
export function parseContextWith(source: ParamSource, known: (key: ContextKey, value: string) => boolean): EnquiryContext {
  const rawIntent = (read(source, "intent") || "").toLowerCase().slice(0, 40);
  const context: EnquiryContext = {
    // Own keys only: ?intent=constructor must not read Object.prototype.
    intent: (intents as readonly string[]).includes(rawIntent) ? (rawIntent as Intent) : Object.hasOwn(legacyIntent, rawIntent) ? legacyIntent[rawIntent] : "general",
  };
  for (const key of contextKeys) {
    const value = (read(source, key) || "").toLowerCase().slice(0, 80);
    if (value && known(key, value)) context[key] = value;
  }
  // Legacy links used ?intent=<member-slug> for ecosystem enquiries.
  if (!context.member && known("member", rawIntent)) {
    context.member = rawIntent;
    context.intent = "partnership";
  }
  return context;
}
