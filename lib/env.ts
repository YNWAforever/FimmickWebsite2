/**
 * Environment contract.
 *
 * SITE_ENV=production enables indexing and analytics. Every other value
 * (default: "review") ships `noindex` meta, an `X-Robots-Tag` header and a
 * disallow-all robots.txt. Canonical URLs always point at the production
 * origin so a review hostname can never become canonical.
 */
export type SiteEnv = "production" | "review" | "development";

export function siteEnv(): SiteEnv {
  const value = process.env.SITE_ENV;
  if (value === "production" || value === "development") return value;
  return "review";
}

export const isProduction = () => siteEnv() === "production";

/** Production canonical origin (no trailing slash). */
export const canonicalOrigin = (process.env.NEXT_PUBLIC_CANONICAL_ORIGIN || "https://www.fimmick.com").replace(/\/+$/, "");

/** Google Tag Manager container verified on the current production site. */
export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

export const contactEmail = "business@fimmick.com";
export const aipLoginUrl = "https://aip.fimmick.com/";
