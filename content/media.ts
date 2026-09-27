/**
 * Media registry for the product explainer film. Files are rendered by
 * `npm run video:render` from video/composition.html (see video/README.md).
 * Rights: original work rendered from this repository's own sample interface;
 * uses the FIMMICK logo from fimmick.com and the Manrope font (SIL OFL 1.1).
 */
export type ExplainerMedia = {
  width: number;
  height: number;
  durationSeconds: number;
  poster: string;
  sources: Record<"en" | "zh-hant", { mp4: string; webm: string }>;
  captions: { srclang: string; label: string; src: string; locale: "en" | "zh-hant" }[];
  rights: string;
};

export const explainerMedia: ExplainerMedia = {
  width: 1280,
  height: 720,
  durationSeconds: 42,
  poster: "/media/explainer/poster.webp",
  sources: {
    en: { mp4: "/media/explainer/fimmick-aip-explainer-en.mp4", webm: "/media/explainer/fimmick-aip-explainer-en.webm" },
    "zh-hant": { mp4: "/media/explainer/fimmick-aip-explainer-zh-hant.mp4", webm: "/media/explainer/fimmick-aip-explainer-zh-hant.webm" },
  },
  captions: [
    { srclang: "en", label: "English", src: "/media/explainer/captions-en.vtt", locale: "en" },
    { srclang: "zh-Hant-HK", label: "繁體中文", src: "/media/explainer/captions-zh-hant.vtt", locale: "zh-hant" },
  ],
  rights: "Original FIMMICK work rendered from sample data; no stock footage, voice or third-party imagery.",
};
