import { solutions } from "@/content/solutions";
import { products } from "@/content/products";
import { workstreams } from "@/content/transformation";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { cases } from "@/content/cases";
import { members } from "@/content/ecosystem";
import { aboutPages } from "@/content/company";
import { businessFunctions } from "@/content/functions";
import { capabilities } from "@/content/platform-pages";
import { articleIndex, legacyEvents } from "./resources";
import type { LegacyLocale } from "./i18n";

/** Release date of the rebuilt pages (genuine modification date for sitemaps). */
export const REBUILD_DATE = "2026-09-28";

export type PublicPage = { path: string; lastModified: string; locales: LegacyLocale[]; kind: string };

/** Every canonical public page, locale-neutral. Used by the sitemap and tests. */
export function publicPages(): PublicPage[] {
  const all: LegacyLocale[] = ["en", "zh-hant", "zh-hans"];
  const page = (path: string, kind: string, lastModified = REBUILD_DATE, locales = all): PublicPage => ({ path, kind, lastModified, locales });
  const list: PublicPage[] = [
    page("/", "home"),
    page("/solutions", "hub"),
    ...solutions.map((s) => page(`/solutions/${s.id}`, "solution")),
    page("/products", "hub"),
    ...products.map((p) => page(`/products/${p.id}`, "product")),
    page("/platform", "platform"),
    page("/platform/integrations", "platform"),
    page("/platform/governance", "platform"),
    page("/platform/architecture", "platform"),
    page("/platform/agents", "platform"),
    page("/platform/marketplace", "platform"),
    page("/platform/pricing", "platform"),
    ...capabilities.map((c) => page(`/platform/${c.id}`, "capability")),
    page("/functions", "hub"),
    ...businessFunctions.map((f) => page(`/functions/${f.id}`, "function")),
    page("/ai-transformation", "hub"),
    ...workstreams.map((w) => page(`/ai-transformation/${w.id}`, "workstream")),
    page("/services", "hub"),
    page("/growth", "hub"),
    ...services.filter((s) => !s.canonicalPath).map((s) => page(`/services/${s.id}`, "service")),
    page("/industries", "hub"),
    ...industries.map((i) => page(`/industries/${i.id}`, "industry")),
    page("/case-studies", "hub"),
    ...cases.map((c) => page(`/case-studies/${c.slug}`, "case")),
    page("/cases-and-demos", "hub"),
    page("/resources", "hub"),
    page("/insights", "resource"),
    page("/resources/guides", "resource"),
    page("/resources/videos", "resource"),
    page("/knowledge-hub", "hub"),
    page("/events", "hub"),
    page("/workshop", "resource"),
    page("/fimmick-ecosystem", "hub"),
    ...members.map((m) => page(`/fimmick-ecosystem/${m.id}`, "member")),
    page("/about", "hub"),
    ...aboutPages.map((a) => page(`/about/${a}`, "about")),
    page("/how-to-start", "conversion"),
    page("/contact", "conversion"),
    page("/privacy", "legal", "2026-05-01"),
    page("/terms", "legal", "2026-05-01"),
    page("/cookies", "legal", "2026-05-01"),
  ];
  for (const article of articleIndex) {
    const locales = (["en", "zh-hant", "zh-hans"] as LegacyLocale[]).filter((l) => article.locales[l]);
    list.push({ path: `/knowledge-hub/${article.slug}`, kind: "article", lastModified: article.modified || article.published, locales });
  }
  for (const event of legacyEvents) list.push(page(`/events/${event.id}`, "event"));
  return list;
}
