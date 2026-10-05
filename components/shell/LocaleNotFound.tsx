"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Headline } from "@/components/motion/Headline";
import { stripLocale, zh, type Locale } from "@/lib/i18n";

/**
 * Body of the locale 404. `not-found.tsx` receives no params, so the locale comes from the URL;
 * the page around it (header, footer, language switch) is the locale layout’s.
 *
 * A notFound() during a request is served by Next as a 404 recovery shell (status, noindex and the
 * localised <title> from not-found’s generateMetadata) that the client then renders into this page;
 * the client render takes the layout’s default title, so the 404 title is restored here.
 */
export function LocaleNotFound() {
  const pathname = usePathname() || "/en";
  const locale: Locale = stripLocale(pathname).locale ?? "en";
  const chinese = locale !== "en";
  const title = `${chinese ? zh("找不到此頁面", locale) : "Page not found"} | FIMMICK`;
  useEffect(() => {
    document.title = title;
  }, [title]);
  const base = `/${locale}`;
  const links = chinese
    ? [["/solutions", "業務解決方案"], ["/services", "專業服務"], ["/industries", "行業應用"], ["/resources", "資源中心"], ["/contact", "聯絡我們"]].map(([p, l]) => [p, zh(l, locale)])
    : [["/solutions", "Solutions"], ["/services", "Services"], ["/industries", "Industries"], ["/resources", "Resources"], ["/contact", "Contact"]];
  return (
    <section className="nf">
      <div className="container stack">
        <p className="eyebrow">404</p>
        {chinese ? <Headline as="h1" text={zh("找不到此頁面", locale)} /> : <Headline as="h1" text={"We couldn’t find that page"} accent="find that page" />}
        <p className="lead">{chinese ? zh("頁面可能已移動，請從以下位置繼續瀏覽。", locale) : "The page may have moved. Try one of these starting points."}</p>
        <ul className="chips" style={{ marginTop: 24 }}>
          {links.map(([path, label]) => (
            <li key={path}>
              {/* A 404 is a dead end, not a page to prefetch from (8.2.2). */}
              <Link className="chip" href={`${base}${path}`} prefetch={false}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 24 }}>
          <Link className="btn" href={base} prefetch={false}>
            {chinese ? zh("返回首頁", locale) : "Go to the homepage"}
          </Link>
        </p>
      </div>
    </section>
  );
}
