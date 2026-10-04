import { notFound } from "next/navigation";
import { caseKindLabel, cases } from "@/content/cases";
import { t } from "@/lib/i18n";
import { shareImage, shareImageAlt, shareImageSize } from "@/lib/og";
import { resolveLocale, type SlugParams } from "@/lib/page";

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";
/** Rendered on request and cached (lib/og.tsx explains why not at build). */
export const dynamic = "force-dynamic";

export default async function Image({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();
  return shareImage({ locale, eyebrow: `${t(caseKindLabel[c.kind], locale)} · ${t(c.sector, locale)}`, title: t(c.title, locale) });
}
