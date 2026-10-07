import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { startOptions } from "@/content/home";
import { solutions } from "@/content/solutions";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, Faq } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "How to start", zh: "如何開始" },
  lead: { en: "Choose one workflow, decide how much FIMMICK should do, and agree a starting scope. Products, transformation and services can be combined — or used on their own.", zh: "選擇一個流程，決定由 FIMMICK 承擔多少工作，再議定起步範圍。產品、轉型及服務可以組合使用，亦可單獨使用。" },
};

const steps = [
  { title: { en: "Tell us the work", zh: "告訴我們你的工作" }, copy: { en: "Name, email, company and the work you want to improve. That is all we need to start.", zh: "姓名、電郵、公司及你想改善的工作——這些已足夠開始。" } },
  { title: { en: "We reply by email", zh: "我們以電郵回覆" }, copy: { en: "A FIMMICK team member reviews the request and proposes a time to talk. Nothing is booked until you confirm.", zh: "FIMMICK 同事會審閱要求並建議傾談時間；在你確認前不會預約任何事項。" } },
  { title: { en: "Scope conversation", zh: "範圍傾談" }, copy: { en: "We look at inputs, review points, systems and the output you need, then suggest a starting scope.", zh: "我們會了解輸入、審閱環節、系統及所需輸出，再建議起步範圍。" } },
  { title: { en: "Written proposal", zh: "書面建議" }, copy: { en: "Scope, responsibilities, dependencies and commercial terms are agreed in writing before work begins.", zh: "範圍、責任、依賴條件及商業條款會在開始前以書面議定。" } },
];

const faqs = [
  { q: { en: "Can we buy a service without the platform?", zh: "可以只購買服務而不使用平台嗎？" }, a: { en: "Yes. Services and transformation work can be commissioned on their own.", zh: "可以。服務及轉型工作均可單獨委託。" } },
  { q: { en: "Where are prices?", zh: "價格在哪裏？" }, a: { en: "Scope drives price, so we quote after the scope conversation. Earlier price plans on the previous website no longer apply.", zh: "價格取決於範圍，因此我們會在範圍傾談後報價；舊網站的價格方案已不再適用。" } },
  { q: { en: "Is a demo request a confirmed meeting?", zh: "預約示範是否即確認會面？" }, a: { en: "No. It is a request. We confirm a time with you by email.", zh: "不是，這只是一個要求；我們會以電郵與你確認時間。" } },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/how-to-start", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function HowToStartPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "Start with one defined workflow." : zh("由一個清楚的流程開始。", locale)} accent={en ? "one defined workflow." : zh("一個清楚的流程", locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Three ways to work with us" : zh("三種合作方式", locale)} title={en ? "How much should FIMMICK do?" : zh("由 FIMMICK 承擔多少？", locale)} />
          <div className="start-grid">
            {startOptions.map((o, i) => (
              <div key={o.id} className="start-card">
                <span className="number-tag">0{i + 1}</span>
                <h3>{t(o.title, locale)}</h3>
                <p className="muted">{t(o.forWho, locale)}</p>
                <ul className="check-list small">{t(o.includes, locale).map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="small"><strong>{en ? "You provide: " : zh("你需要提供：", locale)}</strong>{t(o.youProvide, locale)}</p>
                <Link className="btn btn--small" href={href(locale, paths.contact({ intent: o.intent as never }))}>{t(o.cta, locale)}</Link>
              </div>
            ))}
          </div>
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <Link className="hub-card" href={href(locale, "/ai-transformation")}>
              <h3>{en ? "Planning a wider change?" : zh("規劃更大範圍的轉變？", locale)}</h3>
              <p className="muted small">{en ? "Start with AI Transformation: readiness, roadmap, workflow design and governance." : zh("由 AI 轉型開始：準備度、路線圖、流程設計及管治。", locale)}</p>
              <span className="card-foot">{en ? "AI Transformation" : zh("AI 轉型", locale)} →</span>
            </Link>
            <Link className="hub-card" href={href(locale, "/services")}>
              <h3>{en ? "Need specialists for one job?" : zh("需要專家處理一項工作？", locale)}</h3>
              <p className="muted small">{en ? "Sixteen services with defined deliverables and starting scopes." : zh("十六項服務，各有明確交付成果及起步範圍。", locale)}</p>
              <span className="card-foot">{en ? "Services" : zh("專業服務", locale)} →</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Starting scopes" : zh("起步範圍", locale)} title={en ? "Typical first scopes by business job" : zh("按業務工作劃分的一般起步範圍", locale)} />
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th scope="col">{en ? "Business job" : zh("業務工作", locale)}</th><th scope="col">{t(ui.startingScope, locale)}</th></tr></thead>
              <tbody>
                {solutions.map((s) => (
                  <tr key={s.id}><td><Link href={href(locale, paths.solution(s.id))}>{t(s.name, locale)}</Link></td><td>{t(s.startingScope, locale)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "What happens after you contact us" : zh("聯絡我們之後", locale)} title={en ? "Four steps, no surprises" : zh("四個步驟，清楚透明", locale)} />
          <ol className="steps steps--row">{steps.map((s) => <li key={s.title.en}><h3>{t(s.title, locale)}</h3><p>{t(s.copy, locale)}</p></li>)}</ol>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div className="stack"><p className="eyebrow">{t(ui.faqs, locale)}</p><h2>{en ? "Before you get in touch" : zh("聯絡我們之前", locale)}</h2></div>
          <Faq items={faqs} locale={locale} />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Tell us which work to improve" : zh("告訴我們想改善哪項工作", locale)} primary={{ label: t(ui.requestDemo, locale), to: "/contact?intent=demo" }} secondary={{ label: en ? "Explore a partnership" : zh("探討合作", locale), to: paths.contact({ intent: "partnership" }) }} />
    </>
  );
}
