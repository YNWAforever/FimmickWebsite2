// Route sheets (8.2.3), first so they keep their place before component sheets.
import "@/app/styles/diagrams.css";
import "@/app/styles/examples.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, locales, t, zh } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import type { EnquiryContext } from "@/lib/intent";
import { capabilities, type Capability } from "@/content/platform-pages";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection, ExampleBlock, FlowStrip, FunctionCards, IndustryCards, ProductCards, RelatedSection, ServiceCards, SolutionCards } from "@/components/blocks";

type Props = { params: Promise<{ locale: string; capability: string }> };

/** Capability pages carried over from the reference site; integrations and governance have their own routes. */
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => capabilities.map((c) => ({ locale, capability: c.id })));
}

const find = (id: string) => capabilities.find((c) => c.id === id);

function contextFor(c: Capability): EnquiryContext {
  if (c.solution) return { intent: "demo", solution: c.solution, ...(c.example ? { example: c.example } : {}) };
  return { intent: "service", service: c.services[0] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const c = find((await params).capability);
  if (!c) return {};
  return pageMetadata({ locale, path: paths.capability(c.id), title: `${t(c.name, locale)} — FIMMICK AIP`, description: t(c.intro, locale) });
}

export default async function CapabilityPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const c = find((await params).capability);
  if (!c) notFound();
  const en = locale === "en";
  const contact = paths.contact(contextFor(c));
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(c.name, locale) }]}
        eyebrow={`${t(c.name, locale)} · ${t(c.eyebrow, locale)}`}
        title={t(c.title, locale)}
        accent={t(c.titleAccent, locale)}
        lead={t(c.intro, locale)}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{c.solution ? t(ui.requestDemo, locale) : t(ui.discussScope, locale)}</LinkButton>
            <LinkButton to="#how" variant="ghost">{en ? "How it works" : zh("運作方式", locale)}</LinkButton>
          </>
        }
        aside={
          <div className="io-card io-card--out">
            <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "What should change" : zh("應有的改變", locale)}</h2>
            <ul className="check-list small">{t(c.changes, locale).map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="micro muted" style={{ marginTop: 12 }}>{en ? "Aims of the workflow, not measured results. Results depend on your data and scope." : zh("這些是流程的目標，並非已量度的成果；實際結果視乎你的資料及範圍。", locale)}</p>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Principle" : zh("原則", locale)} title={t(c.principle, locale)} />
        </div>
      </section>
      <section className="section section--surface" id="how">
        <div className="container">
          <SectionHead eyebrow={en ? "Operating loop" : zh("運作循環", locale)} title={en ? "From input to a decision your team owns" : zh("由輸入到團隊負責的決定", locale)} />
          <FlowStrip locale={locale} steps={c.steps} humanIndex={3} />
          <div className="io-card" style={{ marginTop: 28 }}>
            <h3>{en ? "Boundaries" : zh("界線", locale)}</h3>
            <ul className="x-list small">{t(c.boundaries, locale).map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        </div>
      </section>
      {c.example ? (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={en ? "Try the sample" : zh("試用示例", locale)} title={en ? "Inspect a sample workflow" : zh("查看示例流程", locale)} />
            <ExampleBlock locale={locale} id={c.example} />
          </div>
        </section>
      ) : null}
      {c.solution ? (
        <RelatedSection title={en ? "Business solution" : zh("業務解決方案", locale)} tint>
          <SolutionCards locale={locale} ids={[c.solution]} />
        </RelatedSection>
      ) : null}
      {c.products.length ? (
        <RelatedSection title={t(ui.relatedProducts, locale)}>
          <ProductCards locale={locale} ids={c.products} />
        </RelatedSection>
      ) : null}
      <RelatedSection title={t(ui.relatedServices, locale)} tint>
        <ServiceCards locale={locale} ids={c.services} />
      </RelatedSection>
      <RelatedSection title={en ? "Teams that use it" : zh("適用團隊", locale)}>
        <FunctionCards locale={locale} ids={c.functions} />
      </RelatedSection>
      <RelatedSection title={t(ui.relatedIndustries, locale)} tint>
        <IndustryCards locale={locale} ids={c.industries} />
      </RelatedSection>
      <section className="section section--tight">
        <div className="container related-block">
          <h2>{en ? "Other capabilities" : zh("其他功能", locale)}</h2>
          <ul className="chips">
            {capabilities.filter((o) => o.id !== c.id).map((o) => (
              <li key={o.id}>
                <Link className="chip" href={href(locale, paths.capability(o.id))}>{t(o.name, locale)}</Link>
              </li>
            ))}
            <li><Link className="chip" href={href(locale, "/platform/integrations")}>{en ? "Integrations" : zh("系統串接", locale)}</Link></li>
            <li><Link className="chip" href={href(locale, "/platform/governance")}>{en ? "Governance" : zh("管治", locale)}</Link></li>
          </ul>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? `Put ${t(c.name, locale).toLowerCase()} to work on a real workflow` : zh(`把${t(c.name, locale)}用於真實流程`, locale)} primary={{ label: c.solution ? t(ui.requestDemo, locale) : t(ui.discussScope, locale), to: contact }} secondary={{ label: en ? "Platform overview" : zh("平台概覽", locale), to: "/platform" }} />
    </>
  );
}
