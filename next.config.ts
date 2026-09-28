import type { NextConfig } from "next";
import { localeMoves } from "./lib/redirects";

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
    ];
  },
  async redirects() {
    const moves = localeMoves.map((move) => ({
      source: `/:locale(en|zh-hant)${move.from}`,
      destination: `/:locale${move.to}`,
      permanent: true,
    }));
    return [
      // Root follows production behaviour (language home). Temporary so a
      // future language-negotiation decision is not cached by clients.
      { source: "/", destination: "/en", permanent: false },
      // Reference-site Traditional Chinese prefix → production convention.
      { source: "/zh-hk", destination: "/zh-hant", permanent: true },
      { source: "/zh-hk/:path*", destination: "/zh-hant/:path*", permanent: true },
      { source: "/zh-cn", destination: "/zh-hant", permanent: false },
      { source: "/zh-cn/knowledge-hub/:path*", destination: "/zh-hans/knowledge-hub/:path*", permanent: true },
      { source: "/zh-cn/:path*", destination: "/zh-hant/:path*", permanent: false },
      // Simplified Chinese: only the Knowledge Hub archive is retained natively.
      // Other pages temporarily resolve to Traditional Chinese pending a
      // Simplified translation decision (see docs/redesign/route-migration.csv).
      { source: "/zh-hans", destination: "/zh-hant", permanent: false },
      { source: "/zh-hans/knowledge-hub/category/:c", destination: "/zh-hant/knowledge-hub/category/:c", permanent: false },
      { source: "/zh-hans/:path((?!knowledge-hub).*)", destination: "/zh-hant/:path", permanent: false },
      // Pre-locale WordPress URLs still linked from old material.
      { source: "/events/:slug", destination: "/en/events/:slug", permanent: true },
      { source: "/knowledge-hub/:slug", destination: "/en/knowledge-hub/:slug", permanent: true },
      ...moves,
    ];
  },
};

export default nextConfig;
