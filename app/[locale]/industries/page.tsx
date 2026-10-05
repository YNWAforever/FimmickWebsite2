// Route sheets (8.2.3), first so they keep their place before component sheets.
import "@/app/styles/diagrams.css";
import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { industries, industryGroups } from "@/content/industries";
import { ui } from "@/content/ui";
import { PageHero, SectionHead } from "@/components/ui";
import { EnquirySection, IndustryMapBlock, IndustryMatrix } from "@/components/blocks";

const copy = {
  title: { en: "Industries", zh: "行業應用" },
  lead: { en: "The same products and services, applied to the operating problems of eight sectors. Each page shows a suggested workflow, the review points and a starting scope.", zh: "同一套產品及服務，應用於八個行業的營運問題。每頁展示建議流程、審閱環節及起步範圍。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/industries", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function IndustriesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "One set of products, configured for your sector." : zh("同一套產品，按你的行業配置。", locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            {industryGroups.map((g) => (
              <div key={g.id} className="io-card">
                <h2 className="micro" style={{ letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--subtle)", marginBottom: 12 }}>{t(g.name, locale)}</h2>
                <ul className="stack" style={{ listStyle: "none", ["--stack" as string]: "6px" }}>
                  {industries.filter((i) => i.group === g.id).map((i) => (
                    <li key={i.id}>
                      <Link className="text-link" href={href(locale, paths.industry(i.id))}>{t(i.name, locale)} <span className="arrow" aria-hidden="true">→</span></Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Explore by sector" : zh("按行業探索", locale)} title={en ? "Select a sector to see its workflow" : zh("選擇行業，查看其流程", locale)} />
          <IndustryMapBlock locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Industry-to-product map" : zh("行業與產品對照", locale)} title={en ? "Same products, different jobs" : zh("同一產品，不同工作", locale)} lead={en ? "FIMMICK does not build separate software per sector. Each industry applies a subset of the six products to its own workflow." : zh("FIMMICK 不會為每個行業另建軟件；各行業按自身流程應用六個產品中的部分產品。", locale)} />
          <IndustryMatrix locale={locale} />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Discuss your sector’s workflow" : zh("討論你所屬行業的流程", locale)} primary={{ label: t(ui.discussScope, locale), to: "/contact?intent=configuration" }} />
    </>
  );
}
