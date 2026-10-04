import { expect, test, type Page } from "@playwright/test";

/**
 * Award pass 2, Phase 1: craft breaks a juror hits without looking for them.
 * Each test measures the behaviour (status, rect, computed style) rather than a class name.
 */

/** Instant scroll: the page sets `scroll-behavior: smooth`, which would still be moving when we measure. */
const jump = (page: Page, top: number) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
const frames = (page: Page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

/** WCAG relative-luminance contrast between two computed `rgb()` colours. */
function contrast(a: string, b: string) {
  const lum = (c: string) => {
    const [r, g, bl] = (c.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
      const s = Number(v) / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test.describe("1.1 locale 404", () => {
  const cases: [string, string, RegExp][] = [
    ["/zh-hant/platform/nope", "zh-Hant-HK", /找不到此頁面/],
    ["/zh-hant/knowledge-hub/nope", "zh-Hant-HK", /找不到此頁面/],
    ["/zh-hans/nope", "zh-Hans", /找不到此页面/],
    ["/en/nope", "en", /couldn.t find that page/],
    ["/en/services/not-a-service", "en", /couldn.t find that page/],
  ];
  for (const [path, lang, heading] of cases) {
    test(`${path} renders the localised 404 inside the site shell`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator(".site-header")).toHaveCount(1);
      await expect(page.locator(".site-footer")).toHaveCount(1);
      await expect(page.locator(".lang-switch").first()).toBeAttached();
      await expect(page.locator("h1")).toHaveText(heading);
      const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
      expect(robots).toContain("noindex");
    });
  }

  test("the 404 title is localised", async ({ page }) => {
    await page.goto("/zh-hant/platform/nope");
    await expect(page).toHaveTitle(/找不到此頁面/);
    await page.goto("/en/nope");
    await expect(page).toHaveTitle(/Page not found/);
  });

  test("a URL outside every locale still gets the global 404", async ({ request }) => {
    const res = await request.get("/totally-unknown");
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toContain('<html lang="en"');
    expect(html).toContain("找不到此頁面");
  });
});

test.describe("1.2 navigation from 1024 px; drawer as a sheet", () => {
  test("primary navigation shows from 1024 px and fits on one line with the CTA", async ({ page }) => {
    for (const [width, locale] of [[1024, "/en"], [1024, "/zh-hant"], [1200, "/en"], [1279, "/zh-hans"]] as const) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(locale);
      const layout = await page.evaluate(() => {
        const nav = document.querySelector(".primary-nav")!;
        const triggers = [...document.querySelectorAll<HTMLElement>(".pillar-trigger")].filter((b) => b.getClientRects().length > 0);
        const cta = document.querySelector(".header-cta")!.getBoundingClientRect();
        const last = triggers[triggers.length - 1].getBoundingClientRect();
        return {
          nav: getComputedStyle(nav).display,
          toggle: getComputedStyle(document.querySelector(".header-actions .menu-toggle")!).display,
          count: triggers.length,
          rows: new Set(triggers.map((b) => Math.round(b.getBoundingClientRect().top))).size,
          gapToCta: cta.left - last.right,
          ctaVisible: cta.width > 0,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(layout.nav, `${width} ${locale}`).not.toBe("none");
      expect(layout.toggle, `${width} ${locale}`).toBe("none");
      expect(layout.count, `${width} ${locale}`).toBe(7);
      expect(layout.rows, `${width} ${locale}`).toBe(1);
      expect(layout.gapToCta, `${width} ${locale}`).toBeGreaterThanOrEqual(8);
      expect(layout.ctaVisible).toBe(true);
      expect(layout.overflow).toBeLessThanOrEqual(0);
    }
  });

  test("below 1024 px the menu button shows", async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 800 });
    await page.goto("/en");
    await expect(page.locator(".header-actions .menu-toggle")).toBeVisible();
    await expect(page.locator(".primary-nav")).toBeHidden();
  });

  test("on tablets the drawer is a right-hand sheet over a scrim that closes it", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto("/en");
    await page.locator(".header-actions .menu-toggle").click();
    const drawer = page.locator(".drawer");
    await expect(drawer).toBeVisible();
    await page.waitForTimeout(500);
    const rect = await drawer.boundingBox();
    expect(rect!.width).toBeLessThanOrEqual(420);
    expect(rect!.x).toBeGreaterThanOrEqual(400);
    expect(rect!.height).toBe(1180);
    await page.mouse.click(100, 600);
    await expect(drawer).toBeHidden();
    await expect(page.locator("body")).toHaveAttribute("data-menu-open", "false");
  });

  test("on phones the drawer stays full-screen", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    await page.locator(".header-actions .menu-toggle").click();
    await page.waitForTimeout(500);
    const rect = await page.locator(".drawer").boundingBox();
    expect(rect).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  });
});

test.describe("1.3 lazily rendered bands keep a stable document height", () => {
  async function drift(page: Page, path: string) {
    await page.goto(path, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const load = await page.evaluate(() => document.documentElement.scrollHeight);
    let max = 0;
    for (let i = 0; i < 80; i++) {
      const { h, done } = await page.evaluate(() => {
        window.scrollBy({ top: Math.round(window.innerHeight * 0.9), behavior: "instant" });
        return { h: document.documentElement.scrollHeight, done: window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 };
      });
      await frames(page);
      await page.waitForTimeout(80);
      max = Math.max(max, Math.abs(h - load), Math.abs((await page.evaluate(() => document.documentElement.scrollHeight)) - load));
      if (done) break;
    }
    return max;
  }
  for (const [path, width, height, budget] of [
    ["/en", 390, 844, 400], ["/zh-hant", 390, 844, 400], ["/en", 1440, 900, 150], ["/zh-hant", 1440, 900, 150],
    ["/en/platform", 390, 844, 0], ["/en/platform", 1440, 900, 0], ["/en/services", 390, 844, 0], ["/en/services", 1440, 900, 0],
  ] as const) {
    test(`${path} at ${width}px drifts at most ${budget}px on the first scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      expect(await drift(page, path)).toBeLessThanOrEqual(budget);
    });
  }
});

test.describe("1.4 focus and contrast", () => {
  test("the utility row comes back into view when it takes keyboard focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    await jump(page, 1500);
    await page.waitForTimeout(300);
    await jump(page, 1200);
    await page.waitForTimeout(700);
    await expect(page.locator("html")).toHaveAttribute("data-scroll", "up");
    await page.locator(".header-main .brand").focus();
    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(700);
    const top = await page.evaluate(() => document.activeElement!.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
  });

  test("keyboard focus stays visible in forced-colours mode", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/contact");
    const button = page.getByRole("button", { name: "Send request" });
    await button.scrollIntoViewIfNeeded();
    const box = (await button.boundingBox())!;
    const clip = { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 };
    const idle = await page.screenshot({ clip });
    await button.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    const focused = await page.screenshot({ clip });
    expect(Buffer.compare(idle, focused)).not.toBe(0);
  });

  test("hovering an output tile keeps its keyboard focus ring", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    const link = page.locator(".output-tile__meta h3 a").first();
    await link.focus();
    const tile = page.locator(".output-tile").first();
    await tile.hover();
    await page.waitForTimeout(700);
    const shadow = await tile.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/0px 0px 0px 5px/);
  });

  test("form-field borders and the industry-matrix dash reach 3:1", async ({ page }) => {
    await page.goto("/en/contact");
    const field = await page.locator(".form input[type='text']").first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { border: s.borderTopColor, bg: getComputedStyle(el.closest("section") ?? document.body).backgroundColor };
    });
    expect(contrast(field.border, field.bg === "rgba(0, 0, 0, 0)" ? "rgb(255, 255, 255)" : field.bg)).toBeGreaterThanOrEqual(3);
    await page.goto("/en/industries");
    const dash = page.locator(".matrix td.off").first();
    if (await dash.count()) {
      const color = await dash.evaluate((el) => getComputedStyle(el).color);
      expect(contrast(color, "rgb(255, 255, 255)")).toBeGreaterThanOrEqual(3);
    }
  });
});

test.describe("1.4 touch targets", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("footer legal links and the small ghost button are 44 px tall on touch", async ({ page }) => {
    await page.goto("/en/platform");
    const cookies = await page.locator(".footer-bottom a[href$='/cookies']").boundingBox();
    expect(cookies!.height).toBeGreaterThanOrEqual(44);
    await page.goto("/zh-hant");
    const ghost = await page.locator(".btn--ghost.btn--small").first().boundingBox();
    expect(ghost!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("1.5 drawer and route-change coordination", () => {
  test("the drawer opens at full height after the header has moved", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    await jump(page, 2000);
    await page.waitForTimeout(400);
    await jump(page, 1700);
    await page.waitForTimeout(800);
    const heights = await page.evaluate(async () => {
      (document.querySelector(".header-actions .menu-toggle") as HTMLElement).click();
      const t0 = performance.now();
      const out: number[] = [];
      for (const ms of [60, 200, 450]) {
        await new Promise((r) => setTimeout(r, ms - (performance.now() - t0)));
        out.push(Math.round(document.querySelector(".drawer")!.getBoundingClientRect().height));
      }
      return out;
    });
    expect(heights).toEqual([844, 844, 844]);
  });

  test("resizing past the breakpoint closes the drawer and unlocks the page", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/en");
    await page.locator(".header-actions .menu-toggle").click();
    await expect(page.locator(".drawer")).toBeVisible();
    await page.setViewportSize({ width: 1300, height: 800 });
    await expect(page.locator("body")).toHaveAttribute("data-menu-open", "false");
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
    await expect(page.locator(".drawer")).toBeHidden();
  });

  test("the in-drawer close button is never hidden by the desktop rule", async ({ page }) => {
    await page.setViewportSize({ width: 1300, height: 800 });
    await page.goto("/en");
    expect(await page.evaluate(() => getComputedStyle(document.querySelector(".drawer .menu-toggle")!).display)).not.toBe("none");
  });

  test("after a route change the header is in place from the first frame", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    await jump(page, 2000);
    await page.waitForTimeout(600);
    await jump(page, 1900);
    await page.waitForTimeout(700);
    const first = await page.evaluate(
      () =>
        new Promise<string>((resolve) => {
          const tick = () => {
            if (location.pathname === "/en/platform") resolve(getComputedStyle(document.querySelector(".site-header")!).transform);
            else requestAnimationFrame(tick);
          };
          (document.querySelector('a[href="/en/platform"]') as HTMLElement).click();
          requestAnimationFrame(tick);
        }),
    );
    expect(first === "none" || first === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  });
});

test.describe("1.6 small visible breaks", () => {
  for (const [width, height] of [[390, 844], [320, 640]] as const) {
    test(`hero photo badge is not covered by the sample card at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/en");
      const badge = page.locator(".cine-hero .photo__label");
      await badge.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      const onTop = await badge.evaluate((el) => {
        // The badge is pointer-events: none (it never blocks the photo link); enable hit-testing
        // for the measurement so elementFromPoint reports what is painted on top.
        (el as HTMLElement).style.pointerEvents = "auto";
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!hit && (hit === el || el.contains(hit));
      });
      expect(onTop).toBe(true);
    });
  }

  for (const [path, width, height] of [["/en", 1440, 900], ["/en", 390, 844], ["/zh-hant", 1440, 900]] as const) {
    test(`the dark-chapter marquee rests on a whole, centred phrase (${path} at ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const top = await page.locator(".chapter-night").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
      // Wherever a visitor stops once the chapter has risen into view, the band holds the same phrase.
      for (const offset of [Math.round(height * 0.35), 120, 0, -300]) {
        await jump(page, top - offset);
        await frames(page);
        await page.waitForTimeout(150);
        const band = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const items = [...document.querySelectorAll(".marquee__item")].map((item) => {
            const range = document.createRange();
            range.selectNodeContents(item.firstChild!);
            const r = range.getBoundingClientRect();
            return { left: r.left, right: r.right, dot: item.querySelector(".marquee__dot")!.getBoundingClientRect().left };
          });
          const i = items.findIndex((r) => r.left >= 0 && r.right <= vw && Math.abs((r.left + r.right) / 2 - vw / 2) <= vw * 0.04);
          return { centred: i, dotBefore: i > 0 ? items[i - 1].dot : -1 };
        });
        expect(band.centred, `chapter top at ${offset}px`).toBeGreaterThanOrEqual(0);
        expect(band.dotBefore, `chapter top at ${offset}px`).toBeGreaterThanOrEqual(0);
      }
      // The hairlines run full-bleed: the element carrying them is not faded by the edge mask.
      const hairline = await page.evaluate(() => {
        const el = [...document.querySelectorAll<HTMLElement>(".chapter-night *")].find((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0 && e.querySelector(".marquee__track"))!;
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, vw: document.documentElement.clientWidth, mask: getComputedStyle(el).maskImage };
      });
      expect(hairline.left).toBeLessThanOrEqual(0);
      expect(hairline.right).toBeGreaterThanOrEqual(hairline.vw);
      expect(hairline.mask).toBe("none");
    });
  }

  test("the scroll cue drops twice, then rests", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    const count = await page.evaluate(() => getComputedStyle(document.querySelector(".scroll-cue__line")!, "::after").animationIterationCount);
    expect(count).toBe("2");
  });

  test("the explainer falls back to WebM when the MP4 source fails", async ({ page }) => {
    // Playwright's Chromium now decodes H.264, so a browser without it is simulated by failing the
    // MP4 request: the <source> error is what such a browser produces.
    await page.route(/\.mp4$/, (route) => route.abort());
    await page.goto("/en/resources/videos");
    await page.getByRole("button", { name: /Play video/ }).click();
    const video = page.locator("video");
    await expect(video).toBeAttached();
    await page.waitForTimeout(3000);
    await expect(page.locator(".player__error")).toHaveCount(0);
    const state = await video.evaluate((v: HTMLVideoElement) => ({ src: v.currentSrc, ready: v.readyState }));
    expect(state.src).toMatch(/\.webm$/);
    expect(state.ready).toBeGreaterThanOrEqual(1);
  });

  test("the poster offers a 640 w candidate", async ({ page }) => {
    await page.goto("/en/resources/videos");
    await expect(page.locator(".player__poster img")).toHaveAttribute("srcset", /640w/);
  });
});

test.describe("1.7 icons, titles, archive banner, leadership", () => {
  test("the full icon set and a manifest are served", async ({ request }) => {
    const html = await (await request.get("/en")).text();
    expect(html).toMatch(/<link rel="icon" href="\/icon\.svg[^"]*"[^>]* type="image\/svg\+xml"/);
    expect(html).toMatch(/<link rel="apple-touch-icon" href="\/apple-icon\.png/);
    expect(html).toMatch(/<link rel="manifest" href="\/manifest\.webmanifest"/);
    const apple = await request.get("/apple-icon.png");
    expect(apple.status()).toBe(200);
    expect(apple.headers()["content-type"]).toBe("image/png");
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.theme_color).toBe("#ffffff");
    const ico = await (await request.get("/favicon.ico")).body();
    const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => ico[6 + i * 16] || 256);
    expect(sizes).toEqual(expect.arrayContaining([32, 48]));
  });

  test("article titles show a decoded ampersand", async ({ page }) => {
    await page.goto("/en/knowledge-hub/4-types-of-crm-system");
    const h1 = await page.locator("h1").textContent();
    expect(h1).toContain("&");
    expect(h1).not.toContain("&amp;");
    await expect(page).not.toHaveTitle(/&amp;/);
  });

  test("the archive banner marks only pre-relaunch articles", async ({ page }) => {
    await page.goto("/en/knowledge-hub/answer-engine-optimization-complete-guide");
    await expect(page.locator(".archive-banner")).toHaveCount(0);
    await page.goto("/en/knowledge-hub/seo-visibility-tips");
    await expect(page.locator(".archive-banner")).toHaveCount(1);
  });

  test("the leadership page has no pending-approval note and shows a context photograph", async ({ page }) => {
    await page.goto("/en/about/team");
    await expect(page.getByText(/will be added once they are approved/)).toHaveCount(0);
    await expect(page.locator("main figure.photo")).toHaveCount(1);
    await page.goto("/zh-hant/about/team");
    await expect(page.getByText(/獲批准公開後會在此加入/)).toHaveCount(0);
  });
});
