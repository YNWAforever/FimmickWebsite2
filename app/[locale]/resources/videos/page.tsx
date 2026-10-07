import type { Metadata } from "next";
import Link from "next/link";
import { href, t, formatDate, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { explainerVideo } from "@/content/resources";
import { explainerMedia, explainerScenes } from "@/content/media";
import { PageHero } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";
import { ExplainerPlayer } from "@/components/media/ExplainerPlayer";
import { JsonLd } from "@/components/JsonLd";
import { canonicalOrigin } from "@/lib/env";

const copy = {
  // The H1 (award pass 3); `title` stays the page's name in the crumbs and <title>.
  headline: { en: "One workflow on film, from brief to record.", zh: "一個流程的短片，由簡報到紀錄。" },
  accent: { en: "from brief to record.", zh: "由簡報到紀錄" },
  title: { en: "Videos & demos", zh: "影片與示範" },
  lead: { en: "A short product demonstration with captions and a full transcript. The film uses the same sample data as the interactive examples.", zh: "附字幕及完整文字稿的簡短產品示範；影片使用與互動示例相同的示例資料。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/resources/videos", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

const stamp = (s: number) => `0:${String(s).padStart(2, "0")}`;

export default async function VideosPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: t(explainerVideo.title, locale),
          description: t(explainerVideo.summary, locale),
          thumbnailUrl: `${canonicalOrigin}${explainerMedia.poster}`,
          uploadDate: explainerVideo.published,
          duration: `PT${explainerMedia.durationSeconds}S`,
          contentUrl: `${canonicalOrigin}${explainerMedia.sources[en ? "en" : "zh-hant"].mp4}`,
          inLanguage: en ? "en" : "zh-Hant-HK",
        }}
      />
      <PageHero locale={locale} crumbs={[{ label: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: t(copy.title, locale) }]} eyebrow={en ? "Resources" : zh("資源中心", locale)} title={t(copy.headline, locale)} accent={t(copy.accent, locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container detail-grid">
          <div className="stack">
            <ExplainerPlayer locale={locale} media={explainerMedia} title={t(explainerVideo.title, locale)} transcriptHref="#transcript" />
            <h2>{t(explainerVideo.title, locale)}</h2>
            <p className="muted">{t(explainerVideo.summary, locale)}</p>
            <p className="notice">{t(explainerVideo.mode, locale)}</p>
            <p className="micro muted">{formatDate(explainerVideo.published, locale)} · {explainerMedia.durationSeconds}s · {en ? "No audio track. Captions: English, Traditional Chinese, Simplified Chinese." : zh("沒有音軌。字幕：英文、繁體中文、簡體中文。", locale)}</p>
          </div>
          <aside className="detail-aside">
            <div className="transcript" id="transcript">
              <h2 style={{ fontSize: "1.2rem", marginBottom: 16 }}>{en ? "Transcript" : zh("文字稿", locale)}</h2>
              <ol>
                {explainerScenes.map((s) => (
                  <li key={s.start}>
                    <time>{stamp(s.start)}</time>
                    <p>
                      <strong>{t(s.title, locale)}</strong>
                      <br />
                      {t(s.caption, locale)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <Link className="btn btn--ghost" href={href(locale, "/platform")}>{en ? "Read the platform story" : zh("閱讀平台介紹", locale)} →</Link>
          </aside>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "See the workflow with your own content" : zh("以你自己的內容了解流程", locale)} primary={{ label: en ? "Request a demo" : zh("申請產品示範", locale), to: paths.contact({ intent: "demo", resource: "fimmick-aip-explainer" }) }} />
    </>
  );
}
