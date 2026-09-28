import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { solutions } from "@/content/solutions";
import { productById } from "@/content/products";
import { governanceBoundary } from "@/content/platform";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { BeforeAfterBlock, EnquirySection, ExampleBlock, PlatformLayersBlock } from "@/components/blocks";
import { FlowScene } from "@/components/diagrams/FlowScene";

const copy = {
  title: { en: "FIMMICK AIP — Agentic AI Platform", zh: "FIMMICK AIP — 企業 AI 智能體平台" },
  lead: {
    en: "FIMMICK AIP connects approved data, AI tasks and human approvals into workflows your team can run and check. Four layers answer four business questions.",
    zh: "FIMMICK AIP 把已確認的資料、AI 任務及人手審批連成團隊可以運作及檢查的流程。四個層面回答四個業務問題。",
  },
};

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
        crumbs={[{ label: en ? "Platform" : "平台" }]}
        eyebrow={en ? "Platform" : "平台"}
        title={en ? "Connect data, AI tasks and human approvals into workflows you can run." : "把資料、AI 任務與人手審批，連成可執行的流程。"}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, "/contact?intent=demo")} variant="accent">{t(ui.requestDemo, locale)}</LinkButton>
            <LinkButton to="#layers" variant="ghost">{en ? "The four layers" : "四個層面"}</LinkButton>
          </>
        }
        aside={<FlowScene locale={locale} />}
      />
      <section className="section section--night" id="layers">
        <div className="container">
          <SectionHead
            eyebrow={en ? "Four layers · one scenario" : "四個層面・一個情境"}
            title={en ? "Brand context → content preparation → human review → selected export → record" : "品牌資料 → 內容準備 → 人手審閱 → 選定匯出 → 記錄"}
            lead={en ? "Select a layer to see what it does in the sample scenario. On smaller screens every layer is listed in order." : "選擇一個層面，查看它在示例情境中的作用。在較小的螢幕上，所有層面會按次序列出。"}
          />
          <PlatformLayersBlock locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Before and after" : "前後對比"} title={en ? "What changes in the work" : "工作有何改變"} />
          <BeforeAfterBlock locale={locale} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "The same scenario, hands-on" : "同一情境，親身試用"} title={en ? "Edit the draft, review it, export the sample" : "修改草稿、審閱，再匯出示例"} />
          <ExampleBlock locale={locale} id="content" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "What runs on the platform" : "平台上運作的工作"} title={en ? "Four business jobs, six products" : "四項業務工作，六個產品"} />
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
          <div className="grid grid-2" style={{ marginTop: 32 }}>
            <Link className="hub-card" href={href(locale, "/platform/integrations")}>
              <h3>{en ? "Integrations" : "系統串接"}</h3>
              <p className="muted">{en ? "How connections to your CMS, CRM, messaging and data are scoped and approved." : "如何界定及批准與 CMS、CRM、訊息渠道及資料的串接。"}</p>
              <span className="card-foot">{t(ui.learnMore, locale)} →</span>
            </Link>
            <Link className="hub-card" href={href(locale, "/platform/governance")}>
              <h3>{en ? "Governance" : "管治"}</h3>
              <p className="muted">{en ? "Purpose-limited access, human decisions and visible records." : "按目的限制存取、由人決策，以及清晰可見的記錄。"}</p>
              <span className="card-foot">{t(ui.learnMore, locale)} →</span>
            </Link>
          </div>
          <p className="micro muted" style={{ marginTop: 24 }}>{t(governanceBoundary, locale)}</p>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "See the platform on your workflow" : "以你的流程了解平台"} body={en ? "A demo request is reviewed by our team; we confirm a time with you by email." : "我們的團隊會審閱示範要求，並以電郵與你確認時間。"} primary={{ label: t(ui.requestDemo, locale), to: "/contact?intent=demo" }} secondary={{ label: t(ui.discussConfiguration, locale), to: "/contact?intent=configuration" }} />
    </>
  );
}
