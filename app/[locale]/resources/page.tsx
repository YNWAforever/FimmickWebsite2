import type { Metadata } from "next";
import Link from "next/link";
import { href, t, formatDate , zh, type Locale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { filterResources } from "@/lib/resources";
import { resourceFormats, resourceTopics } from "@/content/resources";
import { ui } from "@/content/ui";
import type { ResourceFormat, ResourceTopic } from "@/content/types";
import { PageHero } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ format?: string; topic?: string; q?: string; page?: string }> };

const copy = {
  title: { en: "Resource Centre", zh: "資源中心" },
  lead: { en: "Articles, guides, the product explainer, events and workshops — searchable and filterable. Older articles are kept with their original dates and language.", zh: "文章、指南、產品示範影片、活動及工作坊，均可搜尋及篩選。較舊的文章保留原有日期及語言。" },
};

const langLabel = (lang: string, locale: Locale) => {
  const en = locale === "en";
  return ({ en: en ? "English" : zh("英文", locale), "zh-hant": en ? "Traditional Chinese" : "繁體中文", "zh-hans": en ? "Simplified Chinese" : zh("簡體中文", locale), bilingual: en ? "English · 繁中" : zh("英文・繁中", locale) } as Record<string, string>)[lang] ?? lang;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/resources", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function ResourcesPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const sp = await searchParams;
  const format = resourceFormats.some((f) => f.id === sp.format) ? (sp.format as ResourceFormat) : undefined;
  const topic = resourceTopics.some((f) => f.id === sp.topic) ? (sp.topic as ResourceTopic) : undefined;
  const q = (sp.q || "").slice(0, 80);
  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1);
  const result = filterResources(locale, { format, topic, q, page });
  const base = href(locale, "/resources");
  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const next: Record<string, string | undefined> = { format, topic, q: q || undefined, ...patch };
    Object.entries(next).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  const filtered = Boolean(format || topic || q);
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "Learn, inspect and download." : zh("學習、查看及下載。", locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <form className="search-form" action={base} method="get" role="search" style={{ marginBottom: 24 }}>
            {format ? <input type="hidden" name="format" value={format} /> : null}
            {topic ? <input type="hidden" name="topic" value={topic} /> : null}
            <label className="sr-only" htmlFor="resource-q">{t(ui.search, locale)}</label>
            <input id="resource-q" type="search" name="q" defaultValue={q} placeholder={en ? "Search titles and summaries" : zh("搜尋標題及摘要", locale)} maxLength={80} />
            <button className="btn" type="submit">{t(ui.search, locale)}</button>
          </form>
          <nav className="filter-bar" aria-label={en ? "Filter resources" : zh("篩選資源", locale)}>
            <div className="filter-group">
              <span className="filter-label">{en ? "Format" : zh("類型", locale)}</span>
              <Link className="filter-pill" href={link({ format: undefined, page: undefined })} aria-current={!format ? "true" : undefined} scroll={false}>{t(ui.all, locale)}</Link>
              {resourceFormats.map((f) => {
                const n = result.formatCount(f.id);
                return n ? (
                  <Link key={f.id} className="filter-pill" href={link({ format: f.id, page: undefined })} aria-current={format === f.id ? "true" : undefined} scroll={false}>
                    {t(f.plural, locale)} <span className="count">{n}</span>
                  </Link>
                ) : null;
              })}
            </div>
            <div className="filter-group">
              <span className="filter-label">{en ? "Topic" : zh("主題", locale)}</span>
              <Link className="filter-pill" href={link({ topic: undefined, page: undefined })} aria-current={!topic ? "true" : undefined} scroll={false}>{t(ui.all, locale)}</Link>
              {resourceTopics.map((tp) => {
                const n = result.topicCount(tp.id);
                return n ? (
                  <Link key={tp.id} className="filter-pill" href={link({ topic: tp.id, page: undefined })} aria-current={topic === tp.id ? "true" : undefined} scroll={false}>
                    {t(tp.name, locale)} <span className="count">{n}</span>
                  </Link>
                ) : null;
              })}
            </div>
          </nav>
          <div className="result-meta" role="status">
            <span>
              {result.total} {t(ui.results, locale)}
              {result.pages > 1 ? ` · ${t(ui.page, locale)} ${result.page} / ${result.pages}` : ""}
            </span>
            {filtered ? <Link href={base} scroll={false}>{t(ui.clearFilters, locale)}</Link> : null}
          </div>
          {result.items.length ? (
            <div className="related-grid">
              {result.items.map((item) => {
                const fmt = resourceFormats.find((f) => f.id === item.format)!;
                return (
                  <Link key={item.id} className="card card--link" href={href(locale, item.href)}>
                    <span className="card-meta">
                      <span className={item.format === "article" ? "chip" : item.format === "guide" ? "chip chip--lime" : item.format === "video" ? "chip chip--magenta" : "chip chip--sky"}>{t(fmt.name, locale)}</span>
                      {item.date ? formatDate(item.date, locale) : en ? "On request" : zh("按需安排", locale)}
                      {item.status === "past" ? <span>· {en ? "Past event" : zh("已舉行", locale)}</span> : null}
                    </span>
                    <h3>{item.title}</h3>
                    <p className="small muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.summary}</p>
                    <span className="micro muted">{t(ui.originalLanguage, locale)}: {langLabel(item.contentLanguage, locale)}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">
              {t(ui.noResults, locale)} <Link href={base}>{t(ui.clearFilters, locale)}</Link>
            </p>
          )}
          {result.pages > 1 ? (
            <nav className="pagination" aria-label={en ? "Pagination" : zh("分頁", locale)}>
              {result.page > 1 ? <Link className="btn btn--ghost btn--small" href={link({ page: String(result.page - 1) })} rel="prev">← {t(ui.previous, locale)}</Link> : null}
              <span className="small muted">{t(ui.page, locale)} {result.page} / {result.pages}</span>
              {result.page < result.pages ? <Link className="btn btn--ghost btn--small" href={link({ page: String(result.page + 1) })} rel="next">{t(ui.next, locale)} →</Link> : null}
            </nav>
          ) : null}
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Want to talk it through?" : zh("想進一步傾談？", locale)} primary={{ label: en ? "Contact FIMMICK" : zh("聯絡 FIMMICK", locale), to: "/contact?intent=general" }} secondary={{ label: en ? "Leadership workshop" : zh("管理層工作坊", locale), to: "/workshop" }} />
    </>
  );
}
