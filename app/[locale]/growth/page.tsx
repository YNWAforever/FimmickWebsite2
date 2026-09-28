import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { objectives, services } from "@/content/services";
import { casesFor } from "@/content/relations";
import { ui } from "@/content/ui";
import type { ServiceObjective } from "@/content/types";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { CaseCards, EnquirySection, FunctionCards, RelatedSection, SolutionCards } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

const copy = {
  title: { en: "Growth solutions", zh: "增長方案" },
  lead: {
    en: "Acquire, convert and retain customers with one connected system: specialist services for each stage, AI workflows that prepare the repeated work, and people deciding what goes live.",
    zh: "以一套互相連繫的系統獲客、轉化及留客：每個階段都有專業服務，AI 流程負責準備重複工作，發布內容則由人決定。",
  },
};

const stages: ServiceObjective[] = ["acquire", "convert", "retain"];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/growth", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function GrowthPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const related = [...casesFor({ service: "digitalmarketing" }, 2), ...casesFor({ service: "crm-sales" }, 2)].filter((c, i, all) => all.findIndex((x) => x.slug === c.slug) === i).slice(0, 3);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: t(copy.title, locale), path: "/growth" }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Services" : zh("專業服務", locale), path: "/services" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Marketing & growth" : zh("市場推廣與增長", locale)}
        title={en ? "Growth that runs as one system." : zh("以一套系統推動增長。", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, paths.contact({ intent: "service" }))} variant="accent">{t(ui.discussScope, locale)}</LinkButton>
            <LinkButton to="#stages" variant="ghost">{en ? "Acquire · Convert · Retain" : zh("獲客・轉化・留客", locale)}</LinkButton>
          </>
        }
      />
      <section className="section" id="stages">
        <div className="container">
          <SectionHead eyebrow={en ? "Three stages" : zh("三個階段", locale)} title={en ? "Specialist services for each stage of growth" : zh("增長每個階段的專業服務", locale)} />
          <div className="grid grid-3">
            {stages.map((id, i) => {
              const o = objectives.find((x) => x.id === id)!;
              return (
                <div key={id} className="io-card">
                  <span className="number-tag">{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontSize: "1.25rem", margin: "8px 0 4px" }}>{t(o.name, locale)}</h3>
                  <p className="muted small">{t(o.question, locale)}</p>
                  <ul className="stack small" style={{ listStyle: "none", padding: 0, margin: "16px 0 0" }}>
                    {services.filter((s) => s.objective === id).map((s) => (
                      <li key={s.id}>
                        <Link href={href(locale, paths.service(s.id))}><strong>{t(s.name, locale)}</strong></Link>
                        <br />
                        <span className="muted">{t(s.eyebrow, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="small" style={{ marginTop: 24 }}>
            <Link className="text-link" href={href(locale, "/services")}>{en ? "All services, by objective" : zh("按目標查看全部服務", locale)} →</Link>
          </p>
        </div>
      </section>
      <RelatedSection title={en ? "AI solutions that support growth" : zh("支援增長的 AI 解決方案", locale)} tint>
        <SolutionCards locale={locale} ids={["market-intelligence", "content-production", "customer-engagement"]} />
      </RelatedSection>
      <RelatedSection title={en ? "Workflows for growth teams" : zh("增長團隊的流程", locale)}>
        <FunctionCards locale={locale} ids={["growth", "cx", "expansion"]} />
      </RelatedSection>
      {related.length ? (
        <RelatedSection title={t(ui.relatedCases, locale)} tint>
          <CaseCards locale={locale} items={related} />
        </RelatedSection>
      ) : null}
      <EnquirySection locale={locale} title={en ? "Tell us which stage is stuck" : zh("告訴我們哪個階段遇到阻滯", locale)} body={en ? "One objective, one market and the channels involved are enough to start." : zh("只需一個目標、一個市場及相關渠道，便可以開始。", locale)} primary={{ label: t(ui.discussScope, locale), to: paths.contact({ intent: "service" }) }} secondary={{ label: en ? "How to start" : zh("如何開始", locale), to: "/how-to-start" }} />
    </>
  );
}
