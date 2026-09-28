import { describe, expect, it } from "vitest";
import { solutions } from "@/content/solutions";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { workstreams, programme } from "@/content/transformation";
import { members } from "@/content/ecosystem";
import { cases } from "@/content/cases";
import { pillars } from "@/content/nav";
import { explainerScenes, explainerMedia } from "@/content/media";
import { contextQuery, parseContext } from "@/lib/intent";
import { safeQueryForLocaleSwitch } from "@/lib/safe-query";
import { localeMoves, resolveLegacyHref, resolveMove } from "@/lib/redirects";
import { filterResources, articleIndex } from "@/lib/resources";
import { publicPages } from "@/lib/pages";

/** Walk any object and collect every {en, zh} pair. */
function bilingualPairs(value: unknown, out: { en: unknown; zh: unknown }[] = []) {
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if ("en" in v && "zh" in v && Object.keys(v).length === 2) out.push(v as { en: unknown; zh: unknown });
    else Object.values(v).forEach((x) => bilingualPairs(x, out));
  }
  return out;
}

describe("catalogue scope (master instruction §4, §8)", () => {
  it("has the required record counts", () => {
    expect(solutions).toHaveLength(4);
    expect(products).toHaveLength(6);
    expect(services).toHaveLength(15);
    expect(industries).toHaveLength(8);
    expect(workstreams).toHaveLength(4);
    expect(programme).toHaveLength(6);
    expect(members).toHaveLength(6);
    expect(pillars).toHaveLength(8);
  });

  it("preserves the 15 existing service slugs", () => {
    expect(services.map((s) => s.id).sort()).toEqual(
      ["ai-transformation", "digitalmarketing", "marketing-automation", "crm-sales", "seo-aeo", "social-listening", "koc-community", "ecommerce-growth", "business-intelligence", "data-hub", "content-creative", "customer-experience", "workflow-automation", "whatsapp-automation", "ai-training"].sort(),
    );
  });

  it("preserves the six ecosystem slugs", () => {
    expect(members.map((m) => m.id)).toEqual(["aip", "kocmax", "adfocate", "kinnso", "50-add-oil", "eldage"]);
  });

  it("has every bilingual string filled in both locales", () => {
    const all = bilingualPairs([solutions, products, services, industries, workstreams, programme, members, cases, pillars]);
    expect(all.length).toBeGreaterThan(500);
    const empty = (x: unknown): boolean => (Array.isArray(x) ? x.length === 0 || x.some((i) => (Array.isArray(i) ? i.some((j) => !j) : !i)) : !x);
    for (const pair of all) expect(empty(pair.en) || empty(pair.zh), JSON.stringify(pair).slice(0, 120)).toBe(false);
  });

  it("does not reintroduce retired employment metaphors in customer-facing copy", () => {
    const text = JSON.stringify([solutions, products, services, industries, workstreams, members, pillars]).toLowerCase();
    for (const phrase of ["ai workforce", "digital employee", "hire ai", "ai staff", "ai teammate"]) expect(text).not.toContain(phrase);
  });

  it("does not carry unsupported headline metrics into case records", () => {
    const text = JSON.stringify(cases);
    for (const claim of ["32%", "45%", "180%", "3.8x", "130→40", "500+", "4,000+"]) expect(text).not.toContain(claim);
  });
});

describe("relationship registry", () => {
  const ids = {
    product: new Set<string>(products.map((p) => p.id)),
    service: new Set<string>(services.map((s) => s.id)),
    industry: new Set<string>(industries.map((i) => i.id)),
    member: new Set<string>(members.map((m) => m.id)),
  };
  it("references only existing records", () => {
    for (const s of solutions) {
      s.products.forEach((p) => expect(ids.product.has(p)).toBe(true));
      s.services.forEach((x) => expect(ids.service.has(x)).toBe(true));
      s.industries.forEach((x) => expect(ids.industry.has(x)).toBe(true));
    }
    for (const s of services) {
      s.products.forEach((p) => expect(ids.product.has(p)).toBe(true));
      s.industries.forEach((x) => expect(ids.industry.has(x)).toBe(true));
      s.members.forEach((x) => expect(ids.member.has(x)).toBe(true));
    }
    for (const i of industries) {
      i.products.forEach((p) => expect(ids.product.has(p)).toBe(true));
      i.services.forEach((x) => expect(ids.service.has(x)).toBe(true));
      i.members.forEach((x) => expect(ids.member.has(x)).toBe(true));
    }
    for (const c of cases) {
      c.industries.forEach((x) => expect(ids.industry.has(x)).toBe(true));
      c.services.forEach((x) => expect(ids.service.has(x)).toBe(true));
      c.products.forEach((x) => expect(ids.product.has(x)).toBe(true));
    }
  });

  it("maps every product to exactly one solution", () => {
    for (const p of products) expect(solutions.filter((s) => s.products.includes(p.id))).toHaveLength(1);
  });
});

describe("enquiry context", () => {
  it("keeps known IDs and drops unknown values", () => {
    const ctx = parseContext(new URLSearchParams("intent=configuration&product=creativemax&industry=not-real&service=crm-sales&email=a@b.com"));
    expect(ctx).toEqual({ intent: "configuration", product: "creativemax", service: "crm-sales" });
  });
  it("maps legacy intents to their current meaning", () => {
    expect(parseContext({ intent: "benchmark" }).intent).toBe("transformation");
    expect(parseContext({ intent: "kinnso" })).toMatchObject({ intent: "partnership", member: "kinnso" });
    expect(parseContext({ intent: "<script>" }).intent).toBe("general");
  });
  it("serialises only safe keys", () => {
    expect(contextQuery({ intent: "service", service: "seo-aeo" })).toBe("?intent=service&service=seo-aeo");
    expect(safeQueryForLocaleSwitch("?intent=demo&name=Jane&email=j%40x.com&industry=retail-ecommerce")).toBe("?intent=demo&industry=retail-ecommerce");
  });
});

describe("legacy route migration", () => {
  it("has no redirect chains or loops", () => {
    for (const move of localeMoves) {
      expect(move.from).not.toBe(move.to);
      expect(resolveMove(move.to)).toBe(move.to);
    }
  });
  it("rewrites old in-article links to current URLs", () => {
    expect(resolveLegacyHref("/workforce", "en")).toBe("/en/solutions");
    expect(resolveLegacyHref("/platform/agents", "zh-hant")).toBe("/zh-hant/platform");
    expect(resolveLegacyHref("https://www.fimmick.com/en/services/ai-transformation", "en")).toBe("/en/ai-transformation");
    expect(resolveLegacyHref("/zh-hk/contact", "en")).toBe("/zh-hant/contact");
    expect(resolveLegacyHref("https://example.com/x", "en")).toBe("https://example.com/x");
    expect(resolveLegacyHref("/about", "zh-hans")).toBe("/zh-hant/about");
  });
});

describe("resources", () => {
  it("filters by format, topic and search, with safe pagination", () => {
    const all = filterResources("en", {});
    expect(all.total).toBeGreaterThan(350);
    expect(filterResources("en", { format: "guide" }).items.every((i) => i.format === "guide")).toBe(true);
    expect(filterResources("en", { format: "event" }).items.every((i) => i.status === "past")).toBe(true);
    expect(filterResources("en", { q: "readiness" }).items.some((i) => i.id === "guide:ai-readiness-checklist")).toBe(true);
    expect(filterResources("en", { page: 9999 }).page).toBe(all.pages);
    expect(filterResources("en", { q: "zzzz-no-match" }).total).toBe(0);
  });
  it("keeps original article dates", () => {
    expect(articleIndex.every((a) => /^\d{4}-\d{2}-\d{2}$/.test(a.published))).toBe(true);
  });
});

describe("sitemap and media", () => {
  it("lists every canonical page once", () => {
    const paths = publicPages().map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("/services/crm-sales");
    expect(paths).not.toContain("/services/ai-transformation");
    expect(paths.some((p) => p.startsWith("/launch-plan"))).toBe(false);
  });
  it("film script covers the full duration without gaps", () => {
    expect(explainerScenes[0].start).toBe(0);
    expect(explainerScenes[explainerScenes.length - 1].end).toBe(explainerMedia.durationSeconds);
    for (let i = 1; i < explainerScenes.length; i++) expect(explainerScenes[i].start).toBe(explainerScenes[i - 1].end);
    expect(explainerMedia.durationSeconds).toBeGreaterThanOrEqual(30);
    expect(explainerMedia.durationSeconds).toBeLessThanOrEqual(45);
  });
});
