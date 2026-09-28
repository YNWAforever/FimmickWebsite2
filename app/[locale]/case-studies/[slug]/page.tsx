import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { cases, caseKindLabel } from "@/content/cases";
import { industryById } from "@/content/industries";
import { serviceById } from "@/content/services";
import { productById } from "@/content/products";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton, Chips } from "@/components/ui";
import { CaseCards, EnquirySection, RelatedSection } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(cases.map((c) => c.slug));
}

const find = (slug: string) => cases.find((c) => c.slug === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const c = find((await params).slug);
  if (!c) return {};
  return pageMetadata({ locale, path: paths.case(c.slug), title: t(c.title, locale), description: t(c.problem, locale) });
}

export default async function CasePage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const c = find((await params).slug);
  if (!c) notFound();
  const en = locale === "en";
  const more = cases.filter((o) => o.slug !== c.slug && (o.industries.some((i) => c.industries.includes(i)) || o.services.some((s) => c.services.includes(s)))).slice(0, 3);
  const contact = paths.contact({ intent: c.kind === "internal-application" ? "transformation" : "general", case: c.slug });
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Case studies" : zh("成功案例", locale), path: "/case-studies" }, { name: t(c.title, locale), path: paths.case(c.slug) }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Case studies" : zh("成功案例", locale), path: "/case-studies" }, { label: t(c.title, locale) }]}
        eyebrow={`${t(caseKindLabel[c.kind], locale)} · ${t(c.sector, locale)} · ${t(c.market, locale)}`}
        title={t(c.title, locale)}
        lead={t(c.context, locale)}
        actions={<LinkButton to={href(locale, contact)} variant="accent">{en ? "Discuss similar work" : zh("討論類似工作", locale)}</LinkButton>}
        aside={
          <dl className="status-panel">
            <div><dt>{en ? "Publication basis" : zh("發布依據", locale)}</dt><dd className="small">{t(c.publicationBasis, locale)}</dd></div>
            <div><dt>{en ? "Period" : zh("期間", locale)}</dt><dd>{t(c.period, locale)}</dd></div>
          </dl>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Problem" : zh("問題", locale)} title={t(c.problem, locale)} />
          <div className="io-grid">
            <div className="io-card">
              <h3>{en ? "Scope delivered" : zh("交付範圍", locale)}</h3>
              <ul className="check-list">{t(c.scope, locale).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "Services and products involved" : zh("涉及的服務及產品", locale)}</h3>
              <Chips items={c.services.map((s) => ({ label: t(serviceById(s).name, locale), to: href(locale, paths.service(s)) }))} />
              {c.products.length ? <div style={{ marginTop: 10 }}><Chips tone="magenta" items={c.products.map((p) => ({ label: productById(p).name, to: href(locale, paths.product(p)) }))} /></div> : null}
              {c.industries.length ? <div style={{ marginTop: 10 }}><Chips tone="sky" items={c.industries.map((i) => ({ label: t(industryById(i).name, locale), to: href(locale, paths.industry(i)) }))} /></div> : null}
            </div>
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Workflow change" : zh("流程改變", locale)} title={en ? "Before and after" : zh("之前與之後", locale)} />
          <div className="ba">
            <div className="grid grid-2">
              <div>
                <p className="micro muted" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{en ? "Before" : zh("之前", locale)}</p>
                <ol className="ba-lane" style={{ gridTemplateColumns: "1fr" }}>{t(c.workflowBefore, locale).map((s) => <li key={s} data-kind="pain" style={{ minHeight: 0 }}><p style={{ color: "var(--ink)" }}>{s}</p></li>)}</ol>
              </div>
              <div>
                <p className="micro muted" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{en ? "After" : zh("之後", locale)}</p>
                <ol className="ba-lane" style={{ gridTemplateColumns: "1fr" }}>{t(c.workflowAfter, locale).map((s) => <li key={s} data-kind="human" style={{ minHeight: 0 }}><p style={{ color: "var(--ink)" }}>{s}</p></li>)}</ol>
              </div>
            </div>
          </div>
          <div className="decision-callout" style={{ marginTop: 24 }}>
            <strong>{t(ui.humanDecision, locale)}</strong>
            <p>{t(c.humanDecisions, locale)}</p>
          </div>
          <p className="small muted" style={{ marginTop: 16 }}><strong>{en ? "Data foundation: " : zh("資料基礎：", locale)}</strong>{t(c.dataFoundation, locale)}</p>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Outcome" : zh("成果", locale)}</p>
            <h2>{t(c.outcome, locale)}</h2>
            <p className="muted">{en ? "Reusable asset: " : zh("可重用成果：", locale)}{t(c.reusable, locale)}</p>
          </div>
          <div className="archive-banner">
            <strong>{en ? "Evidence and limitations" : zh("證據及限制", locale)}</strong>
            <span>{t(c.limitations, locale)}</span>
          </div>
        </div>
      </section>
      {more.length ? (
        <RelatedSection title={t(ui.relatedCases, locale)} tint>
          <CaseCards locale={locale} items={more} />
        </RelatedSection>
      ) : null}
      <section className="section section--tight">
        <div className="container">
          <Link className="text-link" href={href(locale, "/case-studies")}>← {en ? "Back to the case library" : zh("返回案例庫", locale)}</Link>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Discuss a similar piece of work" : zh("討論類似的工作", locale)} primary={{ label: t(ui.discussScope, locale), to: contact }} />
    </>
  );
}
