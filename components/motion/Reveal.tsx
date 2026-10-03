"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Shared motion policy for section entry.
 *
 * - Elements with `.reveal` animate in once (CSS in diagrams.css), only when
 *   the visitor has no reduced-motion preference and JS is running.
 * - Content is visible by default; the hidden starting state is scoped to
 *   `html.js` so a script failure never hides anything.
 * - Observers are disconnected when elements have been revealed or the
 *   route changes.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    nodes.forEach((n) => observer.observe(n));
    // Content mounted later (client islands, streamed sections) is observed too, so it can never stay hidden.
    const added = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const found = node.matches(".reveal:not(.is-visible)") ? [node] : [];
          found.concat(Array.from(node.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"))).forEach((n) => observer.observe(n));
        });
      }
    });
    added.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      added.disconnect();
    };
  }, [pathname]);
  return null;
}

/** Subscribe to the reduced-motion preference, reacting to changes. */
export function usePrefersReducedMotion(callback: (reduced: boolean) => void) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    callback(query.matches);
    const onChange = (e: MediaQueryListEvent) => callback(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [callback]);
}
