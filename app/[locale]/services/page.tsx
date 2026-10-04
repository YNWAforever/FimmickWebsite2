import type { Metadata } from "next";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { objectives, services } from "@/content/services";
import { ui } from "@/content/ui";
import { PageHero, LinkButton, SectionHead } from "@/components/ui";
import { EditorialList, EnquirySection } from "@/components/blocks";
import { ObjectiveFilter } from "@/components/hubs/ObjectiveFilter";

const copy = {
  title: { en: "Services", zh: "專業服務" },
  lead: {
    en: "Sixteen specialist services, each with defined deliverables, inputs, review responsibilities and a starting scope. Commission a service on its own; an AIP subscription is not required.",
    zh: "十六項專業服務，每項都有明確的交付成果、所需輸入、審閱責任及起步範圍。服務可以單獨委託，無須訂閱 AIP。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/services", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

/** Static: the objective filter runs in the browser (ObjectiveFilter), not on `?objective=`. */
export default async function ServicesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const base = href(locale, "/services");
  // Rows are numbered across the whole list, in objective order.
  const ordered = objectives.flatMap((o) => services.filter((s) => s.objective === o.id));
  const groups = objectives.map((o) => {
    const rows = services.filter((s) => s.objective === o.id);
    const start = ordered.indexOf(rows[0]) + 1;
    return {
      id: o.id,
      label: t(o.name, locale),
      count: rows.length,
      content: (
        <section aria-labelledby={`obj-${o.id}`}>
          <SectionHead eyebrow={t(o.name, locale)} title={<span id={`obj-${o.id}`}>{t(o.question, locale)}</span>} />
          <EditorialList
            start={start}
            rows={rows.map((s) => ({
              id: s.id,
              href: href(locale, s.canonicalPath ?? paths.service(s.id)),
              label: t(s.name, locale),
              headline: t(s.eyebrow, locale),
              accent: s.headlineAccent ? t(s.headlineAccent, locale) : undefined,
              line: t(s.summary, locale),
              aside: (
                <ul className="editorial-row__list">
                  {t(s.deliverables, locale).slice(0, 2).map((d) => <li key={d}>{d}</li>)}
                </ul>
              ),
            }))}
          />
        </section>
      ),
    };
  });
  return (
    <>
      <PageHero
        locale={locale}
        photo={"specialist-desk"}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow={en ? "Specialist services" : zh("專業服務", locale)}
        title={en ? "Specialists for a defined job." : zh("為明確的工作引入專家。", locale)}
        lead={t(copy.lead, locale)}
        actions={<LinkButton to={href(locale, paths.contact({ intent: "service" }))} variant="accent">{en ? "Discuss a service" : zh("討論服務", locale)}</LinkButton>}
      />
      <section className="section">
        <div className="container">
          <ObjectiveFilter
            base={base}
            groups={groups}
            labels={{ nav: en ? "Filter services by objective" : zh("按目標篩選服務", locale), filter: en ? "Objective" : zh("目標", locale), all: t(ui.all, locale), clear: t(ui.clearFilters, locale) }}
          />
        </div>
      </section>
      <EnquirySection
        locale={locale}
        title={en ? "Not sure which service you need?" : zh("不確定需要哪項服務？", locale)}
        body={en ? "Describe the job and the result you need; we will suggest a defined starting scope." : zh("描述你的工作及期望成果，我們會建議明確的起步範圍。", locale)}
        primary={{ label: en ? "Discuss a service" : zh("討論服務", locale), to: paths.contact({ intent: "service" }) }}
        secondary={{ label: en ? "How to start" : zh("如何開始", locale), to: "/how-to-start" }}
      />
    </>
  );
}
