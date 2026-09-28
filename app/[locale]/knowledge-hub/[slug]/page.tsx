import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { articleIndex } from "@/lib/resources";
import { ArticleView, articleSource } from "@/components/ArticleView";
import type { LegacyLocale } from "@/lib/i18n";

/** Preserved production article URLs for every article in either locale. */
export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(articleIndex.filter((a) => a.locales.en || a.locales["zh-hant"]).map((a) => a.slug));
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const found = articleSource((await params).slug, locale);
  if (!found) return {};
  const { entry, meta, fallback, source } = found;
  const available = (["en", "zh-hant", "zh-hans"] as LegacyLocale[]).filter((l) => entry.locales[l]);
  const base = pageMetadata({
    locale: fallback ? source : locale,
    path: `/knowledge-hub/${entry.slug}`,
    title: meta.title,
    description: meta.summary.slice(0, 300),
    type: "article",
    alternates: available,
    publishedTime: entry.published,
    modifiedTime: entry.modified,
  });
  return base;
}

export default async function ArticlePage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  if (!articleSource(slug, locale)) notFound();
  return <ArticleView slug={slug} locale={locale} shellLocale={locale} />;
}
