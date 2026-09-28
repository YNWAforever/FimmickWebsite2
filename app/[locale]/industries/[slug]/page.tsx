import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { industries } from "@/content/industries";
import { productById } from "@/content/products";
import { memberById } from "@/content/ecosystem";
import { ui } from "@/content/ui";
import { casesFor } from "@/content/relations";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { CaseCards, EnquirySection, ProductCards, RelatedSection, ServiceCards } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(industries.map((i) => i.id));
}

const find = (slug: string) => industries.find((i) => i.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const i = find((await params).slug);
  if (!i) return {};
  return pageMetadata({ locale, path: paths.industry(i.id), title: t(i.name, locale), description: t(i.problem, locale) });
}

export default async function IndustryPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const i = find((await params).slug);
  if (!i) notFound();
  const en = locale === "en";
  const contact = paths.contact({ intent: "configuration", industry: i.id });
  const evidence = casesFor({ industry: i.id }, 3);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Industries" : "行業應用", path: "/industries" }, { name: t(i.name, locale), path: paths.industry(i.id) }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Industries" : "行業應用", path: "/industries" }, { label: t(i.name, locale) }]}
        eyebrow={en ? "Industry application" : "行業應用"}
        title={t(i.name, locale)}
        lead={t(i.problem, locale)}
        actions={<LinkButton to={href(locale, contact)} variant="accent">{en ? "Discuss your workflow" : "討論你的流程"}</LinkButton>}
        aside={
          <div className="io-card io-card--out">
            <h2 style={{ fontSize: "1rem", marginBottom: 8 }}>{t(ui.outputs, locale)}</h2>
            <p className="small" style={{ fontWeight: 650, color: "var(--ink)" }}>{t(i.output, locale)}</p>
            <h2 style={{ fontSize: "1rem", margin: "16px 0 8px" }}>{t(ui.startingScope, locale)}</h2>
            <p className="small">{t(i.startingScope, locale)}</p>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Suggested workflow" : "建議流程"} title={en ? "From source information to a reviewed result" : "由來源資料到經審閱的成果"} lead={t(i.proof, locale)} />
          <ol className="journey">
            {i.journey.map((step) => (
              <li key={step.step.en} data-human={!!step.human}>
                <strong>{t(step.step, locale)}</strong>
                <p>{t(step.copy, locale)}</p>
                <span className="who">{step.human ? (en ? "Your team decides" : "由你的團隊決定") : step.product ? productById(step.product).name : ""}</span>
              </li>
            ))}
          </ol>
          <div className="io-grid" style={{ marginTop: 32 }}>
            <div className="io-card">
              <h3>{en ? "Source information" : "來源資料"}</h3>
              <ul className="dot-list">{t(i.sources, locale).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div className="decision-callout">
              <strong>{t(ui.humanDecision, locale)}</strong>
              <ul className="check-list">{t(i.reviewPoints, locale).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </div>
          <p className="distinction" style={{ marginTop: 24 }}>
            <strong>{en ? "Transformation need: " : "轉型需要："}</strong>
            {t(i.transformationNeed, locale)}{" "}
            <Link href={href(locale, "/ai-transformation")}>{en ? "AI Transformation →" : "AI 轉型 →"}</Link>
          </p>
        </div>
      </section>
      <RelatedSection title={t(ui.relatedProducts, locale)} tint>
        <ProductCards locale={locale} ids={i.products} />
      </RelatedSection>
      <RelatedSection title={t(ui.relatedServices, locale)}>
        <ServiceCards locale={locale} ids={i.services} />
      </RelatedSection>
      <section className="section section--tight section--surface">
        <div className="container related-block">
          <h2>{t(ui.relatedCases, locale)}</h2>
          {evidence.length ? (
            <CaseCards locale={locale} items={evidence} />
          ) : (
            <p className="muted">{en ? "No published case for this sector yet. The workflow above is a labelled example; ask us about relevant experience." : "此行業暫未有公開案例。以上流程為已標示的示例，歡迎查詢相關經驗。"}</p>
          )}
        </div>
      </section>
      {i.members.length ? (
        <section className="section section--tight">
          <div className="container related-block">
            <h2>{t(ui.relatedEcosystem, locale)}</h2>
            <ul className="chips">
              {i.members.map((m) => (
                <li key={m}>
                  <Link className="chip chip--lime" href={href(locale, paths.member(m))}>{memberById(m).name} — {t(memberById(m).role, locale)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <EnquirySection locale={locale} title={en ? `Discuss ${t(i.name, locale)} workflows` : `討論${t(i.name, locale)}流程`} body={t(i.startingScope, locale)} primary={{ label: en ? "Discuss your workflow" : "討論你的流程", to: contact }} secondary={{ label: en ? "All industries" : "全部行業", to: "/industries" }} />
    </>
  );
}
