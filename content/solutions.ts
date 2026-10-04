import type { Solution, SolutionId } from "./types";

export const solutions: Solution[] = [
  {
    id: "market-intelligence",
    headlineAccent: { en: "then decide what to do next.", zh: "再決定下一步行動" },
    number: "01",
    name: { en: "Market Intelligence & AI Visibility", zh: "市場洞察與 AI 搜尋曝光" },
    short: { en: "Market intelligence", zh: "市場洞察" },
    job: {
      en: "Understand what customers and AI answers are saying about your category, then decide what to do next.",
      zh: "了解顧客及 AI 答案如何談論你的品類，再決定下一步行動。",
    },
    problem: {
      en: "Conversation data sits in screenshots and exports, and nobody can say with confidence how the brand appears when people ask AI assistants for a recommendation.",
      zh: "社交討論散落在截圖和匯出檔之中；當顧客向 AI 助手查詢推薦時，品牌如何出現，沒有人能清楚說明。",
    },
    deliverable: {
      en: "A source-linked insight brief, plus a defined AI-search review with prioritised improvements.",
      zh: "附來源連結的洞察簡報，以及具明確範圍的 AI 搜尋檢視和優先改善清單。",
    },
    inputs: {
      en: ["Approved topics, brands and competitors", "Permitted public sources or supplied exports", "A defined set of AI-search questions", "Your website pages and approved facts"],
      zh: ["已確認的話題、品牌及競爭對手", "獲准使用的公開來源或客戶提供的匯出資料", "一組已界定的 AI 搜尋問題", "你的網站頁面及已確認資料"],
    },
    outputs: {
      en: ["Insight brief with linked evidence", "Themes, sentiment notes and open questions", "AI-search answer review for the defined questions", "Prioritised content and page improvements"],
      zh: ["附證據連結的洞察簡報", "主題、情緒觀察及待確認問題", "針對已界定問題的 AI 搜尋答案檢視", "按優先次序排列的內容及頁面改善建議"],
    },
    products: ["social-listening", "aiso"],
    example: "intelligence",
    workflow: [
      { title: { en: "Define the question", zh: "界定問題" }, copy: { en: "Agree the topics, competitors, markets and AI-search questions that matter to a decision.", zh: "先確認與決策相關的話題、競爭對手、市場及 AI 搜尋問題。" } },
      { title: { en: "Collect permitted evidence", zh: "收集獲准使用的證據" }, copy: { en: "Listening and AI-search checks run on separate, permitted sources. The two datasets are never mixed.", zh: "社交聆聽與 AI 搜尋檢查各自使用獲准來源，兩組資料不會混合計算。" } },
      { title: { en: "Prepare the brief", zh: "整理簡報" }, copy: { en: "AI groups themes, drafts the interpretation and links every point to its source.", zh: "AI 歸納主題、草擬解讀，並把每一點連結到來源。" } },
      { title: { en: "Analyst review", zh: "分析師審閱" }, copy: { en: "A person checks significance, removes weak evidence and sets the priority list.", zh: "由專人判斷重要性、剔除證據不足的內容，並訂定優先次序。" } },
    ],
    humanDecision: {
      en: "An analyst decides which signals are significant and which improvements are worth doing. AI never publishes a conclusion on its own.",
      zh: "由分析師判斷哪些訊號重要、哪些改善值得執行。AI 不會自行發布任何結論。",
    },
    evidence: {
      en: "Listening evidence (what people said, where and when) and AI-search evidence (how named assistants answered the defined questions on a given date) are reported separately, with their own limitations.",
      zh: "社交聆聽證據（誰在何時何地說了甚麼）與 AI 搜尋證據（指定 AI 助手在特定日期如何回答已界定問題）分開報告，各自註明限制。",
    },
    startingScope: {
      en: "One brand, up to three competitors and one market, with a monthly brief and a single AI-search question set.",
      zh: "一個品牌、最多三個競爭對手及一個市場，每月一份簡報，加一組 AI 搜尋問題。",
    },
    faqs: [
      { q: { en: "Is AI-search visibility the same as social listening?", zh: "AI 搜尋曝光與社交聆聽是同一回事嗎？" }, a: { en: "No. Listening measures public conversation. AISO checks how AI assistants answer a defined set of questions. They use different data and are reported separately.", zh: "不是。社交聆聽量度公開討論；AISO 檢查 AI 助手如何回答一組已界定的問題。兩者資料來源不同，會分開報告。" } },
      { q: { en: "Which sources can you monitor?", zh: "可以監察哪些來源？" }, a: { en: "Only sources that are permitted for the engagement — typically public platforms available through licensed tools, or exports you supply. We confirm coverage before starting.", zh: "只限合作範圍內獲准使用的來源，一般是透過授權工具取得的公開平台資料，或由你提供的匯出檔。開始前會先確認覆蓋範圍。" } },
      { q: { en: "Do you guarantee a ranking in AI answers?", zh: "你們會保證 AI 答案中的排名嗎？" }, a: { en: "No one can guarantee how an AI assistant will answer. We define the questions, record the answers on a date and recommend improvements you can act on.", zh: "沒有人能保證 AI 助手會如何回答。我們會界定問題、按日期記錄答案，並提出你可以執行的改善建議。" } },
    ],
    services: ["social-listening", "seo-aeo", "business-intelligence"],
    industries: ["beauty-luxury", "hospitality-travel", "b2b-professional-services", "food-beverage"],
  },
  {
    id: "content-production",
    headlineAccent: { en: "your team signs off.", zh: "團隊可以修改和批核" },
    number: "02",
    name: { en: "Content & Creative Production", zh: "內容創作與品牌素材" },
    short: { en: "Content production", zh: "內容製作" },
    job: {
      en: "Turn a brief and approved brand facts into editable copy and visual variants your team signs off.",
      zh: "把簡報及已確認的品牌資料，變成團隊可以修改和批核的文案及視覺版本。",
    },
    problem: {
      en: "Every campaign restarts from a blank page, product facts drift between versions, and approvals happen across chat threads nobody can trace later.",
      zh: "每次宣傳都由零開始，產品資料在不同版本之間走樣，批核散落在聊天記錄中，事後無從追查。",
    },
    deliverable: {
      en: "Editable copy, visual variants and a labelled export, with the reviewer’s decision recorded.",
      zh: "可編輯文案、視覺版本及已標示的匯出檔，並記錄審閱人的決定。",
    },
    inputs: {
      en: ["Campaign or content brief", "Approved product facts and claims", "Brand tone and visual rules", "Channel formats required"],
      zh: ["宣傳或內容簡報", "已確認的產品資料及宣稱", "品牌語調及視覺規範", "所需的渠道格式"],
    },
    outputs: {
      en: ["Copy variants per channel", "Visual directions or generated variants", "Review status and comments", "Selected export package"],
      zh: ["按渠道劃分的文案版本", "視覺方向或生成的視覺版本", "審閱狀態及意見", "選定的匯出套件"],
    },
    products: ["creativemax", "whatsapp-aigc"],
    example: "content",
    workflow: [
      { title: { en: "Brief and facts", zh: "簡報與資料" }, copy: { en: "Start from the brief and the approved facts, so claims come from a source rather than memory.", zh: "由簡報及已確認資料出發，令每項宣稱都有來源，而不是憑記憶撰寫。" } },
      { title: { en: "Prepare variants", zh: "準備不同版本" }, copy: { en: "CreativeMax prepares copy and visual options for each requested format.", zh: "CreativeMax 按所需格式準備文案及視覺選項。" } },
      { title: { en: "Edit and review", zh: "修改與審閱" }, copy: { en: "Your team edits, approves or returns each variant. Editing an approved item sends it back for review.", zh: "團隊可修改、批准或退回每個版本；已批准的內容一經修改，便需重新審閱。" } },
      { title: { en: "Export and record", zh: "匯出與記錄" }, copy: { en: "Selected items are exported with their review history for reuse.", zh: "選定的內容連同審閱紀錄一併匯出，方便日後重用。" } },
    ],
    humanDecision: {
      en: "A named brand reviewer approves, edits or rejects each item before export. Nothing is published by the workflow.",
      zh: "由指定的品牌審閱人在匯出前批准、修改或退回每項內容。流程本身不會發布任何內容。",
    },
    evidence: {
      en: "Every draft shows the source facts it used beside the output, so reviewers can check claims quickly.",
      zh: "每份草稿都會在旁列出所用的來源資料，方便審閱人快速核對宣稱。",
    },
    startingScope: {
      en: "One brand, one campaign type and up to three channel formats, with one review step.",
      zh: "一個品牌、一類宣傳及最多三種渠道格式，設一個審閱步驟。",
    },
    faqs: [
      { q: { en: "Does WhatsApp AIGC reply to customers?", zh: "WhatsApp AIGC 會回覆顧客嗎？" }, a: { en: "No. WhatsApp AIGC is a material-submission and content workflow: people send materials in, and content is prepared for review. Customer messaging is a separate service.", zh: "不會。WhatsApp AIGC 是素材提交及內容製作流程：用戶傳入素材，系統準備內容供審閱。顧客訊息溝通屬另一項服務。" } },
      { q: { en: "Who owns the approved content?", zh: "已批准的內容由誰擁有？" }, a: { en: "Content ownership follows your agreement with FIMMICK. The workflow records who approved each item.", zh: "內容擁有權按你與 FIMMICK 的協議處理；流程會記錄每項內容由誰批准。" } },
      { q: { en: "Can we use our own brand guidelines?", zh: "可以使用我們自己的品牌指引嗎？" }, a: { en: "Yes. Your tone, claims and visual rules are configured as the approved inputs for each workflow.", zh: "可以。你的語調、宣稱及視覺規範會設定為每個流程的已確認輸入。" } },
    ],
    services: ["content-creative", "digitalmarketing", "koc-community"],
    industries: ["retail-ecommerce", "beauty-luxury", "food-beverage", "hospitality-travel"],
  },
  {
    id: "customer-engagement",
    headlineAccent: { en: "before it goes cold.", zh: "不會因延誤而流失" },
    number: "03",
    name: { en: "Customer Engagement & Follow-up", zh: "客戶互動與商機跟進" },
    short: { en: "Customer follow-up", zh: "客戶跟進" },
    job: {
      en: "Make sure every enquiry has an owner, a proposed response and a next task — before it goes cold.",
      zh: "確保每個查詢都有負責人、建議回覆及下一步工作，不會因延誤而流失。",
    },
    problem: {
      en: "Enquiries arrive through forms, messages and events. Some get answered twice, some never, and managers cannot see what happened.",
      zh: "查詢來自表格、訊息及活動；有些被重複回覆，有些無人跟進，管理層亦無法掌握實況。",
    },
    deliverable: {
      en: "An enquiry record with owner, proposed response, next task and history.",
      zh: "一份包含負責人、建議回覆、下一步工作及歷史記錄的查詢紀錄。",
    },
    inputs: {
      en: ["Enquiry text and channel", "Routing rules and team owners", "Approved answers and product facts", "Service-level expectations"],
      zh: ["查詢內容及來源渠道", "分派規則及團隊負責人", "已確認的標準答案及產品資料", "服務時限要求"],
    },
    outputs: {
      en: ["Structured enquiry record", "Proposed owner and priority", "Draft response for review", "Next task and follow-up date"],
      zh: ["結構化查詢紀錄", "建議負責人及優先次序", "待審閱的回覆草稿", "下一步工作及跟進日期"],
    },
    products: ["customer-ops"],
    example: "follow-up",
    workflow: [
      { title: { en: "Capture", zh: "記錄" }, copy: { en: "Each enquiry becomes one structured record, whichever channel it came from.", zh: "無論來自哪個渠道，每個查詢都成為一份結構化紀錄。" } },
      { title: { en: "Classify and propose", zh: "分類與建議" }, copy: { en: "AI suggests intent, owner and priority, and drafts a response from approved answers.", zh: "AI 建議查詢意圖、負責人及優先次序，並根據已確認答案草擬回覆。" } },
      { title: { en: "Owner decides", zh: "負責人決定" }, copy: { en: "The owner accepts or changes the assignment and edits the response before anything is sent.", zh: "負責人確認或更改分派，並在發送前修改回覆。" } },
      { title: { en: "Track the next task", zh: "跟進下一步" }, copy: { en: "The next task and its date stay visible until it is closed.", zh: "下一步工作及日期會一直顯示，直至完成為止。" } },
    ],
    humanDecision: {
      en: "The assigned owner decides what is sent and when. Preparing a response is not the same as sending it, and no CRM record changes without a configured, approved connection.",
      zh: "由獲分派的負責人決定發送內容及時間。準備回覆不等於發送回覆；未經設定及批准的系統串接，不會更改任何 CRM 紀錄。",
    },
    evidence: {
      en: "Each record keeps its source message, the proposed and final owner, and the edits made to the draft.",
      zh: "每份紀錄均保留原始訊息、建議及最終負責人，以及草稿的修改內容。",
    },
    startingScope: {
      en: "One enquiry channel, one team and a set of approved answers, with a weekly review of open records.",
      zh: "一個查詢渠道、一個團隊及一套已確認答案，每週檢視未完成紀錄。",
    },
    faqs: [
      { q: { en: "Will it send WhatsApp or email replies automatically?", zh: "會自動發送 WhatsApp 或電郵回覆嗎？" }, a: { en: "Not by default. The workflow prepares a draft. Sending requires a configured channel connection and your approval rules.", zh: "預設不會。流程只會準備草稿；發送需要已設定的渠道串接及你的批核規則。" } },
      { q: { en: "Does it replace our CRM?", zh: "會取代我們的 CRM 嗎？" }, a: { en: "No. Customer Ops can work alongside a CRM. Updating CRM records is a configured workflow that we scope separately.", zh: "不會。Customer Ops 可與現有 CRM 並行；更新 CRM 紀錄屬需另行界定範圍的配置流程。" } },
      { q: { en: "How are sensitive enquiries handled?", zh: "敏感查詢如何處理？" }, a: { en: "You define categories that always go straight to a person, with no AI-drafted response.", zh: "你可以界定某些類別必須直接交由專人處理，不會由 AI 草擬回覆。" } },
    ],
    services: ["crm-sales", "customer-experience", "whatsapp-automation"],
    industries: ["property-real-estate", "financial-services", "healthcare-wellness", "b2b-professional-services"],
  },
  {
    id: "website-operations",
    headlineAccent: { en: "into reviewed page updates.", zh: "保持準確" },
    number: "04",
    name: { en: "Website, Commerce & Operations", zh: "網站、電商與日常營運" },
    short: { en: "Website operations", zh: "網站營運" },
    job: {
      en: "Keep website and listing content accurate by turning structured records into reviewed page updates.",
      zh: "把結構化紀錄轉化為經審閱的頁面更新，令網站及產品／物業資料保持準確。",
    },
    problem: {
      en: "Product, property or service details change in spreadsheets, and the website catches up days later — sometimes with mistakes nobody reviewed.",
      zh: "產品、物業或服務資料在試算表中更新，網站卻要數日後才跟上，有時更出現無人審閱的錯誤。",
    },
    deliverable: {
      en: "A structured record, a reviewed content update, a page preview or export, and the change history.",
      zh: "結構化紀錄、經審閱的內容更新、頁面預覽或匯出檔，以及變更紀錄。",
    },
    inputs: {
      en: ["Structured records (products, listings, services)", "Field rules and required values", "Page templates", "Approval owner for each content type"],
      zh: ["結構化紀錄（產品、物業、服務）", "欄位規則及必填資料", "頁面範本", "各類內容的批核負責人"],
    },
    outputs: {
      en: ["Validated record with flagged gaps", "Before/after field comparison", "Page preview or export", "Change history"],
      zh: ["已驗證並標示缺漏的紀錄", "更新前後的欄位對照", "頁面預覽或匯出檔", "變更紀錄"],
    },
    products: ["website-cms"],
    example: "website-ops",
    workflow: [
      { title: { en: "Update the record", zh: "更新紀錄" }, copy: { en: "A change starts in the structured record, not in page copy.", zh: "每項變更都由結構化紀錄開始，而不是直接改動頁面文字。" } },
      { title: { en: "Validate fields", zh: "驗證欄位" }, copy: { en: "Required fields and rules are checked; gaps are flagged instead of guessed.", zh: "檢查必填欄位及規則；缺漏會被標示，而不是自行猜測填補。" } },
      { title: { en: "Review the change", zh: "審閱變更" }, copy: { en: "The owner sees the before/after fields and the page preview, then approves or returns it.", zh: "負責人查看更新前後的欄位及頁面預覽，再決定批准或退回。" } },
      { title: { en: "Export and log", zh: "匯出與記錄" }, copy: { en: "The approved update is exported or published through your configured CMS, with history kept.", zh: "已批准的更新透過已設定的 CMS 匯出或發布，並保留紀錄。" } },
    ],
    humanDecision: {
      en: "A content owner approves each change before it reaches a page. Listing preparation does not include inventory, payment, refund or order management.",
      zh: "每項變更在上載頁面前均須由內容負責人批准。準備上架資料並不包括庫存、付款、退款或訂單管理。",
    },
    evidence: {
      en: "The change history shows which field changed, who approved it and which page it affected.",
      zh: "變更紀錄會顯示哪個欄位改動了、由誰批准，以及影響了哪個頁面。",
    },
    startingScope: {
      en: "One content type (for example product or property listings) on one site, with one approval owner.",
      zh: "一個網站上的一類內容（例如產品或物業資料），設一位批核負責人。",
    },
    faqs: [
      { q: { en: "Do you manage stock, payments or orders?", zh: "你們會管理庫存、付款或訂單嗎？" }, a: { en: "No. This solution prepares and reviews content. Commerce transactions stay in your commerce platform.", zh: "不會。此方案負責準備及審閱內容；交易仍在你的電商平台處理。" } },
      { q: { en: "Which CMS do you work with?", zh: "支援哪些 CMS？" }, a: { en: "We confirm compatibility during scoping. Where publishing is not connected, the output is an export your team uploads.", zh: "我們會在界定範圍時確認兼容性；如未連接發布功能，輸出會是由團隊自行上載的匯出檔。" } },
      { q: { en: "Can updates go live automatically?", zh: "更新可以自動上線嗎？" }, a: { en: "Only if you configure it that way for specific low-risk fields. By default every change needs an owner’s approval.", zh: "只有在你為特定低風險欄位作此設定時才會。預設情況下，每項變更都需要負責人批准。" } },
    ],
    services: ["ecommerce-growth", "workflow-automation", "data-hub"],
    industries: ["property-real-estate", "retail-ecommerce", "food-beverage", "hospitality-travel"],
  },
];

export const solutionById = (id: SolutionId) => solutions.find((s) => s.id === id)!;
