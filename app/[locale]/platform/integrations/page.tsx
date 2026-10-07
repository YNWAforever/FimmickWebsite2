import type { Metadata } from "next";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { integrationNotes, integrationTypes, governanceBoundary } from "@/content/platform";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection, ServiceCards } from "@/components/blocks";

const copy = {
  // The H1 (award pass 3); `title` stays the page's name in the crumbs and <title>.
  headline: { en: "Connections scoped per workflow, approved by the system owner.", zh: "按流程界定的串接，由系統負責人批准。" },
  accent: { en: "approved by the system owner.", zh: "由系統負責人批准" },
  title: { en: "Integrations", zh: "系統串接" },
  lead: { en: "Connections are configured per workflow, tested with you and approved by the system owner. Where a connection is not in place, the output is a labelled export.", zh: "系統串接按流程設定，與你一同測試，並由系統負責人批准。未有串接時，輸出會以已標示的匯出檔提供。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform/integrations", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function IntegrationsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]} eyebrow={en ? "Platform" : zh("平台", locale)} title={t(copy.headline, locale)} accent={t(copy.accent, locale)} lead={t(copy.lead, locale)} actions={<LinkButton to={href(locale, "/contact?intent=deployment")} variant="accent">{en ? "Discuss a connection" : zh("討論系統串接", locale)}</LinkButton>} />
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            {integrationNotes.map((n) => (
              <div key={n.title.en} className="io-card">
                <h2 style={{ fontSize: "1.2rem", marginBottom: 10 }}>{t(n.title, locale)}</h2>
                <p className="muted">{t(n.copy, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Connection types" : zh("串接類型", locale)} title={en ? "What we typically connect, and how" : zh("一般串接的系統及方式", locale)} />
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">{en ? "Type" : zh("類型", locale)}</th>
                  <th scope="col">{en ? "Examples" : zh("例子", locale)}</th>
                  <th scope="col">{en ? "Default mode" : zh("預設模式", locale)}</th>
                </tr>
              </thead>
              <tbody>
                {integrationTypes.map((i) => (
                  <tr key={i.name.en}>
                    <td><strong>{t(i.name, locale)}</strong></td>
                    <td>{t(i.examples, locale)}</td>
                    <td>{t(i.mode, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="micro muted" style={{ marginTop: 16 }}>{t(governanceBoundary, locale)}</p>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container related-block">
          <h2>{t(ui.relatedServices, locale)}</h2>
          <ServiceCards locale={locale} ids={["data-hub", "workflow-automation", "crm-sales"]} />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Check whether your systems can connect" : zh("確認你的系統能否串接", locale)} primary={{ label: en ? "Discuss deployment support" : zh("討論部署支援", locale), to: "/contact?intent=deployment" }} />
    </>
  );
}
