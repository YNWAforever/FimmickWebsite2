import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, type Locale } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { aboutPages, leaders, methodSteps, principles, timeline, whyFimmick, type AboutPage } from "@/content/company";
import { caseBySlug } from "@/content/cases";
import { members } from "@/content/ecosystem";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { CaseCards, EnquirySection } from "@/components/blocks";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams([...aboutPages]);
}

const meta: Record<AboutPage, { title: { en: string; zh: string }; lead: { en: string; zh: string } }> = {
  "our-story": {
    title: { en: "Our story", zh: "我們的故事" },
    lead: { en: "Years of campaigns, content, CRM and reporting showed us where work gets lost between people and systems. That experience now shapes how FIMMICK designs AI workflows.", zh: "多年處理宣傳、內容、CRM 及報告的經驗，讓我們看清工作如何在人與系統之間流失；這些經驗塑造了 FIMMICK 設計 AI 流程的方式。" },
  },
  "how-we-work": {
    title: { en: "How we work", zh: "工作方式" },
    lead: { en: "Start from the business outcome, design the whole workflow — including where people decide — and prove it on one piece of work before extending it.", zh: "由業務成果出發，設計完整流程（包括由人決定的環節），先在一項工作上驗證，再逐步擴展。" },
  },
  "why-fimmick": {
    title: { en: "Why FIMMICK", zh: "為何選擇 FIMMICK" },
    lead: { en: "A partner should understand the work, design it with you, run the first version and hand over capability. FIMMICK combines platform, transformation and specialist services to do that.", zh: "合作夥伴應該理解工作、與你一同設計、推行首個版本並移交能力。FIMMICK 結合平台、轉型及專業服務做到這一點。" },
  },
  team: {
    title: { en: "Leadership", zh: "領導團隊" },
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
              <p className="eyebrow">{en ? "What the journey created" : "歷程帶來的成果"}</p>
              <h2>{en ? "A platform, a practice and an ecosystem" : "一個平台、一套實務及一個生態系統"}</h2>
              <p className="muted">{en ? "FIMMICK AIP grew out of our own delivery work. The transformation practice grew out of redesigning that work. The ecosystem — creator programmes, communities, a travel platform and a social enterprise — grew out of building audiences and ventures ourselves." : "FIMMICK AIP 源自我們自身的交付工作；轉型實務源自重新設計這些工作；而生態系統——創作者計劃、社群、旅遊平台及社會企業——則源自我們親身建立受眾及項目。"}</p>
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
            <SectionHead eyebrow={en ? "Method" : "方法"} title={en ? "Four steps" : "四個步驟"} />
            <ol className="steps steps--row">{methodSteps.map((s) => <li key={s.title.en}><h3>{t(s.title, locale)}</h3><p>{t(s.copy, locale)}</p></li>)}</ol>
          </div>
        </section>
        <section className="section section--surface">
          <div className="container">
            <SectionHead eyebrow={en ? "Principles" : "原則"} title={en ? "What we hold to" : "我們堅守的原則"} />
            <div className="grid grid-2">{principles.map((p) => <div key={p.title.en} className="io-card"><h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{t(p.title, locale)}</h3><p className="muted">{t(p.copy, locale)}</p></div>)}</div>
            <p style={{ marginTop: 24 }}><Link className="text-link" href={href(locale, "/ai-transformation")}>{en ? "AI Transformation programme" : "AI 轉型計劃"} →</Link></p>
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
          <p className="distinction" style={{ marginTop: 24 }}>{en ? "We do not publish client counts, agent counts or savings figures without documented evidence. Ask us for relevant, verifiable examples during a conversation." : "在未有書面證據前，我們不會公布客戶數目、智能體數目或節省數字；歡迎在傾談時查詢相關、可核實的例子。"}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-2">
          {leaders.map((l) => (
            <article key={l.name} className="io-card">
              <h2 style={{ fontSize: "1.4rem" }}>{l.name}</h2>
              <p className="eyebrow" style={{ margin: "6px 0 14px" }}>{t(l.role, locale)}</p>
              <p className="muted">{t(l.bio, locale)}</p>
              {l.linkedin ? <p style={{ marginTop: 14 }}><a href={l.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn ↗</a></p> : null}
            </article>
          ))}
        </div>
        <p className="micro muted" style={{ marginTop: 20 }}>{en ? "Additional leadership profiles will be added once they are approved for publication." : "其他領導層簡介獲批准公開後會在此加入。"}</p>
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
      <PageHero locale={locale} crumbs={[{ label: en ? "About" : "關於 FIMMICK", path: "/about" }, { label: t(meta[slug].title, locale) }]} eyebrow={en ? "About FIMMICK" : "關於 FIMMICK"} title={t(meta[slug].title, locale)} lead={t(meta[slug].lead, locale)} actions={<LinkButton to={href(locale, "/contact?intent=general")} variant="ghost">{en ? "Contact us" : "聯絡我們"}</LinkButton>} />
      <Body slug={slug} locale={locale} />
      <EnquirySection locale={locale} title={en ? "Work with FIMMICK" : "與 FIMMICK 合作"} primary={{ label: en ? "How to start" : "如何開始", to: "/how-to-start" }} secondary={{ label: en ? "Contact us" : "聯絡我們", to: "/contact?intent=general" }} />
    </>
  );
}
