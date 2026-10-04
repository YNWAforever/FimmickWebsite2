import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
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
        photo={"community-event"}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow={en ? "Built by FIMMICK" : zh("FIMMICK 建立的生態系統", locale)}
        title={en ? "Built by FIMMICK. Run by FIMMICK." : zh("由 FIMMICK 建立，由 FIMMICK 營運。", locale)}
        accent={en ? "Run by FIMMICK." : zh("由 FIMMICK 營運", locale)}
        lead={t(copy.lead, locale)}
        actions={<LinkButton to={href(locale, paths.contact({ intent: "partnership" }))} variant="accent">{en ? "Explore a partnership" : zh("探討合作", locale)}</LinkButton>}
      />
      <section className="section section--eco">
        <div className="container">
          <SectionHead eyebrow={en ? "Ecosystem map" : zh("生態系統地圖", locale)} title={en ? "Six members, four kinds of experience" : zh("六個成員，四類經驗", locale)} lead={en ? "Select a member to see its audience, role and the FIMMICK work it relates to." : zh("選擇一個成員，查看其受眾、角色及相關的 FIMMICK 工作。", locale)} />
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
                    <p className="small"><strong>{en ? "Relationship: " : zh("關係：", locale)}</strong>{t(m.relationship, locale)}</p>
                    <span className="card-foot">{en ? "Explore" : zh("了解", locale)} {m.name} →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <p className="distinction">{t(ecosystemBoundary, locale)}</p>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Explore a partnership with the ecosystem" : zh("探討與生態系統的合作", locale)} body={en ? "Brand, community, travel, creator or cultural partnerships are agreed with each member directly." : zh("品牌、社群、旅遊、創作者或文化合作，均與各成員直接議定。", locale)} primary={{ label: en ? "Explore a partnership" : zh("探討合作", locale), to: paths.contact({ intent: "partnership" }) }} secondary={{ label: en ? "Our story" : zh("我們的故事", locale), to: "/about/our-story" }} />
    </>
  );
}
