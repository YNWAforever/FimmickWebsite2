import type { Metadata } from "next";
import "@/app/styles/article.css";
import { notFound } from "next/navigation";
import { resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { articleIndex, articleLocales, hasEnglish } from "@/lib/resources";
import { ArticleView, articleSource } from "@/components/ArticleView";

/**
 * Preserved production article URLs. EN and zh-HK cover every article in
 * either language; zh-Hans covers every article so the language switch never
 * 404s — native Simplified articles render as themselves, others fall back to
 * the original language with a canonical to that version.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  // /en only for genuine English articles; Chinese "en" records redirect to zh-hant (next.config.ts).
  return [
    ...articleIndex.filter(hasEnglish).map((a) => ({ locale: "en", slug: a.slug })),
    ...articleIndex.filter((a) => hasEnglish(a) || a.locales["zh-hant"]).map((a) => ({ locale: "zh-hant", slug: a.slug })),
    ...articleIndex.map((a) => ({ locale: "zh-hans", slug: a.slug })),
  ];
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const found = articleSource((await params).slug, locale);
  if (!found) return {};
  const { entry, meta, fallback, source } = found;
  const available = articleLocales(entry);
  const base = pageMetadata({
    locale: fallback ? source : locale,
    path: `/knowledge-hub/${entry.slug}`,
    title: meta.title,
    description: meta.summary.slice(0, 300),
    type: "article",
    alternates: available,
    generatedImage: true,
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
