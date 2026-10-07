// Route sheets (8.2.3), first so they keep their place before component sheets.
import "@/app/styles/examples.css";
import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { exampleMeta } from "@/content/examples";
import { solutionById } from "@/content/solutions";
import { productById } from "@/content/products";
import { explainerVideo } from "@/content/resources";
import { explainerMedia } from "@/content/media";
import { PageHero, SectionHead } from "@/components/ui";
import { EnquirySection, ExampleTabs } from "@/components/blocks";
import { ExplainerPlayer } from "@/components/media/ExplainerPlayer";
import type { ExampleId } from "@/content/types";

const copy = {
  // The H1 (award pass 3); `title` stays the page's name in the crumbs and <title>.
  headline: { en: "Try the workflow on sample data.", zh: "用示例資料試用流程。" },
  accent: { en: "on sample data.", zh: "試用流程" },
  title: { en: "Examples & demos", zh: "示例與示範" },
  lead: { en: "Interactive examples and a product demonstration, all built on clearly labelled sample data. For client evidence, see the case library.", zh: "互動示例及產品示範，全部以清楚標示的示例資料製作。客戶實證請參閱案例庫。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/cases-and-demos", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function DemosPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Case studies" : zh("客戶案例", locale), path: "/case-studies" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Illustrative examples — sample data" : zh("流程示範·示例資料", locale)}
        title={t(copy.headline, locale)} accent={t(copy.accent, locale)}
        lead={t(copy.lead, locale)}
        notice={en ? "Nothing on this page is a customer result." : zh("本頁內容均非客戶成果。", locale)}
      />
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Product demonstration" : zh("產品示範", locale)}</p>
            <h2>{t(explainerVideo.title, locale)}</h2>
            <p className="muted">{t(explainerVideo.mode, locale)}</p>
            <Link className="text-link" href={href(locale, "/resources/videos")}>{en ? "Transcript and captions" : zh("文字稿及字幕", locale)} →</Link>
          </div>
          <ExplainerPlayer locale={locale} media={explainerMedia} title={t(explainerVideo.title, locale)} transcriptHref={href(locale, "/resources/videos#transcript")} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Interactive examples" : zh("互動示例", locale)} title={en ? "Four workflows on sample data" : zh("以示例資料運作的四個流程", locale)} />
          <ExampleTabs locale={locale} initial="intelligence" />
          <div className="grid grid-4" style={{ marginTop: 32 }}>
            {(Object.keys(exampleMeta) as ExampleId[]).map((id) => {
              const m = exampleMeta[id];
              return (
                <Link key={id} className="hub-card" href={href(locale, paths.solution(m.solution))}>
                  <h3>{t(m.title, locale)}</h3>
                  <p className="small muted">{t(solutionById(m.solution).name, locale)} · {m.products.map((p) => productById(p).name).join(", ")}</p>
                  <span className="card-foot">{en ? "Solution page" : zh("解決方案頁面", locale)} →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "See it with your own workflow" : zh("以你的流程了解", locale)} primary={{ label: en ? "Request a demo" : zh("申請產品示範", locale), to: "/contact?intent=demo" }} secondary={{ label: en ? "Case library" : zh("案例庫", locale), to: "/case-studies" }} />
    </>
  );
}
