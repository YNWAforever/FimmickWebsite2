import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/shell.css";
import "../styles/diagrams.css";
import "../styles/examples.css";
import "../styles/pages.css";
import { Shell } from "@/components/shell/Shell";
import { Gtm } from "@/components/analytics/Gtm";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, localeMeta, locales } from "@/lib/i18n";
import { canonicalOrigin, isProduction } from "@/lib/env";
import { organizationJsonLd } from "@/lib/seo";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: "variable" });

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
  const zh = locale === "zh-hant";
  return {
    metadataBase: new URL(canonicalOrigin),
    title: { default: zh ? "FIMMICK — 企業 AI 智能體平台與業務解決方案" : "FIMMICK — Agentic AI Platform & Business Solutions", template: "%s | FIMMICK" },
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
    <html lang={localeMeta[locale].htmlLang} className={manrope.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
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
