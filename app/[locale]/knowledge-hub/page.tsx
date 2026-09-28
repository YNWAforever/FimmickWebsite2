import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import { ArticleList } from "@/components/ArticleView";
import { knowledgeCategories } from "./categories";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> };

const copy = {
  title: { en: "Knowledge Hub", zh: "知識庫" },
  lead: { en: "FIMMICK's article archive since 2015 — kept at its original addresses, with original dates and language. Newer guides and the product explainer are in the Resource Centre.", zh: "FIMMICK 自 2015 年起的文章存檔，保留原有網址、日期及語言。較新的指南及產品示範影片見資源中心。" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/knowledge-hub", title: t(copy.title, locale), description: t(copy.lead, locale), alternates: ["en", "zh-hant", "zh-hans"] });
}

export default async function KnowledgeHubPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const page = Number.parseInt((await searchParams).page || "1", 10) || 1;
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: locale === "en" ? "Resources" : "資源中心", path: "/resources" }, { label: t(copy.title, locale) }]} eyebrow={locale === "en" ? "Insights & articles" : "洞察與文章"} title={t(copy.title, locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <nav className="filter-bar" aria-label={locale === "en" ? "Categories" : "分類"}>
            <div className="filter-group">
              <span className="filter-label">{locale === "en" ? "Category" : "分類"}</span>
              {knowledgeCategories.map((c) => (
                <Link key={c.slug} className="filter-pill" href={href(locale, `/knowledge-hub/category/${encodeURIComponent(c.slug)}`)}>
                  {c.slug}
                </Link>
              ))}
            </div>
          </nav>
          <ArticleList locale={locale} shellLocale={locale} page={page} basePath={href(locale, "/knowledge-hub")} />
        </div>
      </section>
    </>
  );
}
