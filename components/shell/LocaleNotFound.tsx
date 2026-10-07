"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Headline } from "@/components/motion/Headline";
import { stripLocale, zh, type Locale } from "@/lib/i18n";
import { notFoundCss } from "./not-found-css";

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
  // The dead end, told the site's way (award pass 3): the address arrives as a request and is
  // returned with a reason, like a draft at the review step. Decorative: the heading says it all.
  const record = chinese
    ? { label: zh("請求紀錄", locale), address: zh("地址", locale), status: zh("狀態", locale), returned: zh("已退回", locale), reason: zh("原因", locale), why: zh("此地址沒有已批准的頁面。", locale), next: zh("下一步", locale), then: zh("已附上五個起點。", locale) }
    : { label: "Request record", address: "Address", status: "Status", returned: "Returned", reason: "Reason", why: "No approved page at this address.", next: "Next step", then: "Five starting points attached." };
  return (
    <section className="nf">
      <style href="nf-record" precedence="default">
        {notFoundCss}
      </style>
      <div className="container nf__grid">
        <div className="stack">
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
        <div className="nf__record" aria-hidden="true">
          <p className="nf__record-label">{record.label}</p>
          <dl>
            <div>
              <dt>{record.address}</dt>
              <dd className="nf__path">{pathname}</dd>
            </div>
            <div>
              <dt>{record.status}</dt>
              <dd>
                <span className="nf__stamp">{record.returned}</span>
              </dd>
            </div>
            <div>
              <dt>{record.reason}</dt>
              <dd>{record.why}</dd>
            </div>
            <div>
              <dt>{record.next}</dt>
              <dd>{record.then}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
