/**
 * Media registry for the product explainer film. Files are rendered by
 * `npm run video:render` from video/composition.html (see video/README.md).
 * Rights: original work rendered from this repository’s own sample interface;
 * uses the FIMMICK logo from fimmick.com and the Manrope font (SIL OFL 1.1).
 */
export type ExplainerMedia = {
  width: number;
  height: number;
  durationSeconds: number;
  /** Title card (1 s into the film), full width; `posterSmall` is the same frame at 640 w. */
  poster: string;
  posterSmall: string;
  sources: Record<"en" | "zh-hant", { mp4: string; webm: string }>;
  /** Each track is labelled with its language’s own name (as the language switch is). */
  captions: { srclang: string; label: string; src: string; locale: "en" | "zh-hant" | "zh-hans" }[];
  rights: string;
};

/**
 * Scene script — the single source for the film composition, caption files
 * (video/render.mjs) and the on-page transcript.
 */
export const explainerScenes: { start: number; end: number; title: { en: string; zh: string }; caption: { en: string; zh: string } }[] = [
  { start: 0, end: 5, title: { en: "One business job", zh: "一項業務工作" }, caption: { en: "Start with one business job: launch content for a new product.", zh: "由一項業務工作開始：為新產品準備推出內容。" } },
  { start: 5, end: 12, title: { en: "Your business context", zh: "你的業務資料" }, caption: { en: "Approved brand facts enter the workspace: 750 ml, double-wall steel, three colours — and no price supplied.", zh: "已確認的品牌資料進入工作區：750 毫升、雙層不銹鋼、三款顏色——並未提供價格。" } },
  { start: 12, end: 22, title: { en: "The work, prepared", zh: "準備好的工作" }, caption: { en: "Drafts are prepared from those facts in English and Traditional Chinese, with each fact shown beside the draft.", zh: "根據這些資料準備英文及繁體中文草稿，每項資料都列在草稿旁邊。" } },
  { start: 22, end: 30, title: { en: "People decide", zh: "由人決定" }, caption: { en: "A brand manager softens the tone and approves the caption, and returns a visual with the wrong colour name.", zh: "品牌經理把語氣調整得更親切並批准文案，同時退回一個顏色名稱錯誤的視覺。" } },
  { start: 30, end: 37, title: { en: "A usable, traceable result", zh: "可用、可追溯的成果" }, caption: { en: "The approved content is exported with its sources, review notes and a record for next time.", zh: "已批准的內容連同來源、審閱意見及記錄一併匯出，方便下次重用。" } },
  { start: 37, end: 42, title: { en: "FIMMICK AIP", zh: "FIMMICK AIP" }, caption: { en: "FIMMICK AIP — Agentic AI Platform. Choose one workflow and discuss a starting scope.", zh: "FIMMICK AIP — 企業 AI 智能體平台。選擇一個流程，討論起步範圍。" } },
];

export const explainerMedia: ExplainerMedia = {
  width: 1280,
  height: 720,
  durationSeconds: 42,
  poster: "/media/explainer/poster-title.webp",
  posterSmall: "/media/explainer/poster-title-640.webp",
  sources: {
    en: { mp4: "/media/explainer/fimmick-aip-explainer-en.mp4", webm: "/media/explainer/fimmick-aip-explainer-en.webm" },
    "zh-hant": { mp4: "/media/explainer/fimmick-aip-explainer-zh-hant.mp4", webm: "/media/explainer/fimmick-aip-explainer-zh-hant.webm" },
  },
  captions: [
    { srclang: "en", label: "English", src: "/media/explainer/captions-en.vtt", locale: "en" },
    { srclang: "zh-Hant-HK", label: "繁體中文", src: "/media/explainer/captions-zh-hant.vtt", locale: "zh-hant" },
    // Generated from the Traditional track by npm run i18n:hans (award pass 2, 8.3), never edited by hand.
    { srclang: "zh-Hans", label: "简体中文", src: "/media/explainer/captions-zh-hans.vtt", locale: "zh-hans" },
  ],
  rights: "Original FIMMICK work rendered from sample data; no stock footage, voice or third-party imagery.",
};
