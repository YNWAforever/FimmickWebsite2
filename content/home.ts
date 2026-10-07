import type { L } from "@/lib/i18n";

export const hero = {
  eyebrow: { en: "FIMMICK Agentic AI Platform", zh: "FIMMICK 企業 AI 智能體平台" } as L,
  title: { en: "AI prepares the work. Your people decide.", zh: "AI 準備工作，由你的人決定。" } as L,
  /** The title split for display: the accent part is set in the editorial face (zh: emphasis marks). */
  titleLead: { en: "AI prepares the work.", zh: "AI 準備工作，" } as L,
  titleAccent: { en: "Your people decide.", zh: "由你的人決定。" } as L,
};

export const sections = {
  faq: { eyebrow: { en: "Questions", zh: "常見問題" }, title: { en: "What happens next?", zh: "接下來會怎樣？" }, other: { en: "Something else? Write to us and a member of the team replies by email.", zh: "還有其他問題？歡迎來信，團隊同事會以電郵回覆。" } },
} satisfies Record<string, { eyebrow: L; title: L; other?: L }>;

/**
 * Cinematic homepage copy. Short by design: the page shows outputs, evidence
 * and photographs first; detailed explanations live on the destination pages.
 */
export const cinema = {
  heroBody: {
    en: "Insight briefs, launch content, enquiry replies and page updates — drafted from your approved facts, reviewed by a named person, exported with a record.",
    zh: "AI 根據已確認的資料草擬，由指定的人審閱批准，匯出時連同紀錄。",
  } as L,
  heroCard: {
    label: { en: "Sample output · launch caption", zh: "示例成果·推出文案" } as L,
    /** The caption and its facts come from content/examples.ts (heroSample). */
    facts: { en: "Approved facts", zh: "已確認資料" } as L,
    approved: { en: "Approved by brand manager", zh: "品牌經理已批准" } as L,
    approve: { en: "Approve", zh: "批准" } as L,
    record: { en: "Record", zh: "紀錄" } as L,
    /** The one sample-data notice on the homepage; artefacts below carry a one-word "Sample" tag. */
    notice: { en: "Everything on this page runs on sample data — a made-up bottle brand, so you can see the workflow, not our clients.", zh: "本頁所有示例都用示例資料——一個虛構的水樽品牌，讓你看清流程，而不是我們客戶的資料。" } as L,
    ledger: [
      { role: "source", label: { en: "Facts", zh: "資料" } },
      { role: "work", label: { en: "Drafted", zh: "草擬" } },
      { role: "review", label: { en: "Approved", zh: "批准" } },
      { role: "result", label: { en: "Exported", zh: "匯出" } },
    ] as { role: "source" | "work" | "review" | "result"; label: L }[],
  },
  outputs: {
    eyebrow: { en: "Four business outputs", zh: "四項業務成果" } as L,
    title: { en: "See what you get before you read how it works.", zh: "先看成果，再講做法。" } as L,
    sample: { en: "Sample", zh: "示例" } as L,
    link: { en: "See the workflow", zh: "查看流程" } as L,
    names: {
      "market-intelligence": { en: "Insight brief", zh: "洞察簡報" },
      "content-production": { en: "Approved launch content", zh: "已批准的推出內容" },
      "customer-engagement": { en: "Routed enquiry", zh: "已分派的查詢" },
      "website-operations": { en: "Checked page update", zh: "已檢查的頁面更新" },
    } as Record<string, L>,
  },
  brief: {
    headline: { en: "Leaking lids are the top complaint", zh: "杯蓋漏水是最多人投訴的問題" } as L,
    aiso: { en: "AI answer to “Which bottle won’t leak in a bag?”", zh: "AI 回答「邊款水樽放袋唔會漏？」" } as L,
    notMentioned: { en: "Brand not mentioned", zh: "未有提及品牌" } as L,
    action: { en: "Priority: add a clear leak-proof statement to the product page", zh: "優先行動：在產品頁加入清晰的防漏說明" } as L,
  },
  content: {
    check: { en: "No price mentioned — none supplied", zh: "沒有提及價錢——未有提供" } as L,
    reviewer: { en: "Brand manager · edited tone, approved", zh: "品牌經理·調整語氣後批准" } as L,
  },
  enquiry: {
    received: { en: "Website form · 10:12", zh: "網站表格·10:12" } as L,
    routed: { en: "Routed to", zh: "分派給" } as L,
    waiting: { en: "Waiting for owner approval — nothing sent", zh: "等待負責人批准——未有發送" } as L,
  },
  record: {
    field: { en: "Care", zh: "保養" } as L,
    valid: { en: "Required fields complete", zh: "必填欄位齊全" } as L,
    publish: { en: "Publishes after editor approval", zh: "編輯批准後才發布" } as L,
  },
  evidence: {
    eyebrow: { en: "Case-study evidence", zh: "案例證據" } as L,
    title: { en: "Work we have delivered — and how we run our own.", zh: "為客戶做過的工作，我們自己也在用。" } as L,
    before: { en: "Before", zh: "以前" } as L,
    after: { en: "After", zh: "現在" } as L,
    read: { en: "Read the case", zh: "閱讀案例" } as L,
    note: {
      en: "We publish what we can stand behind: the work, who decided, and what changed. Numbers follow when a client signs them off.",
      zh: "我們只公開站得住腳的內容：做了甚麼、由誰決定、有甚麼改變。數字待客戶確認後才會公布。",
    } as L,
  },
  signature: {
    eyebrow: { en: "How every workflow runs", zh: "每個流程的運作方式" } as L,
    title: { en: "One workflow. Four moments. People decide.", zh: "一個流程，四個時刻，由人決定。" } as L,
    lead: { en: "One sample product launch, from approved facts to a recorded export.", zh: "一次示例新品推出，由已確認資料到有紀錄的匯出。" } as L,
    play: { en: "Play sequence", zh: "播放流程" } as L,
    pause: { en: "Pause sequence", zh: "暫停流程" } as L,
    showAll: { en: "Show all four", zh: "同時顯示四步" } as L,
    showOne: { en: "Step through", zh: "逐步查看" } as L,
    platformLink: { en: "How the platform coordinates this", zh: "平台如何協調這些工作" } as L,
    filmLink: { en: "Watch the 42-second film", zh: "觀看 42 秒短片" } as L,
    steps: [
      { id: "source", label: { en: "Input", zh: "輸入" }, title: { en: "Approved facts go in", zh: "放入已確認資料" }, note: { en: "The brand team lists what may be said, and what may not. Nothing else reaches the draft.", zh: "品牌團隊列出可以說和不可以說的內容，草稿不會用上其他資料。" } },
      { id: "work", label: { en: "Prepared work", zh: "準備好的工作" }, title: { en: "AI drafts in two languages", zh: "AI 草擬雙語內容" }, note: { en: "An English and a Traditional Chinese caption, each line traceable to the facts it used.", zh: "英文及繁體中文文案各一，每一句都能追溯到所用的資料。" } },
      { id: "review", label: { en: "Human review", zh: "人手審閱" }, title: { en: "A named person decides", zh: "由指定的人決定" }, note: { en: "The brand manager edits, approves or returns each item. Nothing moves until they do.", zh: "品牌經理逐項修改、批准或退回；未有決定，甚麼都不會發出。" } },
      { id: "result", label: { en: "Usable output", zh: "可用成果" }, title: { en: "Exported with its record", zh: "連紀錄一併匯出" }, note: { en: "Only approved items leave, with their sources, edits and the decision attached.", zh: "只有已批准的項目會匯出，並附上來源、修改及決定。" } },
    ] as { id: "source" | "work" | "review" | "result"; label: L; title: L; note: L }[],
    brief: { en: "Brief: launch post · Instagram · EN + 繁中", zh: "簡報：推出貼文·Instagram·英文＋繁中" } as L,
    linked: { en: "Uses only the listed facts", zh: "只使用所列資料" } as L,
    edit: { en: "Tone softened", zh: "語氣調整" } as L,
    captionOk: { en: "Caption approved", zh: "文案已批准" } as L,
    visualBack: { en: "Visual returned: colour named “Sky Blue” — should be Harbour Blue", zh: "視覺退回：顏色寫成「天藍」——應為海港藍" } as L,
    reviewer: { en: "Reviewer: brand manager (sample role)", zh: "審閱人：品牌經理（示例角色）" } as L,
    files: [
      { en: "caption-en.txt", zh: "caption-en.txt" },
      { en: "caption-zh-hant.txt", zh: "caption-zh-hant.txt" },
      { en: "review-record — sources, edits, decision", zh: "審閱紀錄——來源、修改、決定" },
    ] as L[],
    reuse: { en: "Kept for the next launch", zh: "留待下次推出重用" } as L,
  },
  pathways: {
    eyebrow: { en: "AI Transformation & Services", zh: "AI 轉型與專業服務" } as L,
    title: { en: "Plan the change — or bring in specialists.", zh: "規劃轉變，或直接找專家。" } as L,
    transformation: {
      label: { en: "AI Transformation", zh: "AI 轉型" } as L,
      title: { en: "For leaders planning the change", zh: "為規劃轉變的管理層而設" } as L,
      deliverable: { en: "Example deliverable: readiness heatmap", zh: "成果示例：準備度熱圖" } as L,
      cta: { en: "Discuss a transformation scope", zh: "討論轉型範圍" } as L,
    },
    services: {
      label: { en: "Services", zh: "專業服務" } as L,
      title: { en: "For teams that need specialists", zh: "為需要專家的團隊而設" } as L,
      body: { en: "Sixteen services with defined deliverables. No AIP subscription required.", zh: "十六項服務，各有明確交付成果；無須訂閱 AIP。" } as L,
      count: { en: "services", zh: "項服務" } as L,
      deliverable: { en: "Example deliverable: SEO fix list (sample)", zh: "成果示例：SEO 修正清單（示例）" } as L,
      cta: { en: "Discuss a service", zh: "討論服務" } as L,
    },
  },
  industries: {
    eyebrow: { en: "Industry application", zh: "行業應用" } as L,
    title: { en: "Same four jobs. Your sector’s rules.", zh: "同樣四項工作，按你行業的規矩。" } as L,
    all: { en: "All eight industries", zh: "全部八個行業" } as L,
  },
  ecosystem: {
    /** Short relationship tags; wording follows production (see design-decisions.md). */
    tags: {
      aip: { en: "Built and operated by FIMMICK", zh: "由 FIMMICK 建立及營運" },
      kocmax: { en: "Workflow layer for Adfocate", zh: "Adfocate 的流程層" },
      adfocate: { en: "FIMMICK business unit", zh: "FIMMICK 業務單位" },
      kinnso: { en: "Described by FIMMICK as its platform", zh: "FIMMICK 形容為旗下平台" },
      "50-add-oil": { en: "Described by FIMMICK as its platform", zh: "FIMMICK 形容為旗下平台" },
      eldage: { en: "Social enterprise incubated by FIMMICK", zh: "由 FIMMICK 培育的社會企業" },
    } as Record<string, L>,
    eyebrow: { en: "Built by FIMMICK", zh: "FIMMICK 建立的生態系統" } as L,
    title: { en: "What we build, we also run.", zh: "我們建立的，我們也在營運。" } as L,
  },
  resources: {
    eyebrow: { en: "Resources", zh: "資源中心" } as L,
    title: { en: "Take something you can use today.", zh: "挑一份資源，今天就用得上。" } as L,
    guide: { en: "Guide · PDF · 2 pages", zh: "指南·PDF·2 頁" } as L,
    guidePreview: { en: "First page of the guide", zh: "指南第一頁" } as L,
    article: { en: "Article", zh: "文章" } as L,
    workshop: { en: "Workshop · on request", zh: "工作坊·按需安排" } as L,
  },
  start: {
    you: { en: "Your team", zh: "你的團隊" } as L,
    us: { en: "FIMMICK", zh: "FIMMICK" } as L,
  },
  closing: {
    title: { en: "Tell us which work you want to improve.", zh: "想改善哪項工作？告訴我們。" } as L,
    body: {
      en: "We read every request and reply by email to set up a conversation. A time is fixed once we’ve both agreed it.",
      zh: "我們會細閱每一個要求，並以電郵回覆安排傾談；雙方確認後才會定下時間。",
    } as L,
  },
};

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
