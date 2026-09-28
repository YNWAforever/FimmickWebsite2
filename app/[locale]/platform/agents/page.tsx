import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { agentAnatomy, autonomyLevels, taskPatterns } from "@/content/platform-pages";
import { governanceBoundary } from "@/content/platform";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection, PlatformLayersBlock } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

const copy = {
  title: { en: "AI agents & tasks", zh: "AI 智能體與任務" },
  lead: {
    en: "In FIMMICK AIP, an agent is a configured sequence of AI tasks with one purpose, approved inputs, permitted tools and a named human owner. Here is what that means in practice.",
    zh: "在 FIMMICK AIP 中，智能體是一組已配置的 AI 任務：目的單一、輸入已確認、工具獲准使用，並有指定的人手負責人。以下說明實際運作方式。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform/agents", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function AgentsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Platform" : zh("平台", locale), path: "/platform" }, { name: t(copy.title, locale), path: "/platform/agents" }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Platform" : zh("平台", locale)}
        title={en ? "Agents that prepare the work. People who decide." : zh("由智能體準備工作，由人作決定。", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, paths.contact({ intent: "demo" }))} variant="accent">{t(ui.requestDemo, locale)}</LinkButton>
            <LinkButton to="#anatomy" variant="ghost">{en ? "Anatomy of an agent" : zh("智能體的組成", locale)}</LinkButton>
          </>
        }
        aside={
          <div className="io-card">
            <h2 style={{ fontSize: "1rem", marginBottom: 10 }}>{en ? "What an agent is not" : zh("智能體不是甚麼", locale)}</h2>
            <ul className="x-list small">
              <li>{en ? "A replacement employee or a headcount figure" : zh("取代員工，或一個人手數字", locale)}</li>
              <li>{en ? "Free to use any data it can reach" : zh("可隨意使用任何能接觸到的資料", locale)}</li>
              <li>{en ? "Able to publish, send or spend on its own" : zh("可自行發布、發送或支出", locale)}</li>
            </ul>
          </div>
        }
      />
      <section className="section" id="anatomy">
        <div className="container">
          <SectionHead eyebrow={en ? "Anatomy" : zh("組成", locale)} title={en ? "Six things every agent must define before it runs" : zh("每個智能體運作前必須界定的六項內容", locale)} />
          <div className="grid grid-3">
            {agentAnatomy.map((a, i) => (
              <div key={a.title.en} className="io-card">
                <span className="number-tag">{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ fontSize: "1.1rem", margin: "8px 0" }}>{t(a.title, locale)}</h3>
                <p className="muted small">{t(a.copy, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Task patterns" : zh("任務類型", locale)} title={en ? "Eight kinds of task agents combine" : zh("智能體組合運用的八種任務", locale)} lead={en ? "Every workflow is built from a few of these. Each has a clear limit." : zh("每個流程都由其中幾種任務組成，每種任務都有清晰的界限。", locale)} />
          <div className="table-wrap">
            <table className="data">
              <caption className="sr-only">{en ? "Task patterns, examples and limits" : zh("任務類型、例子及界限", locale)}</caption>
              <thead>
                <tr>
                  <th scope="col">{en ? "Task" : zh("任務", locale)}</th>
                  <th scope="col">{en ? "What it does" : zh("作用", locale)}</th>
                  <th scope="col">{en ? "Typical example" : zh("常見例子", locale)}</th>
                  <th scope="col">{en ? "Never does" : zh("永不會做", locale)}</th>
                </tr>
              </thead>
              <tbody>
                {taskPatterns.map((p) => (
                  <tr key={p.name.en}>
                    <th scope="row">{t(p.name, locale)}</th>
                    <td>{t(p.does, locale)}</td>
                    <td>{t(p.example, locale)}</td>
                    <td>{t(p.never, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Autonomy" : zh("自主程度", locale)} title={en ? "Three levels of autonomy — agreed per workflow" : zh("三個自主程度——按流程議定", locale)} />
          <ol className="steps steps--row" style={{ ["--cols" as string]: "3" }}>
            {autonomyLevels.map((l) => (
              <li key={l.level}>
                <p className="number-tag">{en ? `Level ${l.level}` : zh(`第 ${l.level} 級`, locale)}</p>
                <h3>{t(l.name, locale)}</h3>
                <p>{t(l.copy, locale)}</p>
                <p className="small muted">{t(l.examples, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section--night">
        <div className="container">
          <SectionHead eyebrow={en ? "Where agents sit" : zh("智能體的位置", locale)} title={en ? "Agents run inside the four platform layers" : zh("智能體在平台的四個層面內運作", locale)} />
          <PlatformLayersBlock locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-3">
          <Link className="hub-card" href={href(locale, "/platform/marketplace")}>
            <h3>{en ? "Workflow templates" : zh("流程範本", locale)}</h3>
            <p className="muted small">{en ? "Nine starting patterns, each configured for your data and reviewers." : zh("九個起步範本，按你的資料及審閱人配置。", locale)}</p>
            <span className="card-foot">{t(ui.learnMore, locale)} →</span>
          </Link>
          <Link className="hub-card" href={href(locale, "/platform/architecture")}>
            <h3>{en ? "Architecture" : zh("平台架構", locale)}</h3>
            <p className="muted small">{en ? "How a workflow run moves from trigger to record." : zh("流程如何由觸發到記錄。", locale)}</p>
            <span className="card-foot">{t(ui.learnMore, locale)} →</span>
          </Link>
          <Link className="hub-card" href={href(locale, "/functions")}>
            <h3>{en ? "Workflows by function" : zh("按職能劃分的流程", locale)}</h3>
            <p className="muted small">{en ? "Examples for marketing, operations, finance, HR, CX and leadership." : zh("市場、營運、財務、人力資源、顧客體驗及管理層的例子。", locale)}</p>
            <span className="card-foot">{t(ui.learnMore, locale)} →</span>
          </Link>
        </div>
        <div className="container">
          <p className="micro muted" style={{ marginTop: 24 }}>{t(governanceBoundary, locale)}</p>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Design the first agent around one workflow" : zh("圍繞一個流程設計首個智能體", locale)} primary={{ label: t(ui.requestDemo, locale), to: paths.contact({ intent: "demo" }) }} secondary={{ label: t(ui.discussConfiguration, locale), to: paths.contact({ intent: "configuration" }) }} />
    </>
  );
}
