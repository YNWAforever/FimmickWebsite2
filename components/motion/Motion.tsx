"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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

  // Route change hides any bubble left over from the clicked card.
  useEffect(() => {
    document.querySelector(".cursor-bubble")?.classList.remove("is-on");
  }, [pathname]);

  return null;
}
