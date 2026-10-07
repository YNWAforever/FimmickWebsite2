import type { L } from "@/lib/i18n";
import type { ExampleId, IndustryId, ProductId, ServiceId, SolutionId, TitledCopy } from "./types";
import type { FunctionId } from "./functions";

/**
 * Platform sub-pages: capabilities, AI agents & tasks, workflow templates,
 * architecture and the pricing approach. Qualitative only — no counts,
 * uptime, savings or price figures are published without evidence.
 */

const tc = (enT: string, zhT: string, enC: string, zhC: string): TitledCopy => ({ title: { en: enT, zh: zhT }, copy: { en: enC, zh: zhC } });

/* ------------------------------------------------------------------ */
/* Capabilities (/platform/<capability>)                               */
/* ------------------------------------------------------------------ */

export type CapabilityId = "intelligence" | "data-analysis" | "creative-studio" | "marketing-strategy" | "workflow-automation";

export type Capability = {
  id: CapabilityId;
  name: L;
  eyebrow: L;
  title: L;
  /** Phrase inside `title` set as the H1 accent (award pass 3). */
  titleAccent: L;
  intro: L;
  principle: L;
  steps: TitledCopy[];
  changes: L<string[]>;
  boundaries: L<string[]>;
  solution?: SolutionId;
  services: ServiceId[];
  products: ProductId[];
  functions: FunctionId[];
  industries: IndustryId[];
  example?: ExampleId;
};

export const capabilities: Capability[] = [
  {
    id: "intelligence",
    name: { en: "Market intelligence", zh: "市場情報" },
    eyebrow: { en: "Signals into priorities", zh: "由訊號到優先事項" },
    title: { en: "See the shift before it becomes the story.", zh: "在變化成為話題之前看見它。" },
    titleAccent: { en: "before it becomes the story.", zh: "在變化成為話題之前" },
    intro: {
      en: "Turn scattered market, competitor, search and conversation signals into a regular brief your team can act on — with sources attached and people deciding what matters.",
      zh: "把分散的市場、競爭對手、搜尋及對話訊號，整理成團隊可以據此行動的定期簡報——附上來源，並由人決定甚麼才重要。",
    },
    principle: {
      en: "The workflow monitors approved sources, explains what changed and routes only material signals to the people who can act on them.",
      zh: "流程監察已確認的來源、說明有何改變，並只把重要訊號轉交有權行動的人。",
    },
    steps: [
      tc("Observe", "觀察", "Track approved market, brand, competitor, search and conversation sources.", "追蹤已確認的市場、品牌、競爭對手、搜尋及對話來源。"),
      tc("Classify", "分類", "Link signals to topics, audiences, markets and your priorities.", "把訊號連繫至話題、受眾、市場及你的優先事項。"),
      tc("Interpret", "解讀", "Explain what moved, how confident the reading is and why it may matter.", "說明有何變動、判斷的可信程度，以及可能的影響。"),
      tc("Route", "轉交", "Send a brief or alert to the named owner, who decides the response.", "把簡報或提示交給指定負責人，由其決定如何回應。"),
    ],
    changes: {
      en: ["Earlier awareness of category and competitor moves", "Briefs that cite their sources", "One shared evidence base across markets", "Less time assembling monitoring reports"],
      zh: ["更早察覺品類及競爭對手動向", "列明來源的簡報", "各市場共用的證據基礎", "減少整理監察報告的時間"],
    },
    boundaries: {
      en: ["Uses licensed or permitted sources only", "Does not respond publicly on your behalf", "Confidence is stated; conclusions are validated by people"],
      zh: ["只使用已授權或獲准的來源", "不會代你公開回應", "列明可信程度，結論由人核實"],
    },
    solution: "market-intelligence",
    services: ["social-listening", "seo-aeo", "business-intelligence"],
    products: ["social-listening", "aiso"],
    functions: ["expansion", "growth", "executive"],
    industries: ["beauty-luxury", "food-beverage", "retail-ecommerce"],
    example: "intelligence",
  },
  {
    id: "data-analysis",
    name: { en: "Data analysis & reporting", zh: "數據分析與報告" },
    eyebrow: { en: "Metrics that lead somewhere", zh: "有方向的數據" },
    title: { en: "Every metric should lead to a decision.", zh: "每個指標都應指向一個決定。" },
    titleAccent: { en: "lead to a decision.", zh: "指向一個決定" },
    intro: {
      en: "Connect campaign, CRM, commerce and operational exports so teams receive explanations, anomalies and next questions — not another reporting queue.",
      zh: "連繫宣傳、CRM、電商及營運資料，讓團隊得到解釋、異常提示及下一步要問的問題，而不是另一條報告輪候隊伍。",
    },
    principle: {
      en: "Analysis follows agreed definitions, shows its method and sources, and leaves material interpretation to your analysts and owners.",
      zh: "分析按議定的定義進行，列明方法及來源，重要的解讀交由你的分析員及負責人判斷。",
    },
    steps: [
      tc("Connect", "連接", "Bring approved performance and commercial exports into one analysis workspace.", "把已批准的成效及商業資料匯入同一個分析工作區。"),
      tc("Reconcile", "核對", "Apply the agreed definitions, time windows and market context.", "套用議定的定義、時段及市場背景。"),
      tc("Explain", "解釋", "Flag anomalies and describe the likely drivers, with the evidence.", "標示異常並說明可能成因，附上證據。"),
      tc("Recommend", "建議", "Prepare next questions and actions for an owner to accept or reject.", "準備下一步問題及行動，由負責人接受或拒絕。"),
    ],
    changes: {
      en: ["Faster weekly and monthly reporting", "Consistent KPI definitions across teams", "Anomalies explained, not just charted", "More analyst time for judgement"],
      zh: ["更快完成每週及每月報告", "各團隊採用一致的 KPI 定義", "解釋異常，而不只是繪圖", "分析員有更多時間作判斷"],
    },
    boundaries: {
      en: ["Reads data; does not change source systems", "Figures are traceable to a named export", "Financial and forecast decisions stay with owners"],
      zh: ["只讀取資料，不會更改來源系統", "數字可追溯至指定匯出檔", "財務及預測決定由負責人作出"],
    },
    services: ["business-intelligence", "data-hub"],
    products: [],
    functions: ["finance", "executive", "operations"],
    industries: ["retail-ecommerce", "financial-services", "b2b-professional-services"],
  },
  {
    id: "creative-studio",
    name: { en: "Creative studio", zh: "創意工作室" },
    eyebrow: { en: "Creative operations", zh: "創意營運" },
    title: { en: "Scale expression. Keep the brand human.", zh: "擴大創作規模，保留品牌的人味。" },
    titleAccent: { en: "Keep the brand human.", zh: "保留品牌的人味" },
    intro: {
      en: "Turn insight and brand rules into multilingual briefs, concepts, copy and variants — with human taste and approval at every publishable step.",
      zh: "把洞察及品牌規範轉化為多語言簡報、概念、文案及版本——每個可發布的步驟都由人把關及批准。",
    },
    principle: {
      en: "The system generates options from approved context; people direct the idea, set the standard and own what goes live.",
      zh: "系統根據已確認的資料產生選項；由人主導創意、訂立標準，並對發布內容負責。",
    },
    steps: [
      tc("Ground", "定調", "Combine the objective, audience insight, brand system and channel formats.", "結合目標、受眾洞察、品牌系統及渠道格式。"),
      tc("Explore", "構思", "Prepare distinct creative territories and message angles, not random volume.", "準備不同的創意方向及訊息角度，而非隨機大量產出。"),
      tc("Produce", "製作", "Draft coordinated copy and visual directions for each channel and language.", "為每個渠道及語言草擬協調一致的文案及視覺方向。"),
      tc("Review and learn", "審閱及學習", "Reviewers approve, edit or return; decisions feed the next round.", "由審閱人批准、修改或退回；決定會用於改善下一輪。"),
    ],
    changes: {
      en: ["More strategically distinct options per brief", "Faster multilingual production", "Consistent brand and claims review", "Review decisions reused in the next cycle"],
      zh: ["每份簡報有更多具策略差異的選項", "更快完成多語言製作", "一致的品牌及宣稱審閱", "審閱決定可用於下一輪"],
    },
    boundaries: {
      en: ["Nothing is published without approval", "Only facts from the approved list are used", "Talent, music and image rights are cleared by people"],
      zh: ["未經批准不會發布任何內容", "只使用已確認清單內的資料", "肖像、音樂及圖像版權由人負責處理"],
    },
    solution: "content-production",
    services: ["content-creative", "digitalmarketing", "koc-community"],
    products: ["creativemax"],
    functions: ["growth", "expansion"],
    industries: ["beauty-luxury", "food-beverage", "retail-ecommerce"],
    example: "content",
  },
  {
    id: "marketing-strategy",
    name: { en: "Marketing strategy & planning", zh: "市場策略與規劃" },
    eyebrow: { en: "Plans that stay alive", zh: "持續更新的計劃" },
    title: { en: "Turn strategy into an operating rhythm.", zh: "把策略變成有節奏的日常運作。" },
    titleAccent: { en: "an operating rhythm.", zh: "有節奏的日常運作" },
    intro: {
      en: "Coordinate audiences, channels, content, timing and budget around one measurable business priority — and keep the plan current as evidence arrives.",
      zh: "圍繞一個可衡量的業務重點，協調受眾、渠道、內容、時間及預算，並在新證據出現時更新計劃。",
    },
    principle: {
      en: "Assumptions stay visible. The workflow watches the evidence and proposes changes; your team decides what to change.",
      zh: "假設清晰可見。流程觀察證據並提出修改建議，由你的團隊決定是否修改。",
    },
    steps: [
      tc("Frame", "界定", "Agree the objective, constraints, audience, market and success measures.", "議定目標、限制、受眾、市場及成功指標。"),
      tc("Model", "分析", "Map demand signals, journey friction, channel roles and trade-offs.", "梳理需求訊號、顧客旅程障礙、渠道角色及取捨。"),
      tc("Plan", "規劃", "Prepare an action plan with owners, timing, approvals and measures.", "準備列明負責人、時間、批核及指標的行動計劃。"),
      tc("Adapt", "調整", "Review results on a set rhythm and propose evidence-based changes.", "按固定節奏檢視結果，並提出有證據支持的修改。"),
    ],
    changes: {
      en: ["One view of the customer journey", "Faster response to market movement", "Clear channel and team responsibilities", "Strategy linked directly to measurement"],
      zh: ["對顧客旅程有統一的認知", "更快回應市場變化", "渠道及團隊責任清晰", "策略與衡量指標直接連繫"],
    },
    boundaries: {
      en: ["Budget changes are proposed, never made", "Assumptions and sources are listed", "Planning decisions stay with your team"],
      zh: ["只建議預算變動，不會自行更改", "列明假設及來源", "規劃決定由你的團隊作出"],
    },
    services: ["digitalmarketing", "marketing-automation", "koc-community"],
    products: ["social-listening", "creativemax"],
    functions: ["growth", "executive"],
    industries: ["retail-ecommerce", "hospitality-travel", "food-beverage"],
  },
  {
    id: "workflow-automation",
    name: { en: "Workflow automation", zh: "流程自動化" },
    eyebrow: { en: "Multi-step workflows", zh: "多步驟流程" },
    title: { en: "Remove the queue. Keep the judgement.", zh: "減少輪候，保留判斷。" },
    titleAccent: { en: "Keep the judgement.", zh: "保留判斷" },
    intro: {
      en: "Redesign recurring work as visible workflows with approved inputs, clear owners, escalation rules and people deciding where it matters.",
      zh: "把重複工作重新設計為清晰可見的流程：輸入已確認、負責人清楚、設有轉交規則，重要環節由人決定。",
    },
    principle: {
      en: "Automation that knows when to stop: every flow separates repeatable steps from exceptions, material decisions and moments that need care.",
      zh: "懂得停下來的自動化：每個流程都把可重複的步驟，與例外、重要決定及需要細心處理的時刻分開。",
    },
    steps: [
      tc("Map", "梳理", "Document triggers, inputs, handoffs, decisions, exceptions and service standards.", "記錄觸發點、輸入、交接、決定、例外及服務標準。"),
      tc("Design", "設計", "Assign AI tasks and human owners around a defined output.", "圍繞明確的輸出，分配 AI 任務及人手負責人。"),
      tc("Connect", "連接", "Connect approved systems, starting with read-only access and exports.", "連接已批准的系統，由只讀存取及匯出開始。"),
      tc("Improve", "改善", "Measure time, returns and exceptions, then refine the rules.", "衡量時間、退回及例外情況，再優化規則。"),
    ],
    changes: {
      en: ["Shorter cycle time for recurring work", "More consistent execution", "Visible exception and approval queues", "A measured path from pilot to wider use"],
      zh: ["縮短重複工作的處理時間", "執行更一致", "例外及批核清單清晰可見", "由試行到擴大應用有可衡量的路徑"],
    },
    boundaries: {
      en: ["Write-back to systems is approved separately", "Exceptions stop the flow and go to a person", "Payments and deletions are out of scope"],
      zh: ["寫回系統須另行批准", "遇到例外即停止並轉交專人", "付款及刪除不在範圍內"],
    },
    solution: "website-operations",
    services: ["workflow-automation", "whatsapp-automation", "data-hub"],
    products: ["customer-ops", "website-cms"],
    functions: ["operations", "cx", "hr"],
    industries: ["property-real-estate", "hospitality-travel", "retail-ecommerce"],
    example: "website-ops",
  },
];

export const capabilityById = (id: CapabilityId) => capabilities.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ */
/* AI agents & tasks (/platform/agents)                                */
/* ------------------------------------------------------------------ */

/** What every configured agent in FIMMICK AIP must define before it runs. */
export const agentAnatomy: TitledCopy[] = [
  tc("Purpose", "目的", "One business job, written down: what the agent prepares and for whom.", "以文字寫明一項業務工作：智能體準備甚麼、為誰準備。"),
  tc("Approved inputs", "已確認輸入", "The sources it may read — nothing broader by default.", "它可以讀取的來源——預設不會開放更多。"),
  tc("Permitted tools", "獲准工具", "The actions it may take, and the ones it may never take.", "它可以採取的行動，以及永遠不可採取的行動。"),
  tc("Output contract", "輸出要求", "The format, checks and quality criteria the output must meet.", "輸出必須符合的格式、檢查及質素準則。"),
  tc("Escalation rules", "轉交規則", "When it must stop and hand the work to a person.", "甚麼情況下必須停下並把工作交給專人。"),
  tc("Human owner", "人手負責人", "A named person who reviews, approves and improves it.", "一位負責審閱、批准及改善的指定人員。"),
];

export type TaskPattern = { name: L; does: L; example: L; never: L };

export const taskPatterns: TaskPattern[] = [
  { name: { en: "Monitor", zh: "監察" }, does: { en: "Watches approved sources on a schedule.", zh: "按時間表監察已確認的來源。" }, example: { en: "Competitor price pages, listening feeds", zh: "競爭對手價格頁、聆聽資料" }, never: { en: "Scrape sources you are not permitted to use", zh: "擷取未獲准使用的來源" } },
  { name: { en: "Classify", zh: "分類" }, does: { en: "Sorts items by topic, urgency or owner.", zh: "按話題、緊急程度或負責人分類。" }, example: { en: "Enquiries, mentions, requests", zh: "查詢、提及、要求" }, never: { en: "Decide a complaint or sensitive case", zh: "決定投訴或敏感個案" } },
  { name: { en: "Draft", zh: "草擬" }, does: { en: "Prepares text or visual directions from approved facts.", zh: "根據已確認資料準備文字或視覺方向。" }, example: { en: "Captions, replies, briefs, listings", zh: "文案、回覆、簡報、資料頁" }, never: { en: "Publish or send without approval", zh: "未經批准發布或發送" } },
  { name: { en: "Compare", zh: "比較" }, does: { en: "Checks one version against another or against a rule.", zh: "把一個版本與另一版本或規則比較。" }, example: { en: "Draft vs brand rules; this month vs last", zh: "草稿與品牌規範；本月與上月" }, never: { en: "Overrule the reviewer’s judgement", zh: "推翻審閱人的判斷" } },
  { name: { en: "Validate", zh: "驗證" }, does: { en: "Confirms required fields, formats and facts are present.", zh: "確認必填欄位、格式及資料齊全。" }, example: { en: "Listing records, product data, forms", zh: "物業資料、產品資料、表格" }, never: { en: "Invent missing data", zh: "自行編造缺漏資料" } },
  { name: { en: "Summarise", zh: "摘要" }, does: { en: "Condenses long material with references.", zh: "附參考來源濃縮長篇資料。" }, example: { en: "Reports, meeting notes, feedback", zh: "報告、會議紀錄、意見" }, never: { en: "Drop the source reference", zh: "省略來源參考" } },
  { name: { en: "Route", zh: "轉交" }, does: { en: "Hands work to the right queue or person.", zh: "把工作交給合適的隊列或人員。" }, example: { en: "Sales, service, legal review queues", zh: "銷售、服務、法律審閱隊列" }, never: { en: "Close a case on its own", zh: "自行結束個案" } },
  { name: { en: "Record", zh: "記錄" }, does: { en: "Writes what happened, with sources and decisions.", zh: "記錄發生了甚麼，連同來源及決定。" }, example: { en: "Export records, review history", zh: "匯出紀錄、審閱歷史" }, never: { en: "Edit a record after approval", zh: "在批准後修改紀錄" } },
];

export const autonomyLevels: { level: string; name: L; copy: L; examples: L }[] = [
  { level: "1", name: { en: "Suggest", zh: "建議" }, copy: { en: "Prepares drafts and analysis. A person does everything else.", zh: "只準備草稿及分析，其餘由人處理。" }, examples: { en: "Most new workflows start here.", zh: "大部分新流程由此開始。" } },
  { level: "2", name: { en: "Prepare and route", zh: "準備及轉交" }, copy: { en: "Prepares the work and places it in a named reviewer’s queue with checks attached.", zh: "準備工作並附上檢查結果，放入指定審閱人的隊列。" }, examples: { en: "Reply drafts, listing updates, report packs.", zh: "回覆草稿、資料頁更新、報告。" } },
  { level: "3", name: { en: "Act within rules", zh: "在規則內執行" }, copy: { en: "Performs pre-approved, low-risk actions (for example tagging or filing) and escalates everything else.", zh: "執行已預先批准的低風險行動（例如標籤或歸檔），其他一律轉交。" }, examples: { en: "Agreed in writing, per workflow, after a review period.", zh: "須在檢討期後，按流程以書面議定。" } },
];

/* ------------------------------------------------------------------ */
/* Workflow templates (/platform/marketplace)                          */
/* ------------------------------------------------------------------ */

export type WorkflowTemplate = { id: string; name: L; purpose: L; inputs: L; output: L; review: L; solution?: SolutionId; product?: ProductId; service?: ServiceId };

export const workflowTemplates: WorkflowTemplate[] = [
  { id: "market-brief", name: { en: "Market & competitor brief", zh: "市場及競爭對手簡報" }, purpose: { en: "Spot material category and competitor shifts.", zh: "找出重要的品類及競爭對手變化。" }, inputs: { en: "Listening data, search data, competitor list", zh: "聆聽資料、搜尋資料、競爭對手名單" }, output: { en: "Prioritised brief with sources", zh: "附來源的優先簡報" }, review: { en: "Strategy lead", zh: "策略主管" }, solution: "market-intelligence", product: "social-listening" },
  { id: "audience-segments", name: { en: "Audience & CRM segments", zh: "受眾及 CRM 分組" }, purpose: { en: "Turn customer records into useful, consented segments.", zh: "把顧客紀錄轉化為有用、已獲同意的分組。" }, inputs: { en: "CRM export, consent flags, lifecycle stage", zh: "CRM 匯出、同意標記、顧客階段" }, output: { en: "Segment list with rules shown", zh: "列明規則的分組清單" }, review: { en: "CRM owner", zh: "CRM 負責人" }, service: "crm-sales" },
  { id: "content-pack", name: { en: "Content pack", zh: "內容套裝" }, purpose: { en: "Prepare on-brand drafts from an approved brief.", zh: "根據已批准簡報準備符合品牌的草稿。" }, inputs: { en: "Brief, brand rules, facts list, channel formats", zh: "簡報、品牌規範、資料清單、渠道格式" }, output: { en: "Review-ready drafts in each language", zh: "各語言可供審閱的草稿" }, review: { en: "Brand reviewer", zh: "品牌審閱人" }, solution: "content-production", product: "creativemax" },
  { id: "community-queue", name: { en: "Social & community queue", zh: "社交及社群回應隊列" }, purpose: { en: "Keep community replies timely and consistent.", zh: "讓社群回覆及時而一致。" }, inputs: { en: "Comments and messages, reply policy, answer library", zh: "留言及訊息、回覆政策、答案庫" }, output: { en: "Classified queue with draft replies", zh: "附草擬回覆的分類隊列" }, review: { en: "Community manager", zh: "社群經理" }, service: "koc-community" },
  { id: "media-check", name: { en: "Paid media check", zh: "付費媒體檢查" }, purpose: { en: "Spot anomalies and propose controlled changes.", zh: "發現異常並提出受控的修改建議。" }, inputs: { en: "Campaign exports, budget guardrails", zh: "宣傳匯出資料、預算限制" }, output: { en: "Change proposals with evidence", zh: "附證據的修改建議" }, review: { en: "Media lead", zh: "媒體主管" }, service: "digitalmarketing" },
  { id: "reporting-brief", name: { en: "Reporting brief", zh: "報告簡報" }, purpose: { en: "Turn scattered channel data into decisions.", zh: "把分散的渠道資料轉化為決策重點。" }, inputs: { en: "Analytics, media, CRM and KPI exports", zh: "分析、媒體、CRM 及 KPI 匯出" }, output: { en: "Decision brief with anomalies explained", zh: "解釋異常的決策簡報" }, review: { en: "Analyst", zh: "分析員" }, service: "business-intelligence" },
  { id: "sales-follow-up", name: { en: "Sales follow-up", zh: "銷售跟進" }, purpose: { en: "Move qualified enquiries into timely conversations.", zh: "把合資格查詢及時轉化為對話。" }, inputs: { en: "Enquiry, CRM record, answer library", zh: "查詢、CRM 紀錄、答案庫" }, output: { en: "Prioritised queue with draft replies", zh: "附草擬回覆的優先隊列" }, review: { en: "Sales owner", zh: "銷售負責人" }, solution: "customer-engagement", product: "whatsapp-aigc" },
  { id: "service-reply", name: { en: "Customer service reply", zh: "客戶服務回覆" }, purpose: { en: "Resolve routine needs and route the rest.", zh: "處理常見需要，其餘轉交專人。" }, inputs: { en: "Conversation, service rules, knowledge base", zh: "對話、服務規則、知識庫" }, output: { en: "Draft reply or routed case", zh: "回覆草稿或已轉交個案" }, review: { en: "Service agent", zh: "客戶服務職員" }, solution: "customer-engagement", product: "customer-ops" },
  { id: "listing-update", name: { en: "Website & listing update", zh: "網站及資料頁更新" }, purpose: { en: "Prepare validated page and listing changes.", zh: "準備已驗證的頁面及資料頁修改。" }, inputs: { en: "Change request, product or listing record, content rules", zh: "修改要求、產品或物業資料、內容規則" }, output: { en: "Prepared update with validation report", zh: "附驗證報告的已準備更新" }, review: { en: "Web owner", zh: "網站負責人" }, solution: "website-operations", product: "website-cms" },
];

/* ------------------------------------------------------------------ */
/* Architecture (/platform/architecture)                               */
/* ------------------------------------------------------------------ */

export const runSteps: TitledCopy[] = [
  tc("Trigger", "觸發", "A schedule, a new request or a person starts the workflow.", "由時間表、新要求或人手啟動流程。"),
  tc("Assemble context", "整合資料", "Only the approved sources for this workflow are loaded.", "只載入此流程已確認的來源。"),
  tc("Run tasks", "執行任務", "Named steps draft, classify, compare or validate.", "由已命名的步驟草擬、分類、比較或驗證。"),
  tc("Check", "檢查", "Rules check facts, formats and prohibited content; failures become exceptions.", "以規則檢查資料、格式及禁用內容；不合格即成為例外。"),
  tc("Human review", "人手審閱", "A named reviewer approves, edits or returns the work.", "由指定審閱人批准、修改或退回。"),
  tc("Output", "輸出", "An export, or an approved write-back to a connected system.", "匯出檔，或經批准寫回已連接的系統。"),
  tc("Record", "記錄", "Sources, decisions and exceptions are kept for the next round.", "保留來源、決定及例外情況，供下一輪改善。"),
];

export const buildingBlocks: { name: L; role: L; control: L }[] = [
  { name: { en: "Workspace", zh: "工作區" }, role: { en: "Where your team sees workflows, queues and records (FIMMICK AIP).", zh: "團隊查看流程、隊列及紀錄的地方（FIMMICK AIP）。" }, control: { en: "Access by named user and role", zh: "按指定用戶及角色存取" } },
  { name: { en: "Sources", zh: "來源" }, role: { en: "Approved facts, documents, answer libraries and data exports.", zh: "已確認的資料、文件、答案庫及資料匯出。" }, control: { en: "Listed per workflow; owned by you", zh: "按流程列明，由你擁有" } },
  { name: { en: "Workflow definition", zh: "流程定義" }, role: { en: "Purpose, steps, rules, reviewers and outputs, written down.", zh: "以文字寫明目的、步驟、規則、審閱人及輸出。" }, control: { en: "Changes are reviewed and versioned", zh: "修改須經審閱並保留版本" } },
  { name: { en: "AI tasks", zh: "AI 任務" }, role: { en: "The steps that prepare work using permitted models and tools.", zh: "使用獲准模型及工具準備工作的步驟。" }, control: { en: "Permitted actions listed; the rest refused", zh: "列明獲准行動，其餘一律拒絕" } },
  { name: { en: "Checks", zh: "檢查" }, role: { en: "Automated rules for facts, formats and prohibited content.", zh: "針對資料、格式及禁用內容的自動規則。" }, control: { en: "Failures become visible exceptions", zh: "不合格項目成為可見的例外" } },
  { name: { en: "Review queue", zh: "審閱隊列" }, role: { en: "Where people approve, edit or return prepared work.", zh: "由人批准、修改或退回已準備工作的地方。" }, control: { en: "Named reviewer for each handoff", zh: "每次交接均有指定審閱人" } },
  { name: { en: "Outputs & connections", zh: "輸出及串接" }, role: { en: "Labelled exports by default; write-back only where agreed.", zh: "預設為已標示的匯出檔；只在議定情況下寫回。" }, control: { en: "Each connection scoped and tested", zh: "每項串接均經界定及測試" } },
  { name: { en: "Records", zh: "紀錄" }, role: { en: "Sources, decisions, exceptions and exports for every run.", zh: "每次運作的來源、決定、例外及匯出。" }, control: { en: "Retention agreed per engagement", zh: "保存期按每項合作議定" } },
];

/* ------------------------------------------------------------------ */
/* Pricing approach (/platform/pricing)                                */
/* ------------------------------------------------------------------ */

export const pricingFactors: TitledCopy[] = [
  tc("Number of workflows", "流程數目", "Each workflow is designed, configured and reviewed on its own.", "每個流程都需獨立設計、配置及審閱。"),
  tc("Volume and frequency", "數量及頻率", "How much work runs through it, and how often.", "流程處理的工作量及頻率。"),
  tc("Sources and connections", "來源及串接", "Exports are simplest; each live connection is scoped and tested.", "匯出檔最簡單；每項實時串接都需界定及測試。"),
  tc("Languages and review model", "語言及審閱模式", "Markets, languages and the review points you need.", "所需的市場、語言及審閱環節。"),
  tc("How much FIMMICK runs", "FIMMICK 承擔多少", "Your team runs it, we configure it, or we manage it with you.", "由你的團隊運作、由我們配置，或與你共同管理。"),
  tc("Third-party costs", "第三方費用", "Licences, media spend and messaging fees are shown separately.", "授權費、媒體費用及訊息費用會分開列出。"),
];

export const proposalContents: L<string[]> = {
  en: ["The workflows in scope, and what is out of scope", "Responsibilities on both sides, including reviewers", "Dependencies: data, access, approvals, third parties", "Third-party costs, shown separately", "Review points and how success is measured", "Commercial terms, notice and handover"],
  zh: ["範圍內的流程，以及範圍以外的事項", "雙方責任，包括審閱人", "依賴條件：資料、存取權、批核、第三方", "分開列出的第三方費用", "審閱環節及衡量成效的方法", "商業條款、通知期及移交安排"],
};
