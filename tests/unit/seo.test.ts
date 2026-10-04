import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd } from "@/components/JsonLd";
import articlesEn from "@/content/legacy/articles-en.json";
import articlesZhHant from "@/content/legacy/articles-zh-hant.json";
import { localeMeta } from "@/lib/i18n";
import { publicPages } from "@/lib/pages";
import { allResources, articleIndex, legacyEvents } from "@/lib/resources";
import sitemap from "@/app/sitemap";

/** Award pass 2, Phase 8.1: SEO. */
const cjk = (s: string) => (s.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
type Block = { t: string; x?: string; items?: string[] };
const enText = (slug: string) => {
  const meta = articleIndex.find((a) => a.slug === slug)!.locales.en!;
  const body = ((articlesEn as Record<string, Block[]>)[slug] ?? []).map((b) => b.x ?? (b.items ?? []).join(" ")).join(" ");
  return `${meta.title} ${meta.summary} ${body}`.replace(/\s/g, "");
};

describe("JSON-LD output", () => {
  it("cannot be closed early by a value containing </script> or broken by U+2028", () => {
    const data = { name: "</script><script>alert(1)</script>", note: "a\u2028b\u2029c" };
    const html = renderToStaticMarkup(createElement(JsonLd, { data }));
    const inner = html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));
    expect(inner).not.toContain("<");
    expect(inner).not.toMatch(/[\u2028\u2029]/);
    expect(JSON.parse(inner)).toEqual(data);
  });
});

describe("Chinese articles live under zh-hant, not /en", () => {
  const withEn = articleIndex.filter((a) => a.locales.en);
  it("content language follows the text (CJK > 30 % → zh-hant)", () => {
    const wrong = withEn.filter((a) => {
      const t = enText(a.slug);
      return (cjk(t) > t.length * 0.3) !== (a.locales.en!.contentLanguage === "zh-hant");
    });
    expect(wrong.map((a) => a.slug)).toEqual([]);
  });

  it("every Chinese article has a zh-hant record with its text, and no /en page in the sitemap", () => {
    const pages = new Map(publicPages().map((p) => [p.path, p]));
    for (const a of withEn.filter((x) => x.locales.en!.contentLanguage !== "en")) {
      expect(a.locales["zh-hant"], a.slug).toBeDefined();
      expect((articlesZhHant as Record<string, unknown>)[a.slug], a.slug).toBeDefined();
      expect(pages.get(`/knowledge-hub/${a.slug}`)!.locales, a.slug).not.toContain("en");
    }
  });
});

describe("sitemap and hreflang", () => {
  it("lists the 66 knowledge-hub category URLs (22 categories in three locales)", () => {
    const categories = publicPages().filter((p) => p.path.startsWith("/knowledge-hub/category/"));
    expect(categories.reduce((n, p) => n + p.locales.length, 0)).toBe(66);
  });
  it("names x-default beside the English alternate, and zh-hant as zh-Hant", () => {
    expect(localeMeta["zh-hant"].hreflang).toBe("zh-Hant");
    const entries = sitemap();
    const withEnglish = entries.filter((e) => e.alternates?.languages && "en" in e.alternates.languages);
    expect(withEnglish.length).toBeGreaterThan(0);
    for (const e of withEnglish) expect(e.alternates!.languages!["x-default"], e.url).toBe(e.alternates!.languages!.en);
  });
});

describe("events", () => {
  it("past-event summaries do not say 'Register now'", () => {
    expect(legacyEvents.filter((e) => /register now/i.test(e.summary)).map((e) => e.id)).toEqual([]);
  });
  it("the Chinese resource listings do not list the English-only events", () => {
    expect(allResources("zh-hant").filter((r) => r.format === "event")).toEqual([]);
    expect(allResources("en").filter((r) => r.format === "event").length).toBe(legacyEvents.length);
  });
});
