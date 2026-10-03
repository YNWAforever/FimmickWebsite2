"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Page entrance for client-side navigations only.
 * The first document load never animates (so the hero and its LCP image paint
 * immediately); every later route change remounts this template and plays a
 * short rise. Disabled with prefers-reduced-motion in CSS.
 */
let firstPaint = true;

export default function Template({ children }: { children: ReactNode }) {
  const animate = !firstPaint;
  useEffect(() => {
    firstPaint = false;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
