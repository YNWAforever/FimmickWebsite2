import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "./i18n";

export type LocaleParams = { params: Promise<{ locale: string }> };
export type SlugParams = { params: Promise<{ locale: string; slug: string }> };

/** Resolve and validate the locale segment, or 404. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/** Static params for every locale × slug. */
export function localeSlugParams(slugs: string[]) {
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}
