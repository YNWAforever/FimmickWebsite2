import type { Metadata } from "next";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { workshopResource } from "@/content/resources";
import { PageHero, SectionHead, LinkButton, Faq } from "@/components/ui";
import { EnquirySection, ServiceCards } from "@/components/blocks";

const agenda = [
  { title: { en: "Business context", zh: "業務背景" }, copy: { en: "Objectives, constraints and what leadership needs AI to change.", zh: "目標、限制，以及管理層希望 AI 改變的地方。" } },
  { title: { en: "Workflow map", zh: "流程地圖" }, copy: { en: "Recurring work, inputs, decisions, outputs, owners and exceptions.", zh: "經常性工作、輸入、決策、輸出、負責人及例外。" } },
  { title: { en: "First workflow design", zh: "首個流程設計" }, copy: { en: "What AI prepares, where people decide, what gets recorded.", zh: "AI 準備甚麼、由人在哪裏決定、需要記錄甚麼。" } },
  { title: { en: "Next step", zh: "下一步" }, copy: { en: "Owners, dependencies and a defined starting scope.", zh: "負責人、依賴條件及明確的起步範圍。" } },
];

const outcomes = { en: ["Prioritised workflow opportunities", "A first-workflow outline with review points", "Data and integration questions to answer", "Owners and a defined next step"], zh: ["按優先次序排列的流程機會", "附審閱環節的首個流程大綱", "需要解答的資料及串接問題", "負責人及明確的下一步"] };
const audiences = { en: ["CEO / founder", "Marketing lead", "Operations lead", "Sales or customer experience lead", "IT / data lead", "HR / people lead"], zh: ["行政總裁／創辦人", "市場主管", "營運主管", "銷售或顧客體驗主管", "IT／數據主管", "人力資源主管"] };

const faqs = [
  { q: { en: "Is submitting a request a booking?", zh: "提交申請是否等於預約？" }, a: { en: "No. We reply by email to agree format, participants and a date. The workshop is booked only when we confirm it with you.", zh: "不是。我們會以電郵回覆，議定形式、參加者及日期；只有在與你確認後才算預約。" } },
  { q: { en: "What format does it take?", zh: "工作坊形式如何？" }, a: { en: "A facilitated working session, in person in Hong Kong or online. Length and depth are agreed with you.", zh: "由導師主持的工作坊，可在香港面授或網上進行；時長及深度與你議定。" } },
  { q: { en: "Do we need to prepare anything?", zh: "需要預先準備嗎？" }, a: { en: "A short list of recurring workflows and the people who own them. The AI readiness checklist is a useful starting point.", zh: "一份經常性流程的簡短清單及其負責人；AI 準備度清單是不錯的起點。" } },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/workshop", title: t(workshopResource.title, locale), description: t(workshopResource.summary, locale) });
}

export default async function WorkshopPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const contact = paths.contact({ intent: "workshop", resource: "workshop" });
  return (
    <>
      <PageHero
        locale={locale}
        photo={"workshop-wall"}
        crumbs={[{ label: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: en ? "Workshop" : zh("工作坊", locale) }]}
        eyebrow={en ? "Workshops & training" : zh("工作坊與培訓", locale)}
        title={t(workshopResource.title, locale)}
        lead={t(workshopResource.summary, locale)}
        actions={<LinkButton to={href(locale, contact)} variant="accent">{en ? "Request a workshop" : zh("申請工作坊", locale)}</LinkButton>}
        notice={en ? "Status: available on request — dates are agreed with each team." : zh("狀態：按需安排——日期與各團隊議定。", locale)}
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Agenda" : zh("議程", locale)} title={en ? "Four decisions in one session" : zh("一節工作坊，四個決定", locale)} />
          <ol className="steps steps--row">{agenda.map((a) => <li key={a.title.en}><h3>{t(a.title, locale)}</h3><p>{t(a.copy, locale)}</p></li>)}</ol>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container grid grid-2">
          <div className="io-card io-card--out">
            <h2 style={{ fontSize: "1.2rem", marginBottom: 14 }}>{en ? "Learning outcomes" : zh("學習成果", locale)}</h2>
            <ul className="check-list">{t(outcomes, locale).map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
          <div className="io-card">
            <h2 style={{ fontSize: "1.2rem", marginBottom: 14 }}>{en ? "Who should attend" : zh("適合參加者", locale)}</h2>
            <ul className="dot-list">{t(audiences, locale).map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Questions" : zh("常見問題", locale)}</p>
            <h2>{en ? "How requests work" : zh("申請如何運作", locale)}</h2>
          </div>
          <Faq items={faqs} locale={locale} />
        </div>
      </section>
      <section className="section section--tight section--surface">
        <div className="container related-block">
          <h2>{en ? "Related services" : zh("相關服務", locale)}</h2>
          <ServiceCards locale={locale} ids={["ai-training", "ai-transformation", "workflow-automation"]} />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Request a workshop for your team" : zh("為你的團隊申請工作坊", locale)} body={en ? "We reply by email to agree the details." : zh("我們會以電郵回覆，議定細節。", locale)} primary={{ label: en ? "Request a workshop" : zh("申請工作坊", locale), to: contact }} />
    </>
  );
}
