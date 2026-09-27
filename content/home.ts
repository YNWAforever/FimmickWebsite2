import type { L } from "@/lib/i18n";

export const hero = {
  eyebrow: { en: "FIMMICK Agentic AI Platform", zh: "FIMMICK 企業 AI 智能體平台" } as L,
  title: { en: "Put AI into real business work.", zh: "把 AI 用在真正的業務工作。" } as L,
  body: {
    en: "Connect business data, AI tools and human approvals across market intelligence, content creation, customer follow-up and website operations.",
    zh: "串連業務資料、AI 工具與人手審批，支援市場洞察、內容製作、客戶跟進及網站營運。",
  } as L,
  support: {
    en: "Start with one defined workflow. Add the products, connections and support it needs.",
    zh: "先從一項清楚的工作開始，按需要加入產品、系統串接與支援。",
  } as L,
};

/** Flow motif labels used by the hero scene and infographics. */
export const flowStages: { id: "source" | "work" | "review" | "result"; label: L; caption: L }[] = [
  { id: "source", label: { en: "Source", zh: "來源" }, caption: { en: "Approved brand facts", zh: "已確認品牌資料" } },
  { id: "work", label: { en: "Prepared work", zh: "準備好的工作" }, caption: { en: "Drafts in two languages", zh: "雙語草稿" } },
  { id: "review", label: { en: "Human decision", zh: "人手決定" }, caption: { en: "Edited and approved", zh: "修改後批准" } },
  { id: "result", label: { en: "Usable result", zh: "可用成果" }, caption: { en: "Export with record", zh: "連記錄匯出" } },
];

export const sections = {
  chooseWork: { eyebrow: { en: "Choose the work", zh: "選擇工作" }, title: { en: "Four business jobs. Each ends in something you can use.", zh: "四項業務工作，每一項都有可用的成果。" } },
  inspect: { eyebrow: { en: "Inspect an example", zh: "查看示例" }, title: { en: "See the input, the prepared work, the review and the output.", zh: "看清輸入、準備好的工作、審閱及輸出。" } },
  cases: { eyebrow: { en: "Case studies", zh: "成功案例" }, title: { en: "Work we have delivered — and how we run our own.", zh: "我們交付過的工作，以及我們如何營運自己。" } },
  platform: { eyebrow: { en: "The platform", zh: "平台" }, title: { en: "Four layers coordinate repeatable work.", zh: "以四個層面協調可重複的工作。" } },
  change: { eyebrow: { en: "AI Transformation & Services", zh: "AI 轉型與專業服務" }, title: { en: "Plan the change. Or bring in specialists for a defined job.", zh: "規劃轉變，或為明確的工作引入專家。" } },
  industries: { eyebrow: { en: "Industry application", zh: "行業應用" }, title: { en: "The same products, configured for your sector.", zh: "同一套產品，按你的行業配置。" } },
  ecosystem: { eyebrow: { en: "Built by FIMMICK", zh: "FIMMICK 建立的生態系統" }, title: { en: "Platforms, communities and ventures we build and run.", zh: "我們建立及營運的平台、社群與項目。" } },
  resources: { eyebrow: { en: "Resources", zh: "資源中心" }, title: { en: "Learn, inspect and download.", zh: "學習、查看及下載。" } },
  start: { eyebrow: { en: "How to start", zh: "如何開始" }, title: { en: "Choose how much you want FIMMICK to do.", zh: "選擇由 FIMMICK 承擔多少工作。" } },
  faq: { eyebrow: { en: "Questions", zh: "常見問題" }, title: { en: "What happens next?", zh: "接下來會怎樣？" } },
} satisfies Record<string, { eyebrow: L; title: L }>;

export const startOptions: { id: "product" | "deployment" | "managed"; title: L; forWho: L; includes: L<string[]>; youProvide: L; cta: L; intent: string }[] = [
  {
    id: "product",
    title: { en: "Use a product", zh: "使用產品" },
    forWho: { en: "Your team runs the workflow; FIMMICK configures the product.", zh: "由你的團隊運作流程；FIMMICK 負責配置產品。" },
    includes: { en: ["One product configured for one workflow", "Approved inputs and review step set up", "Onboarding for your reviewers"], zh: ["為一個流程配置一個產品", "設定已確認輸入及審閱步驟", "為審閱人提供上手培訓"] },
    youProvide: { en: "A workflow owner, approved facts and reviewers.", zh: "流程負責人、已確認資料及審閱人。" },
    cta: { en: "Discuss configuration", zh: "討論配置方案" },
    intent: "configuration",
  },
  {
    id: "deployment",
    title: { en: "Deployment support", zh: "部署支援" },
    forWho: { en: "FIMMICK designs the workflow and connections with you, then hands over.", zh: "FIMMICK 與你一同設計流程及串接，然後移交。" },
    includes: { en: ["Workflow and approval design", "Connections or export routines", "Testing with real examples and handover"], zh: ["流程及批核設計", "系統串接或匯出程序", "以真實例子測試及移交"] },
    youProvide: { en: "System access, data owners and time for testing.", zh: "系統存取權、資料負責人及測試時間。" },
    cta: { en: "Discuss a deployment", zh: "討論部署" },
    intent: "deployment",
  },
  {
    id: "managed",
    title: { en: "Managed operations", zh: "託管營運" },
    forWho: { en: "FIMMICK runs the workflow day to day; your team approves.", zh: "FIMMICK 負責日常運作流程；由你的團隊批核。" },
    includes: { en: ["FIMMICK specialists operate the workflow", "Agreed review cadence and reporting", "Ongoing improvement"], zh: ["由 FIMMICK 專家運作流程", "議定的審閱周期及報告", "持續改善"] },
    youProvide: { en: "Approvers and a clear definition of a good output.", zh: "批核人及清晰的合格輸出定義。" },
    cta: { en: "Discuss managed operations", zh: "討論託管營運" },
    intent: "managed",
  },
];

export const homeFaqs: { q: L; a: L }[] = [
  { q: { en: "Is FIMMICK a software company or an agency?", zh: "FIMMICK 是軟件公司還是代理？" }, a: { en: "Both parts are real. FIMMICK AIP and six products handle defined business jobs; transformation and specialist services add people when you need them. You can buy a service without an AIP subscription.", zh: "兩者皆是。FIMMICK AIP 及六個產品負責明確的業務工作；需要人手時，轉型及專業服務可提供支援。你亦可以只購買服務，無須訂閱 AIP。" } },
  { q: { en: "Are the examples on this site real customer data?", zh: "網站上的示例是真實客戶資料嗎？" }, a: { en: "No. Every interactive example is labelled as an illustrative sample. It shows how the workflow behaves; it does not run AI on your data or send anything.", zh: "不是。所有互動示例都標示為示例，只展示流程如何運作，不會以你的資料運行 AI，亦不會發送任何內容。" } },
  { q: { en: "What happens after I send an enquiry?", zh: "提交查詢後會怎樣？" }, a: { en: "A FIMMICK team member reviews it and replies by email to arrange a conversation. A request is not a confirmed meeting until we agree a time with you.", zh: "FIMMICK 同事會審閱你的查詢，並以電郵回覆安排傾談。在與你確認時間前，提交的要求並不等於已確認會面。" } },
  { q: { en: "How long does a first workflow take?", zh: "第一個流程需要多久？" }, a: { en: "It depends on the workflow, the data and your review capacity. We agree scope and timing before starting and do not promise a fixed timeline in advance.", zh: "視乎流程、資料及你的審閱能力而定。我們會在開始前議定範圍及時間，不會預先承諾固定時間表。" } },
  { q: { en: "Do you work outside Hong Kong?", zh: "你們在香港以外有業務嗎？" }, a: { en: "FIMMICK is headquartered in Hong Kong with an office in Taiwan and contact points for Singapore, Mainland China, the UK and the UAE.", zh: "FIMMICK 總部設於香港，在台灣設有辦事處，並為新加坡、中國內地、英國及阿聯酋設有聯絡點。" } },
];
