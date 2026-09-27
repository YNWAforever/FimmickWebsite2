/**
 * Locale contract.
 *
 * Internal identities are `en` and `zh-HK`. Public URL segments follow the
 * current production convention: `/en` and `/zh-hant`. `/zh-hk` (reference
 * site) permanently redirects to `/zh-hant`. `/zh-hans` is retained only for
 * the preserved Simplified Chinese Knowledge Hub archive.
 */
export const locales = ["en", "zh-hant"] as const;
export type Locale = (typeof locales)[number];
export type LegacyLocale = Locale | "zh-hans";

export const defaultLocale: Locale = "en";

export const localeMeta: Record<LegacyLocale, { identity: string; htmlLang: string; hreflang: string; ogLocale: string; label: string; short: string }> = {
  en: { identity: "en", htmlLang: "en", hreflang: "en", ogLocale: "en_HK", label: "English", short: "EN" },
  "zh-hant": { identity: "zh-HK", htmlLang: "zh-Hant-HK", hreflang: "zh-Hant-HK", ogLocale: "zh_HK", label: "繁體中文", short: "繁" },
  "zh-hans": { identity: "zh-CN", htmlLang: "zh-Hans", hreflang: "zh-Hans", ogLocale: "zh_CN", label: "简体中文", short: "简" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "zh-hant";
}

/** Bilingual copy. `zh` is Traditional Chinese for Hong Kong. */
export type L<T = string> = { en: T; zh: T };

export function t<T>(value: L<T>, locale: Locale): T {
  return locale === "en" ? value.en : value.zh;
}

/** Prefix a locale-neutral route (e.g. `/platform`) with the locale segment. */
export function href(locale: Locale | LegacyLocale, path = "/"): string {
  const clean = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Strip the leading locale segment from a pathname. */
export function stripLocale(pathname: string): { locale: LegacyLocale | null; rest: string } {
  const match = pathname.match(/^\/(en|zh-hant|zh-hans)(?=\/|$)(.*)$/);
  if (!match) return { locale: null, rest: pathname || "/" };
  return { locale: match[1] as LegacyLocale, rest: match[2] || "/" };
}

export function formatDate(iso: string, locale: LegacyLocale): string {
  const date = new Date(`${iso}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "zh-hans" ? "zh-CN" : "zh-HK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Hong_Kong",
  }).format(date);
}
