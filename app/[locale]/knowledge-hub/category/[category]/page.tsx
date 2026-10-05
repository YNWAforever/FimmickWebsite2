import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, href, locales, zh } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { articleIndex, articleListing, contentLang, hasEnglish } from "@/lib/resources";
import { PageHero } from "@/components/ui";
import { knowledgeCategories } from "../../categories";

type Props = { params: Promise<{ locale: string; category: string }> };

/** Only the 22 known categories (in three locales) exist; the names decode in find(). */
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => knowledgeCategories.map((c) => ({ locale, category: c.slug })));
}

const find = (raw: string) => {
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {}
  return knowledgeCategories.find((c) => c.slug === value);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const c = find((await params).category);
  if (!c) return {};
  const en = locale === "en";
  return pageMetadata({
    locale,
    path: `/knowledge-hub/category/${encodeURIComponent(c.slug)}`,
    title: en ? `${c.slug} — Knowledge Hub` : `${c.slug}｜${zh("知識庫", locale)}`,
    description: en ? `FIMMICK Knowledge Hub archive: ${c.slug}.` : zh(`FIMMICK 知識庫存檔：${c.slug}。`, locale),
  });
}

export default async function CategoryPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const c = find((await params).category);
  if (!c) notFound();
  const en = locale === "en";
  // English pages list only genuinely English articles; the Chinese ones live under zh-hant (8.1.1).
  const items = articleIndex.filter((a) => a.locales.en?.section && c.sections.includes(a.locales.en.section) && (locale === "en" ? hasEnglish(a) : a.locales[locale] || a.locales.en));
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Knowledge Hub" : zh("知識庫", locale), path: "/knowledge-hub" }, { label: c.slug }]}
        eyebrow={en ? "Knowledge Hub category" : zh("知識庫分類", locale)}
        title={c.slug}
        lead={c.consolidated ? (en ? `This category now combines: ${c.sections.join(", ")}.` : zh(`此分類現合併：${c.sections.join("、")}。`, locale)) : en ? `${items.length} archived articles.` : zh(`共 ${items.length} 篇存檔文章。`, locale)}
      />
      <section className="section">
        <div className="container">
          <div className="related-grid">
            {items.map((a) => {
              // The record the article page shows, marked with its language when it is not the page’s (8.3).
              const { meta, own } = articleListing(a, locale);
              const lang = contentLang(meta.contentLanguage, locale);
              return (
                <Link key={a.slug} className="card card--link" href={href(locale, `/knowledge-hub/${a.slug}`)}>
                  <span className="card-meta">{formatDate(a.published, locale)}{own ? null : <span>· {meta.contentLanguage === "en" ? (en ? "English" : zh("英文原文", locale)) : zh("原文", locale)}</span>}</span>
                  {/* Card titles sit directly under the h1 (a listing page). */}
                  <h2 lang={lang}>{meta.title}</h2>
                  <p className="small muted" lang={lang}>{meta.summary.slice(0, 180)}</p>
                </Link>
              );
            })}
          </div>
          <p style={{ marginTop: 32 }}>
            <Link className="text-link" href={href(locale, "/knowledge-hub")}>← {en ? "All articles" : zh("全部文章", locale)}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
