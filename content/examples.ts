import type { L } from "@/lib/i18n";
import type { ExampleId, ProductId, SolutionId } from "./types";

/**
 * Deterministic sample data for the four interactive examples.
 * Everything here is illustrative: a sample brand launching a 750 ml reusable
 * bottle. No real customer, post, AI answer or enquiry is represented.
 */

export const exampleMeta: Record<ExampleId, { solution: SolutionId; products: ProductId[]; title: L; lead: L }> = {
  intelligence: {
    solution: "market-intelligence",
    products: ["social-listening", "aiso"],
    title: { en: "Insight brief", zh: "洞察簡報" },
    lead: { en: "Choose a topic and a dataset. Evidence, interpretation and priorities change together.", zh: "選擇話題及資料組合，證據、解讀及優先次序會同步更新。" },
  },
  content: {
    solution: "content-production",
    products: ["creativemax", "whatsapp-aigc"],
    title: { en: "Content draft and review", zh: "內容草稿與審閱" },
    lead: { en: "Pick a scenario and format, edit the draft, mark it reviewed and export a labelled sample file.", zh: "選擇情境及格式，修改草稿，標記為已審閱，再匯出已標示的示例檔案。" },
  },
  "follow-up": {
    solution: "customer-engagement",
    products: ["customer-ops"],
    title: { en: "Enquiry follow-up", zh: "查詢跟進" },
    lead: { en: "Select an enquiry, confirm the owner and next action. The record and draft update together.", zh: "選擇一個查詢，確認負責人及下一步行動，紀錄及草稿會同步更新。" },
  },
  "website-ops": {
    solution: "website-operations",
    products: ["website-cms"],
    title: { en: "Record to page update", zh: "由紀錄到頁面更新" },
    lead: { en: "Select a record change, check validation, review it and see the sample page preview.", zh: "選擇一項紀錄變更，檢查驗證結果並審閱，再查看示例頁面預覽。" },
  },
};

/* ---------------------------------------------------------------- intelligence */

export type IntelTopic = "lids" | "cleaning" | "colours";
export type IntelSource = "social" | "reviews" | "forums";

export const intelTopics: { id: IntelTopic; label: L }[] = [
  { id: "lids", label: { en: "Leak-proof lids", zh: "防漏杯蓋" } },
  { id: "cleaning", label: { en: "Cleaning and hygiene", zh: "清洗與衞生" } },
  { id: "colours", label: { en: "Colour choice", zh: "顏色選擇" } },
];

export const intelSources: { id: IntelSource; label: L }[] = [
  { id: "social", label: { en: "Social posts", zh: "社交貼文" } },
  { id: "reviews", label: { en: "Product reviews", zh: "產品評論" } },
  { id: "forums", label: { en: "Forums", zh: "討論區" } },
];

export const intelEvidence: { id: string; topic: IntelTopic; source: IntelSource; date: string; text: L; tone: "positive" | "negative" | "mixed" }[] = [
  { id: "E-101", topic: "lids", source: "social", date: "2026-09-02", tone: "negative", text: { en: "“Second bottle this year that leaked in my work bag.”", zh: "「今年第二個水樽喺返工袋入面漏水。」" } },
  { id: "E-102", topic: "lids", source: "reviews", date: "2026-09-05", tone: "positive", text: { en: "“Lock on the lid is the reason I bought it.”", zh: "「就係因為個蓋有鎖先買。」" } },
  { id: "E-103", topic: "lids", source: "forums", date: "2026-09-08", tone: "mixed", text: { en: "“Does anyone know which bottles are safe for laptops in the same bag?”", zh: "「有冇人知邊隻水樽同手提電腦放埋一齊都唔怕？」" } },
  { id: "E-201", topic: "cleaning", source: "reviews", date: "2026-09-03", tone: "negative", text: { en: "“Hard to clean the bottom — needs a brush.”", zh: "「樽底好難洗，要用刷。」" } },
  { id: "E-202", topic: "cleaning", source: "forums", date: "2026-09-10", tone: "mixed", text: { en: "“Is it dishwasher safe? The box doesn’t say.”", zh: "「可唔可以放洗碗碟機？盒上面冇寫。」" } },
  { id: "E-203", topic: "cleaning", source: "social", date: "2026-09-12", tone: "positive", text: { en: "“Wide mouth makes it easy to add ice and wash.”", zh: "「闊口加冰同洗都方便。」" } },
  { id: "E-301", topic: "colours", source: "social", date: "2026-09-04", tone: "positive", text: { en: "“The lime one is so bright, love it.”", zh: "「青檸色好鮮，好鍾意。」" } },
  { id: "E-302", topic: "colours", source: "reviews", date: "2026-09-09", tone: "mixed", text: { en: "“Stone looks greyer than the photos.”", zh: "「石灰色實物比相片灰。」" } },
  { id: "E-303", topic: "colours", source: "forums", date: "2026-09-11", tone: "mixed", text: { en: "“Which colour hides scratches best?”", zh: "「邊隻顏色最唔顯花？」" } },
];

export const intelInterpretation: Record<IntelTopic, { summary: L; priorities: L[] }> = {
  lids: {
    summary: { en: "Commuters worry about leaks near laptops and documents. The lid lock is a buying reason when people know about it.", zh: "通勤人士擔心水樽在電腦及文件旁漏水；當顧客知道杯蓋有鎖扣時，這會成為購買原因。" },
    priorities: [
      { en: "Lead launch content with a lid-lock demonstration", zh: "新品內容以杯蓋鎖扣示範為重點" },
      { en: "Add a ‘safe in your work bag’ line to the product page (approved claim needed)", zh: "在產品頁加入「放入公事包都安心」一句（須先確認宣稱）" },
      { en: "Analyst to confirm if leak complaints refer to competitor bottles", zh: "由分析師確認漏水投訴是否針對競爭對手產品" },
    ],
  },
  cleaning: {
    summary: { en: "People are unsure how to clean the bottle; dishwasher guidance is missing from the packaging.", zh: "顧客不清楚如何清洗水樽，包裝亦未有洗碗碟機指引。" },
    priorities: [
      { en: "Request care instructions from the product team", zh: "向產品團隊索取保養說明" },
      { en: "Add an FAQ on cleaning to the product page", zh: "在產品頁加入清洗常見問題" },
      { en: "Keep ‘wide mouth’ as a supporting benefit", zh: "保留「闊口設計」作為輔助賣點" },
    ],
  },
  colours: {
    summary: { en: "Lime drives enthusiasm; Stone photos may not match the product, creating expectation gaps.", zh: "青檸色最受歡迎；石灰色相片可能與實物不符，造成期望落差。" },
    priorities: [
      { en: "Reshoot Stone product photos in natural light", zh: "以自然光重拍石灰色產品相" },
      { en: "Feature Lime in social launch visuals", zh: "在社交新品視覺中突出青檸色" },
      { en: "Monitor Stone reviews after the reshoot", zh: "重拍後持續留意石灰色評論" },
    ],
  },
};

/** Separate AI-search dataset (AISO). Assistants are anonymised in the sample. */
export const aisoChecks: { id: string; topic: IntelTopic; question: L; assistant: string; date: string; mentioned: boolean; note: L }[] = [
  { id: "Q-01", topic: "lids", question: { en: "Which reusable bottle won’t leak in a bag?", zh: "邊款可重用水樽放袋都唔會漏？" }, assistant: "Assistant A", date: "2026-09-15", mentioned: false, note: { en: "Answer cites two competitors; sample brand page lacks a clear leak-proof statement.", zh: "答案引用兩個競爭對手；示例品牌頁面欠缺清晰的防漏說明。" } },
  { id: "Q-02", topic: "cleaning", question: { en: "Are stainless steel bottles dishwasher safe?", zh: "不銹鋼水樽可以放洗碗碟機嗎？" }, assistant: "Assistant B", date: "2026-09-15", mentioned: false, note: { en: "Generic answer; no brand cited. A care FAQ could be a citable source.", zh: "答案屬一般資訊，未引用品牌；清洗常見問題可成為可被引用的來源。" } },
  { id: "Q-03", topic: "colours", question: { en: "Best bright-coloured water bottle in Hong Kong?", zh: "香港有邊款顏色鮮艷嘅水樽推介？" }, assistant: "Assistant A", date: "2026-09-15", mentioned: true, note: { en: "Sample brand mentioned via a retailer page, not its own site.", zh: "示例品牌經零售商頁面被提及，而非自家網站。" } },
];

/* --------------------------------------------------------------------- content */

export type ContentScenario = "launch" | "invitation" | "product-page";

export const contentFacts: L<string[]> = {
  en: ["750 ml reusable bottle", "Double-wall stainless steel", "Lid with lock", "Colours: Harbour Blue, Stone, Lime", "No price supplied — do not mention price"],
  zh: ["750 毫升可重用水樽", "雙層不銹鋼", "杯蓋附鎖扣", "顏色：海港藍、石灰、青檸", "未提供價格——不得提及價錢"],
};

export const contentScenarios: {
  id: ContentScenario;
  label: L;
  extraFacts: L<string[]>;
  formats: { id: string; label: L; draft: L }[];
}[] = [
  {
    id: "launch",
    label: { en: "Product launch post", zh: "新品推出貼文" },
    extraFacts: { en: ["Launch: this autumn (sample)"], zh: ["推出：今個秋季（示例）"] },
    formats: [
      {
        id: "instagram",
        label: { en: "Instagram caption", zh: "Instagram 文案" },
        draft: {
          en: "Meet the 750 ml bottle that stays put in your bag. Double-wall stainless steel, a lid that locks, and three colours: Harbour Blue, Stone and Lime. Which one is yours?",
          zh: "750 毫升，放入袋都安心。雙層不銹鋼、杯蓋有鎖扣，三款顏色：海港藍、石灰、青檸。你揀邊隻？",
        },
      },
      {
        id: "facebook",
        label: { en: "Facebook post", zh: "Facebook 貼文" },
        draft: {
          en: "New this autumn: our 750 ml reusable bottle. Double-wall stainless steel with a locking lid, made for commutes and long days. Available in Harbour Blue, Stone and Lime.",
          zh: "今個秋季全新登場：750 毫升可重用水樽。雙層不銹鋼配鎖扣杯蓋，陪你返工返學、忙足一整天。有海港藍、石灰及青檸三色。",
        },
      },
    ],
  },
  {
    id: "invitation",
    label: { en: "Store invitation", zh: "門市邀請" },
    extraFacts: { en: ["Event: in-store preview, Causeway Bay (sample)", "Date: Saturday, 11am–6pm (sample)"], zh: ["活動：銅鑼灣門市預覽（示例）", "日期：星期六上午 11 時至下午 6 時（示例）"] },
    formats: [
      {
        id: "email",
        label: { en: "Email invitation", zh: "電郵邀請" },
        draft: {
          en: "You’re invited to an in-store preview in Causeway Bay this Saturday, 11am–6pm. Try the new 750 ml bottle, test the locking lid and see all three colours in person.",
          zh: "誠邀你本星期六上午 11 時至下午 6 時蒞臨銅鑼灣門市預覽。親身試用全新 750 毫升水樽、測試鎖扣杯蓋，一次過睇晒三款顏色。",
        },
      },
      {
        id: "poster",
        label: { en: "Store poster copy", zh: "門市海報文字" },
        draft: {
          en: "Preview day — this Saturday. Try the 750 ml bottle with the locking lid. Harbour Blue · Stone · Lime.",
          zh: "預覽日——本星期六。即場試用 750 毫升鎖扣杯蓋水樽。海港藍·石灰·青檸。",
        },
      },
    ],
  },
  {
    id: "product-page",
    label: { en: "Product page description", zh: "產品頁描述" },
    extraFacts: { en: ["Care instructions: not yet supplied"], zh: ["保養說明：尚未提供"] },
    formats: [
      {
        id: "description",
        label: { en: "Product description", zh: "產品描述" },
        draft: {
          en: "A 750 ml reusable bottle in double-wall stainless steel, with a locking lid for bags and commutes. Choose Harbour Blue, Stone or Lime. Care instructions: to be confirmed.",
          zh: "750 毫升雙層不銹鋼可重用水樽，杯蓋附鎖扣，適合放入手袋及通勤使用。可選海港藍、石灰或青檸。保養說明：有待確認。",
        },
      },
      {
        id: "bullets",
        label: { en: "Key feature bullets", zh: "重點特色" },
        draft: {
          en: "• 750 ml capacity\n• Double-wall stainless steel\n• Locking lid\n• Harbour Blue, Stone, Lime",
          zh: "• 750 毫升容量\n• 雙層不銹鋼\n• 鎖扣杯蓋\n• 海港藍、石灰、青檸",
        },
      },
    ],
  },
];

/**
 * The homepage hero card, live (award pass 2, 7): the launch caption and the four approved facts it
 * was drafted from. `phrase` is the wording each fact became in the caption, per language; the card
 * derives the character ranges to underline from it (a unit test keeps every phrase in its caption).
 */
export const heroSample = {
  caption: contentScenarios[0].formats[0].draft,
  record: "REC-0412",
  facts: [
    { id: "capacity", label: { en: contentFacts.en[0], zh: contentFacts.zh[0] }, phrase: { en: "750 ml", zh: "750 毫升" } },
    { id: "material", label: { en: contentFacts.en[1], zh: contentFacts.zh[1] }, phrase: { en: "Double-wall stainless steel", zh: "雙層不銹鋼" } },
    { id: "lid", label: { en: contentFacts.en[2], zh: contentFacts.zh[2] }, phrase: { en: "lid that locks", zh: "杯蓋有鎖扣" } },
    { id: "colours", label: { en: contentFacts.en[3], zh: contentFacts.zh[3] }, phrase: { en: "three colours: Harbour Blue, Stone and Lime", zh: "三款顏色：海港藍、石灰、青檸" } },
  ] as { id: string; label: L; phrase: L }[],
};

/** A caption cut into runs at each fact’s wording: [text] or [text, factId]. */
export function captionRuns(text: string, phrases: [id: string, phrase: string][]): [string, string?][] {
  const marks = phrases
    .map(([id, phrase]) => ({ id, at: text.indexOf(phrase), length: phrase.length }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  const runs: [string, string?][] = [];
  let i = 0;
  for (const m of marks) {
    if (m.at > i) runs.push([text.slice(i, m.at)]);
    runs.push([text.slice(m.at, m.at + m.length), m.id]);
    i = m.at + m.length;
  }
  if (i < text.length) runs.push([text.slice(i)]);
  return runs;
}

/* ------------------------------------------------------------------- follow-up */

export type EnquiryId = "ENQ-2041" | "ENQ-2042" | "ENQ-2043";
export type OwnerId = "retail" | "wholesale" | "service";
export type NextActionId = "reply" | "call" | "route";

export const owners: { id: OwnerId; label: L }[] = [
  { id: "retail", label: { en: "Retail store team", zh: "門市團隊" } },
  { id: "wholesale", label: { en: "Corporate sales", zh: "企業銷售" } },
  { id: "service", label: { en: "Customer service", zh: "客戶服務" } },
];

export const nextActions: { id: NextActionId; label: L }[] = [
  { id: "reply", label: { en: "Reply with approved answer", zh: "以已確認答案回覆" } },
  { id: "call", label: { en: "Call back", zh: "回電" } },
  { id: "route", label: { en: "Route to a person, no draft", zh: "直接轉交專人，不草擬" } },
];

export const enquiries: {
  id: EnquiryId;
  channel: L;
  received: string;
  message: L;
  intent: L;
  suggestedOwner: OwnerId;
  suggestedAction: NextActionId;
  priority: L;
  humanOnly: boolean;
  drafts: Record<NextActionId, L | null>;
}[] = [
  {
    id: "ENQ-2041",
    channel: { en: "Website form", zh: "網站表格" },
    received: "2026-09-18 10:12",
    message: { en: "Hi, we’d like 200 bottles with our logo for staff gifts. Is that possible?", zh: "你好，我哋想訂 200 個印有公司標誌嘅水樽做員工禮物，可唔可以？" },
    intent: { en: "Corporate order", zh: "企業訂購" },
    suggestedOwner: "wholesale",
    suggestedAction: "call",
    priority: { en: "High — potential order", zh: "高——潛在訂單" },
    humanOnly: false,
    drafts: {
      reply: { en: "Thank you for your interest in a corporate order. A member of our corporate sales team will contact you to discuss quantities, customisation and timing.", zh: "多謝你對企業訂購的查詢。我們的企業銷售同事會聯絡你，商討數量、訂製及時間安排。" },
      call: { en: "Call note: confirm quantity (200), logo format, delivery date; do not quote price until approved.", zh: "回電備註：確認數量（200 個）、標誌格式及交貨日期；未經批准前不作報價。" },
      route: null,
    },
  },
  {
    id: "ENQ-2042",
    channel: { en: "Message (sample)", zh: "訊息（示例）" },
    received: "2026-09-18 11:40",
    message: { en: "Is the Causeway Bay preview open on Saturday afternoon?", zh: "銅鑼灣個預覽星期六下晝有冇開？" },
    intent: { en: "Event question", zh: "活動查詢" },
    suggestedOwner: "retail",
    suggestedAction: "reply",
    priority: { en: "Normal", zh: "一般" },
    humanOnly: false,
    drafts: {
      reply: { en: "Yes — the Causeway Bay preview is open on Saturday from 11am to 6pm. We look forward to seeing you.", zh: "有的——銅鑼灣門市預覽於星期六上午 11 時至下午 6 時開放，期待見到你。" },
      call: { en: "Call note: confirm Saturday 11am–6pm opening.", zh: "回電備註：確認星期六上午 11 時至下午 6 時開放。" },
      route: null,
    },
  },
  {
    id: "ENQ-2043",
    channel: { en: "Email", zh: "電郵" },
    received: "2026-09-18 14:05",
    message: { en: "My bottle leaked and damaged my laptop. I want to make a claim.", zh: "我個水樽漏水整壞咗我部手提電腦，我想索償。" },
    intent: { en: "Complaint / claim", zh: "投訴／索償" },
    suggestedOwner: "service",
    suggestedAction: "route",
    priority: { en: "Urgent — human-only category", zh: "緊急——只限專人處理" },
    humanOnly: true,
    drafts: { reply: null, call: null, route: null },
  },
];

/* ---------------------------------------------------------------- website ops */

export type RecordChangeId = "add-care" | "new-colour" | "missing-field";

export const recordChanges: {
  id: RecordChangeId;
  label: L;
  record: string;
  fields: { name: L; before: L; after: L; changed: boolean; valid: boolean; note?: L }[];
  preview: { title: L; lines: L[] };
}[] = [
  {
    id: "add-care",
    label: { en: "Add care instructions", zh: "加入保養說明" },
    record: "BTL-750-HB (sample)",
    fields: [
      { name: { en: "Name", zh: "名稱" }, before: { en: "750 ml Bottle — Harbour Blue", zh: "750 毫升水樽——海港藍" }, after: { en: "750 ml Bottle — Harbour Blue", zh: "750 毫升水樽——海港藍" }, changed: false, valid: true },
      { name: { en: "Care", zh: "保養" }, before: { en: "—", zh: "—" }, after: { en: "Hand wash recommended. Lid: top-rack dishwasher safe.", zh: "建議以手清洗。杯蓋：可放洗碗碟機上層。" }, changed: true, valid: true },
      { name: { en: "Status", zh: "狀態" }, before: { en: "Published", zh: "已發布" }, after: { en: "Published", zh: "已發布" }, changed: false, valid: true },
    ],
    preview: { title: { en: "750 ml Bottle — Harbour Blue", zh: "750 毫升水樽——海港藍" }, lines: [{ en: "Double-wall stainless steel · Locking lid", zh: "雙層不銹鋼·鎖扣杯蓋" }, { en: "Care: Hand wash recommended. Lid: top-rack dishwasher safe.", zh: "保養：建議以手清洗。杯蓋：可放洗碗碟機上層。" }] },
  },
  {
    id: "new-colour",
    label: { en: "Rename a colour", zh: "修改顏色名稱" },
    record: "BTL-750-ST (sample)",
    fields: [
      { name: { en: "Name", zh: "名稱" }, before: { en: "750 ml Bottle — Grey", zh: "750 毫升水樽——灰色" }, after: { en: "750 ml Bottle — Stone", zh: "750 毫升水樽——石灰" }, changed: true, valid: true, note: { en: "Matches approved colour list", zh: "符合已確認的顏色清單" } },
      { name: { en: "Image alt text", zh: "圖片替代文字" }, before: { en: "Grey bottle", zh: "灰色水樽" }, after: { en: "Stone-coloured 750 ml bottle", zh: "石灰色 750 毫升水樽" }, changed: true, valid: true },
      { name: { en: "Status", zh: "狀態" }, before: { en: "Published", zh: "已發布" }, after: { en: "Published", zh: "已發布" }, changed: false, valid: true },
    ],
    preview: { title: { en: "750 ml Bottle — Stone", zh: "750 毫升水樽——石灰" }, lines: [{ en: "Double-wall stainless steel · Locking lid", zh: "雙層不銹鋼·鎖扣杯蓋" }, { en: "Colour: Stone", zh: "顏色：石灰" }] },
  },
  {
    id: "missing-field",
    label: { en: "New 1 L variant (incomplete)", zh: "新 1 公升款式（資料不全）" },
    record: "BTL-1000-LM (sample)",
    fields: [
      { name: { en: "Name", zh: "名稱" }, before: { en: "—", zh: "—" }, after: { en: "1 L Bottle — Lime", zh: "1 公升水樽——青檸" }, changed: true, valid: true },
      { name: { en: "Capacity", zh: "容量" }, before: { en: "—", zh: "—" }, after: { en: "1,000 ml", zh: "1,000 毫升" }, changed: true, valid: true },
      { name: { en: "Material", zh: "物料" }, before: { en: "—", zh: "—" }, after: { en: "(missing)", zh: "（缺漏）" }, changed: true, valid: false, note: { en: "Required field — ask the product team; do not guess", zh: "必填欄位——請向產品團隊查詢，不可自行猜測" } },
    ],
    preview: { title: { en: "1 L Bottle — Lime", zh: "1 公升水樽——青檸" }, lines: [{ en: "Held: required field missing", zh: "暫緩：欠缺必填欄位" }] },
  },
];

export const sampleNotice: L = { en: "Illustrative example — sample data", zh: "流程示範·示例資料" };
