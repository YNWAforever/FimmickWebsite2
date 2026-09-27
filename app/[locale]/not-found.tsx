"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Locale-aware 404 for missing records inside /en and /zh-hant. */
export default function LocaleNotFound() {
  const pathname = usePathname() || "/en";
  const zh = pathname.startsWith("/zh-hant");
  const base = zh ? "/zh-hant" : "/en";
  const links = zh
    ? [["/solutions", "業務解決方案"], ["/services", "專業服務"], ["/industries", "行業應用"], ["/resources", "資源中心"], ["/contact", "聯絡我們"]]
    : [["/solutions", "Solutions"], ["/services", "Services"], ["/industries", "Industries"], ["/resources", "Resources"], ["/contact", "Contact"]];
  return (
    <section className="nf">
      <div className="container stack">
        <p className="eyebrow">404</p>
        <h1>{zh ? "找不到此頁面" : "We couldn't find that page"}</h1>
        <p className="lead">{zh ? "頁面可能已移動，請從以下位置繼續瀏覽。" : "The page may have moved. Try one of these starting points."}</p>
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
            {zh ? "返回首頁" : "Go to the homepage"}
          </Link>
        </p>
      </div>
    </section>
  );
}
