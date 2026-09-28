import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { objectives, services } from "@/content/services";
import { ui } from "@/content/ui";
import type { ServiceObjective } from "@/content/types";
import { PageHero, LinkButton } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ objective?: string }> };

const copy = {
  title: { en: "Services", zh: "專業服務" },
  lead: {
    en: "Sixteen specialist services, each with defined deliverables, inputs, review responsibilities and a starting scope. Commission a service on its own; an AIP subscription is not required.",
    zh: "十六項專業服務，每項都有明確的交付成果、所需輸入、審閱責任及起步範圍。服務可以單獨委託，無須訂閱 AIP。",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/services", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function ServicesPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const raw = (await searchParams).objective;
  const active = objectives.find((o) => o.id === raw)?.id as ServiceObjective | undefined;
  const shown = active ? objectives.filter((o) => o.id === active) : objectives;
  const base = href(locale, "/services");
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow={en ? "Specialist services" : zh("專業服務", locale)}
        title={en ? "Specialists for a defined job." : zh("為明確的工作引入專家。", locale)}
        lead={t(copy.lead, locale)}
        actions={<LinkButton to={href(locale, paths.contact({ intent: "service" }))} variant="accent">{en ? "Discuss a service" : zh("討論服務", locale)}</LinkButton>}
      />
      <section className="section">
        <div className="container">
          <nav className="filter-bar" aria-label={en ? "Filter services by objective" : zh("按目標篩選服務", locale)}>
            <div className="filter-group">
              <span className="filter-label">{en ? "Objective" : zh("目標", locale)}</span>
              <Link className="filter-pill" href={base} aria-current={!active ? "true" : undefined} scroll={false}>
                {t(ui.all, locale)} <span className="count">{services.length}</span>
              </Link>
              {objectives.map((o) => (
                <Link key={o.id} className="filter-pill" href={`${base}?objective=${o.id}`} aria-current={active === o.id ? "true" : undefined} scroll={false}>
                  {t(o.name, locale)} <span className="count">{services.filter((s) => s.objective === o.id).length}</span>
                </Link>
              ))}
            </div>
            {active ? (
              <p className="small">
                <Link href={base} scroll={false}>{t(ui.clearFilters, locale)}</Link>
              </p>
            ) : null}
          </nav>
          <div className="stack" style={{ ["--stack" as string]: "48px" }}>
            {shown.map((o) => (
              <section key={o.id} aria-labelledby={`obj-${o.id}`}>
                <div style={{ marginBottom: 20 }}>
                  <p className="eyebrow">{t(o.name, locale)}</p>
                  <h2 id={`obj-${o.id}`} style={{ fontSize: "1.6rem" }}>{t(o.question, locale)}</h2>
                </div>
                <div className="grid grid-3">
                  {services.filter((s) => s.objective === o.id).map((s) => (
                    <Link key={s.id} className="hub-card" href={href(locale, paths.service(s.id))}>
                      <span className="micro muted" style={{ fontWeight: 750 }}>{t(s.eyebrow, locale)}</span>
                      <h3>{t(s.name, locale)}</h3>
                      <p className="small muted">{t(s.summary, locale)}</p>
                      <p className="small"><strong>{en ? "Deliverables: " : zh("交付成果：", locale)}</strong>{t(s.deliverables, locale).slice(0, 3).join(" · ")}</p>
                      <span className="card-foot">{s.canonicalPath ? (en ? "Go to AI Transformation" : zh("前往 AI 轉型", locale)) : t(ui.learnMore, locale)} →</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
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
