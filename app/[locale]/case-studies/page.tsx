import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { cases, caseKindLabel } from "@/content/cases";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { ui } from "@/content/ui";
import type { CaseKind } from "@/content/types";
import { PageHero } from "@/components/ui";
import { CaseCards, EnquirySection } from "@/components/blocks";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ industry?: string; capability?: string; kind?: string }> };

const copy = {
  title: { en: "Case studies", zh: "成功案例" },
  lead: { en: "Client engagements, FIMMICK's own transformation and — kept separate — labelled product examples. Each case states its publication basis and limitations.", zh: "客戶項目、FIMMICK 自身轉型，以及另行標示的產品示例。每個案例都列明發布依據及限制。" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/case-studies", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function CaseStudiesPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const sp = await searchParams;
  const industry = industries.some((i) => i.id === sp.industry) ? sp.industry : undefined;
  const capability = services.some((s) => s.id === sp.capability) ? sp.capability : undefined;
  const kind = (["client-work", "internal-application"] as string[]).includes(sp.kind ?? "") ? (sp.kind as CaseKind) : undefined;
  const matches = (c: (typeof cases)[number], ignore?: string) =>
    (ignore === "industry" || !industry || c.industries.includes(industry as never)) &&
    (ignore === "capability" || !capability || c.services.includes(capability as never)) &&
    (ignore === "kind" || !kind || c.kind === kind);
  const shown = cases.filter((c) => matches(c));
  const base = href(locale, "/case-studies");
  const q = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const next = { industry, capability, kind, ...patch };
    Object.entries(next).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  const usedServices = services.filter((s) => cases.some((c) => c.services.includes(s.id)));
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "Real work, described honestly." : "真實工作，如實描述。"} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <nav className="filter-bar" aria-label={en ? "Filter case studies" : "篩選案例"}>
            <div className="filter-group">
              <span className="filter-label">{en ? "Type" : "類型"}</span>
              <Link className="filter-pill" href={q({ kind: undefined })} aria-current={!kind ? "true" : undefined} scroll={false}>{t(ui.all, locale)}</Link>
              {(["client-work", "internal-application"] as CaseKind[]).map((k) => (
                <Link key={k} className="filter-pill" href={q({ kind: k })} aria-current={kind === k ? "true" : undefined} scroll={false}>
                  {t(caseKindLabel[k], locale)} <span className="count">{cases.filter((c) => matches(c, "kind") && c.kind === k).length}</span>
                </Link>
              ))}
            </div>
            <div className="filter-group">
              <span className="filter-label">{en ? "Industry" : "行業"}</span>
              <Link className="filter-pill" href={q({ industry: undefined })} aria-current={!industry ? "true" : undefined} scroll={false}>{t(ui.all, locale)}</Link>
              {industries.map((i) => {
                const n = cases.filter((c) => matches(c, "industry") && c.industries.includes(i.id)).length;
                return (
                  <Link key={i.id} className="filter-pill" href={q({ industry: i.id })} aria-current={industry === i.id ? "true" : undefined} scroll={false}>
                    {t(i.name, locale)} <span className="count">{n}</span>
                  </Link>
                );
              })}
            </div>
            <div className="filter-group">
              <span className="filter-label">{en ? "Capability" : "能力"}</span>
              <Link className="filter-pill" href={q({ capability: undefined })} aria-current={!capability ? "true" : undefined} scroll={false}>{t(ui.all, locale)}</Link>
              {usedServices.map((s) => (
                <Link key={s.id} className="filter-pill" href={q({ capability: s.id })} aria-current={capability === s.id ? "true" : undefined} scroll={false}>
                  {t(s.name, locale)} <span className="count">{cases.filter((c) => matches(c, "capability") && c.services.includes(s.id)).length}</span>
                </Link>
              ))}
            </div>
          </nav>
          <div className="result-meta" role="status">
            <span>{shown.length} {t(ui.results, locale)}</span>
            {industry || capability || kind ? <Link href={base} scroll={false}>{t(ui.clearFilters, locale)}</Link> : null}
          </div>
          {shown.length ? <CaseCards locale={locale} items={shown} /> : <p className="empty-state">{t(ui.noResults, locale)}</p>}
          <div className="distinction" style={{ marginTop: 32 }}>
            {en ? "Looking for product demonstrations? They are labelled samples, collected separately in " : "想查看產品示範？它們屬已標示的示例，另行收錄於"}
            <Link href={href(locale, "/cases-and-demos")}>{en ? "Examples & demos" : "示例與示範"}</Link>
            {en ? "." : "。"}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Discuss a similar piece of work" : "討論類似的工作"} primary={{ label: t(ui.discussScope, locale), to: "/contact?intent=general" }} />
    </>
  );
}
