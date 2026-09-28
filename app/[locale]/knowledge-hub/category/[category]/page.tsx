import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, href, locales } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { articleIndex } from "@/lib/resources";
import { PageHero } from "@/components/ui";
import { knowledgeCategories } from "../../categories";

type Props = { params: Promise<{ locale: string; category: string }> };

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
  return pageMetadata({ locale, path: `/knowledge-hub/category/${encodeURIComponent(c.slug)}`, title: `${c.slug} — Knowledge Hub`, description: `FIMMICK Knowledge Hub archive: ${c.slug}.` });
}

export default async function CategoryPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const c = find((await params).category);
  if (!c) notFound();
  const en = locale === "en";
  const items = articleIndex.filter((a) => a.locales.en?.section && c.sections.includes(a.locales.en.section) && (a.locales[locale] || a.locales.en));
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Knowledge Hub" : "知識庫", path: "/knowledge-hub" }, { label: c.slug }]}
        eyebrow={en ? "Knowledge Hub category" : "知識庫分類"}
        title={c.slug}
        lead={c.consolidated ? (en ? `This category now combines: ${c.sections.join(", ")}.` : `此分類現合併：${c.sections.join("、")}。`) : en ? `${items.length} archived articles.` : `共 ${items.length} 篇存檔文章。`}
      />
      <section className="section">
        <div className="container">
          <div className="related-grid">
            {items.map((a) => (
              <Link key={a.slug} className="card card--link" href={href(locale, `/knowledge-hub/${a.slug}`)}>
                <span className="card-meta">{formatDate(a.published, locale)}{a.locales[locale] ? null : <span>· {en ? "English" : "英文原文"}</span>}</span>
                <h3>{(a.locales[locale] ?? a.locales.en)!.title}</h3>
                <p className="small muted">{(a.locales[locale] ?? a.locales.en)!.summary.slice(0, 180)}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 32 }}>
            <Link className="text-link" href={href(locale, "/knowledge-hub")}>← {en ? "All articles" : "全部文章"}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
