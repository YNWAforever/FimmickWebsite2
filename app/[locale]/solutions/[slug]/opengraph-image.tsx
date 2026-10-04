import { notFound } from "next/navigation";
import { solutions } from "@/content/solutions";
import { t, zh } from "@/lib/i18n";
import { shareImage, shareImageAlt, shareImageSize } from "@/lib/og";
import { resolveLocale, type SlugParams } from "@/lib/page";

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";
/** Rendered on request and cached (lib/og.tsx explains why not at build). */
export const dynamic = "force-dynamic";

/** The same eyebrow, headline and accent as the solution page’s hero. */
export default async function Image({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const s = solutions.find((x) => x.id === slug);
  if (!s) notFound();
  return shareImage({
    locale,
    eyebrow: `${locale === "en" ? "Solution" : zh("解決方案", locale)} ${s.number} · ${t(s.name, locale)}`,
    title: t(s.job, locale),
    accent: s.headlineAccent ? t(s.headlineAccent, locale) : undefined,
  });
}
