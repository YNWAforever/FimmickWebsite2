import { solutions } from "@/content/solutions";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { workstreams } from "@/content/transformation";
import { members } from "@/content/ecosystem";
import { cases } from "@/content/cases";
import type { L } from "@/lib/i18n";
import { contextKeys, parseContextWith, type ContextKey, type EnquiryContext, type Intent, type ParamSource } from "./intent-parse";

/**
 * Enquiry context contract.
 *
 * Pages link to /contact with a small set of query parameters describing
 * where the visitor came from. Only known IDs survive parsing; anything else
 * is dropped. Personal data (name, email, phone, message) is never placed in
 * URLs, analytics or browser storage.
 */
export { contextKeys, intents, type ContextKey, type EnquiryContext, type Intent } from "./intent-parse";

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

const ids: Record<ContextKey, Set<string>> = {
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

export function isKnownId(key: ContextKey, value: string): boolean {
  return ids[key].has(value);
}

/** Every ID a context key accepts. */
export const knownIds = (key: ContextKey): string[] => [...ids[key]];

export function parseContext(source: ParamSource): EnquiryContext {
  return parseContextWith(source, isKnownId);
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
