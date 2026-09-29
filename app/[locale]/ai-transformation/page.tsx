import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { readinessTopics, workstreams, workstreamById } from "@/content/transformation";
import { caseBySlug } from "@/content/cases";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton, Faq } from "@/components/ui";
import { CaseCards, EnquirySection, HeatmapTable, RoadmapBlock, ServiceCards } from "@/components/blocks";

const copy = {
  title: { en: "AI Transformation", zh: "AI 轉型" },
  lead: {
    en: "FIMMICK helps leadership teams decide where AI should change the work, design those workflows with clear human decisions, and build the governance and skills to run them.",
    zh: "FIMMICK 協助管理團隊決定 AI 應在哪裏改變工作、以清晰的人手決策設計流程，並建立運作所需的管治及能力。",
  },
};

const faqs = [
  { q: { en: "Do we have to buy all six workstreams?", zh: "我們需要購買全部六個工作範疇嗎？" }, a: { en: "No. They form a programme framework. Most organisations begin with one — often a readiness assessment or a single workflow design.", zh: "不需要。六個範疇組成一個計劃框架，大部分機構只由其中一個開始，通常是準備度評估或單一流程設計。" } },
  { q: { en: "Is the readiness assessment a score?", zh: "準備度評估是一個分數嗎？" }, a: { en: "It is an evidence-based view of what can move now, what needs preparation and what should wait. We do not publish a generic maturity score.", zh: "它以證據說明哪些可即時推進、哪些需要準備、哪些應暫緩；我們不會給出籠統的成熟度分數。" } },
  { q: { en: "Can FIMMICK also build what the roadmap recommends?", zh: "FIMMICK 可以執行路線圖的建議嗎？" }, a: { en: "Yes, through FIMMICK AIP products and specialist services — but delivery is scoped separately and you are free to use other providers.", zh: "可以，透過 FIMMICK AIP 產品及專業服務執行；但執行工作會另行界定範圍，你亦可選用其他供應商。" } },
  { q: { en: "How long does it take?", zh: "需要多長時間？" }, a: { en: "Timing depends on scope and is agreed before starting. Any timeline shown on this site is an illustrative example, not a commitment.", zh: "時間視乎範圍，會在開始前議定。本網站所示的任何時間表均為示例，並非承諾。" } },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/ai-transformation", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function TransformationPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const internal = caseBySlug("fimmick-ai-native-operating-model")!;
  return (
    <>
      <PageHero
        locale={locale}
        photo={"workshop-wall"}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow={en ? "For leadership teams" : zh("為管理團隊而設", locale)}
        title={en ? "Plan the change before scaling the tools." : zh("先規劃轉變，再擴大工具應用。", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, paths.contact({ intent: "transformation" }))} variant="accent">{en ? "Discuss a transformation scope" : zh("討論轉型範圍", locale)}</LinkButton>
            <LinkButton to={href(locale, "/workshop")} variant="ghost">{en ? "Leadership workshop" : zh("管理層工作坊", locale)}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Four decision pathways" : zh("四條決策路徑", locale)} title={en ? "The questions leaders need answered" : zh("管理層需要解答的問題", locale)} />
          <div className="grid grid-2">
            {workstreams.map((w) => (
              <Link key={w.id} className="hub-card" href={href(locale, paths.workstream(w.id))}>
                <span className="number-tag">{w.code}</span>
                <h3>{t(w.name, locale)}</h3>
                <p className="muted">{t(w.leadershipQuestion, locale)}</p>
                <p className="small"><strong>{en ? "You receive: " : zh("你會得到：", locale)}</strong>{t(w.artifactLabel, locale)} — {w.deliverables.map((d) => t(d.title, locale)).join(", ")}</p>
                <span className="card-foot">{t(ui.learnMore, locale)} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Where are you now?" : zh("你現在處於哪個階段？", locale)} title={en ? "Pick the statement closest to your situation" : zh("選出最接近你情況的描述", locale)} lead={en ? "An indicative starting point for a conversation — not a diagnosis or a maturity score." : zh("作為傾談起點的參考，並非診斷或成熟度分數。", locale)} />
          <div className="grid grid-2">
            {readinessTopics.map((r) => {
              const w = workstreamById(r.suggests);
              return (
                <Link key={r.id} className="hub-card" href={href(locale, paths.workstream(w.id))}>
                  <h3>“{t(r.label, locale)}”</h3>
                  <p className="muted">{t(r.prompt, locale)}</p>
                  <span className="card-foot">{en ? "Start with" : zh("由此開始：", locale)} {t(w.name, locale)} →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Six workstreams" : zh("六個工作範疇", locale)} title={en ? "How the programme connects" : zh("計劃如何連貫", locale)} lead={en ? "Select a workstream to see the decision it supports, its inputs, the deliverable and who is responsible." : zh("選擇一個範疇，查看它支援的決定、所需輸入、成果及負責人。", locale)} />
          <RoadmapBlock locale={locale} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Sample artifact" : zh("成果示例", locale)}</p>
            <h2>{en ? "A readiness heatmap, with the evidence behind each rating" : zh("附評級依據的準備度熱圖", locale)}</h2>
            <p className="muted">{en ? "Illustrative data. In an engagement each rating links to interview notes, workflow examples and system facts." : zh("示例資料。在實際項目中，每個評級都會連結到訪談筆記、流程例子及系統資料。", locale)}</p>
            <Link className="text-link" href={href(locale, "/resources/guides")}>{en ? "Download the AI readiness checklist" : zh("下載 AI 準備度清單", locale)} →</Link>
          </div>
          <HeatmapTable locale={locale} />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container related-block">
          <h2>{en ? "Services that deliver the programme" : zh("推行計劃的相關服務", locale)}</h2>
          <ServiceCards locale={locale} ids={["ai-training", "data-hub", "workflow-automation"]} />
        </div>
      </section>
      <section className="section section--tight section--surface">
        <div className="container related-block">
          <h2>{en ? "Evidence" : zh("實證", locale)}</h2>
          <CaseCards locale={locale} items={[internal]} />
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{t(ui.faqs, locale)}</p>
            <h2>{en ? "Before you start" : zh("開始之前", locale)}</h2>
          </div>
          <Faq items={faqs} locale={locale} />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Discuss where AI should change your work" : zh("討論 AI 應在哪裏改變你的工作", locale)} primary={{ label: en ? "Discuss a transformation scope" : zh("討論轉型範圍", locale), to: paths.contact({ intent: "transformation" }) }} secondary={{ label: en ? "Request a workshop" : zh("申請工作坊", locale), to: paths.contact({ intent: "workshop" }) }} />
    </>
  );
}
