import type { Metadata } from "next";
import { isLocale, t, type Locale, zh } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { cinema, homeFaqs, sections } from "@/content/home";
import { Faq, SectionHead } from "@/components/ui";
import { company } from "@/content/company";
import { BusinessOutputs, CaseEvidence, CinematicHero, ClosingChapter, EcosystemTiles, IndustryPhotos, Pathways, ResourcePreviews, SignatureWorkflow, StartDecision } from "@/components/home/sections";
import { notFound } from "next/navigation";
// The homepage’s own sheets (8.2.3); award-home.css overrides cinematic.css at equal specificity, so it
// comes last.
import "../styles/cinematic.css";
import "../styles/award-home.css";
import { preload } from "react-dom";

/** The accent face’s file, as named in editorial.css’s @font-face (kept here, not imported from app/fonts.ts,
 *  so this route does not pull the next/font stylesheet into a chunk of its own). */
const accentFontUrl = "/fonts/instrument-serif-latin-400-italic-5.3.0.woff2";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...pageMetadata({
      locale,
      path: "/",
      title: locale === "en" ? "FIMMICK — Agentic AI Platform & Business Solutions" : zh("FIMMICK — 企業 AI 智能體平台與業務解決方案", locale),
      // The meta description is the visible hero body, so search results match the page.
      description: t(cinema.heroBody, locale),
      generatedImage: true,
    }),
    title: { absolute: locale === "en" ? "FIMMICK — Agentic AI Platform & Business Solutions" : zh("FIMMICK — 企業 AI 智能體平台與業務解決方案", locale) },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  // The hero headline’s accent phrase is set in the serif, above the fold: preload it on this route
  // only (8.2.4), and only in English (Chinese accents keep the sans). Same URL as the @font-face in
  // editorial.css, so it is one download on any page.
  if (locale === "en") preload(accentFontUrl, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <>
      {/* 1. Cinematic hero: headline, one sample output and the approval moment */}
      <CinematicHero locale={locale} />
      {/* 2. Four business outputs, shown as readable sample artefacts */}
      <BusinessOutputs locale={locale} />
      {/* 3. Case-study evidence */}
      <CaseEvidence locale={locale} />
      {/* 4. The signature workflow (dark chapter): source → prepared → approved → output */}
      <SignatureWorkflow locale={locale} />
      {/* 5. AI Transformation and Services pathways */}
      <Pathways locale={locale} />
      {/* 6. Industry applications */}
      <IndustryPhotos locale={locale} />
      {/* 7. Ecosystem */}
      <EcosystemTiles locale={locale} />
      {/* 8. Resources with real previews */}
      <ResourcePreviews locale={locale} />
      {/* 9. Starting decision, questions and closing CTA (dark chapter) */}
      <StartDecision locale={locale} />
      <section className="section section--surface home-faq" aria-labelledby="faq">
        <div className="container split">
          <div>
            <SectionHead eyebrow={t(sections.faq.eyebrow, locale)} title={<span id="faq">{t(sections.faq.title, locale)}</span>} />
            <p className="home-faq__other">
              {t(sections.faq.other, locale)}{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </div>
          <Faq items={homeFaqs} locale={locale} />
        </div>
      </section>
      <ClosingChapter locale={locale} />
    </>
  );
}
