import Link from "next/link";
import { href, formatDate, localeMeta, t, zh, type LegacyLocale, type Locale } from "@/lib/i18n";
import { articleBySlug, articleIndex, getArticleBlocks } from "@/lib/resources";
import { resolveLegacyHref } from "@/lib/redirects";
import { canonicalOrigin } from "@/lib/env";
import { localeUrl } from "@/lib/seo";
import { resourceTopics, topicRelations } from "@/content/resources";
import { solutionById } from "@/content/solutions";
import { serviceById } from "@/content/services";
import { workstreamById } from "@/content/transformation";
import { paths } from "@/lib/routes";
import { Crumbs, RichText } from "./ui";
import { JsonLd } from "./JsonLd";

/** Paginated archive list used by the Knowledge Hub and its category pages. */
export function ArticleList({ locale, shellLocale, page, category, basePath }: { locale: LegacyLocale; shellLocale: Locale; page: number; category?: string; basePath: string }) {
  const PAGE = 18;
  const en = locale === "en";
  const hans = locale === "zh-hans";
  const list = articleIndex.filter((a) => (locale === "zh-hans" ? a.locales["zh-hans"] : a.locales[locale] || a.locales.en) && (!category || a.locales.en?.section === category));
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const current = Math.min(Math.max(1, page), pages);
  const items = list.slice((current - 1) * PAGE, current * PAGE);
  const pageHref = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`);
  return (
    <>
      <div className="result-meta" role="status">
        <span>
          {list.length} {en ? "articles" : hans ? zh("篇文章", locale) : zh("篇文章", locale)} · {en ? "Page" : zh("頁", locale)} {current} / {pages}
        </span>
      </div>
      <div className="related-grid">
        {items.map((a) => {
          const meta = a.locales[locale] ?? a.locales.en!;
          const own = Boolean(a.locales[locale]);
          return (
            <Link key={a.slug} className="card card--link" href={`/${locale}/knowledge-hub/${a.slug}`}>
              <span className="card-meta">
                <span className="chip">{meta.section ?? (en ? "Article" : zh("文章", locale))}</span>
                {formatDate(a.published, locale)}
                {!own ? <span>· {hans ? zh("英文原文", locale) : zh("英文原文", locale)}</span> : null}
              </span>
              <h3 lang={meta.contentLanguage === "en" ? "en" : undefined}>{meta.title}</h3>
              <p className="small muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{meta.summary}</p>
            </Link>
          );
        })}
      </div>
      {pages > 1 ? (
        <nav className="pagination" aria-label={en ? "Pagination" : zh("分頁", locale)}>
          {current > 1 ? <Link className="btn btn--ghost btn--small" href={pageHref(current - 1)} rel="prev">← {en ? "Previous" : hans ? zh("上一页", locale) : zh("上一頁", locale)}</Link> : null}
          <span className="small muted">{current} / {pages}</span>
          {current < pages ? <Link className="btn btn--ghost btn--small" href={pageHref(current + 1)} rel="next">{en ? "Next" : hans ? zh("下一页", locale) : zh("下一頁", locale)} →</Link> : null}
        </nav>
      ) : null}
      <p className="micro muted" style={{ marginTop: 24 }}>
        {shellLocale === "en" ? "Search and filter all formats in the " : zh("可於", locale)}
        <Link href={href(shellLocale, "/resources?format=article")}>{shellLocale === "en" ? "Resource Centre" : zh("資源中心", locale)}</Link>
        {shellLocale === "en" ? "." : zh("搜尋及篩選所有類型。", locale)}
      </p>
    </>
  );
}

/** Which locale's body to render and whether it is a fallback. */
export function articleSource(slug: string, locale: LegacyLocale) {
  const entry = articleBySlug(slug);
  if (!entry) return null;
  const own = entry.locales[locale];
  const source: LegacyLocale = own ? locale : entry.locales.en ? "en" : (Object.keys(entry.locales)[0] as LegacyLocale);
  return { entry, source, meta: entry.locales[source]!, fallback: !own };
}

/**
 * Preserved Knowledge Hub article. Shown with its original date, author and
 * language, plus an archive notice; the body is rendered from structured
 * blocks (no source HTML).
 */
export async function ArticleView({ slug, locale, shellLocale }: { slug: string; locale: LegacyLocale; shellLocale: Locale }) {
  const found = articleSource(slug, locale);
  if (!found) return null;
  const { entry, source, meta, fallback } = found;
  const blocks = (await getArticleBlocks(source, slug)) ?? [];
  const en = locale === "en";
  const hans = locale === "zh-hans";
  const resolve = (raw: string) => resolveLegacyHref(raw, locale);
  const topic = resourceTopics.find((tp) => tp.id === entry.topic);
  const rel = topicRelations[entry.topic];
  const others = (["en", "zh-hant", "zh-hans"] as LegacyLocale[]).filter((l) => l !== locale && entry.locales[l]);
  const contentLang = meta.contentLanguage === "en" ? "en" : localeMeta[meta.contentLanguage as LegacyLocale]?.htmlLang ?? "en";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.summary,
          datePublished: entry.published,
          dateModified: entry.modified || entry.published,
          inLanguage: contentLang,
          author: { "@type": "Organization", name: meta.author || "FIMMICK" },
          publisher: { "@type": "Organization", name: "FIMMICK", logo: { "@type": "ImageObject", url: `${canonicalOrigin}/brand/fimmick-logo.png` } },
          mainEntityOfPage: localeUrl(locale, `/knowledge-hub/${slug}`),
        }}
      />
      <article className="section">
        <div className="container">
          <Crumbs locale={shellLocale} items={[{ label: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: en ? "Knowledge Hub" : hans ? zh("知识库", locale) : zh("知識庫", locale), path: "/knowledge-hub" }, { label: meta.title }]} />
          <div className="detail-grid">
            <div>
              <div className="archive-banner" role="note">
                <strong>{en ? "Archive article" : hans ? zh("文章存档", locale) : zh("文章存檔", locale)}</strong>
                <span>
                  {en
                    ? `Originally published ${formatDate(entry.published, "en")}. It reflects FIMMICK's positioning at that time and has not been rewritten; some terms, figures and links may be out of date.`
                    : hans
                      ? zh(`原于 ${formatDate(entry.published, "zh-hans")} 发布，反映 FIMMICK 当时的定位，内容未经改写；部分用语、数字及链接可能已过时。`, locale)
                      : zh(`原於 ${formatDate(entry.published, "zh-hant")} 發布，反映 FIMMICK 當時的定位，內容未經改寫；部分用語、數字及連結可能已過時。`, locale)}
                </span>
                {fallback ? <span>{en ? "" : hans ? zh("此文章没有简体中文版本，以下以原文显示。", locale) : zh("此文章沒有繁體中文版本，以下以原文（英文）顯示。", locale)}</span> : null}
              </div>
              <h1 lang={contentLang} style={{ fontSize: "clamp(1.9rem, 1.4rem + 2vw, 3rem)", maxWidth: "24ch" }}>{meta.title}</h1>
              {meta.summary ? <p className="lead" lang={contentLang} style={{ marginTop: 16 }}>{meta.summary}</p> : null}
              <p className="meta-row">
                <span>{en ? "Published" : hans ? zh("发布日期", locale) : zh("發布日期", locale)}: {formatDate(entry.published, locale)}</span>
                {entry.modified && entry.modified !== entry.published ? <span>{en ? "Updated" : hans ? zh("更新日期", locale) : zh("更新日期", locale)}: {formatDate(entry.modified, locale)}</span> : null}
                {meta.readTime ? <span>{meta.readTime}</span> : null}
                <span>{meta.author}</span>
                {meta.section ? <span className="chip">{meta.section}</span> : null}
              </p>
              <div className="prose" lang={contentLang} style={{ marginTop: 32 }}>
                {blocks.map((b, i) =>
                  b.t === "h" ? (
                    <h2 key={i}>{b.x}</h2>
                  ) : b.t === "ul" ? (
                    <ul key={i}>{b.items.map((it, j) => <li key={j}><RichText text={it} resolveHref={resolve} /></li>)}</ul>
                  ) : (
                    <p key={i}><RichText text={b.x} resolveHref={resolve} /></p>
                  ),
                )}
              </div>
            </div>
            <aside className="detail-aside">
              <div className="io-card">
                <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "Where this fits today" : hans ? zh("现时相关内容", locale) : zh("現時相關內容", locale)}</h2>
                {topic ? <p className="small muted" style={{ marginBottom: 10 }}>{t(topic.name, shellLocale)}</p> : null}
                <ul className="stack small" style={{ listStyle: "none", ["--stack" as string]: "8px" }}>
                  {rel.solution ? <li><Link href={href(shellLocale, paths.solution(rel.solution))}>{t(solutionById(rel.solution).name, shellLocale)} →</Link></li> : null}
                  {rel.service ? <li><Link href={href(shellLocale, paths.service(rel.service))}>{t(serviceById(rel.service).name, shellLocale)} →</Link></li> : null}
                  {rel.workstream ? <li><Link href={href(shellLocale, paths.workstream(rel.workstream))}>{t(workstreamById(rel.workstream).name, shellLocale)} →</Link></li> : null}
                  <li><Link href={href(shellLocale, "/resources")}>{en ? "Resource Centre" : hans ? zh("资源中心", locale) : zh("資源中心", locale)} →</Link></li>
                </ul>
              </div>
              {others.length ? (
                <div className="io-card">
                  <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "Also available in" : hans ? zh("其他语言", locale) : zh("其他語言", locale)}</h2>
                  <ul className="stack small" style={{ listStyle: "none", ["--stack" as string]: "6px" }}>
                    {others.map((l) => (
                      <li key={l}>
                        <a href={`/${l}/knowledge-hub/${slug}`} hrefLang={localeMeta[l].hreflang} lang={localeMeta[l].htmlLang}>{localeMeta[l].label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Link className="btn btn--accent" href={href(shellLocale, "/contact?intent=general")}>{en ? "Talk to FIMMICK" : hans ? zh("联系 FIMMICK", locale) : zh("聯絡 FIMMICK", locale)}</Link>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
