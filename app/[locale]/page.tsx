import type { Metadata } from "next";
import { isLocale, t, type Locale, zh } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { cinema, homeFaqs, sections } from "@/content/home";
import { Faq, SectionHead } from "@/components/ui";
import { BusinessOutputs, CaseEvidence, CinematicHero, ClosingChapter, EcosystemTiles, IndustryPhotos, Pathways, ResourcePreviews, SignatureWorkflow, StartDecision } from "@/components/home/sections";
import { notFound } from "next/navigation";

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
    }),
    title: { absolute: locale === "en" ? "FIMMICK — Agentic AI Platform & Business Solutions" : zh("FIMMICK — 企業 AI 智能體平台與業務解決方案", locale) },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

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
          </div>
          <Faq items={homeFaqs} locale={locale} />
        </div>
      </section>
      <ClosingChapter locale={locale} />
    </>
  );
}
