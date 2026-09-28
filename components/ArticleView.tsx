import Link from "next/link";
import { href, formatDate, localeMeta, type LegacyLocale, type Locale } from "@/lib/i18n";
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
          {list.length} {en ? "articles" : hans ? "篇文章" : "篇文章"} · {en ? "Page" : "頁"} {current} / {pages}
        </span>
      </div>
      <div className="related-grid">
        {items.map((a) => {
          const meta = a.locales[locale] ?? a.locales.en!;
          const own = Boolean(a.locales[locale]);
          return (
            <Link key={a.slug} className="card card--link" href={`/${locale}/knowledge-hub/${a.slug}`}>
              <span className="card-meta">
                <span className="chip">{meta.section ?? (en ? "Article" : "文章")}</span>
                {formatDate(a.published, locale)}
                {!own ? <span>· {hans ? "英文原文" : "英文原文"}</span> : null}
              </span>
              <h3 lang={meta.contentLanguage === "en" ? "en" : undefined}>{meta.title}</h3>
              <p className="small muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{meta.summary}</p>
            </Link>
          );
        })}
      </div>
      {pages > 1 ? (
        <nav className="pagination" aria-label={en ? "Pagination" : "分頁"}>
          {current > 1 ? <Link className="btn btn--ghost btn--small" href={pageHref(current - 1)} rel="prev">← {en ? "Previous" : hans ? "上一页" : "上一頁"}</Link> : null}
          <span className="small muted">{current} / {pages}</span>
          {current < pages ? <Link className="btn btn--ghost btn--small" href={pageHref(current + 1)} rel="next">{en ? "Next" : hans ? "下一页" : "下一頁"} →</Link> : null}
        </nav>
      ) : null}
      <p className="micro muted" style={{ marginTop: 24 }}>
        {shellLocale === "en" ? "Search and filter all formats in the " : "可於"}
        <Link href={href(shellLocale, "/resources?format=article")}>{shellLocale === "en" ? "Resource Centre" : "資源中心"}</Link>
        {shellLocale === "en" ? "." : "搜尋及篩選所有類型。"}
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
  const lk = en ? "en" : "zh";
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
          <Crumbs locale={shellLocale} items={[{ label: en ? "Resources" : "資源中心", path: "/resources" }, { label: en ? "Knowledge Hub" : hans ? "知识库" : "知識庫", path: "/knowledge-hub" }, { label: meta.title }]} />
          <div className="detail-grid">
            <div>
              <div className="archive-banner" role="note">
                <strong>{en ? "Archive article" : hans ? "文章存档" : "文章存檔"}</strong>
                <span>
                  {en
                    ? `Originally published ${formatDate(entry.published, "en")}. It reflects FIMMICK's positioning at that time and has not been rewritten; some terms, figures and links may be out of date.`
                    : hans
                      ? `原于 ${formatDate(entry.published, "zh-hans")} 发布，反映 FIMMICK 当时的定位，内容未经改写；部分用语、数字及链接可能已过时。`
                      : `原於 ${formatDate(entry.published, "zh-hant")} 發布，反映 FIMMICK 當時的定位，內容未經改寫；部分用語、數字及連結可能已過時。`}
                </span>
                {fallback ? <span>{en ? "" : hans ? "此文章没有简体中文版本，以下以原文显示。" : "此文章沒有繁體中文版本，以下以原文（英文）顯示。"}</span> : null}
              </div>
              <h1 lang={contentLang} style={{ fontSize: "clamp(1.9rem, 1.4rem + 2vw, 3rem)", maxWidth: "24ch" }}>{meta.title}</h1>
              {meta.summary ? <p className="lead" lang={contentLang} style={{ marginTop: 16 }}>{meta.summary}</p> : null}
              <p className="meta-row">
                <span>{en ? "Published" : hans ? "发布日期" : "發布日期"}: {formatDate(entry.published, locale)}</span>
                {entry.modified && entry.modified !== entry.published ? <span>{en ? "Updated" : hans ? "更新日期" : "更新日期"}: {formatDate(entry.modified, locale)}</span> : null}
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
                <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "Where this fits today" : hans ? "现时相关内容" : "現時相關內容"}</h2>
                {topic ? <p className="small muted" style={{ marginBottom: 10 }}>{topic.name[lk]}</p> : null}
                <ul className="stack small" style={{ listStyle: "none", ["--stack" as string]: "8px" }}>
                  {rel.solution ? <li><Link href={href(shellLocale, paths.solution(rel.solution))}>{solutionById(rel.solution).name[lk]} →</Link></li> : null}
                  {rel.service ? <li><Link href={href(shellLocale, paths.service(rel.service))}>{serviceById(rel.service).name[lk]} →</Link></li> : null}
                  {rel.workstream ? <li><Link href={href(shellLocale, paths.workstream(rel.workstream))}>{workstreamById(rel.workstream).name[lk]} →</Link></li> : null}
                  <li><Link href={href(shellLocale, "/resources")}>{en ? "Resource Centre" : hans ? "资源中心" : "資源中心"} →</Link></li>
                </ul>
              </div>
              {others.length ? (
                <div className="io-card">
                  <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "Also available in" : hans ? "其他语言" : "其他語言"}</h2>
                  <ul className="stack small" style={{ listStyle: "none", ["--stack" as string]: "6px" }}>
                    {others.map((l) => (
                      <li key={l}>
                        <a href={`/${l}/knowledge-hub/${slug}`} hrefLang={localeMeta[l].hreflang} lang={localeMeta[l].htmlLang}>{localeMeta[l].label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Link className="btn btn--accent" href={href(shellLocale, "/contact?intent=general")}>{en ? "Talk to FIMMICK" : hans ? "联系 FIMMICK" : "聯絡 FIMMICK"}</Link>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
