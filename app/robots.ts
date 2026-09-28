import type { MetadataRoute } from "next";
import { canonicalOrigin, isProduction } from "@/lib/env";

/** Production: crawlable except the API. Any other environment: disallow all. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${canonicalOrigin}/sitemap.xml`,
  };
}
