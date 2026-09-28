import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { offices, principles, timeline } from "@/content/company";
import { members } from "@/content/ecosystem";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "About FIMMICK", zh: "關於 FIMMICK" },
  lead: {
    en: "FIMMICK started in Hong Kong in 2008 as a digital agency. Today it is an Agentic AI platform and business-solutions company: products for defined business jobs, transformation and specialist services, and an ecosystem it has built along the way.",
    zh: "FIMMICK 於 2008 年在香港以數碼代理起步。今天，它是一家企業 AI 智能體平台與業務解決方案公司：提供針對明確業務工作的產品、轉型及專業服務，以及一路建立的生態系統。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/about", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const sub = [
    { path: "/about/our-story", title: en ? "Our story" : "我們的故事", copy: en ? "From digital agency to AI platform and solutions." : "由數碼代理到 AI 平台及解決方案。" },
    { path: "/about/how-we-work", title: en ? "How we work" : "工作方式", copy: en ? "Four principles and a four-step method." : "四個原則及四步方法。" },
    { path: "/about/why-fimmick", title: en ? "Why FIMMICK" : "為何選擇 FIMMICK", copy: en ? "What we bring beyond software access." : "除軟件以外我們帶來的價值。" },
    { path: "/about/team", title: en ? "Leadership" : "領導團隊", copy: en ? "The people who lead FIMMICK." : "帶領 FIMMICK 的團隊。" },
  ];
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "We changed our own work first." : "我們先改變自己的工作方式。"} lead={t(copy.lead, locale)} actions={<LinkButton to={href(locale, "/contact?intent=general")} variant="accent">{en ? "Contact us" : "聯絡我們"}</LinkButton>} />
      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            {sub.map((s) => (
              <Link key={s.path} className="hub-card" href={href(locale, s.path)}>
                <h2 style={{ fontSize: "1.2rem" }}>{s.title}</h2>
                <p className="small muted">{s.copy}</p>
                <span className="card-foot">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Timeline" : "發展歷程"} title={en ? "Eighteen years of digital work" : "十八年的數碼工作"} />
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
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Principles" : "原則"}</p>
            <h2>{en ? "How we approach AI work" : "我們如何處理 AI 工作"}</h2>
            <Link className="text-link" href={href(locale, "/about/how-we-work")}>{en ? "How we work" : "工作方式"} →</Link>
          </div>
          <div className="grid grid-2">
            {principles.map((p) => (
              <div key={p.title.en} className="io-card">
                <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>{t(p.title, locale)}</h3>
                <p className="small muted">{t(p.copy, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--eco">
        <div className="container">
          <SectionHead eyebrow={en ? "Built by FIMMICK" : "FIMMICK 建立的生態系統"} title={en ? "The ecosystem we run" : "我們營運的生態系統"} action={<LinkButton to={href(locale, "/fimmick-ecosystem")} variant="ghost" small>{en ? "Ecosystem" : "生態系統"}</LinkButton>} />
          <ul className="chips">
            {members.map((m) => (
              <li key={m.id}>
                <Link className="chip" href={href(locale, paths.member(m.id))}>{m.name} — {t(m.role, locale)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Offices" : "辦事處"} title={en ? "Where to find us" : "聯絡地點"} />
          <div className="grid grid-3">
            {offices.map((o) => (
              <div key={o.email} className="office">
                <strong>{t(o.name, locale)}</strong>
                {o.address ? <span>{t(o.address, locale)}</span> : null}
                <br />
                {o.phone ? <a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a> : null} {o.phone ? "· " : ""}
                <a href={`mailto:${o.email}`}>{o.email}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Talk to FIMMICK" : "聯絡 FIMMICK"} primary={{ label: en ? "Contact us" : "聯絡我們", to: "/contact?intent=general" }} />
    </>
  );
}
