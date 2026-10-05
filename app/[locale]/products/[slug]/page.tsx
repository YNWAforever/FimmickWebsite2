// Route sheets (8.2.3), first so they keep their place before component sheets.
import "@/app/styles/diagrams.css";
import "@/app/styles/examples.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { products } from "@/content/products";
import { solutionById } from "@/content/solutions";
import { ui } from "@/content/ui";
import { casesFor, industriesForProduct } from "@/content/relations";
import { PageHero, SectionHead, LinkButton, Faq } from "@/components/ui";
import { CaseCards, EnquirySection, ExampleBlock, FlowStrip, IndustryCards, RelatedSection, ServiceCards, StatusPanel } from "@/components/blocks";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(products.map((p) => p.id));
}

const find = (slug: string) => products.find((p) => p.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const p = find((await params).slug);
  if (!p) return {};
  return pageMetadata({ locale, path: paths.product(p.id), title: p.seoTitle ? t(p.seoTitle, locale) : `${p.name} — ${t(p.descriptor, locale)}`, description: t(p.seoDescription ?? p.summary, locale) });
}

export default async function ProductPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const p = find((await params).slug);
  if (!p) notFound();
  const en = locale === "en";
  const solution = solutionById(p.solution);
  const contact = paths.contact({ intent: "configuration", product: p.id, solution: p.solution });
  const related = casesFor({ product: p.id }, 3);
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Products" : zh("產品", locale), path: "/products" }, { label: p.name }]}
        eyebrow={p.name}
        title={t(p.descriptor, locale)}
        accent={p.headlineAccent ? t(p.headlineAccent, locale) : undefined}
        lead={t(p.summary, locale)}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{t(ui.discussConfiguration, locale)}</LinkButton>
            <LinkButton to="#example" variant="ghost">{en ? "Try the example" : zh("試用示例", locale)}</LinkButton>
          </>
        }
        aside={
          <div className="stack">
            <StatusPanel locale={locale} availability={p.availability} mode={p.exampleMode} extra={[{ label: en ? "Solution" : zh("解決方案", locale), value: t(solution.name, locale) }]} />
            <p className="small muted">{t(p.whoFor, locale)}</p>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Scope" : zh("範圍", locale)} title={en ? "What it does — and what it does not do" : zh("它做甚麼——以及不做甚麼", locale)} />
          <div className="grid grid-3">
            <div className="io-card io-card--out">
              <h3>{en ? "Supported actions" : zh("支援的行動", locale)}</h3>
              <ul className="check-list small">{t(p.supportedActions, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "Not included" : zh("不包括", locale)}</h3>
              <ul className="x-list small">{t(p.exclusions, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "Depends on" : zh("依賴條件", locale)}</h3>
              <ul className="dot-list small">{t(p.dependencies, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
          <p className="distinction" style={{ marginTop: 24 }}>{t(p.distinction, locale)}</p>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container stack" style={{ ["--stack" as string]: "24px" }}>
          <SectionHead eyebrow={en ? "Workflow" : zh("流程", locale)} title={en ? "Illustrative workflow" : zh("示例流程", locale)} lead={t(p.output, locale)} />
          <FlowStrip locale={locale} steps={p.workflow} humanIndex={3} />
        </div>
      </section>
      <section className="section" id="example">
        <div className="container">
          <SectionHead eyebrow={en ? "Sample" : zh("示例", locale)} title={en ? "Try the workflow on sample data" : zh("以示例資料試用流程", locale)} />
          <ExampleBlock locale={locale} id={p.example} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{t(ui.faqs, locale)}</p>
            <h2>{en ? "Questions about " : zh("關於 ", locale)}{p.name}</h2>
            <p className="muted">
              {en ? "Part of " : zh("屬於", locale)}<Link href={href(locale, paths.solution(solution.id))}>{t(solution.name, locale)}</Link>{en ? "." : "。"}
            </p>
          </div>
          <Faq items={p.faqs} locale={locale} />
        </div>
      </section>
      <RelatedSection title={t(ui.relatedServices, locale)}>
        <ServiceCards locale={locale} ids={p.services} />
      </RelatedSection>
      <RelatedSection title={t(ui.relatedIndustries, locale)} tint>
        <IndustryCards locale={locale} ids={industriesForProduct(p.id).map((i) => i.id).slice(0, 4)} />
      </RelatedSection>
      {related.length ? (
        <RelatedSection title={t(ui.relatedCases, locale)}>
          <CaseCards locale={locale} items={related} />
        </RelatedSection>
      ) : null}
      <EnquirySection
        locale={locale}
        title={en ? `Discuss a ${p.name} configuration` : zh(`討論 ${p.name} 配置方案`, locale)}
        body={en ? "We confirm availability, dependencies and a starting scope for your workflow." : zh("我們會按你的流程確認供應安排、依賴條件及起步範圍。", locale)}
        primary={{ label: t(ui.discussConfiguration, locale), to: contact }}
        secondary={{ label: t(ui.requestDemo, locale), to: paths.contact({ intent: "demo", product: p.id }) }}
      />
    </>
  );
}
