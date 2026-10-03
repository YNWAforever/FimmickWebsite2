import { Instrument_Serif, Manrope } from "next/font/google";

/** UI and body face. */
export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: "variable" });

/** Editorial accent face: one italic phrase per display headline (Latin only; CJK keeps the sans). */
export const serif = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: "400", style: ["italic"] });

/** Class names that define both font variables on <html>. Every root layout must apply them. */
export const fontVariables = `${manrope.variable} ${serif.variable}`;
