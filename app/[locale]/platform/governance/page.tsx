// Route sheets (8.2.3), first so they keep their place before component sheets.
import "@/app/styles/diagrams.css";
import type { Metadata } from "next";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { governanceBoundary, governancePrinciples } from "@/content/platform";
import { workstreamById } from "@/content/transformation";
import { PageHero, SectionHead, LinkButton, TextLink } from "@/components/ui";
import { EnquirySection, PlatformLayersBlock } from "@/components/blocks";

const copy = {
  title: { en: "Governance", zh: "管治" },
  lead: { en: "Governance is built into each workflow: what it may access, what it prepares, where people decide and what is recorded.", zh: "管治融入每個流程：可存取甚麼、準備甚麼、由人在哪裏決定，以及記錄甚麼。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform/governance", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function GovernancePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const ws = workstreamById("governance-adoption");
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]} eyebrow={en ? "Platform" : zh("平台", locale)} title={en ? "Useful AI work, with people in charge." : zh("讓 AI 做有用的工作，由人掌舵。", locale)} accent={en ? "with people in charge." : zh("由人掌舵", locale)} lead={t(copy.lead, locale)} actions={<LinkButton to={href(locale, paths.workstream(ws.id))} variant="ghost">{t(ws.name, locale)}</LinkButton>} />
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            {governancePrinciples.map((g, i) => (
              <div key={g.title.en} className="io-card">
                <span className="number-tag">0{i + 1}</span>
                <h2 style={{ fontSize: "1.2rem", margin: "8px 0 10px" }}>{t(g.title, locale)}</h2>
                <p className="muted">{t(g.copy, locale)}</p>
              </div>
            ))}
          </div>
          <p className="distinction" style={{ marginTop: 24 }}>{t(governanceBoundary, locale)}</p>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Where governance sits" : zh("管治所在", locale)} title={en ? "The approvals and records layers in practice" : zh("批核及記錄層的實際運作", locale)} />
          <PlatformLayersBlock locale={locale} variant="light" />
          <p style={{ marginTop: 24 }}>
            <TextLink to={href(locale, "/ai-transformation/governance-adoption")}>{en ? "Governance & Adoption for leadership teams" : zh("為管理團隊而設的管治與推行", locale)}</TextLink>
          </p>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Discuss review points for your workflow" : zh("討論你流程中的審閱環節", locale)} primary={{ label: en ? "Discuss governance" : zh("討論管治", locale), to: paths.contact({ intent: "transformation", workstream: "governance-adoption" }) }} />
    </>
  );
}
