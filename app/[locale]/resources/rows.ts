import { formatDate, href, zh, type Locale } from "@/lib/i18n";
import { allResources, contentLang } from "@/lib/resources";
import type { ResourceRow } from "@/lib/resource-filter";

const langLabel = (lang: string, locale: Locale) => {
  const en = locale === "en";
  return ({ en: en ? "English" : zh("英文", locale), "zh-hant": en ? "Traditional Chinese" : "繁體中文", "zh-hans": en ? "Simplified Chinese" : zh("簡體中文", locale), bilingual: en ? "English · 繁中" : zh("英文·繁中", locale) } as Record<string, string>)[lang] ?? lang;
};

/** Every Resource Centre entry for a locale, with display labels resolved (shared by the page and items.json). */
export function resourceRows(locale: Locale): ResourceRow[] {
  return allResources(locale).map((item) => ({
    id: item.id,
    format: item.format,
    topic: item.topic,
    title: item.title,
    summary: item.summary,
    date: item.date ? formatDate(item.date, locale) : locale === "en" ? "On request" : zh("按需安排", locale),
    lang: langLabel(item.contentLanguage, locale),
    href: href(locale, item.href),
    past: item.status === "past",
    tag: contentLang(item.contentLanguage, locale),
  }));
}
