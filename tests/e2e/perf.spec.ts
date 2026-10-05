import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { expect, test, type Page } from "@playwright/test";

/** Award pass 2, Phase 8.2: performance (fix plan 19). */

const gz = (buf: Buffer) => zlib.gzipSync(buf, { level: 9 }).length;

/** Wait until `count()` has not changed for `quiet` × 250 ms. */
async function settled(page: Page, count: () => number, quiet = 4) {
  let last = -1;
  for (let still = 0, i = 0; still < quiet && i < 80; i++) {
    await page.waitForTimeout(250);
    still = count() === last ? still + 1 : 0;
    last = count();
  }
}

/**
 * Scroll the whole document a viewport at a time (bands resize as they render), letting the
 * requests each step starts finish first: Next drops a queued prefetch whose link has left the
 * viewport, so a fast scroll on a busy machine would under-count.
 */
async function scrollThrough(page: Page, count: () => number) {
  for (let i = 0; i < 80; i++) {
    await settled(page, count, 3);
    const { y, h, vh } = await page.evaluate(() => ({ y: window.scrollY, h: document.documentElement.scrollHeight, vh: window.innerHeight }));
    if (y + vh >= h - 2) break;
    await page.evaluate((dy) => window.scrollBy({ top: dy, behavior: "instant" }), Math.round(vh * 0.9));
  }
  await settled(page, count, 8);
}

test.describe("8.2.1 static hubs", () => {
  for (const hub of ["services", "resources", "case-studies", "knowledge-hub", "contact"]) {
    test(`/en/${hub} is prerendered and served from the cache`, async ({ request }) => {
      const res = await request.get(`/en/${hub}`);
      expect(res.status()).toBe(200);
      expect(res.headers()["cache-control"]).toMatch(/s-maxage/);
      expect(res.headers()["x-nextjs-cache"]).toBe("HIT");
      expect(fs.existsSync(path.join(".next", "server", "app", "en", `${hub}.html`)), `${hub}.html`).toBe(true);
    });
  }

  test("knowledge-hub pages are static paths with self-canonicals; old ?page= links move there in one hop", async ({ page, request }) => {
    const res = await request.get("/en/knowledge-hub/page/2");
    expect(res.status()).toBe(200);
    expect(res.headers()["x-nextjs-cache"]).toBe("HIT");
    expect(fs.existsSync(path.join(".next", "server", "app", "en", "knowledge-hub", "page", "2.html"))).toBe(true);
    const old = await request.get("/en/knowledge-hub?page=2", { maxRedirects: 0 });
    expect(old.status()).toBe(308);
    expect(new URL(old.headers()["location"], "http://x").pathname).toBe("/en/knowledge-hub/page/2");
    const first = await request.get("/en/knowledge-hub/page/1", { maxRedirects: 0 });
    expect(first.status()).toBe(308);
    expect(new URL(first.headers()["location"], "http://x").pathname).toBe("/en/knowledge-hub");
    expect((await request.get("/en/knowledge-hub/page/999")).status()).toBe(404);

    await page.goto("/en/knowledge-hub/page/2");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/knowledge-hub\/page\/2$/);
    await expect(page.locator(".pagination a[rel=prev]")).toHaveAttribute("href", "/en/knowledge-hub");
    await expect(page.locator(".pagination a[rel=next]")).toHaveAttribute("href", "/en/knowledge-hub/page/3");
  });

  test("resource filters, search and paging run in the browser and keep the URL in step", async ({ page }) => {
    await page.goto("/en/resources?format=guide");
    const cards = page.locator(".related-grid .card");
    await expect(cards.first()).toBeVisible();
    await expect(page.locator('.filter-pill[aria-current="true"]').first()).toContainText("Guides");
    for (const chip of await cards.locator(".card-meta .chip").allInnerTexts()) expect(chip).toBe("Guide");

    await page.locator(".filter-group").first().locator(".filter-pill").first().click();
    await expect(page).toHaveURL(/\/en\/resources$/);
    await page.locator("#resource-q").fill("CRM");
    await page.locator("#resource-q").press("Enter");
    await expect(page).toHaveURL(/[?&]q=CRM/);
    expect(await cards.count()).toBeGreaterThan(0);
    for (const text of await cards.allInnerTexts()) expect(text.toLowerCase()).toContain("crm");
    await page.locator("#resource-q").fill("");
    await page.locator("#resource-q").press("Enter");
    await expect(page).toHaveURL(/\/en\/resources$/);
    await page.locator(".pagination a[rel=next]").click();
    await expect(page).toHaveURL(/[?&]page=2/);
    await expect(page.locator(".result-meta")).toContainText("Page 2 /");
  });

  test("case-study filters run in the browser", async ({ page }) => {
    await page.goto("/en/case-studies?kind=internal-application");
    const visible = page.locator(".related-grid .card:visible");
    await expect(visible).toHaveCount(1);
    await page.locator(".filter-pill", { hasText: "Client work" }).click();
    await expect(page).toHaveURL(/kind=client-work/);
    expect(await visible.count()).toBeGreaterThan(1);
  });

  test("contact reads ?intent and the page context in the browser", async ({ page }) => {
    await page.goto("/en/contact?intent=demo&solution=content-production");
    await expect(page.locator("#f-intent")).toHaveValue("demo");
    await expect(page.locator(".context-box")).toContainText(/Content/);
  });
});

test("8.2.2 a full scroll of /en prefetches at most 120 KB of RSC (gzip)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Record each RSC request and replay it afterwards with the same headers: reading bodies back from
  // the browser is unreliable (Chrome may already have discarded them), a replay is not.
  const sent: { url: string; headers: Record<string, string> }[] = [];
  page.on("request", (req) => {
    if (req.headers()["rsc"] || req.url().includes("_rsc=")) sent.push({ url: req.url(), headers: req.headers() });
  });
  await page.goto("/en", { waitUntil: "load" });
  await scrollThrough(page, () => sent.length);
  let bytes = 0;
  for (const { url, headers } of sent) bytes += gz(await (await page.request.get(url, { headers })).body());
  expect(Math.round(bytes / 1024)).toBeLessThanOrEqual(120);
});

test("8.2.2 the header logo does not prefetch the page it is on; nav links prefetch on intent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const prefetched: string[] = [];
  page.on("request", (req) => {
    if (req.headers()["next-router-prefetch"]) prefetched.push(new URL(req.url()).pathname);
  });
  await page.goto("/en", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  expect(prefetched.filter((p) => p === "/en")).toEqual([]);
  expect(prefetched.filter((p) => p === "/en/about")).toEqual([]);
  await page.locator(".utility-about").hover();
  await expect.poll(() => prefetched.includes("/en/about")).toBe(true);
});

test("8.2.3 /en/services loads at most 50 KB of CSS; the home route still gets the cinematic sheet", async ({ request }) => {
  const sheets = async (route: string) => {
    const html = await (await request.get(route)).text();
    const hrefs = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
    let raw = 0;
    let text = "";
    for (const href of hrefs) {
      const body = await (await request.get(href)).body();
      raw += body.length;
      text += body.toString("utf8");
    }
    return { raw, text };
  };
  // The cinematic sheet's own hero rule (a shared keep-all rule names .cine-hero__body, so match the block).
  const cinematic = /\.cine-hero\{/;
  const services = await sheets("/en/services");
  expect(Math.round(services.raw / 1024)).toBeLessThanOrEqual(50);
  expect(services.text).not.toMatch(cinematic);
  expect((await sheets("/en")).text).toMatch(cinematic);
});

test("8.2.4 fonts are self-hosted; the serif is preloaded on the home route only", async ({ page, request }) => {
  const external: string[] = [];
  page.on("request", (req) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) external.push(req.url());
  });
  // The route's own preloads, from its HTML (a prefetched page's font hints can join the live DOM later).
  const preloads = async (route: string) => [...(await (await request.get(route)).text()).matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map((m) => m[1]);
  const inner = await preloads("/en/services");
  const home = await preloads("/en");
  expect(inner).toHaveLength(1);
  expect(inner[0]).toMatch(/manrope/);
  expect(home).toHaveLength(2);
  const serif = home.find((h) => /instrument-serif/.test(h));
  expect(serif).toBeTruthy();
  // The preloaded file is the one the page uses: each face downloads once.
  const fonts: string[] = [];
  page.on("request", (req) => {
    if (req.resourceType() === "font") fonts.push(new URL(req.url()).pathname);
  });
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
  expect(fonts.filter((f) => /instrument-serif/.test(f))).toEqual([serif]);
  expect(fonts.filter((f) => /manrope/.test(f))).toHaveLength(1);
  expect(fs.readFileSync("app/fonts.ts", "utf8")).not.toContain("next/font/google");
  expect((await request.get(serif!)).headers()["cache-control"]).toContain("immutable");
});

test("8.2.5 the header logo is at most 248 px wide", async ({ page }) => {
  await page.goto("/en");
  const logo = page.locator(".site-header .brand img");
  await expect(logo).toBeVisible();
  const width = await logo.evaluate((img) => (img as HTMLImageElement).naturalWidth);
  expect(width).toBeGreaterThan(0);
  expect(width).toBeLessThanOrEqual(248);
});

test("8.2.6 Chinese pages name CJK families first", async ({ page }) => {
  for (const [route, first] of [["/zh-hant", "PingFang HK"], ["/zh-hans", "PingFang SC"]] as const) {
    await page.goto(route);
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family.split(",")[0].replace(/["']/g, "").trim(), route).toBe(first);
  }
  await page.goto("/en");
  expect((await page.evaluate(() => getComputedStyle(document.body).fontFamily)).split(",")[0]).not.toMatch(/PingFang/);
});

test.describe("8.2.7 smaller items", () => {
  /** Every style rule on the page, flattened out of media and supports blocks. */
  const rules = (page: Page) =>
    page.evaluate(() => {
      const out: { selector: string; text: string }[] = [];
      const walk = (list: CSSRuleList) => {
        for (const rule of Array.from(list)) {
          if (rule instanceof CSSStyleRule) out.push({ selector: rule.selectorText, text: rule.style.cssText });
          else if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
        }
      };
      for (const sheet of Array.from(document.styleSheets)) walk(sheet.cssRules);
      return out;
    });

  test("no transition animates box-shadow", async ({ page }) => {
    for (const route of ["/en", "/en/services"]) {
      await page.goto(route);
      const offenders = (await rules(page)).filter((r) => /transition[^;]*box-shadow/.test(r.text)).map((r) => r.selector);
      expect(offenders, route).toEqual([]);
    }
  });

  test("the signature progress bar scales instead of animating width", async ({ page }) => {
    await page.goto("/en");
    const keyframes = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) for (const rule of Array.from(sheet.cssRules)) if (rule instanceof CSSKeyframesRule && rule.name === "sig-progress") return rule.cssText;
      return "";
    });
    expect(keyframes).toContain("scaleX");
    expect(keyframes).not.toMatch(/width/);
  });

  test("with reduced motion nothing animates or transitions", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    for (const route of ["/en", "/en/services"]) {
      await page.goto(route);
      const moving = await page.evaluate(() => {
        const ms = (v: string) => Math.max(...v.split(",").map((d) => parseFloat(d) * (d.trim().endsWith("ms") ? 1 : 1000)));
        return Array.from(document.querySelectorAll("*"))
          .filter((el) => {
            const s = getComputedStyle(el);
            return (s.animationName !== "none" && ms(s.animationDuration) > 10) || ms(s.transitionDuration) > 10;
          })
          .map((el) => el.className.toString().slice(0, 60) || el.tagName);
      });
      expect(moving, route).toEqual([]);
    }
    await context.close();
  });

  test("the header is a solid fill, not a backdrop blur", async ({ page }) => {
    await page.goto("/en/services");
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    const header = page.locator(".site-header");
    for (const pseudo of [null, "::before", "::after"]) expect(await header.evaluate((el, p) => getComputedStyle(el, p).backdropFilter, pseudo), String(pseudo)).toBe("none");
  });

  test("print hides the site chrome", async ({ page }) => {
    await page.goto("/en/services");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".site-footer")).toBeHidden();
    await expect(page.locator("main h1")).toBeVisible();
  });
});
