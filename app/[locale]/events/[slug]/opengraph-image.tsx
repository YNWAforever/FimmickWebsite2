import { notFound } from "next/navigation";
import { resourceFormats } from "@/content/resources";
import { t } from "@/lib/i18n";
import { shareImage, shareImageAlt, shareImageSize } from "@/lib/og";
import { resolveLocale, type SlugParams } from "@/lib/page";
import { eventById } from "@/lib/resources";

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";
/** Rendered on request and cached (lib/og.tsx explains why not at build). */
export const dynamic = "force-dynamic";

export default async function Image({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const e = eventById((await params).slug);
  if (!e) notFound();
  const format = resourceFormats.find((f) => f.id === "event")!;
  return shareImage({ locale, eyebrow: `${t(format.name, locale)} · ${e.date}`, title: e.title });
}
