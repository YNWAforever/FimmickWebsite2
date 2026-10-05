import type { Metadata } from "next";
import Link from "next/link";
import { href, locales, t, zh, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { knowledgePageCount } from "@/lib/resources";
import { PageHero } from "@/components/ui";
import { ArticleList } from "@/components/ArticleView";
import { knowledgeCategories } from "./categories";

/**
 * The Knowledge Hub listing, shared by the hub (page 1) and its static pages `/knowledge-hub/page/<n>`
 * (award pass 2, 8.2.1: no searchParams, so every page is prerendered).
 */
const copy = {
  title: { en: "Knowledge Hub", zh: "知識庫" },
  lead: { en: "FIMMICK’s article archive since 2015 — kept at its original addresses, with original dates and language. Newer guides and the product explainer are in the Resource Centre.", zh: "FIMMICK 自 2015 年起的文章存檔，保留原有網址、日期及語言。較新的指南及產品示範影片見資源中心。" },
};

const pagePath = (page: number) => (page === 1 ? "/knowledge-hub" : `/knowledge-hub/page/${page}`);

/** Each page is its own canonical; alternates list the locales that have that many pages. */
export function knowledgeHubMetadata(locale: Locale, page: number): Metadata {
  const title = t(copy.title, locale);
  return pageMetadata({
    locale,
    path: pagePath(page),
    title: page === 1 ? title : locale === "en" ? `${title}, page ${page}` : `${title}｜${zh(`第 ${page} 頁`, locale)}`,
    description: t(copy.lead, locale),
    alternates: locales.filter((l) => knowledgePageCount(l) >= page),
  });
}

export function KnowledgeHubView({ locale, page }: { locale: Locale; page: number }) {
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: locale === "en" ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: t(copy.title, locale) }]} eyebrow={locale === "en" ? "Insights & articles" : zh("洞察與文章", locale)} title={t(copy.title, locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <nav className="filter-bar" aria-label={locale === "en" ? "Categories" : zh("分類", locale)}>
            <div className="filter-group">
              <span className="filter-label">{locale === "en" ? "Category" : zh("分類", locale)}</span>
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
