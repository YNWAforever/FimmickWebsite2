import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { members, memberGroups, ecosystemBoundary } from "@/content/ecosystem";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EcosystemMapBlock, EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "FIMMICK Ecosystem", zh: "FIMMICK 生態系統" },
  lead: {
    en: "Besides client work, FIMMICK builds and runs its own platform, creator programmes, communities and a social enterprise. Each one gives the team first-hand experience of audiences, content, commerce and culture.",
    zh: "除客戶項目外，FIMMICK 亦建立及營運自家平台、創作者計劃、社群及社會企業；每一個都為團隊帶來受眾、內容、商業及文化方面的第一手經驗。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/fimmick-ecosystem", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function EcosystemPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow={en ? "Built by FIMMICK" : "FIMMICK 建立的生態系統"}
        title={en ? "What FIMMICK has built — and why it matters to your work." : "FIMMICK 建立了甚麼，以及它對你的工作有何意義。"}
        lead={t(copy.lead, locale)}
        actions={<LinkButton to={href(locale, paths.contact({ intent: "partnership" }))} variant="accent">{en ? "Explore a partnership" : "探討合作"}</LinkButton>}
      />
      <section className="section section--eco">
        <div className="container">
          <SectionHead eyebrow={en ? "Ecosystem map" : "生態系統地圖"} title={en ? "Six members, four kinds of experience" : "六個成員，四類經驗"} lead={en ? "Select a member to see its audience, role and the FIMMICK work it relates to." : "選擇一個成員，查看其受眾、角色及相關的 FIMMICK 工作。"} />
          <EcosystemMapBlock locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          {memberGroups.map((g) => (
            <div key={g.id} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "1.4rem", marginBottom: 6 }}>{t(g.name, locale)}</h2>
              <p className="muted" style={{ marginBottom: 16 }}>{t(g.copy, locale)}</p>
              <div className="grid grid-2">
                {members.filter((m) => m.group === g.id).map((m) => (
                  <Link key={m.id} className="hub-card" href={href(locale, paths.member(m.id))}>
                    <span className="chip chip--lime" style={{ alignSelf: "flex-start" }}>{t(m.role, locale)}</span>
                    <h3>{m.name}</h3>
                    <p className="muted small">{t(m.need, locale)}</p>
                    <p className="small"><strong>{en ? "Relationship: " : "關係："}</strong>{t(m.relationship, locale)}</p>
                    <span className="card-foot">{en ? "Explore" : "了解"} {m.name} →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <p className="distinction">{t(ecosystemBoundary, locale)}</p>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Explore a partnership with the ecosystem" : "探討與生態系統的合作"} body={en ? "Brand, community, travel, creator or cultural partnerships are agreed with each member directly." : "品牌、社群、旅遊、創作者或文化合作，均與各成員直接議定。"} primary={{ label: en ? "Explore a partnership" : "探討合作", to: paths.contact({ intent: "partnership" }) }} secondary={{ label: en ? "Our story" : "我們的故事", to: "/about/our-story" }} />
    </>
  );
}
