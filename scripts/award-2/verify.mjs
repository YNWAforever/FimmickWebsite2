#!/usr/bin/env node
/**
 * Point measurements behind the Phase 1 craft-break items: utility-row focus position, hero badge
 * coverage, horizontal overflow, primary-nav breakpoint, drawer geometry and timing, and the header
 * during a client-side route change.
 *
 *   OUT=before node scripts/award-2/verify.mjs
 */
import path from "node:path";
import { chromium } from "@playwright/test";
import { base, jumpTo, outDir, writeJson } from "./lib.mjs";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const out = {};

async function open(url, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(base + url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

// 1.4 Utility-row focus after scrolling down then a little up (header in its "up" state).
await open("/en", 1440, 900);
await jumpTo(page, 1500);
await page.waitForTimeout(300);
await jumpTo(page, 1200);
await page.waitForTimeout(700);
await page.locator(".header-main .brand").focus();
await page.keyboard.press("Shift+Tab");
await page.waitForTimeout(700);
out.utilityFocus = await page.evaluate(() => {
  const el = document.activeElement;
  const r = el.getBoundingClientRect();
  return { focused: el.textContent.trim(), top: Math.round(r.top), dataScroll: document.documentElement.dataset.scroll, headerTransform: getComputedStyle(document.querySelector(".site-header")).transform };
});

// 1.6 Hero badge coverage on phones.
out.heroBadge = {};
for (const [w, h] of [[390, 844], [320, 640]]) {
  await open("/en", w, h);
  await page.waitForTimeout(1200);
  out.heroBadge[w] = await page.evaluate(() => {
    const badge = document.querySelector(".cine-hero .photo__label");
    if (!badge) return { badge: false };
    // The badge is pointer-events: none; enable hit-testing so elementFromPoint reports paint order.
    badge.style.pointerEvents = "auto";
    const r = badge.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { rect: [r.left, r.top, r.width, r.height].map(Math.round), topmost: top ? `${top.tagName.toLowerCase()}.${String(top.className).split(" ")[0]}` : null, visible: !!top && (top === badge || badge.contains(top)) };
  });
}

// 1.2 Primary nav and drawer geometry by width.
out.nav = {};
for (const [w, h] of [[1023, 800], [1024, 800], [1200, 800], [1280, 800]]) {
  await open("/en", w, h);
  out.nav[w] = await page.evaluate(() => ({
    primaryNav: getComputedStyle(document.querySelector(".primary-nav")).display,
    menuToggle: getComputedStyle(document.querySelector(".header-actions .menu-toggle")).display,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
}
out.drawer = {};
for (const [w, h] of [[390, 844], [820, 1180], [1200, 800]]) {
  await open("/en", w, h);
  const toggle = page.locator(".header-actions .menu-toggle");
  if (!(await toggle.isVisible())) {
    out.drawer[w] = { toggleVisible: false };
    continue;
  }
  await toggle.click();
  await page.waitForTimeout(600);
  out.drawer[w] = await page.evaluate(() => {
    const r = document.querySelector(".drawer").getBoundingClientRect();
    return { left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), vh: innerHeight };
  });
}

// 1.5 Drawer height while opening after a scroll down then up (header transformed).
await open("/en", 390, 844);
await jumpTo(page, 2000);
await page.waitForTimeout(400);
await jumpTo(page, 1700);
await page.waitForTimeout(800);
out.drawerOpening = await page.evaluate(async () => {
  document.querySelector(".header-actions .menu-toggle").click();
  const t0 = performance.now();
  const at = [];
  for (const ms of [60, 200, 450, 700]) {
    await new Promise((r) => setTimeout(r, ms - (performance.now() - t0)));
    const d = document.querySelector(".drawer").getBoundingClientRect();
    at.push({ ms, height: Math.round(d.height), top: Math.round(d.top) });
  }
  return { vh: innerHeight, at };
});

// 1.5 Drawer survives a resize past the breakpoint.
await open("/en", 1000, 800);
await page.locator(".header-actions .menu-toggle").click();
await page.waitForTimeout(400);
await page.setViewportSize({ width: 1300, height: 800 });
await page.waitForTimeout(400);
out.drawerResize = await page.evaluate(() => ({
  menuOpen: document.body.dataset.menuOpen,
  bodyOverflow: getComputedStyle(document.body).overflow,
  drawerVisible: !document.querySelector(".drawer").hidden,
  closeButtonDisplay: getComputedStyle(document.querySelector(".drawer .menu-toggle")).display,
}));

// 1.5 Header during a client-side route change from a scrolled position.
await open("/en", 1440, 900);
await jumpTo(page, 2000);
await page.waitForTimeout(700);
await jumpTo(page, 1900);
await page.waitForTimeout(700);
const before = await page.evaluate(() => getComputedStyle(document.querySelector(".site-header")).transform);
await page.evaluate(() => {
  window.__headerSamples = [];
  const t0 = performance.now();
  const tick = () => {
    window.__headerSamples.push({ ms: Math.round(performance.now() - t0), path: location.pathname, transform: getComputedStyle(document.querySelector(".site-header")).transform });
    if (performance.now() - t0 < 700) requestAnimationFrame(tick);
  };
  document.querySelector('a[href="/en/platform"]')?.click();
  requestAnimationFrame(tick);
});
await page.waitForTimeout(1200);
const routeSamples = await page.evaluate(() => window.__headerSamples);
out.routeChange = { before, firstFrameOnNewPage: routeSamples.find((s) => s.path === "/en/platform") ?? null, samples: routeSamples.filter((_, i) => i % 4 === 0).slice(0, 12) };

await browser.close();
writeJson(path.join(outDir(), "verify.json"), out);
console.log(JSON.stringify(out, null, 2));
