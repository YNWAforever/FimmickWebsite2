import localFont from "next/font/local";

/*
 * Self-hosted faces (award pass 2, 8.2.4), so the build no longer fetches from Google: the Latin file of
 * @fontsource-variable/manrope here, and @fontsource/instrument-serif’s in public/fonts (SIL OFL 1.1,
 * licences in app/fonts).
 */

/** UI and body face. */
export const manrope = localFont({ src: "./fonts/manrope-latin-wght-normal.woff2", variable: "--font-manrope", display: "swap", weight: "200 800", style: "normal" });

/*
 * The editorial accent face (one italic phrase per display headline; CJK keeps the sans) is a plain
 * @font-face in app/styles/editorial.css, preloaded only by the English homepage (app/[locale]/page.tsx).
 */

/** Class names that define the font variables on <html>. Every root layout must apply them. */
export const fontVariables = manrope.variable;
