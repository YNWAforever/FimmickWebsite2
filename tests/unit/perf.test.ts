import { describe, expect, it } from "vitest";
import { contextKeys, knownIds, parseContext } from "@/lib/intent";
import { parseContextWith } from "@/lib/intent-parse";
import { PAGE_SIZE, filterQuery, filterRows, readFilter } from "@/lib/resource-filter";
import { KNOWLEDGE_PAGE_SIZE, allResources, knowledgeArticles, knowledgePageCount } from "@/lib/resources";
import { locales } from "@/lib/i18n";

/** Award pass 2, Phase 8.2: the browser-side halves of the static hubs. */

describe("resource filter in the browser", () => {
  const formats = ["article", "guide", "video", "event", "workshop"];
  const topics = ["ai-transformation", "customer-crm"];

  it("reads only known values and writes them back without page 1", () => {
    const f = readFilter("?format=guide&topic=nope&q=CRM&page=1", formats, topics);
    expect(f).toEqual({ format: "guide", topic: undefined, q: "CRM", page: 1 });
    expect(filterQuery(f)).toBe("?format=guide&q=CRM");
    expect(filterQuery(readFilter(filterQuery({ topic: "customer-crm", page: 3 }), formats, topics))).toBe("?topic=customer-crm&page=3");
    expect(filterQuery({})).toBe("");
  });

  it("matches the server's first page (the static page and the island agree)", () => {
    const all = allResources("en");
    const first = filterRows(all, {});
    expect(first.items).toEqual(all.slice(0, PAGE_SIZE));
    expect(filterRows(all, { page: 2 }).items).toEqual(all.slice(PAGE_SIZE, 2 * PAGE_SIZE));
  });
});

describe("contact context in the browser", () => {
  // What the static contact page hands the form: labels for every known id.
  const options = Object.fromEntries(contextKeys.map((k) => [k, Object.fromEntries(knownIds(k).map((id) => [id, true]))]));
  const known = (key: (typeof contextKeys)[number], value: string) => Object.hasOwn(options[key], value);

  it("parses like the server does", () => {
    for (const query of ["intent=demo&solution=content-production", "intent=seminar", "intent=kocmax", "intent=nope&product=nope", ""]) {
      expect(parseContextWith(new URLSearchParams(query), known), query).toEqual(parseContext(new URLSearchParams(query)));
    }
  });

  it("ignores object-prototype keys (found on the way: ?intent=constructor used to yield a function)", () => {
    const query = "intent=constructor&product=__proto__&case=toString";
    expect(parseContextWith(new URLSearchParams(query), known)).toEqual({ intent: "general" });
    expect(parseContext(new URLSearchParams(query))).toEqual({ intent: "general" });
  });
});

describe("knowledge-hub pages", () => {
  it("every locale's list fills its pages, page n holding at most the page size", () => {
    for (const locale of locales) {
      const n = knowledgePageCount(locale);
      expect(n).toBe(Math.max(1, Math.ceil(knowledgeArticles(locale).length / KNOWLEDGE_PAGE_SIZE)));
      expect(knowledgeArticles(locale).length).toBeGreaterThan((n - 1) * KNOWLEDGE_PAGE_SIZE);
    }
  });
});
