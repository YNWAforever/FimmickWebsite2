import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/shell/SiteFooter";
import type { Locale } from "@/lib/i18n";

/** Award pass 2, Phase 4.1: the footer is regrouped, but it links to exactly the same places. */
const hrefs = (locale: Locale) => [...renderToStaticMarkup(createElement(SiteFooter, { locale })).matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);

describe("site footer links", () => {
  for (const locale of ["en", "zh-hant", "zh-hans"] as const) {
    it(`${locale}: same hrefs as before the regrouping`, () => {
      expect([...hrefs(locale)].sort()).toMatchSnapshot();
    });
  }
});
