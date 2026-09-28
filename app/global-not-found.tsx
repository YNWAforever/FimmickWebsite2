import type { Metadata } from "next";
import Link from "next/link";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";

export const metadata: Metadata = {
  title: "404 — Page not found | FIMMICK",
  robots: { index: false, follow: false },
};

/** Bilingual 404 for URLs that match no route at all. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="nf">
          <div className="container stack">
            {/* eslint-disable-next-line @next/next/no-img-element -- static 404 page */}
            <img src="/brand/fimmick-logo.webp" width={124} height={31} alt="FIMMICK" />
            <p className="eyebrow" style={{ marginTop: 32 }}>404</p>
            <h1>We couldn&apos;t find that page</h1>
            <p className="lead" lang="zh-Hant-HK">找不到此頁面</p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn" href="/en">English home</Link>
              <Link className="btn btn--ghost" href="/zh-hant" lang="zh-Hant-HK">繁體中文首頁</Link>
              <Link className="btn btn--ghost" href="/zh-hans" lang="zh-Hans">简体中文首页</Link>
              <Link className="btn btn--ghost" href="/en/contact">Contact</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
