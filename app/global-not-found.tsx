import type { Metadata } from "next";
import Link from "next/link";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/editorial.css";
import { fontVariables } from "./fonts";
import { Headline } from "@/components/motion/Headline";

export const metadata: Metadata = {
  title: "404 — Page not found | FIMMICK",
  robots: { index: false, follow: false },
};

/** Bilingual 404 for URLs that match no route at all. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="nf">
          <div className="container stack">
            {/* eslint-disable-next-line @next/next/no-img-element -- static 404 page */}
            <img src="/brand/fimmick-logo-248.webp" width={124} height={31} alt="FIMMICK" />
            <p className="eyebrow" style={{ marginTop: 32 }}>404</p>
            <Headline as="h1" text={"We couldn’t find that page"} accent="find that page" />
            <p className="lead" lang="zh-Hant-HK">找不到此頁面</p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              {/* A 404 is a dead end, not a page to prefetch from (8.2.2). */}
              <Link className="btn" href="/en" prefetch={false}>English home</Link>
              <Link className="btn btn--ghost" href="/zh-hant" lang="zh-Hant-HK" prefetch={false}>繁體中文首頁</Link>
              <Link className="btn btn--ghost" href="/zh-hans" lang="zh-Hans" prefetch={false}>简体中文首页</Link>
              <Link className="btn btn--ghost" href="/en/contact" prefetch={false}>Contact</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
