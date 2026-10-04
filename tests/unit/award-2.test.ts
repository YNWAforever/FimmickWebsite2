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

import { solutions } from "@/content/solutions";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { ui } from "@/content/ui";
import { intentLabels } from "@/lib/intent";
import { t as tr } from "@/lib/i18n";
import fs from "node:fs";
import path from "node:path";

type Row = [string, { en: string; zh: string }, { en: string; zh: string } | undefined];

describe("award pass 2 — headlines (3.1)", () => {
  const records: Row[] = [
    ...solutions.map((s) => [`solution ${s.id}`, s.job, s.headlineAccent] as Row),
    ...products.map((p) => [`product ${p.id}`, p.descriptor, p.headlineAccent] as Row),
    ...services.map((s) => [`service ${s.id}`, s.eyebrow, s.headlineAccent] as Row),
    ...industries.map((i) => [`industry ${i.id}`, i.output, i.headlineAccent] as Row),
  ];
  it("every detail record has an accent phrase that occurs in its headline, in all three locales", () => {
    const problems: string[] = [];
    for (const [name, headline, accent] of records) {
      if (!accent) {
        problems.push(`${name}: no headlineAccent`);
        continue;
      }
      for (const locale of ["en", "zh-hant", "zh-hans"] as const) {
        if (!tr(headline, locale).includes(tr(accent, locale))) problems.push(`${name} (${locale}): "${tr(accent, locale)}" not in "${tr(headline, locale)}"`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("award pass 2 — microcopy (3.2)", () => {
  it("no Chinese string uses the Japanese middle dot (U+30FB)", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (full.includes(`${path.sep}legacy`) || e.name === "legal.ts" || e.name === "hans-table.ts") continue;
        if (e.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(e.name) && fs.readFileSync(full, "utf8").includes("・")) offenders.push(full);
      }
    };
    for (const dir of ["content", "components", "app", "lib"]) walk(dir);
    expect(offenders).toEqual([]);
  });

  it("the demo call to action asks for a request, not a booking (申請, not 預約)", () => {
    expect(ui.requestDemo.zh).not.toContain("預約");
    expect(intentLabels.demo.zh).not.toContain("預約");
    expect(ui.requestDemo.zh).toBe("申請產品示範");
  });

  it("buttons are in sentence case", () => {
    expect(ui.requestDemo.en).toBe("Request a demo");
    expect(ui.exploreSolutions.en).toBe("Explore solutions");
    expect(ui.discussConfiguration.en).toBe("Scope this product");
  });
});

import { cases } from "@/content/cases";

describe("award pass 2 — case evidence (3.3)", () => {
  it("every case outcome is an observable state: present, under 220 characters, no evaluative adjectives", () => {
    // The audit’s deny-list for outcome claims.
    const deny = /\b(better|clearer|more consistent|improved)\b/i;
    const problems = cases.flatMap((c) => {
      const en = c.outcome.en;
      const out: string[] = [];
      if (!en.trim() || !c.outcome.zh.trim()) out.push(`${c.slug}: empty`);
      if (en.length >= 220) out.push(`${c.slug}: ${en.length} characters`);
      if (deny.test(en)) out.push(`${c.slug}: evaluative "${en.match(deny)![0]}"`);
      return out;
    });
    expect(problems).toEqual([]);
  });

  it("client cases carry one provenance line and no unknown period", () => {
    for (const c of cases.filter((x) => x.kind === "client-work")) {
      expect(c.publicationBasis.en, c.slug).toBe("Anonymised client engagement. Described, not quantified until the client approves figures.");
      expect(c.period, c.slug).toBeUndefined();
    }
  });
});

import { businessFunctions } from "@/content/functions";

describe("award pass 2 — hub copy (5.3)", () => {
  it("every service, product and function summary says what it does in at most 16 words", () => {
    const long = [...services, ...products, ...businessFunctions]
      .map((r) => ({ id: r.id, words: r.summary.en.trim().split(/\s+/).length }))
      .filter((r) => r.words > 16);
    expect(long).toEqual([]);
  });
});

import { heroSample } from "@/content/examples";

describe("award pass 2 — live hero card (7)", () => {
  it("every approved fact maps to words that appear in both captions", () => {
    expect(heroSample.facts).toHaveLength(4);
    for (const fact of heroSample.facts) {
      expect(heroSample.caption.en, fact.id).toContain(fact.phrase.en);
      expect(heroSample.caption.zh, fact.id).toContain(fact.phrase.zh);
    }
  });
});
