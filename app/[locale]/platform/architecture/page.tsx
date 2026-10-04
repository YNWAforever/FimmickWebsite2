import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { buildingBlocks, runSteps } from "@/content/platform-pages";
import { governanceBoundary, integrationNotes } from "@/content/platform";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection, PlatformLayersBlock } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

const copy = {
  title: { en: "Platform architecture", zh: "平台架構" },
  lead: {
    en: "How FIMMICK AIP is put together: four layers, eight building blocks and one path every workflow run follows — from trigger to record.",
    zh: "FIMMICK AIP 的組成：四個層面、八個構成部分，以及每次流程運作都會依循的路徑——由觸發到記錄。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform/architecture", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function ArchitecturePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Platform" : zh("平台", locale), path: "/platform" }, { name: t(copy.title, locale), path: "/platform/architecture" }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Platform" : zh("平台", locale)}
        title={en ? "Context in. Reviewed work out. A record of both." : zh("資料輸入，經審閱的工作輸出，兩者都有紀錄。", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, paths.contact({ intent: "configuration" }))} variant="accent">{t(ui.discussConfiguration, locale)}</LinkButton>
            <LinkButton to="#run" variant="ghost">{en ? "Follow one run" : zh("跟隨一次運作", locale)}</LinkButton>
          </>
        }
      />
      <section className="section section--night">
        <div className="container">
          <SectionHead eyebrow={en ? "Four layers" : zh("四個層面", locale)} title={en ? "Data → tasks → approvals → records" : zh("資料 → 任務 → 批核 → 記錄", locale)} lead={en ? "Each layer answers one business question. Select a layer to see its role in the sample scenario." : zh("每個層面回答一個業務問題。選擇一個層面，查看它在示例情境中的作用。", locale)} />
          <PlatformLayersBlock locale={locale} />
        </div>
      </section>
      <section className="section" id="run">
        <div className="container">
          <SectionHead eyebrow={en ? "One workflow run" : zh("一次流程運作", locale)} title={en ? "Seven steps, one of them always human" : zh("七個步驟，其中一步必定由人負責", locale)} />
          <ol className="flow-strip flow-strip--seven">
            {runSteps.map((s, i) => {
              const role = i === 4 ? "review" : i === 0 ? "source" : i === runSteps.length - 1 ? "result" : "work";
              return (
                <li key={s.title.en} data-role={role}>
                  <span className="role">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t(s.title, locale)}</h3>
                  <p>{t(s.copy, locale)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Building blocks" : zh("構成部分", locale)} title={en ? "What each part does, and who controls it" : zh("每個部分的作用及控制者", locale)} />
          <div className="table-wrap">
            <table className="data">
              <caption className="sr-only">{en ? "Platform building blocks" : zh("平台構成部分", locale)}</caption>
              <thead>
                <tr>
                  <th scope="col">{en ? "Building block" : zh("構成部分", locale)}</th>
                  <th scope="col">{en ? "Role" : zh("作用", locale)}</th>
                  <th scope="col">{en ? "Control" : zh("控制", locale)}</th>
                </tr>
              </thead>
              <tbody>
                {buildingBlocks.map((b) => (
                  <tr key={b.name.en}>
                    <th scope="row">{t(b.name, locale)}</th>
                    <td>{t(b.role, locale)}</td>
                    <td>{t(b.control, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Connections and data" : zh("串接及資料", locale)} title={en ? "Your systems stay the source of truth" : zh("你的系統仍是唯一可信來源", locale)} />
          <div className="grid grid-2">
            {integrationNotes.map((n) => (
              <div key={n.title.en} className="io-card">
                <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{t(n.title, locale)}</h3>
                <p className="muted small">{t(n.copy, locale)}</p>
              </div>
            ))}
          </div>
          <p className="distinction" style={{ marginTop: 24 }}>{t(governanceBoundary, locale)}</p>
          <div className="grid grid-3" style={{ marginTop: 32 }}>
            <Link className="hub-card" href={href(locale, "/platform/integrations")}>
              <h3>{en ? "Integrations" : zh("系統串接", locale)}</h3>
              <p className="muted small">{en ? "Connection types and how each is scoped." : zh("串接類型及界定方式。", locale)}</p>
              <span className="card-foot">{t(ui.learnMore, locale)} →</span>
            </Link>
            <Link className="hub-card" href={href(locale, "/platform/governance")}>
              <h3>{en ? "Governance" : zh("管治", locale)}</h3>
              <p className="muted small">{en ? "Access, decisions and records." : zh("存取、決定及紀錄。", locale)}</p>
              <span className="card-foot">{t(ui.learnMore, locale)} →</span>
            </Link>
            <Link className="hub-card" href={href(locale, "/platform/agents")}>
              <h3>{en ? "AI agents & tasks" : zh("AI 智能體與任務", locale)}</h3>
              <p className="muted small">{en ? "What an agent must define before it runs." : zh("智能體運作前必須界定的內容。", locale)}</p>
              <span className="card-foot">{t(ui.learnMore, locale)} →</span>
            </Link>
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Map your systems to the four layers" : zh("把你的系統對應到四個層面", locale)} body={en ? "We start with the sources and outputs you already have, then decide which connections are worth building." : zh("我們會由你現有的來源及輸出開始，再決定哪些串接值得建立。", locale)} primary={{ label: t(ui.discussConfiguration, locale), to: paths.contact({ intent: "configuration" }) }} secondary={{ label: en ? "Platform overview" : zh("平台概覽", locale), to: "/platform" }} />
    </>
  );
}
