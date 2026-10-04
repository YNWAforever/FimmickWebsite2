import { solutions } from "@/content/solutions";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { workstreams } from "@/content/transformation";
import { members } from "@/content/ecosystem";
import { cases } from "@/content/cases";
import type { L } from "@/lib/i18n";

/**
 * Enquiry context contract.
 *
 * Pages link to /contact with a small set of query parameters describing
 * where the visitor came from. Only known IDs survive parsing; anything else
 * is dropped. Personal data (name, email, phone, message) is never placed in
 * URLs, analytics or browser storage.
 */
export const intents = ["demo", "configuration", "deployment", "managed", "transformation", "service", "partnership", "workshop", "event", "general"] as const;
export type Intent = (typeof intents)[number];

export const intentLabels: Record<Intent, L> = {
  demo: { en: "Request a product demo", zh: "申請產品示範" },
  configuration: { en: "Discuss product configuration", zh: "討論產品配置" },
  deployment: { en: "Discuss deployment support", zh: "討論部署支援" },
  managed: { en: "Discuss managed operations", zh: "討論託管營運" },
  transformation: { en: "Discuss an AI transformation scope", zh: "討論 AI 轉型範圍" },
  service: { en: "Discuss a specialist service", zh: "討論專業服務" },
  partnership: { en: "Explore an ecosystem partnership", zh: "探討生態系統合作" },
  workshop: { en: "Request a leadership workshop", zh: "申請管理層工作坊" },
  event: { en: "Ask about events", zh: "查詢活動" },
  general: { en: "Something else", zh: "其他查詢" },
};

const ids = {
  solution: new Set<string>(solutions.map((s) => s.id)),
  product: new Set<string>(products.map((p) => p.id)),
  service: new Set<string>(services.map((s) => s.id)),
  industry: new Set<string>(industries.map((i) => i.id)),
  workstream: new Set<string>(workstreams.map((w) => w.id)),
  member: new Set<string>(members.map((m) => m.id)),
  case: new Set<string>(cases.map((c) => c.slug)),
  example: new Set<string>(["intelligence", "content", "follow-up", "website-ops"]),
  resource: new Set<string>(["ai-readiness-checklist", "workflow-planning-worksheet", "fimmick-aip-explainer", "workshop"]),
};

export type ContextKey = keyof typeof ids;
export const contextKeys = Object.keys(ids) as ContextKey[];

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

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function read(source: ParamSource, key: string): string | undefined {
  if (source instanceof URLSearchParams) return source.get(key) ?? undefined;
  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

export function isKnownId(key: ContextKey, value: string): boolean {
  return ids[key].has(value);
}

export function parseContext(source: ParamSource): EnquiryContext {
  const rawIntent = (read(source, "intent") || "").toLowerCase().slice(0, 40);
  const context: EnquiryContext = {
    intent: (intents as readonly string[]).includes(rawIntent) ? (rawIntent as Intent) : legacyIntent[rawIntent] ?? "general",
  };
  for (const key of contextKeys) {
    const value = (read(source, key) || "").toLowerCase().slice(0, 80);
    if (value && ids[key].has(value)) context[key] = value;
  }
  // Legacy links used ?intent=<member-slug> for ecosystem enquiries.
  if (!context.member && ids.member.has(rawIntent)) {
    context.member = rawIntent;
    context.intent = "partnership";
  }
  return context;
}

/** Serialise a context back to a query string (known keys only). */
export function contextQuery(context: Partial<EnquiryContext>): string {
  const params = new URLSearchParams();
  if (context.intent) params.set("intent", context.intent);
  for (const key of contextKeys) {
    const value = context[key];
    if (value && ids[key].has(value)) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export { safeQueryForLocaleSwitch } from "./safe-query";
