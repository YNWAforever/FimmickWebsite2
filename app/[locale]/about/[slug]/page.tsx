import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, type Locale, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { aboutPages, deliverySteps, leaders, methodSteps, offices, principles, timeline, whyFimmick, type AboutPage } from "@/content/company";
import { caseBySlug } from "@/content/cases";
import { members } from "@/content/ecosystem";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { Photo } from "@/components/media/Photo";
import { CaseCards, EnquirySection } from "@/components/blocks";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams([...aboutPages]);
}

// headline: the H1 with one accented phrase (award pass 3); title: the page's name (eyebrow, crumbs, <title>).
const meta: Record<AboutPage, { title: { en: string; zh: string }; headline: { en: string; zh: string }; accent: { en: string; zh: string }; lead: { en: string; zh: string } }> = {
  "our-story": {
    title: { en: "Our story", zh: "我們的故事" },
    headline: { en: "We saw where work gets lost before we automated any of it.", zh: "我們先看清工作在哪裡流失，才開始把它自動化。" },
    accent: { en: "before we automated any of it.", zh: "才開始把它自動化" },
    lead: { en: "Years of campaigns, content, CRM and reporting showed us where work gets lost between people and systems. That experience now shapes how FIMMICK designs AI workflows.", zh: "多年處理宣傳、內容、CRM 及報告的經驗，讓我們看清工作如何在人與系統之間流失；這些經驗塑造了 FIMMICK 設計 AI 流程的方式。" },
  },
  "how-we-work": {
    title: { en: "How we work", zh: "工作方式" },
    headline: { en: "Outcome first, the whole workflow next, one piece of work to prove it.", zh: "先定成果，再設計完整流程，用一項工作驗證。" },
    accent: { en: "one piece of work to prove it.", zh: "用一項工作驗證" },
    lead: { en: "Start from the business outcome, design the whole workflow — including where people decide — and prove it on one piece of work before extending it.", zh: "由業務成果出發，設計完整流程（包括由人決定的環節），先在一項工作上驗證，再逐步擴展。" },
  },
  "why-fimmick": {
    title: { en: "Why FIMMICK", zh: "為何選擇 FIMMICK" },
    headline: { en: "Understand the work, design it with you, then hand it over.", zh: "理解工作、與你一同設計，然後移交能力。" },
    accent: { en: "then hand it over.", zh: "然後移交能力" },
    lead: { en: "A partner should understand the work, design it with you, run the first version and hand over capability. FIMMICK combines platform, transformation and specialist services to do that.", zh: "合作夥伴應該理解工作、與你一同設計、推行首個版本並移交能力。FIMMICK 結合平台、轉型及專業服務做到這一點。" },
  },
  "asia-delivery": {
    title: { en: "Regional delivery", zh: "區域交付" },
    headline: { en: "Run from Hong Kong, working across markets.", zh: "以香港為基地，跨市場運作。" },
    accent: { en: "working across markets.", zh: "跨市場運作" },
    lead: { en: "FIMMICK works from Hong Kong with an office in Taiwan and contact points in Singapore, Mainland China, the United Kingdom and the UAE. Here is how multi-market work is organised.", zh: "FIMMICK 以香港為基地，在台灣設有辦事處，並在新加坡、中國內地、英國及阿聯酋設有聯絡點。以下說明跨市場工作的組織方式。" },
  },
  team: {
    title: { en: "Leadership", zh: "領導團隊" },
    headline: { en: "Led from Hong Kong by the people who built it.", zh: "在香港，由創立 FIMMICK 的人帶領。" },
    accent: { en: "by the people who built it.", zh: "由創立 FIMMICK 的人帶領" },
    lead: { en: "FIMMICK is led from Hong Kong by its founder and chairman and its co-founder and CEO.", zh: "FIMMICK 由創辦人及主席，以及聯合創辦人及行政總裁在香港領導。" },
  },
};

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const slug = (await params).slug as AboutPage;
  if (!meta[slug]) return {};
  return pageMetadata({ locale, path: `/about/${slug}`, title: t(meta[slug].title, locale), description: t(meta[slug].lead, locale) });
}

function Body({ slug, locale }: { slug: AboutPage; locale: Locale }) {
  const en = locale === "en";
  if (slug === "our-story") {
    return (
      <>
        <section className="section">
          <div className="container">
            <ol className="steps steps--row" style={{ ["--cols" as string]: "5" }}>
              {timeline.map((m) => (
                <li key={m.year}>
                  <p className="number-tag" style={{ fontSize: "1.1rem" }}>{m.year}</p>
                  <h3>{t(m.title, locale)}</h3>
                  <p>{t(m.copy, locale)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="section section--surface">
          <div className="container split">
            <div className="stack">
              <p className="eyebrow">{en ? "What the journey created" : zh("歷程帶來的成果", locale)}</p>
              <h2>{en ? "A platform, a practice and an ecosystem" : zh("一個平台、一套實務及一個生態系統", locale)}</h2>
              <p className="muted">{en ? "FIMMICK AIP grew out of our own delivery work. The transformation practice grew out of redesigning that work. The ecosystem — creator programmes, communities, a travel platform and a social enterprise — grew out of building audiences and ventures ourselves." : zh("FIMMICK AIP 源自我們自身的交付工作；轉型實務源自重新設計這些工作；而生態系統——創作者計劃、社群、旅遊平台及社會企業——則源自我們親身建立受眾及項目。", locale)}</p>
            </div>
            <CaseCards locale={locale} items={[caseBySlug("fimmick-ai-native-operating-model")!]} />
          </div>
        </section>
        <section className="section">
          <div className="container">
            <ul className="chips">{members.map((m) => <li key={m.id}><Link className="chip chip--lime" href={href(locale, paths.member(m.id))}>{m.name}</Link></li>)}</ul>
          </div>
        </section>
      </>
    );
  }
  if (slug === "how-we-work") {
    return (
      <>
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={en ? "Method" : zh("方法", locale)} title={en ? "Four steps" : zh("四個步驟", locale)} />
            <ol className="steps steps--row">{methodSteps.map((s) => <li key={s.title.en}><h3>{t(s.title, locale)}</h3><p>{t(s.copy, locale)}</p></li>)}</ol>
          </div>
        </section>
        <section className="section section--surface">
          <div className="container">
            <SectionHead eyebrow={en ? "Principles" : zh("原則", locale)} title={en ? "What we hold to" : zh("我們堅守的原則", locale)} />
            <div className="grid grid-2">{principles.map((p) => <div key={p.title.en} className="io-card"><h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{t(p.title, locale)}</h3><p className="muted">{t(p.copy, locale)}</p></div>)}</div>
            <p style={{ marginTop: 24 }}><Link className="text-link" href={href(locale, "/ai-transformation")}>{en ? "AI Transformation programme" : zh("AI 轉型計劃", locale)} →</Link></p>
          </div>
        </section>
      </>
    );
  }
  if (slug === "asia-delivery") {
    return (
      <>
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={en ? "Offices and contact points" : zh("辦事處及聯絡點", locale)} title={en ? "Where to reach us" : zh("聯絡我們的地點", locale)} />
            <div className="grid grid-3">
              {offices.map((o) => (
                <div key={o.email} className="io-card">
                  <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{t(o.name, locale)}</h3>
                  {o.address ? <p className="small muted">{t(o.address, locale)}</p> : null}
                  <p className="small" style={{ marginTop: 8 }}>
                    {o.phone ? <><a href={`tel:${o.phone.replace(/s/g, "")}`}>{o.phone}</a><br /></> : null}
                    <a href={`mailto:${o.email}`}>{o.email}</a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section section--surface">
          <div className="container">
            <SectionHead eyebrow={en ? "Multi-market engagements" : zh("跨市場合作", locale)} title={en ? "How work across markets is organised" : zh("跨市場工作的組織方式", locale)} />
            <ol className="steps steps--row">{deliverySteps.map((s) => <li key={s.title.en}><h3>{t(s.title, locale)}</h3><p>{t(s.copy, locale)}</p></li>)}</ol>
          </div>
        </section>
        <section className="section">
          <div className="container split">
            <div className="stack">
              <p className="eyebrow">{en ? "Languages" : zh("語言", locale)}</p>
              <h2>{en ? "English, Traditional Chinese and Simplified Chinese" : zh("英文、繁體中文及簡體中文", locale)}</h2>
              <p className="muted">{en ? "Workflows can prepare drafts in each language, but localisation is more than translation: tone, terms and claims are reviewed by people who know each market." : zh("流程可以準備各語言的草稿，但本地化不只是翻譯：語調、用詞及宣稱都由熟悉當地市場的人審閱。", locale)}</p>
            </div>
            <div className="stack">
              <p className="distinction">{en ? "We do not publish market counts, client counts or regional figures on this page without documented evidence. Ask us about relevant experience in your market." : zh("在未有書面證據前，我們不會在此頁公布市場數目、客戶數目或區域數字；歡迎查詢我們在你所在市場的相關經驗。", locale)}</p>
              <p><Link className="text-link" href={href(locale, "/functions/expansion")}>{en ? "Market expansion workflows" : zh("市場拓展流程", locale)} →</Link></p>
            </div>
          </div>
        </section>
      </>
    );
  }
  if (slug === "why-fimmick") {
    return (
      <section className="section">
        <div className="container">
          <div className="grid grid-2">{whyFimmick.map((w, i) => <div key={w.title.en} className="io-card"><span className="number-tag">0{i + 1}</span><h2 style={{ fontSize: "1.25rem", margin: "8px 0 10px" }}>{t(w.title, locale)}</h2><p className="muted">{t(w.copy, locale)}</p></div>)}</div>
          <p className="distinction" style={{ marginTop: 24 }}>{en ? "We do not publish client counts, agent counts or savings figures without documented evidence. Ask us for relevant, verifiable examples during a conversation." : zh("在未有書面證據前，我們不會公布客戶數目、智能體數目或節省數字；歡迎在傾談時查詢相關、可核實的例子。", locale)}</p>
        </div>
      </section>
    );
  }
  // One composed block: the two published leaders beside a context photograph (no portraits yet).
  return (
    <section className="section">
      <div className="container split leaders">
        <Photo id="workshop-wall" locale={locale} crop="portrait" sizes="(min-width: 1000px) 38vw, 92vw" className="leaders__photo" />
        <div className="leaders__list">
          {leaders.map((l) => (
            <article key={l.name} className="leader">
              <h2>{l.name}</h2>
              <p className="eyebrow">{t(l.role, locale)}</p>
              <p className="muted">{t(l.bio, locale)}</p>
              {l.linkedin ? <p><a href={l.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn ↗</a></p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function AboutSubPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const slug = (await params).slug as AboutPage;
  if (!meta[slug]) notFound();
  const en = locale === "en";
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: en ? "About" : zh("關於 FIMMICK", locale), path: "/about" }, { label: t(meta[slug].title, locale) }]} eyebrow={t(meta[slug].title, locale)} title={t(meta[slug].headline, locale)} accent={t(meta[slug].accent, locale)} lead={t(meta[slug].lead, locale)} actions={<LinkButton to={href(locale, "/contact?intent=general")} variant="ghost">{en ? "Contact us" : zh("聯絡我們", locale)}</LinkButton>} />
      <Body slug={slug} locale={locale} />
      <EnquirySection locale={locale} title={en ? "Work with FIMMICK" : zh("與 FIMMICK 合作", locale)} primary={{ label: en ? "How to start" : zh("如何開始", locale), to: "/how-to-start" }} secondary={{ label: en ? "Contact us" : zh("聯絡我們", locale), to: "/contact?intent=general" }} />
    </>
  );
}
