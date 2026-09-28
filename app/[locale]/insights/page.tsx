import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { allResources } from "@/lib/resources";
import { resourceTopics } from "@/content/resources";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

const copy = {
  title: { en: "Insights", zh: "洞察" },
  lead: {
    en: "The latest guides, videos and articles from FIMMICK, grouped by topic. For search and filters across everything, use the Resource Centre.",
    zh: "按主題整理 FIMMICK 最新的指南、影片及文章。如需搜尋及篩選全部內容，請使用資源中心。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/insights", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function InsightsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const items = allResources(locale).filter((i) => i.format === "article" || i.format === "guide" || i.format === "video");
  const featured = items.filter((i) => i.format !== "article").slice(0, 3);
  const topics = resourceTopics
    .map((topic) => ({ topic, list: items.filter((i) => i.format === "article" && i.topic === topic.id).slice(0, 3) }))
    .filter((g) => g.list.length);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { name: t(copy.title, locale), path: "/insights" }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Resources" : zh("資源中心", locale)}
        title={en ? "What we are learning about AI in real business work." : zh("我們在真實業務中對 AI 的所學所得。", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, "/resources")} variant="accent">{en ? "Search all resources" : zh("搜尋全部資源", locale)}</LinkButton>
            <LinkButton to={href(locale, "/knowledge-hub")} variant="ghost">{en ? "Knowledge Hub archive" : zh("知識庫存檔", locale)}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Current" : zh("最新", locale)} title={en ? "Guides and video" : zh("指南及影片", locale)} />
          <div className="related-grid">
            {featured.map((i) => (
              <Link key={i.id} className="card card--link" href={href(locale, i.href)}>
                <span className="card-meta">{i.format === "guide" ? (en ? "Guide" : zh("指南", locale)) : en ? "Video" : zh("影片", locale)}{i.date ? ` · ${formatDate(i.date, locale)}` : ""}</span>
                <h3>{i.title}</h3>
                <p className="small muted">{i.summary.slice(0, 180)}</p>
                <span className="card-foot">{t(ui.learnMore, locale)} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {topics.map(({ topic, list }, index) => (
        <section key={topic.id} className={index % 2 === 0 ? "section section--tight section--surface" : "section section--tight"}>
          <div className="container related-block">
            <h2>{t(topic.name, locale)}</h2>
            <div className="related-grid">
              {list.map((i) => (
                <Link key={i.id} className="card card--link" href={href(locale, i.href)}>
                  <span className="card-meta">
                    {formatDate(i.date, locale)}
                    {i.contentLanguage === "en" && !en ? zh(" · 英文", locale) : null}
                  </span>
                  <h3>{i.title}</h3>
                  <p className="small muted">{i.summary.slice(0, 160)}</p>
                  <span className="card-foot">{en ? "Read" : zh("閱讀", locale)} →</span>
                </Link>
              ))}
            </div>
            <p className="small" style={{ marginTop: 16 }}>
              <Link className="text-link" href={href(locale, `/resources?topic=${topic.id}`)}>{en ? `More on ${t(topic.name, locale)}` : zh(`更多${t(topic.name, locale)}內容`, locale)} →</Link>
            </p>
          </div>
        </section>
      ))}
      <p className="container micro muted" style={{ marginTop: 24 }}>{en ? "Archive articles keep their original dates and wording and may describe earlier positioning." : zh("存檔文章保留原有日期及內容，或反映較早期的定位。", locale)}</p>
      <EnquirySection locale={locale} title={en ? "Want to discuss an idea from these articles?" : zh("想討論文章中的構思？", locale)} primary={{ label: en ? "Contact us" : zh("聯絡我們", locale), to: "/contact?intent=general" }} secondary={{ label: en ? "Resource Centre" : zh("資源中心", locale), to: "/resources" }} />
    </>
  );
}
