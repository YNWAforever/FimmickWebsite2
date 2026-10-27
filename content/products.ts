import type { Product, ProductId } from "./types";

/**
 * AISO links to the available live readiness product. Other products retain
 * configuration availability and labelled illustrative workflows.
 */
export const products: Product[] = [
  {
    id: "social-listening",
    headlineAccent: { en: "conversation insight", zh: "社交討論洞察" },
    name: "AI Social Listening",
    descriptor: { en: "Source-linked conversation insight", zh: "附來源連結的社交討論洞察" },
    solution: "market-intelligence",
    availability: "discuss",
    exampleMode: "illustrative-sample",
    summary: {
      en: "Turns permitted public conversation about your brand and competitors into a source-linked insight brief.",
      zh: "把獲准使用的公開討論（品牌及競爭對手）整理成連結來源的洞察簡報。",
    },
    whoFor: { en: "Brand, marketing and insight teams who need evidence, not screenshots.", zh: "需要證據而非截圖的品牌、市場推廣及市場研究團隊。" },
    supportedActions: {
      en: ["Track defined topics, brands and competitors", "Group mentions into themes with sentiment notes", "Draft an insight brief with linked evidence", "Flag spikes for an analyst to review"],
      zh: ["追蹤已界定的話題、品牌及競爭對手", "把提及內容歸納成主題並附情緒觀察", "草擬附證據連結的洞察簡報", "標示討論急升情況供分析師審閱"],
    },
    exclusions: {
      en: ["Private groups or messages", "Measuring how AI assistants answer questions (that is AISO)", "Replying to or engaging with posts"],
      zh: ["私人群組或訊息", "量度 AI 助手如何回答問題（屬 AISO 範圍）", "回覆或互動貼文"],
    },
    dependencies: {
      en: ["Source coverage available through the licensed listening provider", "Agreed keyword and competitor set", "Analyst time for review"],
      zh: ["授權社交聆聽供應商可提供的來源覆蓋", "已確認的關鍵字及競爭對手組合", "分析師審閱時間"],
    },
    output: { en: "Insight brief with themes, evidence links, priority list and open questions.", zh: "包含主題、證據連結、優先清單及待確認問題的洞察簡報。" },
    workflow: [
      { title: { en: "Topic set", zh: "話題組合" }, copy: { en: "Brands, competitors, products and exclusions are agreed.", zh: "確認品牌、競爭對手、產品及排除字詞。" } },
      { title: { en: "Collection", zh: "收集" }, copy: { en: "Mentions are gathered from permitted sources for the period.", zh: "於指定期間從獲准來源收集提及內容。" } },
      { title: { en: "Themes and draft", zh: "主題與草稿" }, copy: { en: "AI groups themes and drafts the brief with links.", zh: "AI 歸納主題並草擬附連結的簡報。" } },
      { title: { en: "Analyst sign-off", zh: "分析師確認" }, copy: { en: "An analyst checks, edits and prioritises before sharing.", zh: "分析師檢查、修改及排序後才發出。" } },
    ],
    distinction: {
      en: "Social Listening measures what people say in public conversation. It is a different dataset from AI-search answers, which AISO reviews.",
      zh: "社交聆聽量度公開討論的內容，與 AISO 所檢視的 AI 搜尋答案屬不同資料。",
    },
    example: "intelligence",
    faqs: [
      { q: { en: "How is this different from the Social Listening service?", zh: "與社交聆聽服務有何分別？" }, a: { en: "The product prepares the evidence and draft brief. The service adds FIMMICK analysts who define scope, interpret results and present recommendations.", zh: "產品負責整理證據及草擬簡報；服務則加入 FIMMICK 分析師，負責界定範圍、解讀結果及提出建議。" } },
      { q: { en: "How often is a brief produced?", zh: "多久出一份簡報？" }, a: { en: "The cadence is agreed during configuration — commonly monthly, with ad-hoc alerts reviewed by an analyst.", zh: "頻率在配置時議定，一般為每月一次，另由分析師審閱不定期警示。" } },
    ],
    services: ["social-listening", "business-intelligence"],
  },
  {
    id: "aiso",
    headlineAccent: { en: "recommend your business?", zh: "推薦你的業務嗎？" },
    name: "AISO",
    descriptor: { en: "Can AI recommend your business?", zh: "AI 能推薦你的業務嗎？" },
    seoTitle: { en: "AISO — Website readiness for AI search", zh: "AISO — 網站 AI 搜尋準備度" },
    solution: "market-intelligence",
    availability: "available",
    exampleMode: "live-product",
    summary: {
      en: "Checks whether ChatGPT, Perplexity, Google AI, Claude and Gemini can find, read and quote your website.",
      zh: "檢查網站的 AI 搜尋準備度，了解 ChatGPT、Perplexity、Google AI、Claude 及 Gemini 能否找到、讀取及引用你的網站。",
    },
    whoFor: { en: "Marketing, SEO and web teams preparing their website for AI search. First scan free, with no sign-up or credit card required for the scan itself.", zh: "適合為網站準備 AI 搜尋的市場推廣、SEO 及網站團隊。首次掃描免費，掃描本身毋須註冊或信用卡。" },
    supportedActions: {
      en: ["Website readiness scans", "20-check score out of 100, with grades A+ to F", "Fix Pack: llms.txt, robots.txt patch and FAQ JSON-LD", "Prioritised fixes", "Score history per plan", "Client-attributed reports on Pro and above"],
      zh: ["網站準備度掃描", "20 項檢查、100 分制，評級由 A+ 至 F", "修正套件：llms.txt、robots.txt 修補及 FAQ JSON-LD", "按優先次序排列的修正建議", "按方案提供分數歷史", "Pro 或以上方案提供註明客戶的報告"],
    },
    exclusions: {
      en: ["Guaranteed rankings or citations", "Changing third-party AI systems", "Social conversation analysis — see Social Listening", "Treating readiness as live mention monitoring"],
      zh: ["保證排名或引用", "更改第三方 AI 系統", "社交討論分析 — 請參閱社交聆聽", "把準備度當作即時品牌提及監察"],
    },
    dependencies: {
      en: ["Ability to update your own website", "Public crawlability of the page", "A free account to save the result and Fix Pack"],
      zh: ["可更新自家網站", "頁面可供公開爬取", "儲存結果及修正套件需要免費帳戶"],
    },
    output: { en: "An AI-search readiness score, prioritised fixes and a Fix Pack. Scan → Fix → Track through re-scans.", zh: "AI 搜尋準備度分數、優先修正清單及修正套件。掃描 → 修正 → 重新掃描追蹤。" },
    workflow: [
      { title: { en: "Scan", zh: "掃描" }, copy: { en: "Enter a website URL. The scan evaluates an origin page across 20 readiness checks.", zh: "輸入網站網址，掃描會就來源頁面進行 20 項準備度檢查。" } },
      { title: { en: "Review", zh: "檢視" }, copy: { en: "Review the score, grade and prioritised fixes. Create a free account to save the result and Fix Pack.", zh: "檢視分數、評級及優先修正清單，建立免費帳戶以儲存結果及修正套件。" } },
      { title: { en: "Fix", zh: "修正" }, copy: { en: "Your web team reviews and applies the llms.txt, robots.txt patch and FAQ JSON-LD to your website.", zh: "由網站團隊審閱並在網站套用 llms.txt、robots.txt 修補及 FAQ JSON-LD。" } },
      { title: { en: "Track", zh: "追蹤" }, copy: { en: "Re-scan and compare score history within your plan. Score changes alone do not prove which change caused them.", zh: "重新掃描並按方案比較分數歷史；單憑分數變化不能證明由哪項改動造成。" } },
    ],
    distinction: {
      en: "AISO measures website readiness for AI search, not live mentions or assistant answers. It cannot guarantee that an assistant will recommend or cite your business.",
      zh: "AISO 量度網站的 AI 搜尋準備度，並非即時提及或助手答案；不能保證助手會推薦或引用你的業務。",
    },
    example: "intelligence",
    faqs: [
      { q: { en: "Is the first scan really free?", zh: "首次掃描真的免費嗎？" }, a: { en: "Yes. The scan itself needs no sign-up and no credit card. Create a free account to save your result and Fix Pack.", zh: "是。掃描本身毋須註冊或信用卡。儲存結果及修正套件則需要建立免費帳戶。" } },
      { q: { en: "What does the score measure?", zh: "分數量度甚麼？" }, a: { en: "20 checks in three areas total 100 points: Core 45, Extended 30 and GEO 25, with letter grades A+ to F. They assess whether your site is ready to be found, read and quoted by ChatGPT, Google AI, Perplexity, Claude and Gemini; they do not measure live mentions.", zh: "三個範疇共 20 項檢查，總分 100：Core 45、Extended 30、GEO 25，評級由 A+ 至 F。檢查網站是否準備好讓 ChatGPT、Google AI、Perplexity、Claude 及 Gemini 找到、讀取及引用，並非量度即時提及。" } },
      { q: { en: "What is in the Fix Pack?", zh: "修正套件包含甚麼？" }, a: { en: "llms.txt, a robots.txt patch and FAQ JSON-LD for your web team to review and apply. Pro adds Advanced Fix Packs.", zh: "包含 llms.txt、robots.txt 修補及 FAQ JSON-LD，供網站團隊審閱及套用。Pro 另有進階修正套件。" } },
      { q: { en: "Does a higher score guarantee citations?", zh: "分數提高是否保證獲引用？" }, a: { en: "No. Readiness is not a ranking or citation guarantee. A scan evaluates an origin page, and later score changes alone do not prove causation or a change in live AI answers.", zh: "不會。準備度不保證排名或引用。掃描評估來源頁面，之後的分數變化本身不能證明因果關係，亦不能證明即時 AI 答案有所改變。" } },
      { q: { en: "How does AISO differ from Social Listening?", zh: "AISO 與社交聆聽有何分別？" }, a: { en: "AISO checks your website’s readiness for AI search. Social Listening analyses public conversation about brands and competitors.", zh: "AISO 檢查網站的 AI 搜尋準備度；社交聆聽則分析品牌及競爭對手的公開討論。" } },
    ],
    services: ["seo-aeo"],
  },
  {
    id: "creativemax",
    headlineAccent: { en: "and visual variants", zh: "文案及視覺版本" },
    name: "CreativeMax",
    descriptor: { en: "Editable copy and visual variants", zh: "可編輯的文案及視覺版本" },
    solution: "content-production",
    availability: "discuss",
    exampleMode: "illustrative-sample",
    summary: {
      en: "Drafts editable copy and visuals from approved brand facts, recording every review before export.",
      zh: "根據已確認的品牌資料草擬可編輯的文案及視覺，並在匯出前記錄每次審閱。",
    },
    whoFor: { en: "Brand and content teams producing recurring campaign, product and social content.", zh: "需要經常製作宣傳、產品及社交內容的品牌及內容團隊。" },
    supportedActions: {
      en: ["Draft copy variants per channel format", "Prepare visual directions or generated variants", "Show source facts beside each draft", "Record review, edits and selected exports"],
      zh: ["按渠道格式草擬文案版本", "準備視覺方向或生成視覺版本", "在每份草稿旁列出來源資料", "記錄審閱、修改及選定的匯出內容"],
    },
    exclusions: {
      en: ["Publishing to channels", "Media buying", "Making claims that are not in the approved facts"],
      zh: ["發布到各渠道", "媒體採購", "作出已確認資料以外的宣稱"],
    },
    dependencies: {
      en: ["Approved product facts and brand rules", "A named reviewer", "Agreed channel formats"],
      zh: ["已確認的產品資料及品牌規範", "指定審閱人", "已確認的渠道格式"],
    },
    output: { en: "Reviewed copy and visual variants in a labelled export.", zh: "已審閱的文案及視覺版本，以已標示的匯出檔提供。" },
    workflow: [
      { title: { en: "Brief", zh: "簡報" }, copy: { en: "Campaign goal, audience and formats.", zh: "宣傳目標、受眾及格式。" } },
      { title: { en: "Draft", zh: "草稿" }, copy: { en: "Variants prepared from approved facts.", zh: "根據已確認資料準備不同版本。" } },
      { title: { en: "Review", zh: "審閱" }, copy: { en: "Edit, approve or return; edits reset approval.", zh: "修改、批准或退回；修改後須重新批准。" } },
      { title: { en: "Export", zh: "匯出" }, copy: { en: "Selected items exported with history.", zh: "選定內容連同記錄一併匯出。" } },
    ],
    distinction: {
      en: "CreativeMax prepares and organises content for review. Publishing, scheduling and media buying stay with your team or the relevant service.",
      zh: "CreativeMax 負責準備及整理內容供審閱；發布、排程及媒體採購仍由你的團隊或相關服務處理。",
    },
    example: "content",
    faqs: [
      { q: { en: "Can we edit the drafts?", zh: "可以修改草稿嗎？" }, a: { en: "Yes — every draft is editable. Editing an approved draft returns it to review so the record stays accurate.", zh: "可以，每份草稿都能修改；已批准的草稿一經修改便會退回審閱，確保記錄準確。" } },
      { q: { en: "What does the export contain?", zh: "匯出檔包含甚麼？" }, a: { en: "The selected copy, the source facts used, the review status and the reviewer’s notes.", zh: "選定的文案、所用的來源資料、審閱狀態及審閱人備註。" } },
    ],
    services: ["content-creative", "digitalmarketing"],
  },
  {
    id: "whatsapp-aigc",
    headlineAccent: { en: "content workflow", zh: "內容流程" },
    name: "WhatsApp AIGC",
    descriptor: { en: "Material-submission content workflow", zh: "素材提交內容流程" },
    solution: "content-production",
    availability: "discuss",
    exampleMode: "illustrative-sample",
    summary: {
      en: "Turns photos and details that participants send on WhatsApp into content drafts for review.",
      zh: "把參與者透過 WhatsApp 提交的相片及資料，整理成供審閱的內容草稿。",
    },
    whoFor: { en: "Brands that collect content materials from many people in the field.", zh: "需要從前線多人收集內容素材的品牌。" },
    supportedActions: {
      en: ["Receive submitted materials through a configured number", "Check submissions against required fields", "Prepare content drafts from the materials", "Queue drafts for brand review"],
      zh: ["透過已設定的號碼接收提交素材", "按必填項目檢查提交內容", "根據素材準備內容草稿", "把草稿排入品牌審閱隊列"],
    },
    exclusions: {
      en: ["Customer-service chat or enquiry replies", "Broadcast marketing messages", "Publishing without review"],
      zh: ["客戶服務對話或查詢回覆", "群發推廣訊息", "未經審閱即發布"],
    },
    dependencies: {
      en: ["A configured WhatsApp Business number and provider", "Participant consent and submission rules", "A brand reviewer"],
      zh: ["已設定的 WhatsApp Business 號碼及供應商", "參與者同意及提交規則", "品牌審閱人"],
    },
    output: { en: "Review-ready content drafts linked to the submitted materials.", zh: "連結提交素材、可供審閱的內容草稿。" },
    workflow: [
      { title: { en: "Submit", zh: "提交" }, copy: { en: "Participants send photos and details.", zh: "參與者傳送相片及資料。" } },
      { title: { en: "Check", zh: "檢查" }, copy: { en: "Missing fields are requested, not invented.", zh: "缺漏項目會要求補交，不會自行虛構。" } },
      { title: { en: "Draft", zh: "草擬" }, copy: { en: "Content is prepared from the materials.", zh: "根據素材準備內容。" } },
      { title: { en: "Review", zh: "審閱" }, copy: { en: "The brand team approves or returns.", zh: "品牌團隊批准或退回。" } },
    ],
    distinction: {
      en: "WhatsApp AIGC is a content workflow for incoming materials. It is not a customer-service chatbot — enquiry and notification journeys belong to the WhatsApp Automation service.",
      zh: "WhatsApp AIGC 是處理傳入素材的內容流程，並不是客戶服務聊天機械人；查詢及通知流程屬 WhatsApp 自動化服務。",
    },
    example: "content",
    faqs: [
      { q: { en: "Is this a chatbot?", zh: "這是聊天機械人嗎？" }, a: { en: "No. It receives materials and prepares content drafts. Customer conversations are handled through the separate WhatsApp Automation service.", zh: "不是。它負責接收素材並準備內容草稿；顧客對話由另一項 WhatsApp 自動化服務處理。" } },
    ],
    services: ["content-creative", "koc-community"],
  },
  {
    id: "customer-ops",
    headlineAccent: { en: "and next tasks", zh: "下一步工作" },
    name: "Customer Ops",
    descriptor: { en: "Enquiry records, owners and next tasks", zh: "查詢紀錄、負責人及下一步工作" },
    solution: "customer-engagement",
    availability: "discuss",
    exampleMode: "illustrative-sample",
    summary: {
      en: "Each enquiry gets a proposed owner, a draft reply from approved answers, and a next task.",
      zh: "每個查詢都會有建議負責人、根據已確認答案草擬的回覆，以及下一步工作。",
    },
    whoFor: { en: "Sales, service and admin teams handling enquiries from several channels.", zh: "處理多渠道查詢的銷售、客戶服務及行政團隊。" },
    supportedActions: {
      en: ["Create one record per enquiry", "Suggest intent, owner and priority", "Draft a response from approved answers", "Track the next task and follow-up date"],
      zh: ["每個查詢建立一份紀錄", "建議查詢意圖、負責人及優先次序", "根據已確認答案草擬回覆", "追蹤下一步工作及跟進日期"],
    },
    exclusions: {
      en: ["Sending messages without an approved, configured channel", "Changing CRM records without a configured connection", "Handling categories you mark as human-only"],
      zh: ["未經批准及設定渠道即發送訊息", "未經設定串接即更改 CRM 紀錄", "處理你標示為只限專人處理的類別"],
    },
    dependencies: {
      en: ["Access to enquiry sources", "Routing rules and owners", "Approved answer library"],
      zh: ["可存取查詢來源", "分派規則及負責人", "已確認的答案庫"],
    },
    output: { en: "Enquiry record: owner, proposed response, next task and history.", zh: "查詢紀錄：負責人、建議回覆、下一步工作及歷史記錄。" },
    workflow: [
      { title: { en: "Capture", zh: "記錄" }, copy: { en: "One record per enquiry.", zh: "每個查詢一份紀錄。" } },
      { title: { en: "Propose", zh: "建議" }, copy: { en: "Owner, priority and draft response.", zh: "負責人、優先次序及回覆草稿。" } },
      { title: { en: "Decide", zh: "決定" }, copy: { en: "Owner edits and approves.", zh: "負責人修改及批准。" } },
      { title: { en: "Follow up", zh: "跟進" }, copy: { en: "Next task tracked to close.", zh: "追蹤下一步直至完成。" } },
    ],
    distinction: {
      en: "Preparing a response is different from sending it, and recording a next task is different from updating a CRM. Each action is configured and approved separately.",
      zh: "準備回覆不等於發送回覆；記錄下一步工作亦不等於更新 CRM。每項行動均需分別設定及批准。",
    },
    example: "follow-up",
    faqs: [
      { q: { en: "Can it work with our CRM?", zh: "可以配合我們的 CRM 嗎？" }, a: { en: "It can run alongside one. Writing to a CRM is a configured connection that we scope and test with you.", zh: "可以並行使用；寫入 CRM 屬需與你一同界定及測試的配置串接。" } },
    ],
    services: ["crm-sales", "customer-experience", "whatsapp-automation"],
  },
  {
    id: "website-cms",
    headlineAccent: { en: "to reviewed page updates", zh: "經審閱的頁面更新" },
    name: "Website / CMS",
    descriptor: { en: "Structured records to reviewed page updates", zh: "由結構化紀錄到經審閱的頁面更新" },
    solution: "website-operations",
    availability: "discuss",
    exampleMode: "illustrative-sample",
    summary: {
      en: "Ties page content to structured records, previews each change and logs who approved it.",
      zh: "令頁面內容與結構化紀錄保持一致，預覽每次更新，並記錄批核人。",
    },
    whoFor: { en: "Teams maintaining product, property, service or location pages.", zh: "負責維護產品、物業、服務或分店頁面的團隊。" },
    supportedActions: {
      en: ["Validate structured records", "Draft page copy from record fields", "Show before/after field changes", "Export or publish approved updates through a configured CMS"],
      zh: ["驗證結構化紀錄", "根據紀錄欄位草擬頁面文字", "顯示欄位更新前後對照", "透過已設定的 CMS 匯出或發布已批准更新"],
    },
    exclusions: {
      en: ["Inventory, payment, refund or order management", "Publishing without an approval rule", "Inventing missing field values"],
      zh: ["庫存、付款、退款或訂單管理", "未設批核規則即發布", "虛構缺漏的欄位資料"],
    },
    dependencies: {
      en: ["A structured data source", "Page templates", "CMS access if publishing is in scope"],
      zh: ["結構化資料來源", "頁面範本", "如包括發布，需可存取 CMS"],
    },
    output: { en: "Validated record, reviewed page update, preview/export and change history.", zh: "已驗證紀錄、經審閱的頁面更新、預覽／匯出檔及變更紀錄。" },
    workflow: [
      { title: { en: "Record", zh: "紀錄" }, copy: { en: "Change the source record.", zh: "更新來源紀錄。" } },
      { title: { en: "Validate", zh: "驗證" }, copy: { en: "Rules checked, gaps flagged.", zh: "檢查規則，標示缺漏。" } },
      { title: { en: "Review", zh: "審閱" }, copy: { en: "Before/after and preview approved.", zh: "批核更新前後對照及預覽。" } },
      { title: { en: "Export", zh: "匯出" }, copy: { en: "Export or publish with history.", zh: "匯出或發布並保留紀錄。" } },
    ],
    distinction: {
      en: "Website / CMS manages content accuracy. It does not run your shop’s transactions.",
      zh: "Website / CMS 負責內容準確性，不處理網店交易。",
    },
    example: "website-ops",
    faqs: [
      { q: { en: "Do we need a new CMS?", zh: "需要換新的 CMS 嗎？" }, a: { en: "Not necessarily. We check whether your current CMS can receive updates; otherwise the output is an export.", zh: "未必。我們會檢查現有 CMS 能否接收更新；如不能，輸出會以匯出檔形式提供。" } },
    ],
    services: ["ecommerce-growth", "workflow-automation", "data-hub"],
  },
];

export const productById = (id: ProductId) => products.find((p) => p.id === id)!;
