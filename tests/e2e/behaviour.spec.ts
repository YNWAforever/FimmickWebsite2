import { expect, test, type Page } from "@playwright/test";

/** Award pass 2, Phase 9 (fix plan 21): behaviours the earlier phases left without a test. */

test.describe("language switch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  const traditional = (page: Page) => page.locator(".utility-bar .lang-switch a[hreflang='zh-Hant-HK']");

  test("keeps the hash, with and without a query", async ({ page }) => {
    await page.goto("/en/platform#how-it-works");
    await traditional(page).click();
    await expect(page).toHaveURL(/\/zh-hant\/platform#how-it-works$/);

    await page.goto("/en/contact?intent=service&service=seo-aeo#form");
    await traditional(page).click();
    await expect(page).toHaveURL(/\/zh-hant\/contact\?intent=service&service=seo-aeo#form$/);
  });

  test("modified clicks are left to the browser (new tab, window); a plain click navigates in place", async ({ page }) => {
    await page.goto("/en/contact?intent=service&service=seo-aeo");
    const link = traditional(page);
    // The new-tab destination is the full equivalent page.
    await expect(link).toHaveAttribute("href", "/zh-hant/contact?intent=service&service=seo-aeo");
    // Whether a headless browser actually opens a tab differs by platform, so check the contract: the
    // switch cancels only a plain primary click. A window listener (after React's document listener)
    // records the decision, then cancels the default itself so the test page stays put.
    const prevented = await link.evaluate(
      (a, variants) =>
        variants.map((init) => {
          let seen = false;
          window.addEventListener(
            "click",
            (e) => {
              seen = e.defaultPrevented;
              e.preventDefault();
            },
            { once: true },
          );
          a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init }));
          return seen;
        }),
      [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, {}],
    );
    expect(prevented).toEqual([false, false, false, false, true]);
    await expect(page).toHaveURL(/\/zh-hant\/contact\?intent=service&service=seo-aeo$/);
  });
});

test.describe("signature stage", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });

  /** The active step's progress bar, 0–1, read from its scaleX transform. */
  const progress = (page: Page) =>
    page.locator('.sig__step[aria-current="step"] .sig__fill').evaluate((el) => {
      const t = getComputedStyle(el).transform;
      return t === "none" ? 1 : Number(t.match(/matrix\(([^,]+)/)?.[1] ?? 0);
    });

  test("pausing holds the step's progress and playing again resumes from there", async ({ page }) => {
    await page.goto("/en");
    const play = page.locator(".sig__btn").first();
    await page.locator(".sig__frames").scrollIntoViewIfNeeded();
    await expect(play).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => progress(page)).toBeGreaterThan(0.15);
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "false");
    const paused = await progress(page);
    expect(paused).toBeGreaterThan(0.1);
    await page.waitForTimeout(800);
    expect(Math.abs((await progress(page)) - paused)).toBeLessThan(0.02);
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "true");
    // Resumed, not restarted: the bar never drops back below where it paused.
    expect(await progress(page)).toBeGreaterThanOrEqual(paused - 0.02);
    await expect.poll(() => progress(page)).toBeGreaterThan(paused + 0.05);
  });

  // The server renders all four frames; the stage then shows one (audit: 539 → 433 px at 1440,
  // 1,683 → 615 px at 390). The page has to look like the stage before hydration too.
  for (const width of [1440, 390]) {
    test(`at ${width} px the frames keep their height through hydration`, async ({ browser }) => {
      const framesHeight = async (hydrate: boolean) => {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
        const page = await context.newPage();
        // Blocking the app's scripts leaves the inline boot script (html.js): the state before hydration.
        if (!hydrate) await page.route(/\/_next\/static\/chunks\/.+\.js/, (route) => route.abort());
        await page.goto("/en");
        if (hydrate) await expect(page.locator(".sig")).toHaveClass(/sig--stage/);
        const frames = page.locator(".sig__frames");
        await frames.evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const height = await frames.evaluate((el) => el.getBoundingClientRect().height);
        await context.close();
        return height;
      };
      const before = await framesHeight(false);
      const after = await framesHeight(true);
      expect(Math.abs(before - after), `${before} → ${after}`).toBeLessThanOrEqual(2);
    });
  }

  /** Left edge and width of each step and button in the controls row, rounded to the pixel. */
  const controls = (page: Page) =>
    page.locator(".sig__step, .sig__btn").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return [Math.round(r.left), Math.round(r.width)];
      }),
    );

  for (const width of [1440, 390]) {
    test(`at ${width} px the controls row does not move through hydration`, async ({ browser }) => {
      const layout = async (hydrate: boolean) => {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
        const page = await context.newPage();
        if (!hydrate) await page.route(/\/_next\/static\/chunks\/.+\.js/, (route) => route.abort());
        await page.goto("/en");
        if (hydrate) await expect(page.locator(".sig")).toHaveClass(/sig--stage/);
        const result = await controls(page);
        await context.close();
        return result;
      };
      expect(await layout(true)).toEqual(await layout(false));
    });
  }

  test("the buttons keep their size whatever they say", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator(".sig")).toHaveClass(/sig--stage/);
    const play = page.locator(".sig__btn").first();
    const start = await controls(page);
    await page.locator(".sig__frames").scrollIntoViewIfNeeded();
    await expect(play).toHaveAttribute("aria-pressed", "true"); // Pause
    expect(await controls(page)).toEqual(start);
    await page.locator(".sig__step").last().click(); // the last step: Replay
    await expect(play).toHaveAccessibleName(/replay/i);
    expect(await controls(page)).toEqual(start);
    await page.getByRole("button", { name: "Show all four" }).click(); // now Step through
    await expect(page.getByRole("button", { name: "Step through" })).toBeVisible();
    expect(await controls(page)).toEqual(start);
  });

  test("hydration does not replay the first frame's entrance; the next step still enters", async ({ page }) => {
    /** The entrance animations (`sig-in`) on a frame and its contents, finished ones included (fill: both). */
    const entrances = (role: string) =>
      page.locator(`.sig__frame[data-role="${role}"]`).evaluate((el) =>
        el.getAnimations({ subtree: true }).filter((a) => (a as CSSAnimation).animationName === "sig-in").length,
      );
    await page.goto("/en");
    await expect(page.locator(".sig")).toHaveClass(/sig--stage/);
    // Already on screen in the pending storyboard: fading it out and back in would be the blink this fix removes.
    expect(await entrances("source")).toBe(0);
    await page.locator('.sig__step').nth(1).click();
    expect(await entrances("work")).toBeGreaterThan(0);
  });

  test("without JavaScript, or with reduced motion, the storyboard keeps all four frames", async ({ browser }) => {
    for (const options of [{ javaScriptEnabled: false }, { reducedMotion: "reduce" as const }]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
      const page = await context.newPage();
      await page.goto("/en");
      const frames = page.locator(".sig__frame");
      await frames.first().evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
      await expect(frames.filter({ visible: true }), JSON.stringify(options)).toHaveCount(4);
      await context.close();
    }
  });
});

test("the hero accent is the serif in English and emphasis marks in both Chinese scripts", async ({ page }) => {
  await page.goto("/en");
  const en = page.locator("h1 .accent").first();
  expect(await en.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Instrument Serif/);
  for (const route of ["/zh-hant", "/zh-hans"]) {
    await page.goto(route);
    const style = await page.locator("h1 em.accent").evaluate((el) => {
      const s = getComputedStyle(el);
      return { family: s.fontFamily, emphasis: s.getPropertyValue("text-emphasis-style") || s.getPropertyValue("-webkit-text-emphasis-style") };
    });
    expect(style.emphasis, route).toContain("circle");
    expect(style.family, route).not.toMatch(/Instrument Serif/);
  }
});
