import type { Metadata } from "next";
import { LocaleNotFound } from "@/components/shell/LocaleNotFound";
import { isLocale, zh } from "@/lib/i18n";

/**
 * Locale-aware 404 for unknown paths and missing records inside /en, /zh-hant and /zh-hans.
 * Next passes the segment params to a not-found’s generateMetadata, so the title is localised.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = isLocale(locale) && locale !== "en" ? zh("找不到此頁面", locale) : "Page not found";
  return { title, robots: { index: false, follow: false } };
}

export default function NotFound() {
  return <LocaleNotFound />;
}
