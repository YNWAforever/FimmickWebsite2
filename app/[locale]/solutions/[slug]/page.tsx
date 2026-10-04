import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, t, type Locale, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { solutions } from "@/content/solutions";
import { productById } from "@/content/products";
import { industryById } from "@/content/industries";
import { ui } from "@/content/ui";
import type { SolutionId } from "@/content/types";
import { casesFor } from "@/content/relations";
import { PageHero, SectionHead, LinkButton, Faq, Chips } from "@/components/ui";
import { solutionPhotos } from "@/content/photography";
import { BeforeAfterBlock, CaseCards, EnquirySection, ExampleBlock, FlowStrip, IndustryCards, RelatedSection, ServiceCards, StatusPanel } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(solutions.map((s) => s.id));
}

const find = (slug: string) => solutions.find((s) => s.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const s = find((await params).slug);
  if (!s) return {};
  return pageMetadata({ locale, path: paths.solution(s.id), title: t(s.name, locale), description: `${t(s.job, locale)} ${t(s.deliverable, locale)}`, generatedImage: true });
}

export default async function SolutionPage({ params }: SlugParams) {
  const locale: Locale = await resolveLocale(params);
  const s = find((await params).slug);
  if (!s) notFound();
  const en = locale === "en";
  const contact = paths.contact({ intent: "configuration", solution: s.id as SolutionId });
  const related = casesFor({ service: s.services[0], product: s.products[0] }, 3);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Solutions" : zh("解決方案", locale), path: "/solutions" }, { name: t(s.name, locale), path: paths.solution(s.id) }])} />
      <PageHero
        locale={locale}
        photo={solutionPhotos[s.id]}
        crumbs={[{ label: en ? "Solutions" : zh("解決方案", locale), path: "/solutions" }, { label: t(s.name, locale) }]}
        eyebrow={`${en ? "Solution" : zh("解決方案", locale)} ${s.number} · ${t(s.name, locale)}`}
        title={t(s.job, locale)}
        accent={s.headlineAccent ? t(s.headlineAccent, locale) : undefined}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{t(ui.discussConfiguration, locale)}</LinkButton>
            <LinkButton to="#example" variant="ghost">{en ? "Try the example" : zh("試用示例", locale)}</LinkButton>
          </>
        }
        aside={
          <div className="stack">
            <div className="io-card io-card--out">
              <h2 className="h3" style={{ fontSize: "1rem" }}>{t(ui.outputs, locale)}</h2>
              <p style={{ fontWeight: 650, color: "var(--ink)" }}>{t(s.deliverable, locale)}</p>
            </div>
            <StatusPanel locale={locale} availability="discuss" mode="illustrative-sample" extra={[{ label: en ? "Products" : zh("產品", locale), value: s.products.map((p) => productById(p).name).join(" · ") }]} />
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "The problem" : zh("問題", locale)} title={t(s.problem, locale)} />
          <div className="io-grid">
            <div className="io-card">
              <h3>{t(ui.inputs, locale)}</h3>
              <ul className="dot-list">{t(s.inputs, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card io-card--out">
              <h3>{t(ui.outputs, locale)}</h3>
              <ul className="check-list">{t(s.outputs, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container stack" style={{ ["--stack" as string]: "24px" }}>
          <SectionHead eyebrow={en ? "Workflow" : zh("流程", locale)} title={en ? "How the work moves" : zh("工作如何推進", locale)} />
          <FlowStrip locale={locale} steps={s.workflow} />
          <div className="decision-callout">
            <strong>{t(ui.humanDecision, locale)}</strong>
            <p>{t(s.humanDecision, locale)}</p>
          </div>
          <p className="distinction">{t(s.evidence, locale)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t(ui.relatedProducts, locale)} title={en ? "Products that do this work" : zh("負責這項工作的產品", locale)} />
          <div className="grid grid-2">
            {s.products.map((id) => {
              const p = productById(id);
              return (
                <a key={id} className="hub-card" href={href(locale, paths.product(id))}>
                  <span className="chip chip--magenta" style={{ alignSelf: "flex-start" }}>{t(p.descriptor, locale)}</span>
                  <h3>{p.name}</h3>
                  <p className="muted">{t(p.summary, locale)}</p>
                  <p className="small">{t(p.distinction, locale)}</p>
                  <span className="card-foot">{t(ui.learnMore, locale)} →</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--surface" id="example">
        <div className="container">
          <SectionHead eyebrow={en ? "Sample" : zh("示例", locale)} title={en ? "Try it on sample data" : zh("以示例資料試用", locale)} />
          <ExampleBlock locale={locale} id={s.example} />
        </div>
      </section>

      {s.id === "content-production" ? (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={en ? "Before and after" : zh("前後對比", locale)} title={en ? "From chat approvals to a reviewed, recorded workflow" : zh("由聊天批核到有審閱、有記錄的流程", locale)} />
            <BeforeAfterBlock locale={locale} />
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{t(ui.startingScope, locale)}</p>
            <h2>{t(s.startingScope, locale)}</h2>
            <p className="muted">{en ? "Scope, timing and connections are agreed before work starts. No fixed timeline is promised in advance." : zh("範圍、時間及系統串接會在開始前議定，不會預先承諾固定時間表。", locale)}</p>
            <Chips items={s.industries.map((i) => ({ label: t(industryById(i).name, locale), to: href(locale, paths.industry(i)) }))} />
          </div>
          <Faq items={s.faqs} locale={locale} />
        </div>
      </section>

      <RelatedSection title={t(ui.relatedServices, locale)} tint>
        <ServiceCards locale={locale} ids={s.services} />
      </RelatedSection>
      <RelatedSection title={t(ui.relatedIndustries, locale)}>
        <IndustryCards locale={locale} ids={s.industries} />
      </RelatedSection>
      {related.length ? (
        <RelatedSection title={t(ui.relatedCases, locale)} tint>
          <CaseCards locale={locale} items={related} />
        </RelatedSection>
      ) : null}
      <EnquirySection
        locale={locale}
        title={en ? `Discuss ${t(s.short, locale).toLowerCase()} for your team` : zh(`討論適合你團隊的${t(s.short, locale)}方案`, locale)}
        body={t(s.startingScope, locale)}
        primary={{ label: t(ui.discussConfiguration, locale), to: contact }}
        secondary={{ label: t(ui.requestDemo, locale), to: paths.contact({ intent: "demo", solution: s.id }) }}
      />
    </>
  );
}
