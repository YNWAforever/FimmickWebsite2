import { toHans, toHansDeep } from "./hans";

/**
 * Locale contract.
 *
 * Internal identities are `en`, `zh-HK` and `zh-CN`. Public URL segments
 * follow the production convention: `/en`, `/zh-hant` and `/zh-hans`.
 * `/zh-hk` (reference site) permanently redirects to `/zh-hant`.
 *
 * Copy is authored in English and Traditional Chinese (Hong Kong). The
 * Simplified Chinese pages are converted from the Traditional copy at render
 * time (lib/hans.ts); the preserved Knowledge Hub archive keeps its native
 * Simplified articles.
 */
export const locales = ["en", "zh-hant", "zh-hans"] as const;
export type Locale = (typeof locales)[number];
/** Kept as an alias: every public locale is now a full site locale. */
export type LegacyLocale = Locale;

export const defaultLocale: Locale = "en";

export const localeMeta: Record<LegacyLocale, { identity: string; htmlLang: string; hreflang: string; ogLocale: string; label: string; short: string }> = {
  en: { identity: "en", htmlLang: "en", hreflang: "en", ogLocale: "en_HK", label: "English", short: "EN" },
  "zh-hant": { identity: "zh-HK", htmlLang: "zh-Hant-HK", hreflang: "zh-Hant-HK", ogLocale: "zh_HK", label: "繁體中文", short: "繁" },
  "zh-hans": { identity: "zh-CN", htmlLang: "zh-Hans", hreflang: "zh-Hans", ogLocale: "zh_CN", label: "简体中文", short: "简" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "zh-hant" || value === "zh-hans";
}

/** Bilingual copy. `zh` is Traditional Chinese for Hong Kong; Simplified is derived. */
export type L<T = string> = { en: T; zh: T };

export function t<T>(value: L<T>, locale: Locale): T {
  if (locale === "en") return value.en;
  return locale === "zh-hans" ? toHansDeep(value.zh) : value.zh;
}

/** A Traditional Chinese literal, converted when rendering Simplified Chinese. */
export function zh(text: string, locale: Locale): string {
  return locale === "zh-hans" ? toHans(text) : text;
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
