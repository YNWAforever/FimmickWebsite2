import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import type { EnquiryContext } from "@/lib/intent";
import { businessFunctions, type BusinessFunction } from "@/content/functions";
import { workstreamById } from "@/content/transformation";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection, IndustryCards, ProductCards, RelatedSection, SampleRecord, ServiceCards, SolutionCards } from "@/components/blocks";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(businessFunctions.map((f) => f.id));
}

const find = (slug: string) => businessFunctions.find((f) => f.id === slug);

/** Enquiry context: the most specific known record for the function. */
function contextFor(f: BusinessFunction): EnquiryContext {
  if (f.solutions[0]) return { intent: "configuration", solution: f.solutions[0] };
  if (f.workstream) return { intent: "transformation", workstream: f.workstream };
  return { intent: "service", service: f.services[0] };
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const f = find((await params).slug);
  if (!f) return {};
  return pageMetadata({ locale, path: paths.function(f.id), title: zh(`${t(f.name, locale)} — ${locale === "en" ? "AI workflows" : "AI 流程"}`, locale), description: t(f.summary, locale) });
}

export default async function FunctionPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const f = find((await params).slug);
  if (!f) notFound();
  const en = locale === "en";
  const contact = paths.contact(contextFor(f));
  const hubLabel = en ? "Workflows by function" : zh("按職能劃分的流程", locale);
  const ws = f.workstream ? workstreamById(f.workstream) : undefined;
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: hubLabel, path: "/functions" }, { label: t(f.name, locale) }]}
        eyebrow={t(f.owner, locale)}
        title={t(f.headline, locale)}
        accent={t(f.headlineAccent, locale)}
        lead={t(f.summary, locale)}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{t(ui.discussScope, locale)}</LinkButton>
            <LinkButton to="#workflows" variant="ghost">{en ? "See the workflows" : zh("查看流程", locale)}</LinkButton>
          </>
        }
        aside={
          <div className="io-card">
            <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "Always decided by people" : zh("一律由人決定", locale)}</h2>
            <ul className="x-list small">{t(f.boundaries, locale).map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "The problem" : zh("問題", locale)} title={t(f.problem, locale)} />
        </div>
      </section>
      <section className="section section--surface" id="workflows">
        <div className="container">
          <SectionHead eyebrow={en ? "Example workflows" : zh("流程例子", locale)} title={en ? "What AI prepares, and who decides" : zh("AI 準備甚麼、由誰決定", locale)} />
          <div className="table-wrap">
            <table className="data">
              <caption className="sr-only">{en ? `Example workflows for ${t(f.name, locale)}` : zh(`${t(f.name, locale)}的流程例子`, locale)}</caption>
              <thead>
                <tr>
                  <th scope="col">{en ? "Workflow" : zh("流程", locale)}</th>
                  <th scope="col">{t(ui.inputs, locale)}</th>
                  <th scope="col">{en ? "Prepared output" : zh("準備好的輸出", locale)}</th>
                  <th scope="col">{t(ui.humanDecision, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {f.workflows.map((wf) => (
                  <tr key={wf.name.en}>
                    <th scope="row">{t(wf.name, locale)}</th>
                    <td>{t(wf.input, locale)}</td>
                    <td>{t(wf.output, locale)}</td>
                    <td>{t(wf.decision, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small" style={{ marginTop: 20 }}>
            <strong>{t(ui.startingScope, locale)}: </strong>
            {t(f.startingScope, locale)}
          </p>
          {ws ? (
            <p className="distinction" style={{ marginTop: 16 }}>
              {en ? "Related leadership pathway: " : zh("相關管理層路徑：", locale)}
              <Link href={href(locale, paths.workstream(ws.id))}>{t(ws.name, locale)}</Link>
            </p>
          ) : null}
        </div>
      </section>
      <SampleRecord locale={locale} label={f.sample.label} rows={f.sample.rows} />
      {f.solutions.length ? (
        <RelatedSection title={en ? "Business solutions" : zh("業務解決方案", locale)} tint>
          <SolutionCards locale={locale} ids={f.solutions} />
        </RelatedSection>
      ) : null}
      {f.products.length ? (
        <RelatedSection title={t(ui.relatedProducts, locale)}>
          <ProductCards locale={locale} ids={f.products} />
        </RelatedSection>
      ) : null}
      <RelatedSection title={t(ui.relatedServices, locale)} tint>
        <ServiceCards locale={locale} ids={f.services} />
      </RelatedSection>
      <RelatedSection title={t(ui.relatedIndustries, locale)}>
        <IndustryCards locale={locale} ids={f.industries} />
      </RelatedSection>
      <section className="section section--tight section--surface">
        <div className="container related-block">
          <h2>{en ? "Other functions" : zh("其他職能", locale)}</h2>
          <ul className="chips">
            {businessFunctions.filter((o) => o.id !== f.id).map((o) => (
              <li key={o.id}>
                <Link className="chip" href={href(locale, paths.function(o.id))}>{t(o.name, locale)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? `Discuss ${t(f.name, locale).toLowerCase()} workflows` : zh(`討論${t(f.name, locale)}流程`, locale)} body={t(f.startingScope, locale)} primary={{ label: t(ui.discussScope, locale), to: contact }} secondary={{ label: en ? "All functions" : zh("全部職能", locale), to: "/functions" }} />
    </>
  );
}
