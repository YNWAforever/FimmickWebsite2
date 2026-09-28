/**
 * Legacy route migration contract.
 *
 * Every entry records a production (or reference-site) path that moved, the
 * new canonical target and why. `next.config.ts` turns these into HTTP
 * redirects, the legacy-article renderer uses them to rewrite old in-body
 * links, and `docs/redesign/route-migration.csv` is generated from them.
 * Paths are locale-neutral; they apply under both `/en` and `/zh-hant`.
 */
export type LegacyMove = {
  from: string;
  to: string;
  reason: string;
  /** Where the old path was observed. */
  evidence: "production-sitemap" | "production-nav" | "reference-repo" | "production-probe";
};

export const localeMoves: LegacyMove[] = [
  { from: "/platform/agents", to: "/platform", reason: "Workforce-era platform page replaced by the four-layer platform story", evidence: "production-sitemap" },
  { from: "/platform/architecture", to: "/platform", reason: "Architecture content consolidated into the platform page layers", evidence: "production-sitemap" },
  { from: "/platform/marketplace", to: "/products", reason: "Agent marketplace replaced by the six-product directory", evidence: "production-sitemap" },
  { from: "/platform/pricing", to: "/how-to-start", reason: "Outdated price plans retired; starting scopes explained on How to Start", evidence: "production-sitemap" },
  { from: "/platform/intelligence", to: "/solutions/market-intelligence", reason: "Reference capability page mapped to its solution", evidence: "reference-repo" },
  { from: "/platform/data-analysis", to: "/services/business-intelligence", reason: "Reference capability page mapped to the BI service", evidence: "reference-repo" },
  { from: "/platform/creative-studio", to: "/products/creativemax", reason: "Reference capability page mapped to CreativeMax", evidence: "reference-repo" },
  { from: "/platform/marketing-strategy", to: "/solutions", reason: "Reference capability page mapped to the solutions overview", evidence: "reference-repo" },
  { from: "/platform/workflow-automation", to: "/services/workflow-automation", reason: "Reference capability page mapped to the workflow automation service", evidence: "reference-repo" },
  { from: "/workforce", to: "/solutions", reason: "Employment metaphor retired; workflows are presented as business solutions", evidence: "production-sitemap" },
  { from: "/workforce/growth", to: "/solutions/content-production", reason: "Growth workflows map to content and campaign production", evidence: "production-sitemap" },
  { from: "/workforce/operations", to: "/solutions/website-operations", reason: "Operations workflows map to website, commerce and operations", evidence: "production-sitemap" },
  { from: "/workforce/finance", to: "/services/business-intelligence", reason: "Finance reporting workflows map to Business Intelligence", evidence: "production-sitemap" },
  { from: "/workforce/hr", to: "/services/ai-training", reason: "HR knowledge and onboarding workflows map to AI Training & Enablement", evidence: "production-sitemap" },
  { from: "/workforce/cx", to: "/solutions/customer-engagement", reason: "Customer experience workflows map to customer engagement", evidence: "production-sitemap" },
  { from: "/workforce/expansion", to: "/solutions/market-intelligence", reason: "Market expansion workflows map to market intelligence", evidence: "production-sitemap" },
  { from: "/workforce/executive", to: "/services/business-intelligence", reason: "Executive reporting maps to Business Intelligence", evidence: "production-sitemap" },
  { from: "/services/ai-transformation", to: "/ai-transformation", reason: "One canonical transformation overview; service entry redirects to the hub", evidence: "production-sitemap" },
  { from: "/services/digital-experience", to: "/solutions/website-operations", reason: "Digital experience work maps to website and operations", evidence: "production-sitemap" },
  { from: "/growth", to: "/solutions", reason: "Growth solutions page replaced by the solutions overview", evidence: "production-sitemap" },
  { from: "/ai-workshop", to: "/workshop", reason: "Reference alias for the production workshop page", evidence: "reference-repo" },
  { from: "/insights", to: "/resources", reason: "Reference insights alias for the Resource Centre", evidence: "reference-repo" },
  { from: "/case-studies/regional-beauty-loyalty-orchestration", to: "/case-studies", reason: "Reference-only case with unverified metrics; case library", evidence: "reference-repo" },
  { from: "/case-studies/asia-operating-footprint", to: "/case-studies", reason: "Reference-only portfolio claim with unverified figures; case library", evidence: "reference-repo" },
  { from: "/about/asia-delivery", to: "/about", reason: "Reference-only page with unverified market counts", evidence: "reference-repo" },
];

/** Resolve a locale-neutral path through the move table (single hop, no chains). */
export function resolveMove(path: string): string {
  const clean = path.replace(/\/+$/, "") || "/";
  const hit = localeMoves.find((m) => m.from === clean);
  return hit ? hit.to : clean;
}

/**
 * Map a link found inside a preserved legacy article to a current URL.
 * External links are returned unchanged.
 */
export function resolveLegacyHref(raw: string, locale: string): string {
  let value = raw.trim();
  const origin = value.match(/^https?:\/\/(www\.)?fimmick\.com(\/.*)?$/i);
  if (origin) value = origin[2] || "/";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (!value.startsWith("/")) return value;
  const [pathOnly, hash = ""] = value.split("#");
  const localeMatch = pathOnly.match(/^\/(en|zh-hant|zh-hans|zh-hk|zh-cn)(?=\/|$)(.*)$/);
  let target = locale === "zh-hans" ? "zh-hant" : locale;
  let rest = pathOnly;
  if (localeMatch) {
    const seg = localeMatch[1];
    target = seg === "zh-hk" ? "zh-hant" : seg === "zh-cn" ? "zh-hans" : seg;
    rest = localeMatch[2] || "/";
  }
  if (target === "zh-hans" && !rest.startsWith("/knowledge-hub")) target = "zh-hant";
  const moved = resolveMove(rest);
  const suffix = moved === "/" ? "" : moved;
  return `/${target}${suffix}${hash ? `#${hash}` : ""}`;
}
