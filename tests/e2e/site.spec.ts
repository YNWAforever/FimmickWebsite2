import { expect, test, type Page } from "@playwright/test";

const keyPages = [
  "/en", "/zh-hant", "/en/solutions", "/en/solutions/content-production", "/en/products/creativemax", "/en/platform",
  "/en/ai-transformation", "/en/ai-transformation/workflow-agent-design", "/en/services", "/en/services/crm-sales",
  "/en/industries", "/en/industries/property-real-estate", "/en/case-studies", "/en/case-studies/real-estate-sales-follow-up",
  "/en/resources", "/en/knowledge-hub", "/en/knowledge-hub/ai-workforce-vs-ai-tools", "/en/events", "/en/workshop",
  "/en/fimmick-ecosystem", "/en/fimmick-ecosystem/kinnso", "/en/about", "/en/about/team", "/en/how-to-start", "/en/contact",
  "/zh-hant/services/seo-aeo", "/zh-hant/fimmick-ecosystem/eldage", "/zh-hans/knowledge-hub/ai-workforce-vs-ai-tools", "/en/privacy",
];

test.describe("routes, redirects and indexing", () => {
  test("key pages render with the right language and canonical", async ({ request }) => {
    for (const path of keyPages) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      const html = await res.text();
      const lang = path.startsWith("/zh-hant") ? "zh-Hant-HK" : path.startsWith("/zh-hans") ? "zh-Hans" : "en";
      expect(html, path).toContain(`<html lang="${lang}"`);
      expect(html, path).toMatch(/<link rel="canonical" href="https:\/\/www\.fimmick\.com\//);
      expect(res.headers()["x-robots-tag"], path).toBe("noindex, nofollow");
    }
  });

  test("legacy URLs redirect to meaningful destinations without chains", async ({ request }) => {
    const cases: [string, string, number][] = [
      ["/", "/en", 307],
      ["/en/platform/agents", "/en/platform", 308],
      ["/en/platform/pricing", "/en/how-to-start", 308],
      ["/en/workforce/cx", "/en/solutions/customer-engagement", 308],
      ["/zh-hant/services/ai-transformation", "/zh-hant/ai-transformation", 308],
      ["/en/services/digital-experience", "/en/solutions/website-operations", 308],
      ["/en/ai-workshop", "/en/workshop", 308],
      ["/zh-hk/contact", "/zh-hant/contact", 308],
      ["/zh-hans/services", "/zh-hant/services", 307],
      ["/events/ai-agent-strategy-seminar", "/en/events/ai-agent-strategy-seminar", 308],
    ];
    for (const [from, to, status] of cases) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(status);
      expect(new URL(res.headers().location, "http://x").pathname, from).toBe(to);
      const final = await request.get(to, { maxRedirects: 0 });
      expect(final.status(), `${to} should not redirect again`).toBe(200);
    }
  });

  test("unknown URLs are genuine 404s", async ({ request }) => {
    for (const path of ["/en/does-not-exist", "/en/services/not-a-service", "/fr", "/en/launch-plan"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test("review build blocks crawlers; sitemap lists canonical pages", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://www.fimmick.com/en/services/crm-sales");
    expect(sitemap).toContain("https://www.fimmick.com/zh-hant/fimmick-ecosystem/kinnso");
    expect(sitemap).not.toContain("/services/ai-transformation<");
  });
});

async function noOverflow(page: Page, path: string) {
  await page.goto(path);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
}

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/en", "/zh-hant", "/en/platform", "/en/services/crm-sales", "/en/industries/property-real-estate", "/en/resources", "/en/contact", "/en/ai-transformation/ai-readiness-maturity"]) {
      await noOverflow(page, path);
    }
  });
}

test.describe("navigation", () => {
  test("desktop menu opens by keyboard, Escape closes and returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    const trigger = page.getByRole("button", { name: "Services", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "CRM & Sales Automation" }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("all eight pillars are reachable in the mobile drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const drawer = page.getByRole("dialog");
    for (const label of ["Platform & Solutions", "AI Transformation", "Services", "Industries", "Case Studies", "Resources", "Ecosystem", "About"]) {
      await expect(drawer.locator("summary", { hasText: label })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});

test.describe("interactive examples", () => {
  test("content example: edits invalidate review, export needs review, reset restores", async ({ page }) => {
    await page.goto("/en/products/creativemax");
    const bench = page.locator(".workbench");
    const status = bench.locator(".status").first();
    const exportBtn = bench.getByRole("button", { name: "Export sample file" });
    await expect(exportBtn).toBeDisabled();
    await bench.getByRole("button", { name: "Mark sample reviewed" }).click();
    await expect(status).toHaveText(/Reviewed/);
    const downloadPromise = page.waitForEvent("download");
    await exportBtn.click();
    const file = await downloadPromise;
    expect(file.suggestedFilename()).toBe("fimmick-sample-launch-instagram.txt");
    const stream = await file.createReadStream();
    const chunks: Buffer[] = [];
    for await (const c of stream) chunks.push(c as Buffer);
    expect(Buffer.concat(chunks).toString()).toContain("ILLUSTRATIVE SAMPLE");
    const draft = bench.locator("textarea");
    await draft.fill("Now only HK$199!");
    await expect(status).toHaveText(/Changed since review/);
    await expect(exportBtn).toBeDisabled();
    await expect(bench.getByText("Mentions a price")).toBeVisible();
    await bench.getByRole("combobox").first().selectOption("invitation");
    await expect(status).toHaveText(/not reviewed/);
    await expect(draft).toHaveValue(/Causeway Bay/);
    await bench.getByRole("button", { name: "Reset example" }).click();
    await expect(draft).toHaveValue(/Meet the 750 ml bottle/);
  });

  test("follow-up example keeps human-only enquiries away from drafts", async ({ page }) => {
    await page.goto("/en/products/customer-ops");
    const bench = page.locator(".workbench");
    await bench.getByLabel("ENQ-2043").check();
    await expect(bench.getByText("Human-only category", { exact: true })).toBeVisible();
    await expect(bench.getByText("No draft — this category goes straight to a person.")).toBeVisible();
  });

  test("website example holds records with missing required fields", async ({ page }) => {
    await page.goto("/en/products/website-cms");
    const bench = page.locator(".workbench");
    await bench.getByLabel("New 1 L variant (incomplete)").check();
    await expect(bench.getByRole("button", { name: "Approve change" })).toBeDisabled();
    await expect(bench.getByText("Held until the missing field is supplied")).toBeVisible();
  });
});

test.describe("enquiry journey", () => {
  test("context is preserved, validation works, and no false success without a backend", async ({ page }) => {
    await page.goto("/en/contact?intent=configuration&product=creativemax&industry=bogus");
    await expect(page.getByText("Product: CreativeMax")).toBeVisible();
    await expect(page.getByText(/bogus/)).toHaveCount(0);
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Please fill this in.").first()).toBeVisible();
    await page.getByLabel(/^Name/).fill("Test Person");
    await page.getByLabel(/^Company/).fill("Example Ltd");
    await page.getByLabel(/^Work email/).fill("test@example.com");
    await page.getByLabel(/What work do you want to improve/).fill("Launch content approvals");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText(/Online submission isn't available right now/)).toBeVisible();
    await expect(page.getByText(/request has been sent/)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Open email app/ })).toHaveAttribute("href", /^mailto:business@fimmick\.com/);
    expect(page.url()).not.toContain("example.com");
    expect(page.url()).not.toContain("Test");
  });

  test("API rejects invalid input and never reports acceptance without a delivery backend", async ({ request }) => {
    const bad = await request.post("/api/enquiries", { data: { idempotencyKey: "test-key-0001", name: "", email: "nope" } });
    expect(bad.status()).toBe(422);
    const ok = await request.post("/api/enquiries", { data: { idempotencyKey: "test-key-0002", name: "A", email: "a@example.com", company: "B", work: "C", context: { intent: "demo" } } });
    expect(ok.status()).toBe(503);
    expect((await ok.json()).status).toBe("unavailable");
  });
});

test.describe("locale continuity and media", () => {
  test("language switch keeps the equivalent page and safe context only", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/contact?intent=service&service=seo-aeo");
    await page.locator(".utility-bar .lang-switch a").first().click();
    await expect(page).toHaveURL(/\/zh-hant\/contact\?intent=service&service=seo-aeo/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant-HK");
    await expect(page.getByText("服務: SEO、GEO 與 AEO")).toBeVisible();
  });

  test("no video bytes before intent; captions attached after play", async ({ page }) => {
    const videoRequests: string[] = [];
    page.on("request", (r) => {
      if (/\.(mp4|webm)$/.test(r.url())) videoRequests.push(r.url());
    });
    await page.goto("/en/resources/videos");
    await page.waitForLoadState("networkidle");
    expect(videoRequests).toHaveLength(0);
    await page.getByRole("button", { name: /Play video/ }).click();
    const video = page.locator("video");
    await expect(video).toBeVisible();
    await expect(video.locator("track[srclang='en']")).toHaveAttribute("default", "");
  });

  test("key pages produce no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`${page.url()} ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`${page.url()} ${e.message}`));
    for (const path of ["/en", "/zh-hant", "/en/platform", "/en/solutions/content-production", "/en/fimmick-ecosystem", "/en/contact", "/en/case-studies?industry=property-real-estate"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(errors).toEqual([]);
  });

  test("reduced motion keeps all content visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const hidden = await page.evaluate(() => [...document.querySelectorAll(".reveal")].filter((el) => getComputedStyle(el).opacity !== "1").length);
    expect(hidden).toBe(0);
  });
});
