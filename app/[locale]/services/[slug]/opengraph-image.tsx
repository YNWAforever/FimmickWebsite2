import { notFound } from "next/navigation";
import { objectives, services } from "@/content/services";
import { t } from "@/lib/i18n";
import { shareImage, shareImageAlt, shareImageSize } from "@/lib/og";
import { resolveLocale, type SlugParams } from "@/lib/page";

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";
/** Rendered on request and cached (lib/og.tsx explains why not at build). */
export const dynamic = "force-dynamic";

/** The same eyebrow, headline and accent as the service page’s hero. */
export default async function Image({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const s = services.find((x) => x.id === slug && !x.canonicalPath);
  if (!s) notFound();
  const objective = objectives.find((o) => o.id === s.objective)!;
  return shareImage({
    locale,
    eyebrow: `${t(objective.name, locale)} · ${t(s.name, locale)}`,
    title: t(s.eyebrow, locale),
    accent: s.headlineAccent ? t(s.headlineAccent, locale) : undefined,
  });
}
