import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";
import { localeMoves } from "./lib/redirects";

/** Knowledge-hub articles whose "en" record is Chinese text: they live under zh-hant (8.1.1). */
const chineseArticles = (
  JSON.parse(readFileSync(join(process.cwd(), "content", "legacy", "article-index.json"), "utf8")) as { slug: string; locales: { en?: { contentLanguage: string } } }[]
)
  .filter((a) => a.locales.en && a.locales.en.contentLanguage !== "en")
  .map((a) => a.slug);
/** Moved pages; the two retired case studies answer 410 from their own route instead. */
const moved = localeMoves.filter((move) => !move.gone);

const indexable = process.env.SITE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: indexable ? securityHeaders : [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Font files carry their version in the name (renamed when they change), 8.2.4.
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Brand files keep stable names, so they are cached for a day and revalidated in the background.
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  async redirects() {
    const moves = moved.map((move) => ({
      source: `/:locale(en|zh-hant|zh-hans)${move.from}`,
      destination: `/:locale${move.to}`,
      permanent: true,
    }));
    // Rules run in order and the first match wins, so the specific single-hop rules come first and
    // no old link takes two redirects to reach its page (8.1.5).
    return [
      // Root follows production behaviour (language home). Temporary so a
      // future language-negotiation decision is not cached by clients.
      { source: "/", destination: "/en", permanent: false },
      // An old locale prefix on a moved path goes straight to the final URL.
      ...moved.flatMap((move) => [
        { source: `/zh-hk${move.from}`, destination: `/zh-hant${move.to}`, permanent: true },
        { source: `/zh-cn${move.from}`, destination: `/zh-hans${move.to}`, permanent: true },
      ]),
      // Chinese articles: the /en URL and the old prefix-less URL go straight to zh-hant (308).
      ...chineseArticles.flatMap((slug) => [
        { source: `/en/knowledge-hub/${slug}`, destination: `/zh-hant/knowledge-hub/${slug}`, permanent: true },
        { source: `/knowledge-hub/${slug}`, destination: `/zh-hant/knowledge-hub/${slug}`, permanent: true },
      ]),
      // Knowledge Hub pages are static paths (8.2.1): an old ?page=N link goes to /page/N (N ≥ 2;
      // ?page=1 is the hub itself) and /page/1 to the hub, each in one hop.
      { source: "/:locale(en|zh-hant|zh-hans)/knowledge-hub", has: [{ type: "query", key: "page", value: "(?<page>[2-9]|[1-9]\\d+)" }], destination: "/:locale/knowledge-hub/page/:page", permanent: true },
      { source: "/knowledge-hub", has: [{ type: "query", key: "page", value: "(?<page>[2-9]|[1-9]\\d+)" }], destination: "/en/knowledge-hub/page/:page", permanent: true },
      { source: "/:locale(en|zh-hant|zh-hans)/knowledge-hub/page/1", destination: "/:locale/knowledge-hub", permanent: true },
      // Reference-site Traditional Chinese prefix → production convention.
      { source: "/zh-hk", destination: "/zh-hant", permanent: true },
      { source: "/zh-hk/:path*", destination: "/zh-hant/:path*", permanent: true },
      // Simplified Chinese alias used by some older links.
      { source: "/zh-cn", destination: "/zh-hans", permanent: true },
      { source: "/zh-cn/:path*", destination: "/zh-hans/:path*", permanent: true },
      // Pre-locale WordPress URLs still linked from old material.
      { source: "/knowledge-hub", destination: "/en/knowledge-hub", permanent: true },
      { source: "/events", destination: "/en/events", permanent: true },
      { source: "/knowledge-hub/category/:category", destination: "/en/knowledge-hub/category/:category", permanent: true },
      { source: "/events/:slug", destination: "/en/events/:slug", permanent: true },
      { source: "/knowledge-hub/:slug", destination: "/en/knowledge-hub/:slug", permanent: true },
      ...moves,
    ];
  },
};

export default nextConfig;
