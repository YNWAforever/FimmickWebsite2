import Link from "next/link";
import { href, formatDate, localeMeta, t, zh, type LegacyLocale, type Locale } from "@/lib/i18n";
import { KNOWLEDGE_PAGE_SIZE, articleBySlug, articleListing, articleLocales, contentLang as langFor, getArticleBlocks, isArchiveArticle, knowledgeArticles, tidyArticleBlocks } from "@/lib/resources";
import { resolveLegacyHref } from "@/lib/redirects";
import { canonicalOrigin } from "@/lib/env";
import { localeUrl, organizationId } from "@/lib/seo";
import { resourceTopics, topicRelations } from "@/content/resources";
import { solutionById } from "@/content/solutions";
import { serviceById } from "@/content/services";
import { workstreamById } from "@/content/transformation";
import { paths } from "@/lib/routes";
import { Crumbs, RichText } from "./ui";
import { JsonLd } from "./JsonLd";

/**
 * Paginated Knowledge Hub list. Page 1 is the hub itself and page n is the static path
 * `<hub>/page/<n>` (award pass 2, 8.2.1).
 */
export function ArticleList({ locale, shellLocale, page, basePath }: { locale: LegacyLocale; shellLocale: Locale; page: number; basePath: string }) {
  const PAGE = KNOWLEDGE_PAGE_SIZE;
  const en = locale === "en";
  const hans = locale === "zh-hans";
  const list = knowledgeArticles(locale);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const current = Math.min(Math.max(1, page), pages);
  const items = list.slice((current - 1) * PAGE, current * PAGE);
  const pageHref = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);
  return (
    <>
      <div className="result-meta" role="status">
        <span>
          {list.length} {en ? "articles" : hans ? zh("篇文章", locale) : zh("篇文章", locale)} · {en ? "Page" : zh("頁", locale)} {current} / {pages}
        </span>
      </div>
      <div className="related-grid">
        {items.map((a) => {
          const { meta, own } = articleListing(a, locale);
          const lang = langFor(meta.contentLanguage, locale);
          return (
            <Link key={a.slug} className="card card--link" href={`/${locale}/knowledge-hub/${a.slug}`}>
              <span className="card-meta">
                <span className="chip">{meta.section ?? (en ? "Article" : zh("文章", locale))}</span>
                {formatDate(a.published, locale)}
                {!own ? <span>· {meta.contentLanguage === "en" ? zh("英文原文", locale) : zh("原文", locale)}</span> : null}
              </span>
              {/* Card titles sit directly under the page’s h1 (a listing page). */}
              <h2 lang={lang}>{meta.title}</h2>
              <p className="small muted" lang={lang} style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{meta.summary}</p>
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

/** Which locale’s body to render and whether it is a fallback. */
export function articleSource(slug: string, locale: LegacyLocale) {
  const entry = articleBySlug(slug);
  if (!entry) return null;
  // A Chinese "en" record is not an English version (8.1.1): fall back to English only when it is
  // genuinely English, otherwise to Traditional Chinese.
  const { source, meta, own } = articleListing(entry, locale);
  return { entry, source, meta, fallback: !own };
}

/**
 * Preserved Knowledge Hub article. Shown with its original date, author and
 * language, plus an archive notice; the body is rendered from structured
 * blocks (no source HTML).
 */
/** A language named in the reader's own language and script (for a related link to another language). */
const languageName: Record<LegacyLocale, Record<LegacyLocale, string>> = {
  en: { en: "English", "zh-hant": "Traditional Chinese", "zh-hans": "Simplified Chinese" },
  "zh-hant": { en: "英文", "zh-hant": "繁體中文", "zh-hans": "簡體中文" },
  "zh-hans": { en: "英文", "zh-hant": "繁体中文", "zh-hans": "简体中文" },
};

export async function ArticleView({ slug, locale, shellLocale }: { slug: string; locale: LegacyLocale; shellLocale: Locale }) {
  const found = articleSource(slug, locale);
  if (!found) return null;
  const { entry, source, meta, fallback } = found;
  const blocks = tidyArticleBlocks((await getArticleBlocks(source, slug)) ?? [], slug, source);
  const en = locale === "en";
  const hans = locale === "zh-hans";
  const archived = isArchiveArticle(entry.published);
  const resolve = (raw: string) => resolveLegacyHref(raw, locale);
  const topic = resourceTopics.find((tp) => tp.id === entry.topic);
  const rel = topicRelations[entry.topic];
  const others = articleLocales(entry).filter((l) => l !== locale);
  const canonical = localeUrl(fallback ? source : locale, `/knowledge-hub/${slug}`);
  // Article dates are calendar days; schema.org wants a date-time, so they are pinned to Hong Kong time.
  const hk = (date: string) => (date.includes("T") ? date : `${date}T00:00:00+08:00`);
  const contentLang = meta.contentLanguage === "en" ? "en" : localeMeta[meta.contentLanguage as LegacyLocale]?.htmlLang ?? "en";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.summary,
          image: `${canonical}/opengraph-image`,
          datePublished: hk(entry.published),
          dateModified: hk(entry.modified || entry.published),
          inLanguage: contentLang,
          author: { "@type": "Organization", name: meta.author || "FIMMICK" },
          publisher: { "@type": "Organization", "@id": organizationId, name: "FIMMICK", logo: { "@type": "ImageObject", url: `${canonicalOrigin}/brand/fimmick-logo.png` } },
          mainEntityOfPage: canonical,
        }}
      />
      {/* The article root carries the content language; the shell (crumbs) keeps the page’s. */}
      <article className="section" lang={contentLang}>
        <div className="container">
          <div lang={localeMeta[shellLocale].htmlLang}>
          <Crumbs locale={shellLocale} items={[{ label: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: en ? "Knowledge Hub" : hans ? zh("知识库", locale) : zh("知識庫", locale), path: "/knowledge-hub" }, { label: meta.title }]} />
          </div>
          <div className="detail-grid">
            <div>
              {/* The archive note is for articles from before the relaunch; a recent article only
                  gets the banner when it is shown in another language. */}
              {archived || (fallback && !en) ? (
                <div className="archive-banner" role="note">
                  {archived ? (
                    <>
                      <strong>{en ? "Archive article" : hans ? zh("文章存档", locale) : zh("文章存檔", locale)}</strong>
                      <span>
                        {en
                          ? `Originally published ${formatDate(entry.published, "en")}. It reflects FIMMICK’s positioning at that time and has not been rewritten; some terms, figures and links may be out of date.`
                          : hans
                            ? zh(`原于 ${formatDate(entry.published, "zh-hans")} 发布，反映 FIMMICK 当时的定位，内容未经改写；部分用语、数字及链接可能已过时。`, locale)
                            : zh(`原於 ${formatDate(entry.published, "zh-hant")} 發布，反映 FIMMICK 當時的定位，內容未經改寫；部分用語、數字及連結可能已過時。`, locale)}
                      </span>
                    </>
                  ) : null}
                  {fallback && !en ? <span>{hans ? zh("此文章没有简体中文版本，以下以原文显示。", locale) : zh("此文章沒有繁體中文版本，以下以原文（英文）顯示。", locale)}</span> : null}
                </div>
              ) : null}
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
                  ) : b.t === "rel" ? (
                    // A related archive article (the WordPress "Explore Further" card), in the body's language.
                    <p key={i} className="article-rel">
                      <span>
                        {source === "en" ? "Related reading" : source === "zh-hans" ? "延伸阅读" : "延伸閱讀"}
                        {/* A target only in another language says so before the click. */}
                        {b.titleLocale !== source ? ` · ${languageName[source][b.titleLocale]}` : null}
                      </span>
                      <Link href={href(shellLocale, paths.article(b.slug))} prefetch={false} lang={localeMeta[b.titleLocale].htmlLang}>
                        {b.title} <span aria-hidden="true">→</span>
                      </Link>
                    </p>
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
