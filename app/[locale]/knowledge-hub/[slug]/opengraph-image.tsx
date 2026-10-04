import { notFound } from "next/navigation";
import { resourceFormats, resourceTopics } from "@/content/resources";
import { t } from "@/lib/i18n";
import { shareImage, shareImageAlt, shareImageSize } from "@/lib/og";
import { resolveLocale, type SlugParams } from "@/lib/page";
import { articleBySlug } from "@/lib/resources";

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";
/** Rendered on request and cached: ~1,070 articles would otherwise be drawn at every build. */
export const dynamic = "force-dynamic";

export default async function Image({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const entry = articleBySlug((await params).slug);
  if (!entry) notFound();
  // The article’s own language when it exists, otherwise the version the page falls back to.
  const meta = entry.locales[locale] ?? entry.locales.en ?? Object.values(entry.locales)[0];
  if (!meta) notFound();
  const format = resourceFormats.find((f) => f.id === "article")!;
  const topic = resourceTopics.find((x) => x.id === entry.topic);
  return shareImage({ locale, eyebrow: [t(format.name, locale), topic ? t(topic.name, locale) : null].filter(Boolean).join(" · "), title: meta.title });
}
