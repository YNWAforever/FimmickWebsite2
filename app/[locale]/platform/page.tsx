import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { solutions } from "@/content/solutions";
import { productById } from "@/content/products";
import { governanceBoundary } from "@/content/platform";
import { capabilities } from "@/content/platform-pages";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { BeforeAfterBlock, EnquirySection, ExampleBlock, PlatformLayersBlock } from "@/components/blocks";
import { FlowScene } from "@/components/diagrams/FlowScene";

const copy = {
  title: { en: "FIMMICK AIP — Agentic AI Platform", zh: "FIMMICK AIP — 企業 AI 智能體平台" },
  lead: {
    en: "FIMMICK AIP connects approved data, AI tasks and human approvals into workflows your team can run and check. Four layers answer four business questions.",
    zh: "FIMMICK AIP 把已確認的資料、AI 任務及人手批核連成團隊可以運作及檢查的流程。四個層面回答四個業務問題。",
  },
};

const platformDetail = [
  { path: "/platform/architecture", title: { en: "Architecture", zh: "平台架構" }, copy: { en: "Four layers, eight building blocks and the path of one run.", zh: "四個層面、八個構成部分及一次運作的路徑。" } },
  { path: "/platform/agents", title: { en: "AI agents & tasks", zh: "AI 智能體與任務" }, copy: { en: "What an agent must define, and three levels of autonomy.", zh: "智能體必須界定的內容，以及三個自主程度。" } },
  { path: "/platform/marketplace", title: { en: "Workflow templates", zh: "流程範本" }, copy: { en: "Starting patterns configured for your data and reviewers.", zh: "按你的資料及審閱人配置的起步範本。" } },
  { path: "/platform/integrations", title: { en: "Integrations", zh: "系統串接" }, copy: { en: "How connections to your CMS, CRM, messaging and data are scoped and approved.", zh: "如何界定及批准與 CMS、CRM、訊息渠道及資料的串接。" } },
  { path: "/platform/governance", title: { en: "Governance", zh: "管治" }, copy: { en: "Purpose-limited access, human decisions and visible records.", zh: "按目的限制存取、由人決策，以及清晰可見的記錄。" } },
  { path: "/platform/pricing", title: { en: "Pricing & engagement", zh: "收費及合作模式" }, copy: { en: "What drives cost and how we quote after scoping.", zh: "影響費用的因素，以及界定範圍後如何報價。" } },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function PlatformPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale) }]}
        eyebrow={en ? "Platform" : zh("平台", locale)}
        title={en ? "Four layers. One workflow you can run." : zh("四個層面，一個可以運作的流程。", locale)}
        accent={en ? "One workflow you can run." : zh("一個可以運作的流程", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, "/contact?intent=demo")} variant="accent">{t(ui.requestDemo, locale)}</LinkButton>
            <LinkButton to="#layers" variant="ghost">{en ? "The four layers" : zh("四個層面", locale)}</LinkButton>
          </>
        }
        aside={<FlowScene locale={locale} />}
      />
      <section className="section section--night" id="layers">
        <div className="container">
          <SectionHead
            eyebrow={en ? "Four layers · one scenario" : zh("四個層面·一個情境", locale)}
            title={en ? "Brand context → content preparation → human review → selected export → record" : zh("品牌資料 → 內容準備 → 人手審閱 → 選定匯出 → 記錄", locale)}
            lead={en ? "Select a layer to see what it does in the sample scenario. On smaller screens every layer is listed in order." : zh("選擇一個層面，查看它在示例情境中的作用。在較小的螢幕上，所有層面會按次序列出。", locale)}
          />
          <PlatformLayersBlock locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Before and after" : zh("前後對比", locale)} title={en ? "What changes in the work" : zh("工作有何改變", locale)} />
          <BeforeAfterBlock locale={locale} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "The same scenario, hands-on" : zh("同一情境，親身試用", locale)} title={en ? "Edit the draft, review it, export the sample" : zh("修改草稿、審閱，再匯出示例", locale)} />
          <ExampleBlock locale={locale} id="content" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "What runs on the platform" : zh("平台上運作的工作", locale)} title={en ? "Four business jobs, six products" : zh("四項業務工作，六個產品", locale)} />
          <div className="grid grid-4">
            {solutions.map((s) => (
              <Link key={s.id} className="hub-card" href={href(locale, paths.solution(s.id))}>
                <span className="number-tag">{s.number}</span>
                <h3>{t(s.name, locale)}</h3>
                <p className="small muted">{s.products.map((p) => productById(p).name).join(" · ")}</p>
                <span className="card-foot">{t(ui.learnMore, locale)} →</span>
              </Link>
            ))}
          </div>
          <SectionHead as="h3" eyebrow={en ? "Capabilities" : zh("功能", locale)} title={en ? "What the platform does across those jobs" : zh("平台在這些工作中的功能", locale)} />
          <div className="grid grid-3">
            {capabilities.map((c) => (
              <Link key={c.id} className="hub-card" href={href(locale, paths.capability(c.id))}>
                <h3>{t(c.name, locale)}</h3>
                <p className="muted small">{t(c.intro, locale)}</p>
                <span className="card-foot">{t(ui.learnMore, locale)} →</span>
              </Link>
            ))}
            <Link className="hub-card" href={href(locale, "/functions")}>
              <h3>{en ? "Workflows by function" : zh("按職能劃分的流程", locale)}</h3>
              <p className="muted small">{en ? "Marketing, operations, finance, HR, customer experience, expansion and leadership." : zh("市場、營運、財務、人力資源、顧客體驗、市場拓展及管理層。", locale)}</p>
              <span className="card-foot">{t(ui.learnMore, locale)} →</span>
            </Link>
          </div>
          <div style={{ marginTop: 40 }}>
            <SectionHead as="h3" eyebrow={en ? "How it is built" : zh("平台如何建立", locale)} title={en ? "Architecture, agents and controls" : zh("架構、智能體及控制", locale)} />
          </div>
          <div className="grid grid-3">
            {platformDetail.map((d) => (
              <Link key={d.path} className="hub-card" href={href(locale, d.path)}>
                <h3>{t(d.title, locale)}</h3>
                <p className="muted small">{t(d.copy, locale)}</p>
                <span className="card-foot">{t(ui.learnMore, locale)} →</span>
              </Link>
            ))}
          </div>
          <p className="micro muted" style={{ marginTop: 24 }}>{t(governanceBoundary, locale)}</p>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "See the platform on your workflow" : zh("以你的流程了解平台", locale)} body={en ? "A demo request is reviewed by our team; we confirm a time with you by email." : zh("我們的團隊會審閱示範要求，並以電郵與你確認時間。", locale)} primary={{ label: t(ui.requestDemo, locale), to: "/contact?intent=demo" }} secondary={{ label: t(ui.discussConfiguration, locale), to: "/contact?intent=configuration" }} />
    </>
  );
}
