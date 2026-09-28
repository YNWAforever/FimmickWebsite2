import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { articleIndex } from "@/lib/resources";
import { ArticleView, articleSource } from "@/components/ArticleView";
import type { LegacyLocale } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

/** Simplified Chinese archive: only articles that exist in Simplified Chinese. */
export const dynamicParams = false;
export function generateStaticParams() {
  return articleIndex.filter((a) => a.locales["zh-hans"]).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = articleSource((await params).slug, "zh-hans");
  if (!found || found.fallback) return {};
  const { entry, meta } = found;
  return pageMetadata({
    locale: "zh-hans",
    path: `/knowledge-hub/${entry.slug}`,
    title: meta.title,
    description: meta.summary.slice(0, 300),
    type: "article",
    alternates: (["en", "zh-hant", "zh-hans"] as LegacyLocale[]).filter((l) => entry.locales[l]),
    publishedTime: entry.published,
    modifiedTime: entry.modified,
  });
}

export default async function SimplifiedArticlePage({ params }: Props) {
  const { slug } = await params;
  const found = articleSource(slug, "zh-hans");
  if (!found || found.fallback) notFound();
  return <ArticleView slug={slug} locale="zh-hans" shellLocale="zh-hant" />;
}
