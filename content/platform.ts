import type { L } from "@/lib/i18n";

export type LayerId = "data" | "tasks" | "approvals" | "records";

export type PlatformLayer = {
  id: LayerId;
  number: string;
  name: L;
  question: L;
  explanation: L;
  shows: L<string[]>;
  /** What this layer contributes in the shared sample scenario. */
  scenario: { label: L; items: L<string[]> };
};

/**
 * One coherent scenario runs through the platform page, the content example
 * and the explainer film: a sample brand launching a reusable bottle.
 * All values are illustrative sample data.
 */
export const sampleScenario = {
  brand: { en: "Sample brand · Reusable bottle", zh: "示例品牌·可重用水樽" },
  steps: [
    { en: "Brand context", zh: "品牌資料" },
    { en: "Content preparation", zh: "內容準備" },
    { en: "Human review", zh: "人手審閱" },
    { en: "Selected export", zh: "選定匯出" },
    { en: "Record", zh: "記錄" },
  ],
} satisfies { brand: L; steps: L[] };

export const platformLayers: PlatformLayer[] = [
  {
    id: "data",
    number: "01",
    name: { en: "Data & Knowledge", zh: "資料與知識" },
    question: { en: "What information is this based on?", zh: "這項工作根據甚麼資料？" },
    explanation: {
      en: "Each workflow uses a defined set of approved sources — brand facts, product records, answer libraries or permitted external data — with access configured per workflow rather than opened up by default.",
      zh: "每個流程只使用已界定的已確認來源，例如品牌資料、產品紀錄、答案庫或獲准使用的外部資料；存取權限按流程設定，而非預設全面開放。",
    },
    shows: {
      en: ["Source record", "Approved facts and claims", "Configured access per workflow"],
      zh: ["來源紀錄", "已確認的資料及宣稱", "按流程設定的存取權限"],
    },
    scenario: {
      label: { en: "Approved brand facts", zh: "已確認品牌資料" },
      items: {
        en: ["Product: 750 ml reusable bottle", "Double-wall stainless steel", "Colours: Harbour Blue, Stone, Lime", "No price supplied — do not mention price"],
        zh: ["產品：750 毫升可重用水樽", "雙層不銹鋼", "顏色：海港藍、石灰、青檸", "未提供價格——不得提及價錢"],
      },
    },
  },
  {
    id: "tasks",
    number: "02",
    name: { en: "Agentic Tasks & Tools", zh: "AI 任務與工具" },
    question: { en: "What work is prepared or executed?", zh: "哪些工作會被準備或執行？" },
    explanation: {
      en: "Named steps prepare the work using permitted tools: drafting, classifying, comparing, validating. Each step has a defined output and a list of actions it may and may not take.",
      zh: "以已命名的步驟，使用獲准的工具準備工作，例如草擬、分類、比較、驗證。每個步驟都有明確輸出，並列明可以及不可以採取的行動。",
    },
    shows: {
      en: ["Named steps", "Permitted tool actions", "Outputs prepared for review"],
      zh: ["已命名的步驟", "獲准的工具行動", "準備好供審閱的輸出"],
    },
    scenario: {
      label: { en: "Prepared work", zh: "準備好的工作" },
      items: {
        en: ["Draft Instagram caption (EN + 繁中)", "Draft store-invitation copy", "Visual direction: three colourway variants", "Check: no price, no unapproved claims"],
        zh: ["草擬 Instagram 文案（英文＋繁中）", "草擬門市邀請文案", "視覺方向：三款顏色版本", "檢查：沒有價錢、沒有未確認宣稱"],
      },
    },
  },
  {
    id: "approvals",
    number: "03",
    name: { en: "Approvals & Handoffs", zh: "批核與交接" },
    question: { en: "Where does my team decide?", zh: "團隊在哪裏作決定？" },
    explanation: {
      en: "People approve, correct or reject prepared work at the points you choose. Ownership is explicit: each handoff names who decides next, and editing an approved item sends it back for review.",
      zh: "由你決定在哪些環節由專人批准、修改或拒絕已準備的工作。責任清晰：每次交接都列明下一位決策人；已批准的內容一經修改，便會退回重新審閱。",
    },
    shows: {
      en: ["Reviewer action", "Correction or rejection", "Named owner for each handoff"],
      zh: ["審閱人的行動", "修改或拒絕", "每次交接的指定負責人"],
    },
    scenario: {
      label: { en: "Brand reviewer decision", zh: "品牌審閱人決定" },
      items: {
        en: ["Caption edited: tone softened", "Store invitation approved", "One visual variant returned: wrong colour name", "Owner: Brand Manager (sample)"],
        zh: ["文案已修改：語氣調整得更親切", "門市邀請已批准", "一款視覺版本被退回：顏色名稱錯誤", "負責人：品牌經理（示例）"],
      },
    },
  },
  {
    id: "records",
    number: "04",
    name: { en: "Records & Improvement", zh: "紀錄與改善" },
    question: { en: "What happened, and what can we improve?", zh: "發生了甚麼？有甚麼可以改善？" },
    explanation: {
      en: "The selected output is exported with its sources, review notes and exceptions. That record makes the work reusable and shows where the next iteration should improve.",
      zh: "選定的輸出連同來源、審閱意見及例外情況一併匯出。這份記錄令工作可以重用，亦顯示下一輪應改善的地方。",
    },
    shows: {
      en: ["Output reference", "Review history", "Exception record"],
      zh: ["輸出編號", "審閱歷史", "例外紀錄"],
    },
    scenario: {
      label: { en: "Export record", zh: "匯出紀錄" },
      items: {
        en: ["Exported: caption + invitation (sample file)", "Review notes attached", "Exception: colour name mismatch logged", "Next round: add colour names to the facts list"],
        zh: ["已匯出：文案＋邀請（示例檔案）", "附上審閱意見", "例外：已記錄顏色名稱不符", "下一輪：把顏色名稱加入資料清單"],
      },
    },
  },
];

export const integrationNotes: { title: L; copy: L }[] = [
  { title: { en: "Configured, not assumed", zh: "按需設定，而非預設" }, copy: { en: "Each connection — a CMS, CRM, messaging provider or data export — is scoped, configured and tested for a specific workflow. We do not assume every product already shares data, identity or orchestration.", zh: "每項串接（CMS、CRM、訊息供應商或資料匯出）都按特定流程界定、設定及測試。我們不會假設所有產品已共用資料、身份或流程協調。" } },
  { title: { en: "Read before write", zh: "先讀取，後寫入" }, copy: { en: "Most workflows start by reading approved sources and producing an export. Writing back to another system is a separate, explicitly approved step.", zh: "大部分流程先讀取已確認來源並產生匯出檔；寫回其他系統屬另一個需明確批准的步驟。" } },
  { title: { en: "Your systems stay yours", zh: "系統仍由你掌控" }, copy: { en: "Transactions, payments, customer messaging and CRM ownership remain in your existing platforms unless a connection is agreed.", zh: "除非另有協議，交易、付款、顧客訊息及 CRM 仍由你現有平台負責。" } },
  { title: { en: "Exports as a safe default", zh: "以匯出作為穩妥預設" }, copy: { en: "Where a connection is not yet available, the output is a labelled file your team can check and upload.", zh: "如暫未有串接，輸出會是已標示的檔案，由團隊檢查後自行上載。" } },
];

export const integrationTypes: { name: L; examples: L; mode: L }[] = [
  { name: { en: "Content management", zh: "內容管理" }, examples: { en: "Website CMS, product or listing records", zh: "網站 CMS、產品或物業資料紀錄" }, mode: { en: "Export by default; publishing when configured", zh: "預設匯出；設定後可發布" } },
  { name: { en: "Customer records", zh: "客戶紀錄" }, examples: { en: "CRM, enquiry inboxes, form submissions", zh: "CRM、查詢收件箱、表格提交" }, mode: { en: "Read and prepare; write-back scoped separately", zh: "讀取及準備；寫回需另行界定" } },
  { name: { en: "Messaging", zh: "訊息渠道" }, examples: { en: "WhatsApp Business via an approved provider, email", zh: "透過認可供應商的 WhatsApp Business、電郵" }, mode: { en: "Draft by default; sending only with approval rules", zh: "預設草擬；只在有批核規則時發送" } },
  { name: { en: "Analytics and listening data", zh: "分析及聆聽資料" }, examples: { en: "Licensed listening tools, analytics exports, supplied spreadsheets", zh: "授權聆聽工具、分析匯出、客戶提供的試算表" }, mode: { en: "Read only", zh: "只讀" } },
];

export const governancePrinciples: { title: L; copy: L }[] = [
  { title: { en: "Purpose before access", zh: "先有目的，後有權限" }, copy: { en: "A workflow gets the data and tools its defined purpose needs — nothing broader by default.", zh: "流程只獲取其既定目的所需的資料及工具，預設不會開放更多。" } },
  { title: { en: "People decide material outcomes", zh: "重要結果由人決定" }, copy: { en: "Publishing, sending, spending, sensitive data and exceptions sit with named people.", zh: "發布、發送、支出、敏感資料及例外情況，均由指定人員負責。" } },
  { title: { en: "Every change is visible", zh: "每項變更都清晰可見" }, copy: { en: "Drafts, edits, approvals, rejections and exports are recorded so the team can see what happened.", zh: "草稿、修改、批准、拒絕及匯出都有記錄，團隊可清楚知道發生了甚麼。" } },
  { title: { en: "Exceptions improve the system", zh: "從例外中改善" }, copy: { en: "Corrections and rejected items feed the next round of rules, facts and prompts.", zh: "修改及被拒絕的內容，會成為下一輪規則、資料及指示的改善依據。" } },
];

export const governanceBoundary: L = {
  en: "This page explains how FIMMICK designs configured workflows. It is not a security certification. Hosting, authentication, audit logging and compliance properties are confirmed per engagement in writing.",
  zh: "本頁說明 FIMMICK 如何設計已配置的流程，並非安全認證。託管、身份驗證、審計記錄及合規要求，會按每項合作以書面確認。",
};
