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
import { cinema, hero, homeFaqs } from "@/content/home";
import { contextQuery, parseContext } from "@/lib/intent";
import { safeQueryForLocaleSwitch } from "@/lib/safe-query";
import { localeMoves, resolveLegacyHref, resolveMove } from "@/lib/redirects";
import { filterResources, articleIndex } from "@/lib/resources";
import { publicPages } from "@/lib/pages";
import { businessFunctions } from "@/content/functions";
import { agentAnatomy, capabilities, taskPatterns, workflowTemplates } from "@/content/platform-pages";
import { t } from "@/lib/i18n";
import { toHans } from "@/lib/hans";
import { hansPairs } from "@/lib/hans-table";
import * as OpenCC from "opencc-js";

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
    expect(services).toHaveLength(16);
    expect(businessFunctions).toHaveLength(7);
    expect(capabilities).toHaveLength(5);
    expect(industries).toHaveLength(8);
    expect(workstreams).toHaveLength(4);
    expect(programme).toHaveLength(6);
    expect(members).toHaveLength(6);
    expect(pillars).toHaveLength(8);
  });

  it("preserves the production service slugs, including digital-experience", () => {
    expect(services.map((s) => s.id).sort()).toEqual(
      ["ai-transformation", "digitalmarketing", "marketing-automation", "crm-sales", "seo-aeo", "social-listening", "koc-community", "ecommerce-growth", "digital-experience", "business-intelligence", "data-hub", "content-creative", "customer-experience", "workflow-automation", "whatsapp-automation", "ai-training"].sort(),
    );
  });

  it("keeps the seven production workforce functions as function pages", () => {
    expect(businessFunctions.map((f) => f.id)).toEqual(["growth", "operations", "finance", "hr", "cx", "expansion", "executive"]);
    for (const f of businessFunctions) expect(localeMoves.find((m) => m.from === `/workforce/${f.id}`)?.to).toBe(`/functions/${f.id}`);
  });

  it("preserves the six ecosystem slugs", () => {
    expect(members.map((m) => m.id)).toEqual(["aip", "kocmax", "adfocate", "kinnso", "50-add-oil", "eldage"]);
  });

  it("has every bilingual string filled in both locales", () => {
    const all = bilingualPairs([solutions, products, services, industries, workstreams, programme, members, cases, pillars, businessFunctions, capabilities, workflowTemplates, agentAnatomy, taskPatterns, cinema, hero, homeFaqs]);
    expect(all.length).toBeGreaterThan(500);
    const empty = (x: unknown): boolean => (Array.isArray(x) ? x.length === 0 || x.some((i) => (Array.isArray(i) ? i.some((j) => !j) : !i)) : !x);
    for (const pair of all) expect(empty(pair.en) || empty(pair.zh), JSON.stringify(pair).slice(0, 120)).toBe(false);
  });

  it("does not reintroduce retired employment metaphors in customer-facing copy", () => {
    const text = JSON.stringify([solutions, products, services, industries, workstreams, members, pillars, businessFunctions, capabilities, workflowTemplates, agentAnatomy, taskPatterns, cinema, hero, homeFaqs]).toLowerCase();
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
    expect(resolveLegacyHref("/workforce", "en")).toBe("/en/functions");
    expect(resolveLegacyHref("/workforce/cx", "zh-hant")).toBe("/zh-hant/functions/cx");
    expect(resolveLegacyHref("/platform/agents", "zh-hant")).toBe("/zh-hant/platform/agents");
    expect(resolveLegacyHref("https://www.fimmick.com/en/services/ai-transformation", "en")).toBe("/en/ai-transformation");
    expect(resolveLegacyHref("/zh-hk/contact", "en")).toBe("/zh-hant/contact");
    expect(resolveLegacyHref("https://example.com/x", "en")).toBe("https://example.com/x");
    expect(resolveLegacyHref("/about", "zh-hans")).toBe("/zh-hans/about");
    expect(resolveLegacyHref("/zh-cn/services", "en")).toBe("/zh-hans/services");
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
    for (const p of ["/functions/cx", "/platform/architecture", "/platform/agents", "/platform/marketplace", "/platform/pricing", "/platform/intelligence", "/services/digital-experience", "/growth", "/insights", "/about/asia-delivery"]) expect(paths).toContain(p);
  });
  it("publishes core pages in all three locales and archive articles only where they exist", () => {
    const pages = publicPages();
    expect(pages.find((p) => p.path === "/services")!.locales).toEqual(["en", "zh-hant", "zh-hans"]);
    const article = pages.find((p) => p.kind === "article" && !p.locales.includes("zh-hans"));
    expect(article).toBeDefined();
  });
  it("film script covers the full duration without gaps", () => {
    expect(explainerScenes[0].start).toBe(0);
    expect(explainerScenes[explainerScenes.length - 1].end).toBe(explainerMedia.durationSeconds);
    for (let i = 1; i < explainerScenes.length; i++) expect(explainerScenes[i].start).toBe(explainerScenes[i - 1].end);
    expect(explainerMedia.durationSeconds).toBeGreaterThanOrEqual(30);
    expect(explainerMedia.durationSeconds).toBeLessThanOrEqual(45);
  });
});

describe("Simplified Chinese rendering", () => {
  it("converts Traditional copy, including word-level cases", () => {
    expect(toHans("審閱回覆")).toBe("审阅回复");
    expect(toHans("每週檢視反覆出現的問題")).toBe("每周检视反复出现的问题");
    expect(toHans("為甚麼")).toBe("为什么");
    expect(toHans("FIMMICK AIP")).toBe("FIMMICK AIP");
  });
  it("t() returns converted copy for zh-hans and leaves other locales untouched", () => {
    const copy = { en: "Request a Demo", zh: "預約產品示範" };
    expect(t(copy, "en")).toBe("Request a Demo");
    expect(t(copy, "zh-hant")).toBe("預約產品示範");
    expect(t(copy, "zh-hans")).toBe("预约产品示范");
    expect(t({ en: [["a", "b"]], zh: [["資料", "紀錄"]] }, "zh-hans")).toEqual([["资料", "纪录"]]);
  });
  it("covers every Traditional character used in the content (table is not stale)", () => {
    const convert = OpenCC.Converter({ from: "hk", to: "cn" });
    const keys = new Set([...hansPairs].filter((_, i) => i % 2 === 0));
    const zhText = JSON.stringify(bilingualPairs([solutions, products, services, industries, workstreams, programme, members, cases, pillars, businessFunctions, capabilities, workflowTemplates, cinema, hero, homeFaqs]).map((p) => p.zh));
    const missing = [...new Set(zhText.match(/[㐀-鿿]/g) ?? [])].filter((c) => convert(c) !== c && !keys.has(c));
    expect(missing, "run npm run i18n:hans").toEqual([]);
  });
});

describe("editorial photography", () => {
  it("every scene has bilingual alt text, delivery files and a provenance entry", async () => {
    const fs = await import("node:fs");
    const { photos, solutionPhotos, industryPhotos, casePhotos } = await import("@/content/photography");
    const scenes = (await import("@/assets-src/photography/scenes.json")).default.scenes;
    const provenance = fs.readFileSync("docs/redesign/cinematic/photography-provenance.md", "utf8");
    for (const scene of scenes) {
      const photo = photos[scene.id as keyof typeof photos];
      expect(photo, scene.id).toBeTruthy();
      expect(scene.alt.en.length, scene.id).toBeGreaterThan(20);
      expect(scene.alt.zh.length, scene.id).toBeGreaterThan(6);
      for (const file of [`${scene.id}-1536.avif`, `${scene.id}-640.webp`, `${scene.id}-p-800.avif`, `${scene.id}-p-480.webp`]) {
        expect(fs.existsSync(`public/media/photography/${file}`), file).toBe(true);
      }
      expect(provenance, `provenance for ${scene.id}`).toContain(`\`${scene.id}\``);
    }
    for (const id of [...Object.values(solutionPhotos), ...Object.values(industryPhotos), ...Object.values(casePhotos)]) {
      expect(photos[id], id).toBeTruthy();
    }
    expect(Object.keys(solutionPhotos).sort()).toEqual(solutions.map((s) => s.id).sort());
    expect(Object.keys(industryPhotos).every((id) => industries.some((i) => i.id === id))).toBe(true);
    expect(Object.keys(casePhotos).every((slug) => cases.some((c) => c.slug === slug))).toBe(true);
  });
});
