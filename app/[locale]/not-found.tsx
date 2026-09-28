"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocale, zh, type Locale } from "@/lib/i18n";

/** Locale-aware 404 for missing records inside /en, /zh-hant and /zh-hans. */
export default function LocaleNotFound() {
  const pathname = usePathname() || "/en";
  const locale: Locale = stripLocale(pathname).locale ?? "en";
  const chinese = locale !== "en";
  const base = `/${locale}`;
  const links = chinese
    ? [["/solutions", "業務解決方案"], ["/services", "專業服務"], ["/industries", "行業應用"], ["/resources", "資源中心"], ["/contact", "聯絡我們"]].map(([p, l]) => [p, zh(l, locale)])
    : [["/solutions", "Solutions"], ["/services", "Services"], ["/industries", "Industries"], ["/resources", "Resources"], ["/contact", "Contact"]];
  return (
    <section className="nf">
      <div className="container stack">
        <p className="eyebrow">404</p>
        <h1>{chinese ? zh("找不到此頁面", locale) : "We couldn't find that page"}</h1>
        <p className="lead">{chinese ? zh("頁面可能已移動，請從以下位置繼續瀏覽。", locale) : "The page may have moved. Try one of these starting points."}</p>
        <ul className="chips" style={{ marginTop: 24 }}>
          {links.map(([path, label]) => (
            <li key={path}>
              <Link className="chip" href={`${base}${path}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 24 }}>
          <Link className="btn" href={base}>
            {chinese ? zh("返回首頁", locale) : "Go to the homepage"}
          </Link>
        </p>
      </div>
    </section>
  );
}
