import type { L } from "@/lib/i18n";
import type { IndustryId, ProductId, ServiceId, SolutionId, WorkstreamId } from "./types";

/**
 * Workflows by business function.
 *
 * Replaces the production "AI workforce" section (/workforce/*). The same
 * seven functions are kept, but presented as workflows a team runs — with the
 * inputs, prepared output and the human decision — not as hired staff.
 * All sample rows are illustrative.
 */
export type FunctionId = "growth" | "operations" | "finance" | "hr" | "cx" | "expansion" | "executive";

export type FunctionWorkflow = { name: L; input: L; output: L; decision: L };

export type BusinessFunction = {
  id: FunctionId;
  name: L;
  owner: L;
  summary: L;
  problem: L;
  workflows: FunctionWorkflow[];
  boundaries: L<string[]>;
  sample: { label: L; rows: L<[string, string][]> };
  startingScope: L;
  solutions: SolutionId[];
  services: ServiceId[];
  products: ProductId[];
  industries: IndustryId[];
  workstream?: WorkstreamId;
};

const w = (name: L, input: L, output: L, decision: L): FunctionWorkflow => ({ name, input, output, decision });

export const businessFunctions: BusinessFunction[] = [
  {
    id: "growth",
    name: { en: "Marketing & growth", zh: "市場推廣與增長" },
    owner: { en: "For marketing, brand and sales leaders", zh: "適合市場、品牌及銷售主管" },
    summary: {
      en: "Campaign briefs, content, search visibility and sales follow-up, prepared as reviewable workflows.",
      zh: "以可審閱的流程準備宣傳簡報、內容、搜尋能見度及銷售跟進。",
    },
    problem: {
      en: "Growth teams stitch research, briefs, copy, reports and follow-up together by hand across too many tools. Good ideas stall while the next draft is prepared.",
      zh: "增長團隊要在眾多工具之間，以人手拼湊研究、簡報、文案、報告及跟進；好的構思往往卡在等待下一份草稿。",
    },
    workflows: [
      w({ en: "Campaign brief preparation", zh: "宣傳簡報準備" }, { en: "Objective, audience notes, approved brand facts", zh: "目標、受眾資料、已確認品牌資料" }, { en: "Draft brief with channel roles and measures", zh: "附渠道角色及指標的簡報草稿" }, { en: "Marketing lead approves the brief", zh: "由市場主管批准簡報" }),
      w({ en: "Multichannel content drafts", zh: "多渠道內容草稿" }, { en: "Approved brief, brand rules, channel formats", zh: "已批准簡報、品牌規範、渠道格式" }, { en: "Draft copy and visual directions in English and Traditional Chinese", zh: "英文及繁體中文文案草稿與視覺方向" }, { en: "Brand reviewer edits, approves or returns each item", zh: "由品牌審閱人逐項修改、批准或退回" }),
      w({ en: "Search and answer-engine visibility check", zh: "搜尋及答案引擎能見度檢查" }, { en: "Priority questions, site pages, entity facts", zh: "優先問題、網站頁面、品牌實體資料" }, { en: "Gap list with suggested page updates", zh: "附建議頁面更新的缺口清單" }, { en: "Content owner chooses which fixes to make", zh: "由內容負責人決定處理哪些項目" }),
      w({ en: "Lead follow-up drafts", zh: "銷售線索跟進草稿" }, { en: "Enquiry, CRM record, answer library", zh: "查詢、CRM 紀錄、答案庫" }, { en: "Prioritised queue with draft replies", zh: "附草擬回覆的優先處理清單" }, { en: "Sales owner sends, edits or reassigns", zh: "由銷售負責人發送、修改或轉交" }),
    ],
    boundaries: {
      en: ["Publishing content", "Sending messages to customers", "Changing media budgets", "Making new product or price claims"],
      zh: ["發布內容", "向顧客發送訊息", "更改媒體預算", "提出新的產品或價格宣稱"],
    },
    sample: {
      label: { en: "Sample weekly growth queue", zh: "每週增長工作清單示例" },
      rows: {
        en: [["Brief", "Autumn launch — awaiting approval"], ["Content drafts", "12 prepared · 3 returned for tone"], ["Visibility", "4 priority questions without a clear answer page"], ["Follow-up", "9 replies drafted · 2 escalated (pricing questions)"]],
        zh: [["簡報", "秋季新品推出——等待批准"], ["內容草稿", "已準備 12 項·3 項因語調退回"], ["能見度", "4 條優先問題未有清晰答案頁"], ["跟進", "已草擬 9 則回覆·2 則轉交專人（價格查詢）"]],
      },
    },
    startingScope: { en: "One campaign or one enquiry type, in one market.", zh: "一個市場內的一次宣傳或一類查詢。" },
    solutions: ["content-production", "customer-engagement"],
    services: ["digitalmarketing", "content-creative", "seo-aeo", "crm-sales", "koc-community"],
    products: ["creativemax", "aiso", "whatsapp-aigc"],
    industries: ["retail-ecommerce", "beauty-luxury", "food-beverage"],
  },
  {
    id: "operations",
    name: { en: "Operations", zh: "營運" },
    owner: { en: "For operations, digital and e-commerce leads", zh: "適合營運、數碼及電商主管" },
    summary: {
      en: "Website updates, request routing, data checks and status packs as workflows with visible owners.",
      zh: "把網站更新、要求分流、資料檢查及進度報告，設計為負責人清晰可見的流程。",
    },
    problem: {
      en: "Operational work moves by email and spreadsheet. Nobody can see what is waiting, who owns it, or why the same error keeps returning.",
      zh: "營運工作靠電郵及試算表傳遞，沒有人看得清哪些工作在等待、由誰負責，以及同一錯誤為何一再出現。",
    },
    workflows: [
      w({ en: "Website and listing updates", zh: "網站及資料頁更新" }, { en: "Change request, product or listing record, content rules", zh: "修改要求、產品或物業資料紀錄、內容規則" }, { en: "Prepared update with a validation report", zh: "附驗證報告的已準備更新" }, { en: "Web owner approves publication", zh: "由網站負責人批准發布" }),
      w({ en: "Request intake and routing", zh: "要求接收及分流" }, { en: "Forms, shared inboxes, request categories", zh: "表格、共用收件箱、要求類別" }, { en: "Classified requests with a suggested owner", zh: "已分類並附建議負責人的要求" }, { en: "Team lead confirms routing when unclear", zh: "如有疑問由組長確認分流" }),
      w({ en: "Data quality checks", zh: "資料質素檢查" }, { en: "Records, required fields, format rules", zh: "紀錄、必填欄位、格式規則" }, { en: "Exception list with suggested corrections", zh: "附建議修正的例外清單" }, { en: "Record owner accepts or rejects each correction", zh: "由紀錄負責人逐項接受或拒絕修正" }),
      w({ en: "Recurring status packs", zh: "定期進度報告" }, { en: "Tracker exports, milestones", zh: "追蹤表匯出、里程碑" }, { en: "Draft status summary with open issues", zh: "列出未解決事項的進度摘要草稿" }, { en: "Operations lead signs off before circulation", zh: "由營運主管簽核後才發出" }),
    ],
    boundaries: {
      en: ["Publishing to live systems", "Deleting records", "Changing prices or stock", "Anything involving payments"],
      zh: ["發布至正式系統", "刪除紀錄", "更改價格或存貨", "任何涉及付款的事項"],
    },
    sample: {
      label: { en: "Sample exception record", zh: "例外紀錄示例" },
      rows: {
        en: [["Record", "Listing 0142 (sample)"], ["Issue", "Floor area missing; photo count below the rule"], ["Suggested action", "Request data from the product team"], ["Owner", "Listings coordinator (sample)"]],
        zh: [["紀錄", "物業資料 0142（示例）"], ["問題", "缺少面積；相片數目低於規定"], ["建議行動", "向產品團隊索取資料"], ["負責人", "資料統籌（示例）"]],
      },
    },
    startingScope: { en: "One recurring update or request type, on one system.", zh: "一個系統上的一類定期更新或要求。" },
    solutions: ["website-operations"],
    services: ["workflow-automation", "data-hub", "ecommerce-growth"],
    products: ["website-cms", "customer-ops"],
    industries: ["property-real-estate", "retail-ecommerce", "hospitality-travel"],
  },
  {
    id: "finance",
    name: { en: "Finance & reporting", zh: "財務與報告" },
    owner: { en: "For finance, commercial and planning teams", zh: "適合財務、商務及規劃團隊" },
    summary: {
      en: "KPI monitoring, variance commentary and management packs from reconciled data, every figure traceable.",
      zh: "以已核對的資料準備 KPI 監察、差異分析及管理報告——每個數字都可追溯來源。",
    },
    problem: {
      en: "Month-end reporting consumes the people who should be interpreting it. Definitions differ between teams, so meetings debate the numbers instead of the decisions.",
      zh: "月結報告佔用了本應負責分析的人手；各團隊定義不一，會議往往在爭論數字，而非討論決策。",
    },
    workflows: [
      w({ en: "KPI monitoring", zh: "KPI 監察" }, { en: "Agreed KPI definitions, source exports", zh: "議定的 KPI 定義、來源匯出檔" }, { en: "Movement alerts with the likely driver", zh: "附可能成因的變動提示" }, { en: "Finance owner decides whether an alert is material", zh: "由財務負責人判斷提示是否重要" }),
      w({ en: "Variance commentary drafts", zh: "差異分析草稿" }, { en: "Budget, actuals, prior commentary", zh: "預算、實際數字、過往評述" }, { en: "Draft variance notes with source references", zh: "附來源參考的差異說明草稿" }, { en: "Controller edits and approves the commentary", zh: "由財務總監修改及批准評述" }),
      w({ en: "Management pack assembly", zh: "管理報告整合" }, { en: "Approved figures, pack template", zh: "已批准數字、報告範本" }, { en: "Draft pack with charts and open questions", zh: "附圖表及待解答問題的報告草稿" }, { en: "Finance lead signs off", zh: "由財務主管簽核" }),
      w({ en: "Commercial analysis requests", zh: "商務分析要求" }, { en: "Question, permitted datasets", zh: "問題、獲准使用的資料集" }, { en: "Short analysis with method and caveats", zh: "列明方法及限制的簡短分析" }, { en: "Analyst checks before the answer is shared", zh: "由分析員檢查後才分享" }),
    ],
    boundaries: {
      en: ["Posting journals", "Approving payments", "Changing forecasts or budgets", "External financial reporting"],
      zh: ["過賬", "批准付款", "更改預測或預算", "對外財務報告"],
    },
    sample: {
      label: { en: "Sample variance note", zh: "差異說明示例" },
      rows: {
        en: [["Line", "Marketing spend (sample)"], ["Variance", "Above budget this month (sample)"], ["Likely driver", "Campaign brought forward from next month"], ["Status", "Draft — awaiting controller review"]],
        zh: [["項目", "市場推廣開支（示例）"], ["差異", "本月高於預算（示例）"], ["可能成因", "宣傳由下月提前進行"], ["狀態", "草稿——等待財務總監審閱"]],
      },
    },
    startingScope: { en: "One recurring report with agreed KPI definitions.", zh: "一份採用議定 KPI 定義的定期報告。" },
    solutions: [],
    services: ["business-intelligence", "data-hub"],
    products: [],
    industries: ["financial-services", "b2b-professional-services", "retail-ecommerce"],
  },
  {
    id: "hr",
    name: { en: "People & HR", zh: "人力資源" },
    owner: { en: "For HR, learning and internal communications teams", zh: "適合人力資源、培訓及內部溝通團隊" },
    summary: {
      en: "Policy answers, onboarding, training and request triage as governed workflows with privacy boundaries.",
      zh: "以受管治的流程處理政策解答、入職、培訓及要求分流，並設私隱界線。",
    },
    problem: {
      en: "HR teams answer the same questions again and again, onboarding packs drift out of date, and training rarely keeps pace with new tools.",
      zh: "人力資源團隊不斷回答相同問題，入職資料逐漸過時，培訓亦難以追上新工具的步伐。",
    },
    workflows: [
      w({ en: "Policy and handbook answers", zh: "政策及員工手冊解答" }, { en: "Approved policies, FAQ library", zh: "已批准政策、常見問題庫" }, { en: "Draft answers citing the policy section", zh: "引用政策條文的解答草稿" }, { en: "HR reviews new or sensitive questions before replying", zh: "新問題或敏感問題由人力資源審閱後才回覆" }),
      w({ en: "Onboarding pack preparation", zh: "入職資料準備" }, { en: "Role profile, checklists, policies", zh: "職位資料、清單、政策" }, { en: "Draft onboarding plan and welcome materials", zh: "入職計劃及歡迎資料草稿" }, { en: "Hiring manager and HR approve", zh: "由招聘經理及人力資源批准" }),
      w({ en: "Training content from real workflows", zh: "以真實流程製作培訓內容" }, { en: "Workflow documentation, worked examples", zh: "流程文件、實例" }, { en: "Draft exercises and quick-reference guides", zh: "練習及速查指南草稿" }, { en: "Training owner approves before use", zh: "由培訓負責人批准後使用" }),
      w({ en: "Internal request triage", zh: "內部要求分流" }, { en: "Requests, categories", zh: "要求、類別" }, { en: "Classified queue with a suggested owner", zh: "附建議負責人的分類清單" }, { en: "HR assigns anything about an individual’s case", zh: "涉及個別員工個案的事項由人力資源分派" }),
    ],
    boundaries: {
      en: ["Hiring decisions", "Performance assessment", "Disciplinary matters and pay", "Personal data beyond the defined purpose"],
      zh: ["招聘決定", "表現評核", "紀律事宜及薪酬", "超出既定目的的個人資料"],
    },
    sample: {
      label: { en: "Sample policy answer record", zh: "政策解答紀錄示例" },
      rows: {
        en: [["Question", "Notice needed for annual leave (sample)"], ["Source", "Handbook section 4.2 (sample)"], ["Status", "Prepared — source cited"], ["Reviewer", "HR officer (sample)"]],
        zh: [["問題", "申請年假需提前多久通知（示例）"], ["來源", "員工手冊第 4.2 節（示例）"], ["狀態", "已準備——已引用來源"], ["審閱人", "人力資源主任（示例）"]],
      },
    },
    startingScope: { en: "One policy area or one onboarding path.", zh: "一個政策範疇或一條入職路徑。" },
    solutions: [],
    services: ["ai-training", "workflow-automation"],
    products: [],
    industries: ["b2b-professional-services", "financial-services", "healthcare-wellness"],
    workstream: "governance-adoption",
  },
  {
    id: "cx",
    name: { en: "Customer experience", zh: "顧客體驗" },
    owner: { en: "For customer service, CRM and loyalty leads", zh: "適合客戶服務、CRM 及會員主管" },
    summary: {
      en: "Enquiry replies prepared from an approved answer library, with sensitive cases routed to people.",
      zh: "以已批准的答案庫準備查詢回覆，敏感事項則交由專人處理。",
    },
    problem: {
      en: "Customers wait while staff search for the right answer. The same questions arrive on several channels, and feedback rarely reaches the teams who could fix the cause.",
      zh: "顧客在等待職員尋找正確答案；相同問題從多個渠道湧入，而意見亦甚少傳達到能解決根本問題的團隊。",
    },
    workflows: [
      w({ en: "Enquiry reply drafts", zh: "查詢回覆草稿" }, { en: "Incoming enquiry, answer library, customer record", zh: "查詢、答案庫、顧客紀錄" }, { en: "Draft reply citing approved answers", zh: "引用已批准答案的回覆草稿" }, { en: "Staff member sends, edits or escalates", zh: "由職員發送、修改或轉交" }),
      w({ en: "Conversation routing", zh: "對話分流" }, { en: "Message, service rules, business hours", zh: "訊息、服務規則、辦公時間" }, { en: "Classified conversation with a suggested team", zh: "已分類並附建議團隊的對話" }, { en: "Supervisor handles complaints and sensitive topics", zh: "投訴及敏感話題由主管處理" }),
      w({ en: "Answer library upkeep", zh: "答案庫維護" }, { en: "Unanswered questions, product changes", zh: "未能解答的問題、產品變動" }, { en: "Proposed new or updated answers", zh: "建議新增或更新的答案" }, { en: "Content owner approves library changes", zh: "由內容負責人批准答案庫變更" }),
      w({ en: "Feedback themes", zh: "意見主題分析" }, { en: "Survey comments, reviews, conversation tags", zh: "問卷意見、評價、對話標籤" }, { en: "Theme summary with examples", zh: "附例子的主題摘要" }, { en: "CX lead decides which issues to act on", zh: "由顧客體驗主管決定跟進哪些問題" }),
    ],
    boundaries: {
      en: ["Refunds and compensation", "Complaint outcomes", "Replies outside the approved answer library"],
      zh: ["退款及賠償", "投訴處理結果", "答案庫以外的回覆"],
    },
    sample: {
      label: { en: "Sample routed conversation", zh: "對話分流示例" },
      rows: {
        en: [["Channel", "WhatsApp (sample)"], ["Topic", "Delivery date change"], ["Prepared reply", "Drafted from answer 12 (sample)"], ["Route", "Staff review — the message mentions a complaint"]],
        zh: [["渠道", "WhatsApp（示例）"], ["話題", "更改送貨日期"], ["已準備回覆", "按第 12 號答案草擬（示例）"], ["分流", "交職員審閱——訊息提及投訴"]],
      },
    },
    startingScope: { en: "One enquiry type on one channel.", zh: "一個渠道上的一類查詢。" },
    solutions: ["customer-engagement"],
    services: ["customer-experience", "whatsapp-automation", "crm-sales"],
    products: ["whatsapp-aigc", "customer-ops"],
    industries: ["hospitality-travel", "retail-ecommerce", "healthcare-wellness"],
  },
  {
    id: "expansion",
    name: { en: "Market expansion", zh: "市場拓展" },
    owner: { en: "For regional, business development and strategy teams", zh: "適合區域、業務拓展及策略團隊" },
    summary: {
      en: "Market scans, competitor tracking and localisation, reviewed by people who know each market.",
      zh: "市場掃描、競爭對手追蹤及本地化內容，由熟悉當地市場的人審閱。",
    },
    problem: {
      en: "Entering a new market means weeks of desk research, translated materials that miss the local tone, and no shared view of what competitors are doing.",
      zh: "進入新市場往往要花數星期做案頭研究，翻譯資料又未能掌握當地語調，團隊亦缺乏對競爭對手動向的共同認知。",
    },
    workflows: [
      w({ en: "Market scan", zh: "市場掃描" }, { en: "Target market, category, approved sources", zh: "目標市場、品類、已確認來源" }, { en: "Structured market brief with sources", zh: "列明來源的結構化市場簡報" }, { en: "Strategy lead validates the conclusions", zh: "由策略主管核實結論" }),
      w({ en: "Competitor tracking", zh: "競爭對手追蹤" }, { en: "Competitor list, listening data", zh: "競爭對手名單、聆聽資料" }, { en: "Change log of competitor moves", zh: "競爭對手動向變更紀錄" }, { en: "Market owner flags what matters", zh: "由市場負責人標示重要事項" }),
      w({ en: "Localisation drafts", zh: "本地化草稿" }, { en: "Master content, glossary, market notes", zh: "主版本內容、詞彙表、市場備註" }, { en: "Localised drafts in the target language", zh: "目標語言的本地化草稿" }, { en: "A native-language reviewer approves each version", zh: "由母語審閱人批准每個版本" }),
      w({ en: "Launch readiness checklist", zh: "推出準備清單" }, { en: "Launch plan, local requirements from your advisers", zh: "推出計劃、由你的顧問提供的當地要求" }, { en: "Checklist with open items and owners", zh: "列明未完成事項及負責人的清單" }, { en: "Launch owner confirms go or no-go", zh: "由推出負責人決定是否推出" }),
    ],
    boundaries: {
      en: ["Legal, regulatory and tax advice", "Market-entry decisions", "Claims that have not been checked locally"],
      zh: ["法律、監管及稅務意見", "進入市場的決定", "未經當地核實的宣稱"],
    },
    sample: {
      label: { en: "Sample market brief row", zh: "市場簡報示例" },
      rows: {
        en: [["Market", "Taiwan (sample)"], ["Signal", "Two competitors launched loyalty apps (sample)"], ["Sources", "Listening data, public app listings"], ["Confidence", "Medium — needs local validation"]],
        zh: [["市場", "台灣（示例）"], ["訊號", "兩個競爭對手推出會員應用程式（示例）"], ["來源", "聆聽資料、公開應用程式資料"], ["可信度", "中——需當地核實"]],
      },
    },
    startingScope: { en: "One category scan for one new market.", zh: "為一個新市場進行一個品類掃描。" },
    solutions: ["market-intelligence"],
    services: ["social-listening", "seo-aeo", "digitalmarketing"],
    products: ["social-listening", "aiso"],
    industries: ["food-beverage", "beauty-luxury", "retail-ecommerce"],
  },
  {
    id: "executive",
    name: { en: "Leadership & executive reporting", zh: "管理層與行政報告" },
    owner: { en: "For CEOs, general managers and leadership teams", zh: "適合行政總裁、總經理及管理團隊" },
    summary: {
      en: "Leadership briefs from your own reports: what changed, why, and what needs a decision.",
      zh: "以公司自身的報告整合管理層簡報：有何改變、原因，以及需要決定的事項。",
    },
    problem: {
      en: "Leaders receive many reports but few decisions. The same numbers arrive in different formats, and open decisions are lost between meetings.",
      zh: "管理層收到大量報告，卻甚少得到清晰的決策重點；同一數字以不同格式出現，未完成的決定亦在會議之間遺失。",
    },
    workflows: [
      w({ en: "Weekly leadership brief", zh: "每週管理層簡報" }, { en: "Team reports, KPI dashboard exports", zh: "團隊報告、KPI 儀表板匯出" }, { en: "Short brief: what changed, why, decisions needed", zh: "簡短簡報：有何改變、原因、需作的決定" }, { en: "Chief of staff checks before circulation", zh: "由幕僚長檢查後才發出" }),
      w({ en: "Management pack drafts", zh: "管理報告草稿" }, { en: "Approved figures, prior packs, agenda", zh: "已批准數字、過往報告、議程" }, { en: "Draft sections with open questions", zh: "附待解答問題的章節草稿" }, { en: "Executive owner approves each section", zh: "由負責的管理層逐節批准" }),
      w({ en: "Decision and action log", zh: "決策及行動紀錄" }, { en: "Meeting notes, owners", zh: "會議紀錄、負責人" }, { en: "Decision log with due dates and status", zh: "附限期及狀態的決策紀錄" }, { en: "Meeting chair confirms the record", zh: "由會議主席確認紀錄" }),
      w({ en: "AI adoption overview", zh: "AI 應用概覽" }, { en: "Workflow records, review outcomes", zh: "流程紀錄、審閱結果" }, { en: "Summary of throughput, returns and exceptions", zh: "處理量、退回及例外情況摘要" }, { en: "Leadership decides where to extend or stop", zh: "由管理層決定擴展或停止哪些流程" }),
    ],
    boundaries: {
      en: ["Strategic and people decisions", "Disclosures to investors or regulators", "Anything that commits the company"],
      zh: ["策略及人事決定", "向投資者或監管機構披露資料", "任何對公司構成承諾的事項"],
    },
    sample: {
      label: { en: "Sample leadership brief item", zh: "管理層簡報示例" },
      rows: {
        en: [["What changed", "Enquiry volume up in two markets (sample)"], ["Likely cause", "Seasonal campaign — confirm with regional leads"], ["Decision needed", "Extend the follow-up workflow to a second market?"], ["Owner", "General manager (sample)"]],
        zh: [["改變", "兩個市場的查詢量上升（示例）"], ["可能原因", "季節性宣傳——需與區域主管確認"], ["需作決定", "是否把跟進流程擴展至第二個市場？"], ["負責人", "總經理（示例）"]],
      },
    },
    startingScope: { en: "One weekly leadership brief built from existing reports.", zh: "以現有報告製作一份每週管理層簡報。" },
    solutions: [],
    services: ["business-intelligence", "ai-training"],
    products: [],
    industries: ["b2b-professional-services", "financial-services", "property-real-estate"],
    workstream: "strategy-roadmap",
  },
];

export const functionById = (id: FunctionId) => businessFunctions.find((f) => f.id === id)!;
