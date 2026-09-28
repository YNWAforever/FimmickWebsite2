import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { solutions } from "@/content/solutions";
import { productById } from "@/content/products";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection, ExampleTabs } from "@/components/blocks";

const copy = {
  title: { en: "Business solutions", zh: "業務解決方案" },
  lead: {
    en: "Four jobs FIMMICK AIP is configured for. Each one starts from your approved information, prepares work for review, and ends in an output your team can use.",
    zh: "FIMMICK AIP 為四項工作而配置。每一項都由你的已確認資料出發，準備工作供審閱，並以團隊可用的成果作結。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/solutions", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function SolutionsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow={en ? "Platform & Solutions" : "平台與解決方案"}
        title={en ? "Choose the work you want to improve." : "選擇你想改善的工作。"}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, "/contact?intent=demo")} variant="accent">{t(ui.requestDemo, locale)}</LinkButton>
            <LinkButton to={href(locale, "/products")} variant="ghost">{en ? "Six products" : "六個產品"}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <div className="table-wrap">
            <table className="data">
              <caption className="sr-only">{en ? "Solutions compared" : "解決方案比較"}</caption>
              <thead>
                <tr>
                  <th scope="col">{en ? "Business job" : "業務工作"}</th>
                  <th scope="col">{en ? "Products" : "產品"}</th>
                  <th scope="col">{en ? "You receive" : "你會得到"}</th>
                  <th scope="col">{en ? "People decide" : "由人決定"}</th>
                </tr>
              </thead>
              <tbody>
                {solutions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link href={href(locale, paths.solution(s.id))}>
                        <strong>{t(s.name, locale)}</strong>
                      </Link>
                      <br />
                      <span className="muted small">{t(s.job, locale)}</span>
                    </td>
                    <td>{s.products.map((p) => productById(p).name).join(", ")}</td>
                    <td>{t(s.deliverable, locale)}</td>
                    <td className="small">{t(s.humanDecision, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="job-grid" style={{ marginTop: 40 }}>
            {solutions.map((s) => (
              <Link key={s.id} className="job-card" href={href(locale, paths.solution(s.id))}>
                <span className="number-tag">{s.number}</span>
                <h2 style={{ fontSize: "1.3rem" }}>{t(s.name, locale)}</h2>
                <p className="muted">{t(s.problem, locale)}</p>
                <div className="job-card__deliverable">
                  <span>{en ? "Starting scope" : "起步範圍"}</span>
                  <p>{t(s.startingScope, locale)}</p>
                </div>
                <span className="card-foot">
                  {en ? "See the workflow" : "查看流程"} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Inspect an example" : "查看示例"} title={en ? "Each solution, working on sample data." : "每項解決方案，以示例資料運作。"} />
          <ExampleTabs locale={locale} initial="intelligence" />
        </div>
      </section>
      <EnquirySection
        locale={locale}
        title={en ? "Not sure which job to start with?" : "未肯定由哪項工作開始？"}
        body={en ? "Tell us about the work and we will suggest a starting scope." : "告訴我們你的工作情況，我們會建議起步範圍。"}
        primary={{ label: t(ui.discussScope, locale), to: "/contact?intent=configuration" }}
        secondary={{ label: en ? "How to start" : "如何開始", to: "/how-to-start" }}
      />
    </>
  );
}
