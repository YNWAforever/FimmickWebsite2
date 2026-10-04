import type { Metadata } from "next";
import { canonicalOrigin, isProduction } from "./env";
import { localeMeta, type LegacyLocale } from "./i18n";
import { company } from "@/content/company";

type Input = {
  locale: LegacyLocale;
  /** Locale-neutral path, e.g. "/platform" or "/" */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  /** Locales that have an equivalent of this page. Defaults to all three. */
  alternates?: LegacyLocale[];
  image?: string;
  /**
   * The route draws its own share image (an opengraph-image.tsx beside the page). Next applies a file
   * image only when the page's metadata sets no openGraph.images, so the fallback is left out.
   */
  generatedImage?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function localeUrl(locale: LegacyLocale, path: string) {
  const suffix = path === "/" ? "" : path;
  return `${canonicalOrigin}/${locale}${suffix}`;
}

/** The layout's title template adds this; a title that cannot fit it goes without. */
const BRAND_SUFFIX = " | FIMMICK";
const TITLE_MAX = 65;

/** Cut text to `max` characters at a word boundary (any character in Chinese), with an ellipsis. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:—–-]+$/, "")}…`;
}

/**
 * Award pass 2, 8.1.2: titles fit 65 characters. A title that already names FIMMICK is used as is;
 * one that fits with " | FIMMICK" gets the suffix from the layout template; a longer one is cut at a
 * word boundary within 60 and goes without the suffix.
 */
export function fitTitle(title: string): Metadata["title"] {
  if (title.includes("FIMMICK")) return { absolute: clip(title, TITLE_MAX) };
  if (title.length + BRAND_SUFFIX.length <= TITLE_MAX) return title;
  return { absolute: clip(title, 60) };
}

/** Descriptions fit 155 characters: whole sentences when that leaves at least 70, else a word cut. */
export function fitDescription(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 155) return clean;
  let out = "";
  for (const sentence of clean.match(/[^.!?。！？]+[.!?。！？]+[\s"”’)]*/g) ?? []) {
    if ((out + sentence).trim().length > 155) break;
    out += sentence;
  }
  return out.trim().length >= 70 ? out.trim() : clip(clean, 155);
}

export function pageMetadata({ locale, path, title: rawTitle, description: rawDescription, type = "website", alternates = ["en", "zh-hant", "zh-hans"], image = "/og.png", generatedImage = false, publishedTime, modifiedTime }: Input): Metadata {
  const languages: Record<string, string> = {};
  for (const alt of alternates) languages[localeMeta[alt].hreflang] = localeUrl(alt, path);
  if (alternates.includes("en")) languages["x-default"] = localeUrl("en", path);
  const fitted = fitTitle(rawTitle);
  const title = typeof fitted === "string" ? fitted : (fitted as { absolute: string }).absolute;
  const description = fitDescription(rawDescription);
  return {
    title: fitted,
    description,
    alternates: { canonical: localeUrl(locale, path), languages },
    openGraph: {
      type,
      siteName: "FIMMICK",
      title,
      description,
      url: localeUrl(locale, path),
      locale: localeMeta[locale].ogLocale,
      alternateLocale: alternates.filter((alt) => alt !== locale).map((alt) => localeMeta[alt].ogLocale),
      ...(generatedImage ? {} : { images: [{ url: image, width: 1200, height: 630, alt: "FIMMICK — Agentic AI Platform & Business Solutions" }] }),
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    // No twitter:image: X falls back to og:image, so a template's own share image reaches X too.
    twitter: { card: "summary_large_image", title, description },
    robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/** Stable node ids so other nodes (WebSite, articles) can point at the organisation. */
export const organizationId = `${canonicalOrigin}/#organization`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: company.name,
    url: canonicalOrigin,
    logo: `${canonicalOrigin}/brand/fimmick-logo.png`,
    foundingDate: String(company.founded),
    email: company.generalEmail,
    sameAs: company.social.map((s) => s.url),
    contactPoint: { "@type": "ContactPoint", telephone: "+852-3622-5388", contactType: "sales", email: company.email },
    address: { "@type": "PostalAddress", streetAddress: "1/F, Hung To Centre, 94-96 How Ming Street, Kwun Tong", addressLocality: "Hong Kong", addressCountry: "HK" },
  };
}

/** The site itself, published by the organisation (award pass 2, 8.1.3). */
export function websiteJsonLd(locale: LegacyLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalOrigin}/#website`,
    url: localeUrl(locale, "/"),
    name: company.name,
    inLanguage: localeMeta[locale].htmlLang,
    publisher: { "@id": organizationId },
  };
}

/** Breadcrumbs; the current page (last item) may have no path, as schema.org allows. */
export function breadcrumbJsonLd(locale: LegacyLocale, items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, ...(item.path ? { item: localeUrl(locale, item.path) } : {}) })),
  };
}
