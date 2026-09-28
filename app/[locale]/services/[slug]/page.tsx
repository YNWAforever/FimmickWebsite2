import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { objectives, services } from "@/content/services";
import { memberById } from "@/content/ecosystem";
import { workstreamById } from "@/content/transformation";
import { ui } from "@/content/ui";
import { casesFor } from "@/content/relations";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { CaseCards, EnquirySection, FlowStrip, IndustryCards, ProductCards, RelatedSection } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

/** /services/ai-transformation permanently redirects to the transformation hub (next.config.ts). */
const detailServices = services.filter((s) => !s.canonicalPath);

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(detailServices.map((s) => s.id));
}

const find = (slug: string) => detailServices.find((s) => s.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const s = find((await params).slug);
  if (!s) return {};
  return pageMetadata({ locale, path: paths.service(s.id), title: t(s.name, locale), description: t(s.summary, locale) });
}

export default async function ServicePage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const s = find((await params).slug);
  if (!s) notFound();
  const en = locale === "en";
  const objective = objectives.find((o) => o.id === s.objective)!;
  const contact = paths.contact({ intent: "service", service: s.id });
  const related = casesFor({ service: s.id }, 3);
  const ws = s.workstream ? workstreamById(s.workstream) : undefined;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Services" : "專業服務", path: "/services" }, { name: t(s.name, locale), path: paths.service(s.id) }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Services" : "專業服務", path: "/services" }, { label: t(s.name, locale) }]}
        eyebrow={`${t(objective.name, locale)} · ${t(s.eyebrow, locale)}`}
        title={t(s.name, locale)}
        lead={t(s.summary, locale)}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{en ? "Discuss this service" : "討論此服務"}</LinkButton>
            <LinkButton to="#sample" variant="ghost">{en ? "See a sample output" : "查看成果示例"}</LinkButton>
          </>
        }
        aside={
          <div className="io-card io-card--out">
            <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "Deliverables" : "交付成果"}</h2>
            <ul className="check-list small">{t(s.deliverables, locale).map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "The problem" : "問題"} title={t(s.problem, locale)} />
          <div className="io-grid">
            <div className="io-card">
              <h3>{t(ui.inputs, locale)}</h3>
              <ul className="dot-list">{t(s.inputs, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "Who does what" : "分工"}</h3>
              <dl className="stack small" style={{ margin: 0 }}>
                <div><dt style={{ fontWeight: 800, color: "var(--magenta-ink)" }}>{en ? "Role of AI" : "AI 的角色"}</dt><dd style={{ margin: 0 }}>{t(s.aiRole, locale)}</dd></div>
                <div><dt style={{ fontWeight: 800, color: "var(--ink)" }}>{en ? "FIMMICK specialists" : "FIMMICK 專家"}</dt><dd style={{ margin: 0 }}>{t(s.specialistRole, locale)}</dd></div>
                <div><dt style={{ fontWeight: 800, color: "var(--lime-ink)" }}>{en ? "Your review responsibility" : "你的審閱責任"}</dt><dd style={{ margin: 0 }}>{t(s.reviewResponsibility, locale)}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Delivery process" : "交付流程"} title={en ? "How the service runs" : "服務如何進行"} />
          <FlowStrip locale={locale} steps={s.process} humanIndex={-1} />
        </div>
      </section>
      <section className="section" id="sample">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Sample output" : "成果示例"}</p>
            <h2>{t(s.sample.label, locale)}</h2>
            <p className="muted small">{en ? "Illustrative sample — not client data." : "示例——並非客戶資料。"}</p>
          </div>
          <dl className="kv">
            {t(s.sample.rows, locale).map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <div className="grid grid-3">
            <div className="io-card io-card--out">
              <h3>{en ? "Included" : "包括"}</h3>
              <ul className="check-list small">{t(s.included, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "Not included" : "不包括"}</h3>
              <ul className="x-list small">{t(s.excluded, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "Third-party dependencies" : "第三方依賴"}</h3>
              <p className="small muted">{t(s.thirdParty, locale)}</p>
              <h3 style={{ marginTop: 16 }}>{t(ui.startingScope, locale)}</h3>
              <p className="small">{t(s.startingScope, locale)}</p>
            </div>
          </div>
          {ws ? (
            <p className="distinction" style={{ marginTop: 24 }}>
              {en ? "Part of the AI Transformation programme: " : "屬於 AI 轉型計劃："}
              <Link href={href(locale, paths.workstream(ws.id))}>{t(ws.name, locale)}</Link>
            </p>
          ) : null}
        </div>
      </section>
      {s.products.length ? (
        <RelatedSection title={en ? "Supporting technology" : "支援技術"}>
          <ProductCards locale={locale} ids={s.products} />
        </RelatedSection>
      ) : null}
      <RelatedSection title={t(ui.relatedIndustries, locale)} tint>
        <IndustryCards locale={locale} ids={s.industries} />
      </RelatedSection>
      {related.length ? (
        <RelatedSection title={t(ui.relatedCases, locale)}>
          <CaseCards locale={locale} items={related} />
        </RelatedSection>
      ) : null}
      {s.members.length ? (
        <section className="section section--tight section--surface">
          <div className="container related-block">
            <h2>{t(ui.relatedEcosystem, locale)}</h2>
            <ul className="chips">
              {s.members.map((m) => (
                <li key={m}>
                  <Link className="chip chip--lime" href={href(locale, paths.member(m))}>{memberById(m).name} — {t(memberById(m).role, locale)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <EnquirySection locale={locale} title={en ? `Discuss ${t(s.name, locale)}` : `討論${t(s.name, locale)}`} body={t(s.startingScope, locale)} primary={{ label: en ? "Discuss this service" : "討論此服務", to: contact }} secondary={{ label: en ? "All services" : "全部服務", to: "/services" }} />
    </>
  );
}
