import { expect, test, type APIRequestContext } from "@playwright/test";

/** Award pass 2, Phase 8.1: SEO surfaces that need a running server. */

const head = (request: APIRequestContext, path: string) => request.get(path, { maxRedirects: 0 });

/** Every application/ld+json block on a page, parsed. */
async function jsonLd(request: APIRequestContext, path: string) {
  const html = await (await request.get(path)).text();
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}
const ofType = (nodes: Record<string, unknown>[], type: string) => nodes.flatMap((n) => (n["@graph"] as Record<string, unknown>[] | undefined) ?? [n]).filter((n) => n["@type"] === type);

test.describe("8.1.1 Chinese articles", () => {
  test("an article written in Chinese moves from /en to /zh-hant with a 308, in one hop from the old prefix-less URL", async ({ request }) => {
    const res = await head(request, "/en/knowledge-hub/creative-video-questions");
    expect(res.status()).toBe(308);
    expect(new URL(res.headers().location, "http://x").pathname).toBe("/zh-hant/knowledge-hub/creative-video-questions");
    const old = await head(request, "/knowledge-hub/creative-video-questions");
    expect([301, 308]).toContain(old.status());
    expect(new URL(old.headers().location, "http://x").pathname).toBe("/zh-hant/knowledge-hub/creative-video-questions");
  });

  test("its zh-hant page is a real page: Chinese lang, its own canonical, no 'shown in English' note", async ({ page }) => {
    // One of the 33 Chinese articles that had no zh-hant record before.
    await page.goto("/zh-hant/knowledge-hub/influencer-marketing-challenges-in-finding-kols-blog");
    await expect(page.locator("article").first()).toHaveAttribute("lang", "zh-Hant-HK");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/zh-hant\/knowledge-hub\/influencer-marketing-challenges-in-finding-kols-blog$/);
    await expect(page.locator("main")).not.toContainText("以原文（英文）顯示");
    expect(await page.locator('link[rel="alternate"][hreflang="en"]').count()).toBe(0);
  });
});

test("English listings link no Chinese article", async ({ request }) => {
  for (const path of ["/en/knowledge-hub/category/Content%20Marketing", "/en/knowledge-hub"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toContain("/en/knowledge-hub/creative-video-questions");
  }
});

test.describe("8.1.3 structured data", () => {
  test("the site graph has a WebSite node and an Organization with an @id", async ({ request }) => {
    const nodes = await jsonLd(request, "/en");
    expect(ofType(nodes, "WebSite")).toHaveLength(1);
    expect(ofType(nodes, "Organization")[0]["@id"]).toMatch(/#organization$/);
  });

  test("pages with breadcrumbs carry a BreadcrumbList that matches them", async ({ request }) => {
    for (const path of ["/en/services/digitalmarketing", "/en/case-studies/omni-channel-retail-intelligence", "/en/platform/governance", "/zh-hant/industries/retail-ecommerce"]) {
      const lists = ofType(await jsonLd(request, path), "BreadcrumbList");
      expect(lists, path).toHaveLength(1);
      expect((lists[0].itemListElement as unknown[]).length, path).toBeGreaterThanOrEqual(2);
    }
  });

  test("articles: image, ISO dates in Hong Kong time, canonical mainEntityOfPage", async ({ request }) => {
    const [article] = ofType(await jsonLd(request, "/en/knowledge-hub/4-types-of-crm-system"), "Article");
    expect(article.image).toBeTruthy();
    expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
    expect(article.mainEntityOfPage).toMatch(/\/en\/knowledge-hub\/4-types-of-crm-system$/);
  });

  test("events: status, end date, and a virtual location for webinars", async ({ request }) => {
    const [event] = ofType(await jsonLd(request, "/en/events/ai-agent-strategy-seminar"), "Event");
    expect(event.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(event.endDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
    const html = await (await request.get("/en/events")).text();
    const webinar = html.match(/href="\/en\/events\/([^"]+)"[^>]*>[\s\S]{0,400}?Webinar/);
    if (webinar) {
      const [w] = ofType(await jsonLd(request, `/en/events/${webinar[1]}`), "Event");
      expect((w.location as Record<string, unknown>)["@type"]).toBe("VirtualLocation");
    }
  });

  test("the explainer has a server-rendered <video> for its VideoObject", async ({ request }) => {
    const html = await (await request.get("/en/resources/videos")).text();
    expect(ofType(await jsonLd(request, "/en/resources/videos"), "VideoObject")).toHaveLength(1);
    expect(html).toMatch(/<video[^>]*preload="none"[^>]*poster=|<video[^>]*poster=[^>]*preload="none"/);
  });
});

test.describe("8.1.4–5 routes", () => {
  test("old links reach their page in one hop", async ({ request }) => {
    for (const [from, to] of [
      ["/zh-hk/workforce/growth", "/zh-hant/functions/growth"],
      ["/knowledge-hub", "/en/knowledge-hub"],
      ["/events", "/en/events"],
      ["/knowledge-hub/category/Content%20Marketing", "/en/knowledge-hub/category/Content%20Marketing"],
    ] as const) {
      const res = await head(request, from);
      expect([301, 308], from).toContain(res.status());
      expect(new URL(res.headers().location, "http://x").pathname, from).toBe(to);
      expect((await head(request, to)).status(), to).toBe(200);
    }
  });

  test("the two retired case studies are gone (410)", async ({ request }) => {
    for (const slug of ["regional-beauty-loyalty-orchestration", "asia-operating-footprint"]) {
      expect((await head(request, `/en/case-studies/${slug}`)).status(), slug).toBe(410);
    }
  });

  test("an unknown knowledge-hub category is a 404; a known one has a localised title", async ({ request, page }) => {
    expect((await request.get("/en/knowledge-hub/category/not-a-category")).status()).toBe(404);
    await page.goto("/zh-hant/knowledge-hub/category/Content%20Marketing");
    await expect(page).toHaveTitle(/知識庫/);
  });
});

test.describe("8.1.6 events in Chinese", () => {
  test("the Chinese events hub does not list the English-only events", async ({ page }) => {
    await page.goto("/zh-hant/events");
    expect(await page.locator('main a[href^="/zh-hant/events/"]').count()).toBe(0);
  });
});

test.describe("8.1.2 titles and descriptions", () => {
  test("English titles fit in 65 characters and are unique; descriptions are 70–160", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/en(?:\/[^<]*)?)<\/loc>/g)].map((m) => m[1]).filter((p) => !p.includes("/knowledge-hub/") || /\/knowledge-hub\/[^/]+$/.test(p));
    const sample = paths.filter((p, i) => !p.startsWith("/en/knowledge-hub/") || i % 10 === 0);
    const titles = new Map<string, string>();
    const problems: string[] = [];
    for (const path of sample) {
      const html = await (await request.get(path)).text();
      const title = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
      const description = (html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
      if (title.length > 65) problems.push(`${path}: title ${title.length} "${title}"`);
      if (titles.has(title)) problems.push(`${path}: title duplicates ${titles.get(title)}`);
      titles.set(title, path);
      if (description.length < 70 || description.length > 160) problems.push(`${path}: description ${description.length}`);
    }
    expect(problems).toEqual([]);
  });
});
