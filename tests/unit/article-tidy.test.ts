import { describe, expect, it } from "vitest";
import en from "@/content/legacy/articles-en.json";
import zhHant from "@/content/legacy/articles-zh-hant.json";
import zhHans from "@/content/legacy/articles-zh-hans.json";
import { articleBySlug, tidyArticleBlocks, type Block } from "@/lib/resources";
import type { LegacyLocale } from "@/lib/i18n";

// Award pass 3: the WordPress export's "Explore Further" remnants and the retired company blurb.
const sets: [LegacyLocale, Record<string, Block[]>][] = [
  ["en", en as unknown as Record<string, Block[]>],
  ["zh-hant", zhHant as unknown as Record<string, Block[]>],
  ["zh-hans", zhHans as unknown as Record<string, Block[]>],
];
const text = (b: { t: string; x?: string; items?: string[]; title?: string }) => b.x ?? b.title ?? (b.items ?? []).join(" ");

describe("tidyArticleBlocks", () => {
  for (const [locale, data] of sets) {
    // The closing blurb only; a few recent articles repeat the figures in their own prose (an editorial
    // decision, listed in docs/redesign/award-3/README.md).
    it(`${locale}: no article ends with the retired company blurb`, () => {
      for (const [slug, blocks] of Object.entries(data)) {
        const body = tidyArticleBlocks(blocks, slug, locale);
        expect(body.some((b) => b.t === "h" && /^(About FIMMICK|Get Started)$/.test(b.x.trim())), slug).toBe(false);
        expect(body.map(text).join(" "), slug).not.toMatch(/\$980\/month/);
      }
    });
    it(`${locale}: no "Explore Further" or slug-shaped heading is left, and every related link resolves`, () => {
      for (const [slug, blocks] of Object.entries(data)) {
        for (const b of tidyArticleBlocks(blocks, slug, locale)) {
          if (b.t === "p") expect(b.x.trim(), slug).not.toMatch(/^explore further\s*[:：]?$/i);
          if (b.t === "h") expect(b.x.trim(), slug).not.toMatch(/^[a-z0-9]+(-[a-z0-9]+){3,}$/);
          if (b.t === "rel") {
            expect(b.slug, slug).not.toBe(slug);
            expect(articleBySlug(b.slug), b.slug).toBeTruthy();
          }
        }
      }
    });
  }

  it("turns the CRM guide's references into links to the migrated articles", () => {
    const blocks = (en as unknown as Record<string, Block[]>)["4-types-of-crm-system"];
    const rel = tidyArticleBlocks(blocks, "4-types-of-crm-system", "en").filter((b) => b.t === "rel");
    expect(rel.length).toBeGreaterThan(0);
    expect(rel.map((b) => (b.t === "rel" ? b.title : "")).join(" ")).toMatch(/WhatsApp/);
  });

  it("keeps everything else in order", () => {
    const blocks: Block[] = [
      { t: "h", x: "Intro" },
      { t: "p", x: "Body." },
      { t: "h", x: "About FIMMICK" },
      { t: "p", x: "Blurb." },
      { t: "h", x: "Get Started" },
      { t: "p", x: "Book." },
    ];
    expect(tidyArticleBlocks(blocks, "x", "en")).toEqual(blocks.slice(0, 2));
  });
});
