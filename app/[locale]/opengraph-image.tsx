import { hero } from "@/content/home";
import { t } from "@/lib/i18n";
import { shareImage, shareImageAlt, shareImageSize } from "@/lib/og";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";

/** The homepage card: the hero line and its accent. Prerendered for the three locales. */
export default async function Image({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return shareImage({ locale, eyebrow: t(hero.eyebrow, locale), title: t(hero.title, locale), accent: t(hero.titleAccent, locale) });
}
