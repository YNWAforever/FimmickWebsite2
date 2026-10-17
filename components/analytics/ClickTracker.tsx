"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const LOCALE_PATH = /^\/(en|zh-hant|zh-hans)(\/|$)/;
const CONTACT_PATH = /^\/(en|zh-hant|zh-hans)\/contact\/?$/;
const SAFE_ID = /^[a-z0-9-]{1,40}$/;

/** Where on the page a link sits, as a short ID: the header, the footer, or the section's heading id. */
function placement(link: Element): string {
  if (link.closest(".site-header, .drawer")) return "header";
  if (link.closest(".site-footer")) return "footer";
  if (link.closest(".cta-band")) return "closing_band";
  const section = link.closest("section[aria-labelledby]");
  const id = section?.getAttribute("aria-labelledby") ?? "";
  return SAFE_ID.test(id) ? id : "page";
}

/**
 * One delegated listener for the site's link events (docs/analytics.md), so no component has to wire
 * them: calls to action that open the enquiry form (with their intent and placement), language
 * changes and links that leave the site. It only reads the link that was clicked; `track` sends
 * nothing until GTM has created the dataLayer (production builds only).
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      let url: URL;
      try {
        url = new URL((link as HTMLAnchorElement).href, window.location.href);
      } catch {
        return;
      }
      if (url.protocol === "mailto:" || url.protocol === "tel:") {
        track("outbound_clicked", { kind: url.protocol === "mailto:" ? "email" : "phone", placement: placement(link) });
        return;
      }
      if (url.origin !== window.location.origin) {
        track("outbound_clicked", { kind: "link", host: url.hostname, placement: placement(link) });
        return;
      }
      if (link.closest(".lang-switch")) {
        const to = LOCALE_PATH.exec(url.pathname)?.[1];
        const from = LOCALE_PATH.exec(window.location.pathname)?.[1];
        if (to && to !== from) track("locale_switched", { from, to });
        return;
      }
      if (CONTACT_PATH.test(url.pathname)) {
        const intent = url.searchParams.get("intent") ?? "general";
        track("cta_clicked", { cta: "contact", intent: SAFE_ID.test(intent) ? intent : "other", placement: placement(link) });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
