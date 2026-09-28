import type { MetadataRoute } from "next";
import { publicPages } from "@/lib/pages";
import { localeUrl } from "@/lib/seo";
import { localeMeta } from "@/lib/i18n";

/** Canonical public pages only, with locale alternates and real modification dates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const page of publicPages()) {
    const languages = Object.fromEntries(page.locales.map((l) => [localeMeta[l].hreflang, localeUrl(l, page.path)]));
    for (const locale of page.locales) {
      entries.push({ url: localeUrl(locale, page.path), lastModified: page.lastModified, alternates: { languages } });
    }
  }
  return entries;
}
