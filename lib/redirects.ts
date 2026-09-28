/**
 * Legacy route migration contract.
 *
 * Every entry records a production (or reference-site) path that moved, the
 * new canonical target and why. `next.config.ts` turns these into HTTP
 * redirects, the legacy-article renderer uses them to rewrite old in-body
 * links, and `docs/redesign/route-migration.csv` is generated from them.
 * Paths are locale-neutral; they apply under `/en`, `/zh-hant` and `/zh-hans`.
 */
export type LegacyMove = {
  from: string;
  to: string;
  reason: string;
  /** Where the old path was observed. */
  evidence: "production-sitemap" | "production-nav" | "reference-repo" | "production-probe";
};

export const localeMoves: LegacyMove[] = [
  { from: "/workforce", to: "/functions", reason: "Employment metaphor retired; the same functions are presented as workflows by business function", evidence: "production-sitemap" },
  { from: "/workforce/growth", to: "/functions/growth", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/workforce/operations", to: "/functions/operations", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/workforce/finance", to: "/functions/finance", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/workforce/hr", to: "/functions/hr", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/workforce/cx", to: "/functions/cx", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/workforce/expansion", to: "/functions/expansion", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/workforce/executive", to: "/functions/executive", reason: "Workforce-team page rebuilt as a function workflow page (same function, no employment metaphor)", evidence: "production-sitemap" },
  { from: "/services/ai-transformation", to: "/ai-transformation", reason: "One canonical transformation overview; service entry redirects to the hub", evidence: "production-sitemap" },
  { from: "/ai-workshop", to: "/workshop", reason: "Reference alias for the production workshop page", evidence: "reference-repo" },
  { from: "/case-studies/regional-beauty-loyalty-orchestration", to: "/case-studies", reason: "Reference-only case with unverified metrics; case library", evidence: "reference-repo" },
  { from: "/case-studies/asia-operating-footprint", to: "/case-studies", reason: "Reference-only portfolio claim with unverified figures; case library", evidence: "reference-repo" },
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
  let target = locale;
  let rest = pathOnly;
  if (localeMatch) {
    const seg = localeMatch[1];
    target = seg === "zh-hk" ? "zh-hant" : seg === "zh-cn" ? "zh-hans" : seg;
    rest = localeMatch[2] || "/";
  }
  const moved = resolveMove(rest);
  const suffix = moved === "/" ? "" : moved;
  return `/${target}${suffix}${hash ? `#${hash}` : ""}`;
}
