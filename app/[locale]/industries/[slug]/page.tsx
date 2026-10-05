import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { industries } from "@/content/industries";
import { productById } from "@/content/products";
import { memberById } from "@/content/ecosystem";
import { ui } from "@/content/ui";
import { casesFor } from "@/content/relations";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { industryPhotos } from "@/content/photography";
import { CaseCards, EnquirySection, ProductCards, RelatedSection, ServiceCards } from "@/components/blocks";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(industries.map((i) => i.id));
}

const find = (slug: string) => industries.find((i) => i.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const i = find((await params).slug);
  if (!i) return {};
  return pageMetadata({ locale, path: paths.industry(i.id), title: t(i.seoTitle ?? i.name, locale), description: t(i.seoDescription ?? i.problem, locale) });
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
      <PageHero
        locale={locale}
        photo={industryPhotos[i.id]}
        crumbs={[{ label: en ? "Industries" : zh("行業應用", locale), path: "/industries" }, { label: t(i.name, locale) }]}
        eyebrow={`${en ? "Industry application" : zh("行業應用", locale)} · ${t(i.name, locale)}`}
        title={t(i.output, locale)}
        accent={i.headlineAccent ? t(i.headlineAccent, locale) : undefined}
        lead={t(i.problem, locale)}
        actions={<LinkButton to={href(locale, contact)} variant="accent">{en ? "Discuss your workflow" : zh("討論你的流程", locale)}</LinkButton>}
        aside={
          <div className="io-card io-card--out">
            <h2 style={{ fontSize: "1rem", marginBottom: 8 }}>{t(ui.startingScope, locale)}</h2>
            <p className="small">{t(i.startingScope, locale)}</p>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Suggested workflow" : zh("建議流程", locale)} title={en ? "From source information to a reviewed result" : zh("由來源資料到經審閱的成果", locale)} lead={t(i.proof, locale)} />
          <ol className="journey">
            {i.journey.map((step) => (
              <li key={step.step.en} data-human={!!step.human}>
                <strong>{t(step.step, locale)}</strong>
                <p>{t(step.copy, locale)}</p>
                <span className="who">{step.human ? (en ? "Your team decides" : zh("由你的團隊決定", locale)) : step.product ? productById(step.product).name : ""}</span>
              </li>
            ))}
          </ol>
          <div className="io-grid" style={{ marginTop: 32 }}>
            <div className="io-card">
              <h3>{en ? "Source information" : zh("來源資料", locale)}</h3>
              <ul className="dot-list">{t(i.sources, locale).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div className="decision-callout">
              <strong>{t(ui.humanDecision, locale)}</strong>
              <ul className="check-list">{t(i.reviewPoints, locale).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </div>
          <p className="distinction" style={{ marginTop: 24 }}>
            <strong>{en ? "Transformation need: " : zh("轉型需要：", locale)}</strong>
            {t(i.transformationNeed, locale)}{" "}
            <Link href={href(locale, "/ai-transformation")}>{en ? "AI Transformation →" : zh("AI 轉型 →", locale)}</Link>
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
            <p className="muted">{en ? "No published case for this sector yet. The workflow above is a labelled example; ask us about relevant experience." : zh("此行業暫未有公開案例。以上流程為已標示的示例，歡迎查詢相關經驗。", locale)}</p>
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
      <EnquirySection locale={locale} title={en ? `Discuss ${t(i.name, locale)} workflows` : zh(`討論${t(i.name, locale)}流程`, locale)} body={t(i.startingScope, locale)} primary={{ label: en ? "Discuss your workflow" : zh("討論你的流程", locale), to: contact }} secondary={{ label: en ? "All industries" : zh("全部行業", locale), to: "/industries" }} />
    </>
  );
}
