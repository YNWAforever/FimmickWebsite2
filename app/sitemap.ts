import type { MetadataRoute } from "next";
import { publicPages } from "@/lib/pages";
import { localeUrl } from "@/lib/seo";
import { localeMeta } from "@/lib/i18n";

/** Canonical public pages only, with locale alternates and real modification dates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const page of publicPages()) {
    const languages: Record<string, string> = Object.fromEntries(page.locales.map((l) => [localeMeta[l].hreflang, localeUrl(l, page.path)]));
    // The English page is the default for other languages, as in each page’s own hreflang set.
    if (page.locales.includes("en")) languages["x-default"] = localeUrl("en", page.path);
    for (const locale of page.locales) {
      entries.push({ url: localeUrl(locale, page.path), lastModified: page.lastModified, alternates: { languages } });
    }
  }
  return entries;
}
