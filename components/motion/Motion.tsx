"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

/**
 * Site-wide motion state, mounted once in the shell.
 *
 * JavaScript only sets state; every movement is a CSS transition or animation
 * (award.css), and none of it runs with a reduced-motion preference. Scrolling
 * itself stays native: no smooth-scroll library, no scroll-jacking.
 *
 * 1. Scroll direction on <html data-scroll="top|down|up"> so the header can
 *    condense and step out of the way while reading.
 * 2. A "view" bubble over large media links (elements with data-cursor) on fine
 *    pointers. Its position eases with a CSS transition, and the system cursor is
 *    replaced only while the bubble exists.
 */
export function Motion({ viewLabel }: { viewLabel: string }) {
  const pathname = usePathname();

  // Header state from scroll direction.
  useEffect(() => {
    const root = document.documentElement;
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - last;
      if (y < 80) root.dataset.scroll = "top";
      else if (delta > 6) root.dataset.scroll = "down";
      else if (delta < -6) root.dataset.scroll = "up";
      if (Math.abs(delta) > 6 || y < 80) last = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pointer bubble over media links.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bubble = document.createElement("div");
    bubble.className = "cursor-bubble";
    bubble.setAttribute("aria-hidden", "true");
    bubble.textContent = viewLabel;
    document.body.appendChild(bubble);
    document.documentElement.classList.add("has-bubble");
    let current: Element | null = null;
    const place = (e: PointerEvent) => {
      bubble.style.translate = `${e.clientX}px ${e.clientY}px`;
    };
    const onMove = (e: PointerEvent) => {
      const next = (e.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (next && next !== current) bubble.textContent = next.getAttribute("data-cursor") || viewLabel;
      if (next && !current) {
        // Appear under the pointer instead of gliding in from where it last left a card.
        bubble.classList.add("is-jump");
        place(e);
        void getComputedStyle(bubble).translate;
        bubble.classList.remove("is-jump");
      } else if (next) {
        place(e);
      }
      current = next;
      bubble.classList.toggle("is-on", !!next);
    };
    const onLeave = () => {
      current = null;
      bubble.classList.remove("is-on");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      bubble.remove();
      document.documentElement.classList.remove("has-bubble");
    };
  }, [viewLabel]);

  // Dark-chapter marquee: the scroll-linked slide ends with the [data-rest] phrase centred, so the
  // band never rests mid-word. Only the offset is measured here (on resize and font load); the
  // movement and the static reduced-motion position are CSS (award.css, --marquee-rest).
  // Measuring starts when the chapter comes within a viewport of the screen: the chapter is
  // content-visibility: auto, and measuring it at load would force its layout into the first task.
  useEffect(() => {
    const item = document.querySelector<HTMLElement>(".marquee__item[data-rest]");
    const marquee = item?.closest<HTMLElement>(".marquee");
    const track = item?.closest<HTMLElement>(".marquee__track");
    const chapter = item?.closest<HTMLElement>("section");
    if (!item || !marquee || !track || !chapter || !item.firstChild) return;
    const text = document.createRange();
    text.selectNodeContents(item.firstChild);
    const measure = () => {
      const phrase = text.getBoundingClientRect();
      if (!phrase.width) return;
      // Phrase and track share the track's translateX, so their difference is the untransformed offset.
      const centre = phrase.left - track.getBoundingClientRect().left + phrase.width / 2;
      track.style.setProperty("--marquee-rest", `${Math.round(marquee.clientWidth / 2 - centre)}px`);
    };
    const resize = new ResizeObserver(measure);
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        resize.observe(marquee);
        resize.observe(track);
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(chapter);
    return () => {
      near.disconnect();
      resize.disconnect();
    };
  }, [pathname]);

  // Route change hides any bubble left over from the clicked card.
  useEffect(() => {
    document.querySelector(".cursor-bubble")?.classList.remove("is-on");
  }, [pathname]);

  // Route change: the new page starts at the top, so the header must already be in its top state
  // on the first frame instead of sliding back in over 520 ms against the page entrance. Before
  // paint, set the state and suspend the header transition for one frame.
  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    header.classList.add("no-transition");
    document.documentElement.dataset.scroll = "top";
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => header.classList.remove("no-transition"));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      header.classList.remove("no-transition");
    };
  }, [pathname]);

  return null;
}
