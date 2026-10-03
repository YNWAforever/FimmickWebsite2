import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/shell.css";
import "../styles/diagrams.css";
import "../styles/examples.css";
import "../styles/pages.css";
import "../styles/cinematic.css";
import "../styles/editorial.css";
import "../styles/award.css";
import { fontVariables } from "../fonts";
import { Shell } from "@/components/shell/Shell";
import { Gtm } from "@/components/analytics/Gtm";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, localeMeta, locales, zh } from "@/lib/i18n";
import { canonicalOrigin, isProduction } from "@/lib/env";
import { organizationJsonLd } from "@/lib/seo";


export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(canonicalOrigin),
    title: { default: locale !== "en" ? zh("FIMMICK — 企業 AI 智能體平台與業務解決方案", locale) : "FIMMICK — Agentic AI Platform & Business Solutions", template: "%s | FIMMICK" },
    applicationName: "FIMMICK",
    icons: { icon: "/favicon.ico" },
    robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/** Runs before paint: marks JS availability so reveal styles never hide content without JS. */
const bootScript = `document.documentElement.classList.add('js');`;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body>
        <Gtm />
        <Shell locale={locale}>{children}</Shell>
      </body>
    </html>
  );
}
