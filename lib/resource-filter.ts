import type { ResourceFormat, ResourceTopic } from "@/content/types";

/**
 * Resource Centre filtering, shared by the server (the static first page and the unit tests) and the
 * browser filter island (award pass 2, 8.2.1). No content imports: it runs on whatever rows it is given.
 */
export type ResourceFilter = { format?: ResourceFormat; topic?: ResourceTopic; q?: string; page?: number };
export type Filterable = { format: ResourceFormat; topic: ResourceTopic; title: string; summary: string };
/** A listing row with its labels already localised on the server (the browser imports no i18n tables). */
export type ResourceRow = Filterable & { id: string; date: string; lang: string; href: string; past: boolean };
export const PAGE_SIZE = 12;

export function filterRows<T extends Filterable>(all: T[], filter: ResourceFilter) {
  const q = (filter.q || "").trim().toLowerCase().slice(0, 80);
  const matches = (item: T, ignore?: "format" | "topic") =>
    (ignore === "format" || !filter.format || item.format === filter.format) &&
    (ignore === "topic" || !filter.topic || item.topic === filter.topic) &&
    (!q || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q));
  const matched = all.filter((item) => matches(item));
  const pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, filter.page || 1), pages);
  const count = (ignore: "format" | "topic", value: string) => all.filter((i) => matches(i, ignore) && i[ignore] === value).length;
  return {
    total: matched.length,
    page,
    pages,
    items: matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    formatCount: (format: ResourceFormat) => count("format", format),
    topicCount: (topic: ResourceTopic) => count("topic", topic),
  };
}

/** Read a filter from a query string, keeping only known values. */
export function readFilter(search: string, formats: readonly string[], topics: readonly string[]): ResourceFilter {
  const p = new URLSearchParams(search);
  const format = p.get("format") ?? "";
  const topic = p.get("topic") ?? "";
  return {
    format: formats.includes(format) ? (format as ResourceFormat) : undefined,
    topic: topics.includes(topic) ? (topic as ResourceTopic) : undefined,
    q: (p.get("q") ?? "").slice(0, 80) || undefined,
    page: Math.max(1, Number.parseInt(p.get("page") ?? "1", 10) || 1),
  };
}

/** The query string for a filter (empty values and page 1 left out). */
export function filterQuery(filter: ResourceFilter): string {
  const p = new URLSearchParams();
  if (filter.format) p.set("format", filter.format);
  if (filter.topic) p.set("topic", filter.topic);
  if (filter.q) p.set("q", filter.q);
  if (filter.page && filter.page > 1) p.set("page", String(filter.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}
