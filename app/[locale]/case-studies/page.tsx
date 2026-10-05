import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { cases, caseKindLabel } from "@/content/cases";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { ui } from "@/content/ui";
import type { CaseKind } from "@/content/types";
import { PageHero } from "@/components/ui";
import { CaseCard, EnquirySection } from "@/components/blocks";
import { CaseFilter } from "@/components/hubs/CaseFilter";

const copy = {
  title: { en: "Case studies", zh: "客戶案例" },
  lead: { en: "Client engagements, FIMMICK’s own transformation and — kept separate — labelled product examples. Each case states its publication basis and limitations.", zh: "客戶項目、FIMMICK 自身轉型，以及另行標示的產品示例。每個案例都列明發布依據及限制。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/case-studies", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

/** Static: the type, industry and capability filters run in the browser (CaseFilter, 8.2.1). */
export default async function CaseStudiesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const usedServices = services.filter((s) => cases.some((c) => c.services.includes(s.id)));
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "Work we did. Decisions people made." : zh("我們做過的工作，由人作出的決定。", locale)} accent={en ? "Decisions people made." : zh("由人作出的決定", locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <CaseFilter
            base={href(locale, "/case-studies")}
            cards={cases.map((c) => ({ id: c.slug, kind: c.kind, industry: c.industries, capability: c.services, content: <CaseCard locale={locale} c={c} heading="h2" /> }))}
            groups={[
              { key: "kind", label: en ? "Type" : zh("類型", locale), options: (["client-work", "internal-application"] as CaseKind[]).map((k) => ({ id: k, label: t(caseKindLabel[k], locale) })) },
              { key: "industry", label: en ? "Industry" : zh("行業", locale), options: industries.map((i) => ({ id: i.id, label: t(i.name, locale) })) },
              { key: "capability", label: en ? "Capability" : zh("能力", locale), options: usedServices.map((s) => ({ id: s.id, label: t(s.name, locale) })) },
            ]}
            labels={{ nav: en ? "Filter case studies" : zh("篩選案例", locale), all: t(ui.all, locale), results: t(ui.results, locale), clear: t(ui.clearFilters, locale), noResults: t(ui.noResults, locale) }}
          />
          <div className="distinction" style={{ marginTop: 32 }}>
            {en ? "Looking for product demonstrations? They are labelled samples, collected separately in " : zh("想查看產品示範？它們屬已標示的示例，另行收錄於", locale)}
            <Link href={href(locale, "/cases-and-demos")}>{en ? "Examples & demos" : zh("示例與示範", locale)}</Link>
            {en ? "." : "。"}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Discuss a similar piece of work" : zh("討論類似的工作", locale)} primary={{ label: t(ui.discussScope, locale), to: "/contact?intent=general" }} />
    </>
  );
}
