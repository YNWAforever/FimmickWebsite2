import { describe, expect, it } from "vitest";
import { articleIndex, isArchiveArticle } from "@/lib/resources";
import { decodeEntities } from "../../scripts/migration/entities.mjs";

describe("award pass 2 — Knowledge Hub records", () => {
  it("article titles and summaries carry no HTML entities", () => {
    const leftovers = articleIndex.flatMap((a) =>
      Object.entries(a.locales).flatMap(([locale, m]) =>
        [m?.title ?? "", m?.summary ?? ""].filter((s) => /&(#x?[0-9a-f]+|[a-z]+);/i.test(s)).map((s) => `${a.slug} (${locale}): ${s}`),
      ),
    );
    expect(leftovers).toEqual([]);
  });

  it("decoding repeats until the double-escaped capture is plain text", () => {
    expect(decodeEntities("Tips &amp;amp; Considerations")).toBe("Tips & Considerations");
    expect(decodeEntities("It&#8217;s &lt;b&gt; &hellip;")).toBe("It’s <b> …");
    expect(decodeEntities("AT&T and R&D")).toBe("AT&T and R&D");
  });

  it("only articles published before the relaunch are marked as archive", () => {
    expect(isArchiveArticle("2019-12-17")).toBe(true);
    expect(isArchiveArticle("2025-12-31")).toBe(true);
    expect(isArchiveArticle("2026-01-01")).toBe(false);
    expect(isArchiveArticle("2026-06-06")).toBe(false);
  });
});
