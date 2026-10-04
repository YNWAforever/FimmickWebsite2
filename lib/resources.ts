import articleIndexJson from "@/content/legacy/article-index.json";
import eventsJson from "@/content/legacy/events.json";
import { explainerVideo, guides, workshopResource } from "@/content/resources";
import type { ResourceFormat, ResourceTopic } from "@/content/types";
import { t, type LegacyLocale, type Locale } from "./i18n";

export type ArticleLocaleMeta = {
  title: string;
  summary: string;
  section: string | null;
  readTime: string | null;
  author: string;
  contentLanguage: string;
};
export type ArticleIndexEntry = {
  slug: string;
  topic: ResourceTopic;
  published: string;
  modified: string;
  locales: Partial<Record<LegacyLocale, ArticleLocaleMeta>>;
};
export type Block = { t: "h"; x: string } | { t: "p"; x: string } | { t: "ul"; items: string[] };

export type LegacyEvent = {
  id: string;
  title: string;
  summary: string;
  date: string;
  time: string | null;
  venue: string | null;
  language: string | null;
  format: string | null;
  body: string;
  sourceUrl: string;
};

export const articleIndex = articleIndexJson as ArticleIndexEntry[];
export const legacyEvents = eventsJson as LegacyEvent[];

/** The site relaunch: Knowledge Hub articles published before it carry the "Archive article" note. */
export const RELAUNCH_DATE = "2026-01-01";
export const isArchiveArticle = (published: string) => published < RELAUNCH_DATE;

/** Parse the legacy display date ("3 September 2025 (WED)") to ISO for sorting. */
/**
 * Whether an article has a genuine English version. Some "en" records hold Chinese text
 * (contentLanguage "zh-hant"); those articles live under zh-hant only (award pass 2, 8.1.1).
 */
export const hasEnglish = (a: ArticleIndexEntry) => a.locales.en?.contentLanguage === "en";

/** The locales an article has its own page in. */
export const articleLocales = (a: ArticleIndexEntry): LegacyLocale[] =>
  (["en", "zh-hant", "zh-hans"] as LegacyLocale[]).filter((l) => (l === "en" ? hasEnglish(a) : Boolean(a.locales[l])));

export function eventIsoDate(display: string): string {
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const match = display.toLowerCase().match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
  if (!match) {
    const year = display.match(/(\d{4})/);
    return year ? `${year[1]}-01-01` : "1970-01-01";
  }
  const month = months.indexOf(match[2]) + 1;
  return `${match[3]}-${String(month).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

/** Start and end in Hong Kong time (+08:00) from the display date and a time such as "3:00 – 4:30PM". */
export function eventTimes(e: LegacyEvent): { start: string; end: string } {
  const date = eventIsoDate(e.date);
  const [from, to] = (e.time ?? "").split(/[–-]/).map((part) => part.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]m)?$/i));
  if (!from || !to) return { start: `${date}T00:00:00+08:00`, end: `${date}T23:59:00+08:00` };
  // "3:00 – 4:30PM": the start takes the end's AM/PM when it has none.
  const clock = (m: RegExpMatchArray, meridiem?: string) => {
    const pm = (m[3] ?? meridiem ?? "").toLowerCase() === "pm";
    return `${String((Number(m[1]) % 12) + (pm ? 12 : 0)).padStart(2, "0")}:${m[2] ?? "00"}:00`;
  };
  return { start: `${date}T${clock(from, to[3])}+08:00`, end: `${date}T${clock(to)}+08:00` };
}

const eventTopic = (e: LegacyEvent): ResourceTopic => {
  const t = `${e.title} ${e.summary}`.toLowerCase();
  if (/\bai\b|chatgpt|agent/.test(t)) return "ai-transformation";
  if (/e-commerce|ecommerce|retail|cross-border|shopline/.test(t)) return "commerce";
  if (/influencer|kol|creator|reels|social/.test(t)) return "creators-community";
  if (/crm|loyalty|data|cdp/.test(t)) return "data-intelligence";
  if (/graduate|career|d-day/.test(t)) return "company-news";
  return "marketing-channels";
};

export type ResourceItem = {
  id: string;
  format: ResourceFormat;
  topic: ResourceTopic;
  title: string;
  summary: string;
  date: string;
  /** Language the destination content is written in. */
  contentLanguage: "en" | "zh-hant" | "zh-hans" | "bilingual";
  href: string;
  status?: "past" | "on-request";
};

let cache: Partial<Record<Locale, ResourceItem[]>> = {};

export function allResources(locale: Locale): ResourceItem[] {
  if (cache[locale]) return cache[locale]!;
  const items: ResourceItem[] = [];
  for (const guide of guides) {
    items.push({ id: `guide:${guide.slug}`, format: "guide", topic: guide.topic, title: t(guide.title, locale), summary: t(guide.summary, locale), date: guide.published, contentLanguage: "bilingual", href: `/resources/guides#${guide.slug}` });
  }
  items.push({ id: `video:${explainerVideo.slug}`, format: "video", topic: explainerVideo.topic, title: t(explainerVideo.title, locale), summary: t(explainerVideo.summary, locale), date: explainerVideo.published, contentLanguage: "bilingual", href: "/resources/videos" });
  items.push({ id: "workshop", format: "workshop", topic: workshopResource.topic, title: t(workshopResource.title, locale), summary: t(workshopResource.summary, locale), date: "", contentLanguage: "bilingual", href: "/workshop", status: "on-request" });
  // The legacy events exist in English only, so the Chinese listings leave them out (8.1.6).
  for (const event of locale === "en" ? legacyEvents : []) {
    items.push({ id: `event:${event.id}`, format: "event", topic: eventTopic(event), title: event.title, summary: event.summary, date: eventIsoDate(event.date), contentLanguage: "en", href: `/events/${event.id}`, status: "past" });
  }
  for (const article of articleIndex) {
    if (locale === "en" && !hasEnglish(article)) continue;
    const meta = article.locales[locale] ?? article.locales.en;
    if (!meta) continue;
    const lang = (article.locales[locale] ? meta.contentLanguage : "en") as ResourceItem["contentLanguage"];
    items.push({ id: `article:${article.slug}`, format: "article", topic: article.topic, title: meta.title, summary: meta.summary, date: article.published, contentLanguage: lang, href: `/knowledge-hub/${article.slug}` });
  }
  const sorted = items.sort((a, b) => (b.date || "9999").localeCompare(a.date || "9999"));
  cache = { ...cache, [locale]: sorted };
  return sorted;
}

export type ResourceFilter = { format?: ResourceFormat; topic?: ResourceTopic; q?: string; page?: number };
export const PAGE_SIZE = 12;

export function filterResources(locale: Locale, filter: ResourceFilter) {
  const q = (filter.q || "").trim().toLowerCase().slice(0, 80);
  const all = allResources(locale);
  const matches = (item: ResourceItem, ignore?: "format" | "topic") =>
    (ignore === "format" || !filter.format || item.format === filter.format) &&
    (ignore === "topic" || !filter.topic || item.topic === filter.topic) &&
    (!q || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q));
  const matched = all.filter((item) => matches(item));
  const pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, filter.page || 1), pages);
  const count = (ignore: "format" | "topic", key: keyof ResourceItem, value: string) => all.filter((i) => matches(i, ignore) && i[key] === value).length;
  return {
    total: matched.length,
    page,
    pages,
    items: matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    formatCount: (format: ResourceFormat) => count("format", "format", format),
    topicCount: (topic: ResourceTopic) => count("topic", "topic", topic),
  };
}

/** Load article body blocks for a locale (server only). */
export async function getArticleBlocks(locale: LegacyLocale, slug: string): Promise<Block[] | null> {
  const data =
    locale === "en"
      ? (await import("@/content/legacy/articles-en.json")).default
      : locale === "zh-hant"
        ? (await import("@/content/legacy/articles-zh-hant.json")).default
        : (await import("@/content/legacy/articles-zh-hans.json")).default;
  return ((data as unknown as Record<string, Block[]>)[slug] ?? null) as Block[] | null;
}

export const articleBySlug = (slug: string) => articleIndex.find((a) => a.slug === slug);
export const eventById = (id: string) => legacyEvents.find((e) => e.id === id);
