import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/shell.css";
import "../styles/diagrams.css";
import "../styles/examples.css";
import "../styles/pages.css";
import { Shell, languageOptions } from "@/components/shell/Shell";
import { Gtm } from "@/components/analytics/Gtm";
import { canonicalOrigin, isProduction } from "@/lib/env";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: "variable" });

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: { default: "FIMMICK 知识库", template: "%s | FIMMICK" },
  icons: { icon: "/favicon.ico" },
  robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
};

/**
 * Simplified Chinese archive. Only the Knowledge Hub is preserved natively in
 * Simplified Chinese; navigation around it uses the Traditional Chinese site.
 */
export default function SimplifiedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hans" className={manrope.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
      </head>
      <body>
        <Gtm />
        <Shell locale="zh-hant" languages={languageOptions("zh-hans", ["en", "zh-hant", "zh-hans"])}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
