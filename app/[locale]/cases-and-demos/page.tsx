import type { Metadata } from "next";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
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
        crumbs={[{ label: en ? "Case studies" : "成功案例", path: "/case-studies" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Illustrative examples — sample data" : "流程示範・示例資料"}
        title={t(copy.title, locale)}
        lead={t(copy.lead, locale)}
        notice={en ? "Nothing on this page is a customer result." : "本頁內容均非客戶成果。"}
      />
      <section className="section">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Product demonstration" : "產品示範"}</p>
            <h2>{t(explainerVideo.title, locale)}</h2>
            <p className="muted">{t(explainerVideo.mode, locale)}</p>
            <Link className="text-link" href={href(locale, "/resources/videos")}>{en ? "Transcript and captions" : "文字稿及字幕"} →</Link>
          </div>
          <ExplainerPlayer locale={locale} media={explainerMedia} title={t(explainerVideo.title, locale)} transcriptHref={href(locale, "/resources/videos#transcript")} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Interactive examples" : "互動示例"} title={en ? "Four workflows on sample data" : "以示例資料運作的四個流程"} />
          <ExampleTabs locale={locale} initial="intelligence" />
          <div className="grid grid-4" style={{ marginTop: 32 }}>
            {(Object.keys(exampleMeta) as ExampleId[]).map((id) => {
              const m = exampleMeta[id];
              return (
                <Link key={id} className="hub-card" href={href(locale, paths.solution(m.solution))}>
                  <h3>{t(m.title, locale)}</h3>
                  <p className="small muted">{t(solutionById(m.solution).name, locale)} · {m.products.map((p) => productById(p).name).join(", ")}</p>
                  <span className="card-foot">{en ? "Solution page" : "解決方案頁面"} →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "See it with your own workflow" : "以你的流程了解"} primary={{ label: en ? "Request a Demo" : "預約產品示範", to: "/contact?intent=demo" }} secondary={{ label: en ? "Case library" : "案例庫", to: "/case-studies" }} />
    </>
  );
}
