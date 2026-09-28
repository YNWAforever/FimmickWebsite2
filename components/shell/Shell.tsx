import type { ReactNode } from "react";
import { SiteHeader, type HeaderPillar } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { RevealObserver } from "@/components/motion/Reveal";
import type { LanguageOption } from "./LanguageSwitch";
import { pillars } from "@/content/nav";
import { ui } from "@/content/ui";
import { href, localeMeta, t, type LegacyLocale, type Locale, zh } from "@/lib/i18n";
import { aipLoginUrl } from "@/lib/env";
import type { L } from "@/lib/i18n";

const pillarDescriptions: Record<string, L> = {
  platform: { en: "FIMMICK AIP, four business jobs and six products — with examples you can inspect.", zh: "FIMMICK AIP、四項業務工作及六個產品——附可查看的示例。" },
  transformation: { en: "Readiness, roadmap, workflow design and governance for leadership teams.", zh: "為管理團隊提供準備度、路線圖、流程設計及管治支援。" },
  services: { en: "Sixteen specialist services, grouped by the business objective they serve.", zh: "十六項專業服務，按業務目標分類。" },
  industries: { en: "How the same products and services apply to eight sectors.", zh: "同一套產品及服務如何應用於八個行業。" },
  cases: { en: "Client work, FIMMICK's own transformation and clearly labelled examples.", zh: "客戶項目、FIMMICK 自身轉型及清楚標示的示例。" },
  resources: { en: "Articles, guides, the product explainer, events and workshops.", zh: "文章、指南、產品示範影片、活動及工作坊。" },
  ecosystem: { en: "Platforms, communities and ventures FIMMICK has built.", zh: "FIMMICK 建立的平台、社群及項目。" },
  about: { en: "Our story, how we work and the people who lead FIMMICK.", zh: "我們的故事、工作方式及領導團隊。" },
};

export function languageOptions(current: LegacyLocale, available: LegacyLocale[] = ["en", "zh-hant", "zh-hans"]): LanguageOption[] {
  return available.map((code) => ({ code, label: localeMeta[code].label, short: localeMeta[code].short, lang: localeMeta[code].htmlLang, current: code === current }));
}

export function Shell({ locale, children, languages }: { locale: Locale; children: ReactNode; languages?: LanguageOption[] }) {
  const headerPillars: HeaderPillar[] = pillars.map((p) => ({
    id: p.id,
    label: t(p.label, locale),
    utility: p.utility,
    overview: { label: t(p.overview.label, locale), href: href(locale, p.overview.href), description: t(pillarDescriptions[p.id], locale) },
    groups: p.groups.map((g) => ({ heading: t(g.heading, locale), links: g.links.map((l) => ({ label: t(l.label, locale), href: href(locale, l.href), note: l.note ? t(l.note, locale) : undefined })) })),
    featured: p.featured ? { label: t(p.featured.label, locale), href: href(locale, p.featured.href), note: p.featured.note ? t(p.featured.note, locale) : undefined } : undefined,
  }));
  return (
    <>
      <a className="skip-link" href="#main">
        {t(ui.skip, locale)}
      </a>
      <SiteHeader
        home={href(locale, "/")}
        pillars={headerPillars}
        cta={{ label: t(ui.requestDemo, locale), href: href(locale, "/contact?intent=demo") }}
        login={{ label: t(ui.login, locale), href: aipLoginUrl }}
        about={{ label: locale === "en" ? "About" : zh("關於 FIMMICK", locale), href: href(locale, "/about") }}
        languages={languages ?? languageOptions(locale)}
        labels={{ menu: t(ui.menu, locale), close: t(ui.closeMenu, locale), primary: t(ui.primaryNav, locale), logoAlt: locale === "en" ? "FIMMICK home" : zh("FIMMICK 首頁", locale), language: t(ui.language, locale) }}
      />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} />
      <RevealObserver />
    </>
  );
}
