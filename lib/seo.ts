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
  /** Locales that have an equivalent of this page. Defaults to en + zh-hant. */
  alternates?: LegacyLocale[];
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export function localeUrl(locale: LegacyLocale, path: string) {
  const suffix = path === "/" ? "" : path;
  return `${canonicalOrigin}/${locale}${suffix}`;
}

export function pageMetadata({ locale, path, title, description, type = "website", alternates = ["en", "zh-hant"], image = "/og.png", publishedTime, modifiedTime }: Input): Metadata {
  const languages: Record<string, string> = {};
  for (const alt of alternates) languages[localeMeta[alt].hreflang] = localeUrl(alt, path);
  if (alternates.includes("en")) languages["x-default"] = localeUrl("en", path);
  return {
    title,
    description,
    alternates: { canonical: localeUrl(locale, path), languages },
    openGraph: {
      type,
      siteName: "FIMMICK",
      title,
      description,
      url: localeUrl(locale, path),
      locale: localeMeta[locale].ogLocale,
      images: [{ url: image, width: 1200, height: 630, alt: "FIMMICK — Agentic AI Platform & Business Solutions" }],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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

export function breadcrumbJsonLd(locale: LegacyLocale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: localeUrl(locale, item.path) })),
  };
}
