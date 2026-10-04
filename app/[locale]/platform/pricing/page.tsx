import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import type { Intent } from "@/lib/intent";
import { pricingFactors, proposalContents } from "@/content/platform-pages";
import { startOptions } from "@/content/home";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton, Faq } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "Pricing & engagement", zh: "收費及合作模式" },
  lead: {
    en: "Pricing follows scope: which workflows, how much work runs through them, which systems they touch and how much FIMMICK runs for you. We quote in writing after a scope conversation.",
    zh: "收費取決於範圍：包括哪些流程、處理多少工作、涉及哪些系統，以及由 FIMMICK 承擔多少。我們會在範圍傾談後以書面報價。",
  },
};

const faqs = [
  { q: { en: "Why are there no prices on this page?", zh: "為何此頁沒有列出價格？" }, a: { en: "Two workflows with the same name can differ widely in volume, sources and review needs. A number without that context would mislead, so we quote per scope.", zh: "兩個名稱相同的流程，在數量、來源及審閱需要上可以相差很大；缺乏這些背景的數字會造成誤導，因此我們按範圍報價。" } },
  { q: { en: "What happened to the plans published here before?", zh: "以前在此公布的方案怎樣了？" }, a: { en: "The plans previously published on this page have been withdrawn and no longer apply. Existing agreements continue on their own terms.", zh: "以前在此頁公布的方案已經撤回，不再適用；現有協議按其條款繼續有效。" } },
  { q: { en: "Can we start small?", zh: "可以由小規模開始嗎？" }, a: { en: "Yes. Most engagements start with one workflow and a defined review period before anything is extended.", zh: "可以。大部分合作都由一個流程及一段既定的檢討期開始，之後才考慮擴展。" } },
  { q: { en: "Are third-party costs included?", zh: "是否包括第三方費用？" }, a: { en: "Licences, media spend and messaging fees are listed separately in the proposal so you can see them clearly.", zh: "授權費、媒體費用及訊息費用會在建議書中分開列出，讓你看得清楚。" } },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform/pricing", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function PricingPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Platform" : zh("平台", locale)}
        title={en ? "Price the workflow, not just the software." : zh("按流程定價，而不只是按軟件定價。", locale)}
        lead={t(copy.lead, locale)}
        notice={en ? "Price plans previously published on this page have been withdrawn and no longer apply." : zh("以前在此頁公布的價格方案已經撤回，不再適用。", locale)}
        actions={
          <>
            <LinkButton to={href(locale, paths.contact({ intent: "configuration" }))} variant="accent">{t(ui.discussScope, locale)}</LinkButton>
            <LinkButton to={href(locale, "/how-to-start")} variant="ghost">{en ? "How to start" : zh("如何開始", locale)}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "What drives cost" : zh("影響費用的因素", locale)} title={en ? "Six factors we scope with you" : zh("與你一同界定的六個因素", locale)} />
          <div className="grid grid-3">
            {pricingFactors.map((f, i) => (
              <div key={f.title.en} className="io-card">
                <span className="number-tag">{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ fontSize: "1.1rem", margin: "8px 0" }}>{t(f.title, locale)}</h3>
                <p className="muted small">{t(f.copy, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Engagement models" : zh("合作模式", locale)} title={en ? "How much should FIMMICK run?" : zh("由 FIMMICK 承擔多少？", locale)} />
          <div className="start-grid">
            {startOptions.map((o, i) => (
              <div key={o.id} className="start-card">
                <span className="number-tag">0{i + 1}</span>
                <h3>{t(o.title, locale)}</h3>
                <p className="muted">{t(o.forWho, locale)}</p>
                <ul className="check-list small">{t(o.includes, locale).map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="small"><strong>{en ? "You provide: " : zh("你需要提供：", locale)}</strong>{t(o.youProvide, locale)}</p>
                <Link className="btn btn--small" href={href(locale, paths.contact({ intent: o.intent as Intent }))}>{t(o.cta, locale)}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Written proposal" : zh("書面建議", locale)}</p>
            <h2>{en ? "What every proposal states" : zh("每份建議書都會列明", locale)}</h2>
            <p className="muted">{en ? "Nothing starts until scope, responsibilities and commercial terms are agreed in writing." : zh("範圍、責任及商業條款以書面議定前，不會開始任何工作。", locale)}</p>
          </div>
          <ul className="check-list">{t(proposalContents, locale).map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={t(ui.faqs, locale)} title={en ? "Pricing questions" : zh("收費問題", locale)} />
          <Faq items={faqs} locale={locale} />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Get a scoped quote" : zh("取得按範圍的報價", locale)} body={en ? "Tell us the workflow. We reply by email to arrange a scope conversation, then send a written proposal." : zh("告訴我們你的流程；我們會以電郵回覆安排範圍傾談，然後發出書面建議。", locale)} primary={{ label: t(ui.discussScope, locale), to: paths.contact({ intent: "configuration" }) }} secondary={{ label: en ? "Platform overview" : zh("平台概覽", locale), to: "/platform" }} />
    </>
  );
}
