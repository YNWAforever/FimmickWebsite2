import type { Metadata } from "next";
import Link from "next/link";
import { href, t, formatDate } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { guides } from "@/content/resources";
import { workstreamById } from "@/content/transformation";
import { PageHero } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "Guides & playbooks", zh: "指南與實務手冊" },
  lead: { en: "Practical downloads you can use before talking to anyone. Sample rows are labelled as samples.", zh: "無須先與任何人傾談便可使用的實用下載資料；示例內容已清楚標示。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/resources/guides", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function GuidesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: en ? "Resources" : "資源中心", path: "/resources" }, { label: t(copy.title, locale) }]} eyebrow={en ? "Resources" : "資源中心"} title={t(copy.title, locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container stack" style={{ ["--stack" as string]: "24px" }}>
          {guides.map((g) => {
            const ws = g.related.workstream ? workstreamById(g.related.workstream) : undefined;
            return (
              <article key={g.slug} id={g.slug} className="io-card" style={{ display: "grid", gap: 16 }}>
                <p className="card-meta micro muted" style={{ fontWeight: 700 }}>
                  <span className="chip chip--lime">{t(g.format, locale)}</span> {formatDate(g.published, locale)}
                </p>
                <h2 style={{ fontSize: "1.6rem" }}>{t(g.title, locale)}</h2>
                <p className="muted">{t(g.summary, locale)}</p>
                <ul className="check-list small">{t(g.contents, locale).map((c) => <li key={c}>{c}</li>)}</ul>
                <div className="btn-row">
                  <a className="btn btn--accent" href={g.file.en.href} download hrefLang="en">{en ? "Download (English, PDF)" : "下載（英文 PDF）"}</a>
                  <a className="btn btn--ghost" href={g.file["zh-hant"].href} download hrefLang="zh-Hant-HK">{en ? "Download (繁體中文, PDF)" : "下載（繁體中文 PDF）"}</a>
                  {ws ? <Link className="text-link" href={href(locale, paths.workstream(ws.id))}>{t(ws.name, locale)} →</Link> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Want help filling it in?" : "需要協助填寫？"} primary={{ label: en ? "Discuss a transformation scope" : "討論轉型範圍", to: paths.contact({ intent: "transformation", resource: "ai-readiness-checklist" }) }} />
    </>
  );
}
