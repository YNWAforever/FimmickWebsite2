import type { ProgrammeStep, Workstream, WorkstreamId } from "./types";
import type { L } from "@/lib/i18n";

export const workstreams: Workstream[] = [
  {
    id: "ai-readiness-maturity",
    code: "T/01",
    name: { en: "AI Readiness & Maturity", zh: "AI 準備度與成熟度" },
    leadershipQuestion: {
      en: "Where is the organisation genuinely ready for AI — and where would scaling introduce friction?",
      zh: "機構在哪些方面真正準備好採用 AI？擴大規模又會在哪裏遇到阻力？",
    },
    answer: {
      en: "FIMMICK builds a shared evidence base across leadership, operations, data, systems and people. The result is not a generic maturity score. It is a view of what can move now, what needs preparation and what should wait.",
      zh: "FIMMICK 在管理層、營運、資料、系統及人員之間建立共同的事實基礎。成果不是一個籠統的成熟度分數，而是清楚列出哪些可以即時推進、哪些需要準備、哪些應該暫緩。",
    },
    buyerFit: {
      en: "Leadership teams who have run AI pilots — or are being asked for an AI plan — and need an honest picture before committing budget.",
      zh: "已試行 AI、或被要求提出 AI 計劃，並希望在投入預算前掌握真實情況的管理團隊。",
    },
    problem: {
      en: "Ideas arrive faster than evidence. Pilots start in isolation, then stall on data access, unclear ownership or a workflow nobody documented.",
      zh: "構思多、證據少。試點各自開展，最後卡在資料存取、責任不清，或無人記錄的工作流程上。",
    },
    inputs: {
      en: ["Leadership objectives and constraints", "An inventory of recurring workflows", "Systems and data sources in use", "Current policies and decision rights"],
      zh: ["管理層目標及限制", "經常性工作流程清單", "現有系統及資料來源", "現行政策及決策權責"],
    },
    lenses: [
      { title: { en: "Business value", zh: "業務價值" }, copy: { en: "Where better speed, quality or capacity in recurring work would matter.", zh: "在經常性工作中，提升速度、質素或產能最有價值的地方。" } },
      { title: { en: "Workflow readiness", zh: "流程準備度" }, copy: { en: "Whether inputs, outputs, owners and exceptions are clear enough to redesign safely.", zh: "輸入、輸出、負責人及例外情況是否足夠清晰，可以安全地重新設計。" } },
      { title: { en: "Data & systems", zh: "資料與系統" }, copy: { en: "Trusted context, access constraints and integration effort a workflow would inherit.", zh: "流程會承接的可信資料、存取限制及系統串接工作量。" } },
      { title: { en: "People & decision rights", zh: "人員與決策權" }, copy: { en: "Review capability, adoption conditions and risks that need a named owner.", zh: "審閱能力、推行條件，以及需要指定負責人的風險。" } },
    ],
    stages: [
      { title: { en: "Discover", zh: "了解" }, copy: { en: "Interview leaders and inspect priority workflows, systems and constraints.", zh: "訪談管理層，檢視重點流程、系統及限制。" }, details: { en: ["Leadership interviews", "Workflow inventory", "Data and system map"], zh: ["管理層訪談", "流程清單", "資料及系統地圖"] } },
      { title: { en: "Assess", zh: "評估" }, copy: { en: "Rate opportunities on value, feasibility, risk and adoption, with the evidence behind each rating.", zh: "按價值、可行性、風險及推行難度評估機會，並附上每項評分的依據。" }, details: { en: ["Readiness heatmap", "Opportunity assessment", "Constraint register"], zh: ["準備度熱圖", "機會評估", "限制清單"] } },
      { title: { en: "Prioritise", zh: "排序" }, copy: { en: "Choose a first workflow that can show value without hiding its dependencies.", zh: "選出一個既能展示價值、又不會掩蓋依賴條件的首個流程。" }, details: { en: ["Opportunity portfolio", "First-workflow thesis", "Trade-offs for leadership"], zh: ["機會組合", "首個流程論證", "供管理層取捨的選項"] } },
      { title: { en: "Mobilise", zh: "啟動" }, copy: { en: "Turn the decision into owners, measures and a defined starting scope.", zh: "把決定轉化為負責人、衡量指標及明確的起步範圍。" }, details: { en: ["Owners and decision rights", "Baseline measures", "Starting scope"], zh: ["負責人及決策權", "基線指標", "起步範圍"] } },
    ],
    artifactLabel: { en: "Decision package (sample)", zh: "決策文件（示例）" },
    deliverables: [
      { title: { en: "Readiness heatmap", zh: "準備度熱圖" }, copy: { en: "Workflow, data, systems, people and governance, rated with the evidence behind each rating.", zh: "就流程、資料、系統、人員及管治作出評級，並列出每項評級的依據。" } },
      { title: { en: "Opportunity portfolio", zh: "機會組合" }, copy: { en: "Candidate workflows compared on value, readiness, risk and dependencies.", zh: "按價值、準備度、風險及依賴條件比較候選流程。" } },
      { title: { en: "Constraint register", zh: "限制清單" }, copy: { en: "The data, integration, policy and capability gaps that must be resolved, each with an owner.", zh: "必須解決的資料、串接、政策及能力缺口，每項均有負責人。" } },
      { title: { en: "Leadership brief", zh: "管理層簡報" }, copy: { en: "A recommendation for the first workflow and what it depends on.", zh: "首個流程的建議及其依賴條件。" } },
    ],
    scope: {
      en: "Typically a focused engagement covering one business unit and up to ten candidate workflows. Timing is agreed at scoping.",
      zh: "一般為聚焦的項目，涵蓋一個業務單位及最多十個候選流程；時間表於界定範圍時議定。",
    },
    services: ["ai-transformation", "ai-training", "data-hub"],
    products: [],
    related: ["strategy-roadmap", "governance-adoption"],
  },
  {
    id: "strategy-roadmap",
    code: "T/02",
    name: { en: "AI Strategy & Roadmap", zh: "AI 策略與路線圖" },
    leadershipQuestion: {
      en: "How should we sequence AI investment so each deployment builds reusable capability?",
      zh: "AI 投資應如何排序，令每次部署都能累積可重用的能力？",
    },
    answer: {
      en: "FIMMICK turns a portfolio of ideas into a sequenced plan: which outcomes matter, which workflows change first, which data and platform capabilities can be reused, who owns each step and when leadership reviews progress.",
      zh: "FIMMICK 把一堆構思整理成有次序的計劃：哪些成果重要、哪些流程先變、哪些資料及平台能力可以重用、每一步由誰負責，以及管理層何時檢視進度。",
    },
    buyerFit: {
      en: "Executives who need a board-ready plan that connects AI work to business priorities and budget decisions.",
      zh: "需要一份能向董事會交代、把 AI 工作連繫到業務重點及預算決定的計劃的行政人員。",
    },
    problem: {
      en: "Each department buys its own tools. Nothing is reused, costs are hard to explain, and nobody can say what the next twelve months should achieve.",
      zh: "各部門各自購買工具，沒有可重用的成果，成本難以解釋，亦沒有人說得出未來十二個月應達成甚麼。",
    },
    inputs: {
      en: ["Business priorities and targets", "Readiness findings (or an equivalent fact base)", "Current technology and vendor landscape", "Budget and risk appetite"],
      zh: ["業務重點及目標", "準備度評估結果（或同等的事實基礎）", "現有技術及供應商狀況", "預算及風險承受程度"],
    },
    lenses: [
      { title: { en: "Value thesis", zh: "價值論證" }, copy: { en: "How AI changes cost, quality, speed, capacity or customer experience in specific work.", zh: "AI 如何在特定工作中改變成本、質素、速度、產能或顧客體驗。" } },
      { title: { en: "Portfolio logic", zh: "組合邏輯" }, copy: { en: "Grouping workflows so data, integrations and review practices compound.", zh: "把流程歸組，令資料、串接及審閱做法得以累積。" } },
      { title: { en: "Operating model", zh: "營運模式" }, copy: { en: "What leaders direct, what teams own, what AI prepares and what systems record.", zh: "管理層指導甚麼、團隊負責甚麼、AI 準備甚麼、系統記錄甚麼。" } },
      { title: { en: "Decision gates", zh: "決策關卡" }, copy: { en: "Points where leadership reviews evidence before committing the next stage.", zh: "管理層在投入下一階段前檢視證據的關卡。" } },
    ],
    stages: [
      { title: { en: "Frame", zh: "定框架" }, copy: { en: "Translate ambition into a small set of measurable outcomes.", zh: "把抱負轉化為少量可衡量的成果。" }, details: { en: ["Outcome hierarchy", "Principles", "Scope boundaries"], zh: ["成果層級", "原則", "範圍界限"] } },
      { title: { en: "Architect", zh: "定架構" }, copy: { en: "Connect priority workflows to shared data, platform and team capabilities.", zh: "把重點流程連繫到共用的資料、平台及團隊能力。" }, details: { en: ["Capability architecture", "Workflow portfolio", "Reusable foundations"], zh: ["能力架構", "流程組合", "可重用基礎"] } },
      { title: { en: "Sequence", zh: "排次序" }, copy: { en: "Balance early evidence with the groundwork needed for scale.", zh: "在早期成果與規模化所需的基礎工作之間取得平衡。" }, details: { en: ["Illustrative roadmap", "Dependencies", "Decision gates"], zh: ["示例路線圖", "依賴條件", "決策關卡"] } },
      { title: { en: "Govern", zh: "定管治" }, copy: { en: "Set investment ownership, value tracking and a review cadence.", zh: "訂立投資責任、價值追蹤及檢討周期。" }, details: { en: ["Steering model", "Value tracking", "Review cadence"], zh: ["督導模式", "價值追蹤", "檢討周期"] } },
    ],
    artifactLabel: { en: "Transformation blueprint (sample)", zh: "轉型藍圖（示例）" },
    deliverables: [
      { title: { en: "Value thesis", zh: "價值論證" }, copy: { en: "A concise link between priorities, workflow change and how progress will be measured.", zh: "簡明說明業務重點、流程轉變及進度衡量方式之間的關係。" } },
      { title: { en: "Target operating model", zh: "目標營運模式" }, copy: { en: "Roles, decision rights and the relationship between people, AI tasks and systems.", zh: "角色、決策權，以及人員、AI 任務與系統之間的關係。" } },
      { title: { en: "Prioritised roadmap", zh: "優先路線圖" }, copy: { en: "Sequenced workflows with owners, dependencies and decision gates.", zh: "按次序排列的流程，附負責人、依賴條件及決策關卡。" } },
      { title: { en: "Capability architecture", zh: "能力架構" }, copy: { en: "The reusable data, integration and review layers behind the portfolio.", zh: "支撐整個組合的可重用資料、串接及審閱層面。" } },
    ],
    scope: {
      en: "Usually follows a readiness assessment. Output is a plan and operating model; delivery is scoped separately.",
      zh: "一般在準備度評估之後進行；成果為計劃及營運模式，執行工作另行界定範圍。",
    },
    services: ["ai-transformation", "data-hub", "business-intelligence"],
    products: [],
    related: ["ai-readiness-maturity", "workflow-agent-design"],
  },
  {
    id: "workflow-agent-design",
    code: "T/03",
    name: { en: "Workflow & Agent Design", zh: "流程與 AI 智能體設計" },
    leadershipQuestion: {
      en: "What should AI prepare or execute in this workflow — and where must people decide?",
      zh: "在這個流程中，AI 應準備或執行甚麼？哪些地方必須由人決定？",
    },
    answer: {
      en: "FIMMICK starts from the work itself: triggers, inputs, tasks, handoffs, standards and exceptions. We then define each AI task’s permitted actions and the human decisions around it, so the outcome always has an owner.",
      zh: "FIMMICK 由工作本身出發：觸發點、輸入、任務、交接、標準及例外情況；再界定每項 AI 任務可採取的行動，以及周邊的人手決策，確保每個結果都有負責人。",
    },
    buyerFit: {
      en: "Operations and functional leaders with a chosen workflow who need a design their team and IT can build and run.",
      zh: "已選定流程，需要一份團隊及 IT 部門都能落實運作的設計的營運及部門主管。",
    },
    problem: {
      en: "Automation projects fail on edge cases nobody mapped: a missing field, a sensitive request, an approval that lives in someone’s head.",
      zh: "自動化項目往往失敗於無人預計的特殊情況：缺漏的欄位、敏感的要求，或只存在於某人腦海中的批核步驟。",
    },
    inputs: {
      en: ["The chosen workflow and its owner", "Real examples, including difficult ones", "Systems and data the workflow touches", "Quality standards and approval rules"],
      zh: ["選定的流程及其負責人", "真實例子，包括較棘手的個案", "流程涉及的系統及資料", "質素標準及批核規則"],
    },
    lenses: [
      { title: { en: "Task boundaries", zh: "任務界限" }, copy: { en: "Each AI task has a purpose, approved sources, permitted actions and a defined output.", zh: "每項 AI 任務都有目的、已確認來源、獲准行動及明確輸出。" } },
      { title: { en: "Minimum context", zh: "最少必要資料" }, copy: { en: "The least data each step needs — access is not widened by default.", zh: "每個步驟所需的最少資料，預設不會擴大存取權限。" } },
      { title: { en: "Human decisions", zh: "人手決策" }, copy: { en: "People at publication, sending, spend, sensitive data and exceptions.", zh: "發布、發送、支出、敏感資料及例外情況均由專人決定。" } },
      { title: { en: "Quality criteria", zh: "質素準則" }, copy: { en: "How a good output is recognised, and what happens when one is not good enough.", zh: "如何判斷輸出合格，以及不合格時如何處理。" } },
    ],
    stages: [
      { title: { en: "Map", zh: "描繪" }, copy: { en: "Document the current flow, hidden handoffs and failure modes.", zh: "記錄現行流程、隱藏的交接及常見出錯情況。" }, details: { en: ["Trigger map", "Decision inventory", "Exception analysis"], zh: ["觸發點地圖", "決策清單", "例外分析"] } },
      { title: { en: "Design", zh: "設計" }, copy: { en: "Split the work into human, AI and system responsibilities.", zh: "把工作拆分為人員、AI 及系統的責任。" }, details: { en: ["Task contracts", "Input/output contract", "Approval design"], zh: ["任務規格", "輸入／輸出規格", "批核設計"] } },
      { title: { en: "Test", zh: "測試" }, copy: { en: "Run realistic examples, including edge cases, against the quality criteria.", zh: "以真實例子（包括特殊情況）按質素準則測試。" }, details: { en: ["Scenario tests", "Quality rubric", "Exception routes"], zh: ["情境測試", "質素評分準則", "例外處理路線"] } },
      { title: { en: "Hand over", zh: "移交" }, copy: { en: "Document the operating playbook and train the owners.", zh: "整理營運手冊並培訓負責人。" }, details: { en: ["Operating playbook", "Owner training", "Improvement loop"], zh: ["營運手冊", "負責人培訓", "持續改善機制"] } },
    ],
    artifactLabel: { en: "Workflow blueprint (sample)", zh: "流程藍圖（示例）" },
    deliverables: [
      { title: { en: "Workflow blueprint", zh: "流程藍圖" }, copy: { en: "The end-to-end flow across triggers, tasks, decisions, handoffs and exceptions.", zh: "涵蓋觸發點、任務、決策、交接及例外情況的端到端流程。" } },
      { title: { en: "Input/output contract", zh: "輸入／輸出規格" }, copy: { en: "Required inputs, allowed actions and the expected output for each step.", zh: "每個步驟的必需輸入、獲准行動及預期輸出。" } },
      { title: { en: "Human decision map", zh: "人手決策地圖" }, copy: { en: "Where people review, approve, intervene and recover.", zh: "專人在哪些環節審閱、批准、介入及補救。" } },
      { title: { en: "Quality and exception criteria", zh: "質素及例外準則" }, copy: { en: "How outputs are judged and what happens when they fail.", zh: "如何評估輸出，以及輸出不合格時的處理方法。" } },
    ],
    scope: {
      en: "One workflow at a time, designed with its owner. Build and integration are scoped once the design is agreed.",
      zh: "每次設計一個流程，並與流程負責人共同完成；設計確認後，再界定建置及串接範圍。",
    },
    services: ["workflow-automation", "crm-sales", "customer-experience"],
    products: ["customer-ops", "website-cms", "creativemax"],
    related: ["strategy-roadmap", "governance-adoption"],
  },
  {
    id: "governance-adoption",
    code: "T/04",
    name: { en: "Governance & Adoption", zh: "管治與推行" },
    leadershipQuestion: {
      en: "How do we give AI useful work while keeping judgement, risk and accountability visible?",
      zh: "如何讓 AI 承擔有用的工作，同時令判斷、風險及問責保持清晰可見？",
    },
    answer: {
      en: "FIMMICK builds governance into the workflow rather than into a document beside it. Teams can see what each AI task may access, prepare and escalate, and leaders can see the evidence they need to adjust policy.",
      zh: "FIMMICK 把管治融入流程本身，而不是另寫一份文件擺在一旁。團隊可以看到每項 AI 任務可存取、準備及上報的內容；管理層亦可掌握調整政策所需的證據。",
    },
    buyerFit: {
      en: "Leaders responsible for risk, people or operations who need AI adoption that is practical, proportionate and reviewable.",
      zh: "負責風險、人員或營運，需要切實可行、適度且可檢討的 AI 推行方式的主管。",
    },
    problem: {
      en: "Policies are written once and ignored; teams either avoid AI or use it without shared rules; nobody knows who reviews what.",
      zh: "政策寫好後便被擱置；團隊不是避用 AI，就是在沒有共同規則下使用；沒有人知道誰應審閱甚麼。",
    },
    inputs: {
      en: ["Current policies and risk requirements", "Roles involved in the workflows", "Examples of good and poor outputs", "Training needs by role"],
      zh: ["現行政策及風險要求", "流程涉及的角色", "合格與不合格輸出的例子", "按角色劃分的培訓需要"],
    },
    lenses: [
      { title: { en: "Purpose & boundaries", zh: "目的與界限" }, copy: { en: "Every rule tied to a purpose, a risk level and an accountable owner.", zh: "每條規則都對應一個目的、風險級別及問責負責人。" } },
      { title: { en: "Review responsibilities", zh: "審閱責任" }, copy: { en: "Who reviews which outputs, against which checklist, and how often.", zh: "誰按哪份清單、以甚麼頻率審閱哪些輸出。" } },
      { title: { en: "Escalation", zh: "上報機制" }, copy: { en: "What happens with exceptions, complaints and incidents.", zh: "例外、投訴及事故如何處理。" } },
      { title: { en: "Enablement", zh: "能力建立" }, copy: { en: "Practical training for leaders, operators and reviewers on their real work.", zh: "以實際工作為本，為管理層、操作人員及審閱人提供培訓。" } },
    ],
    stages: [
      { title: { en: "Define", zh: "界定" }, copy: { en: "Set boundaries, risk tiers, review thresholds and owners.", zh: "訂立界限、風險級別、審閱門檻及負責人。" }, details: { en: ["Policy architecture", "Risk tiers", "Responsibility matrix"], zh: ["政策架構", "風險級別", "責任矩陣"] } },
      { title: { en: "Embed", zh: "嵌入" }, copy: { en: "Put approvals, records and exception routes into the workflow.", zh: "把批核、記錄及例外路線嵌入流程。" }, details: { en: ["Approval controls", "Review checklist", "Incident route"], zh: ["批核控制", "審閱清單", "事故處理路線"] } },
      { title: { en: "Enable", zh: "培訓" }, copy: { en: "Train each role through realistic scenarios.", zh: "以真實情境培訓每個角色。" }, details: { en: ["Role-based sessions", "Reviewer calibration", "Practice cases"], zh: ["按角色培訓", "審閱人標準校準", "練習個案"] } },
      { title: { en: "Measure adoption", zh: "衡量推行" }, copy: { en: "Track use, corrections and exceptions to improve rules and training.", zh: "追蹤使用情況、修改及例外，以改善規則及培訓。" }, details: { en: ["Adoption plan", "Review cadence", "Policy updates"], zh: ["推行計劃", "檢討周期", "政策更新"] } },
    ],
    artifactLabel: { en: "Control and adoption pack (sample)", zh: "管控與推行文件（示例）" },
    deliverables: [
      { title: { en: "Responsibility matrix", zh: "責任矩陣" }, copy: { en: "Who prepares, reviews, approves and is informed for each workflow step.", zh: "每個流程步驟由誰準備、審閱、批准及知會。" } },
      { title: { en: "Review checklist", zh: "審閱清單" }, copy: { en: "What reviewers check before approving an output.", zh: "審閱人批准輸出前需要檢查的項目。" } },
      { title: { en: "Escalation route", zh: "上報路線" }, copy: { en: "How exceptions and incidents move to the right person.", zh: "例外及事故如何轉交合適人員。" } },
      { title: { en: "Adoption plan", zh: "推行計劃" }, copy: { en: "Training, support and the measures used to see whether the change is working.", zh: "培訓、支援，以及用來判斷轉變是否奏效的指標。" } },
    ],
    scope: {
      en: "Can run alongside a first workflow deployment or across a function. Training formats are agreed per audience.",
      zh: "可與首個流程部署同步進行，或覆蓋整個部門；培訓形式按對象議定。",
    },
    services: ["ai-training", "ai-transformation", "workflow-automation"],
    products: [],
    related: ["workflow-agent-design", "ai-readiness-maturity"],
  },
];

/**
 * The six-part programme framework. Not a compulsory purchase sequence:
 * organisations can start at any step.
 */
export const programme: ProgrammeStep[] = [
  { id: "audit", number: "01", name: { en: "Audit & maturity assessment", zh: "審視與成熟度評估" }, decision: { en: "Where are we ready, and where not yet?", zh: "我們在哪些方面已準備好？哪些方面仍未？" }, inputs: { en: "Objectives, workflow inventory, systems map", zh: "目標、流程清單、系統地圖" }, deliverable: { en: "Readiness heatmap and constraint register", zh: "準備度熱圖及限制清單" }, humanRole: { en: "Leadership sets priorities and confirms findings", zh: "管理層訂立優先次序並確認評估結果" }, workstream: "ai-readiness-maturity" },
  { id: "identify", number: "02", name: { en: "Workflow identification", zh: "流程識別" }, decision: { en: "Which workflow should change first?", zh: "應先改變哪個流程？" }, inputs: { en: "Candidate workflows with volume and pain points", zh: "候選流程的工作量及痛點" }, deliverable: { en: "Opportunity portfolio and first-workflow thesis", zh: "機會組合及首個流程論證" }, humanRole: { en: "Function heads choose and own the first workflow", zh: "部門主管選定並負責首個流程" }, workstream: "strategy-roadmap" },
  { id: "design", number: "03", name: { en: "Workflow & agent design", zh: "流程與智能體設計" }, decision: { en: "What does AI prepare, and where do people decide?", zh: "AI 準備甚麼？人在哪裏決定？" }, inputs: { en: "Real examples, rules, systems touched", zh: "真實例子、規則、涉及的系統" }, deliverable: { en: "Workflow blueprint and input/output contract", zh: "流程藍圖及輸入／輸出規格" }, humanRole: { en: "Workflow owner approves the design", zh: "流程負責人批准設計" }, workstream: "workflow-agent-design" },
  { id: "integrate", number: "04", name: { en: "Systems integration", zh: "系統串接" }, decision: { en: "Which connections are needed, and what may they do?", zh: "需要哪些串接？這些串接可以做甚麼？" }, inputs: { en: "Access to systems in scope, data rules", zh: "範圍內系統的存取權限、資料規則" }, deliverable: { en: "Tested connections or export routines", zh: "已測試的串接或匯出程序" }, humanRole: { en: "IT and data owners approve access", zh: "IT 及資料負責人批准存取" }, service: "data-hub" },
  { id: "enable", number: "05", name: { en: "Team enablement", zh: "團隊培訓" }, decision: { en: "Can the team run and review this confidently?", zh: "團隊能否有信心地運作及審閱？" }, inputs: { en: "Roles, the designed workflow, practice cases", zh: "角色、已設計的流程、練習個案" }, deliverable: { en: "Role-based training and operating playbook", zh: "按角色培訓及營運手冊" }, humanRole: { en: "Managers confirm readiness to go live", zh: "經理確認可以正式運作" }, service: "ai-training" },
  { id: "govern", number: "06", name: { en: "Governance & optimisation", zh: "管治與優化" }, decision: { en: "Is it working, and what should change?", zh: "成效如何？有甚麼需要改變？" }, inputs: { en: "Review records, corrections, exceptions", zh: "審閱紀錄、修改、例外" }, deliverable: { en: "Review cadence, adoption measures, rule updates", zh: "檢討周期、推行指標、規則更新" }, humanRole: { en: "Owners review evidence and decide changes", zh: "負責人檢視證據並決定改動" }, workstream: "governance-adoption" },
];

export const programmeNote: L = {
  en: "A programme framework, not a compulsory six-package sequence. Many organisations start with one step — for example a readiness assessment or a single workflow design.",
  zh: "這是一個計劃框架，並非必須依次購買的六個套餐。許多機構只由其中一步開始，例如準備度評估或單一流程設計。",
};

/** Indicative self-assessment topics. Not a diagnosis or a validated score. */
export const readinessTopics: { id: string; label: L; prompt: L; suggests: WorkstreamId }[] = [
  { id: "no-plan", label: { en: "We are being asked for an AI plan", zh: "我們被要求提出 AI 計劃" }, prompt: { en: "Start with a fact base before a roadmap.", zh: "先建立事實基礎，再制定路線圖。" }, suggests: "ai-readiness-maturity" },
  { id: "scattered", label: { en: "Teams use AI tools without shared rules", zh: "各團隊在沒有共同規則下使用 AI 工具" }, prompt: { en: "Agree boundaries, review duties and training.", zh: "訂立界限、審閱責任及培訓。" }, suggests: "governance-adoption" },
  { id: "pilots", label: { en: "Pilots worked but did not scale", zh: "試點成功但未能擴展" }, prompt: { en: "Sequence reusable capability and decision gates.", zh: "按次序建立可重用能力及決策關卡。" }, suggests: "strategy-roadmap" },
  { id: "workflow", label: { en: "We know which workflow to fix", zh: "我們知道要改善哪個流程" }, prompt: { en: "Design tasks, approvals and exceptions for it.", zh: "為該流程設計任務、批核及例外處理。" }, suggests: "workflow-agent-design" },
];

/** Sample readiness heatmap data (illustrative; ratings 1–3). */
export const sampleHeatmap: { area: L; ratings: [number, number, number, number, number] }[] = [
  { area: { en: "Content production", zh: "內容製作" }, ratings: [3, 2, 2, 3, 2] },
  { area: { en: "Enquiry follow-up", zh: "查詢跟進" }, ratings: [3, 2, 1, 2, 2] },
  { area: { en: "Management reporting", zh: "管理報告" }, ratings: [2, 1, 1, 2, 1] },
  { area: { en: "Listing updates", zh: "資料更新" }, ratings: [2, 3, 2, 2, 2] },
];
export const heatmapColumns: L[] = [
  { en: "Value", zh: "價值" },
  { en: "Workflow", zh: "流程" },
  { en: "Data", zh: "資料" },
  { en: "People", zh: "人員" },
  { en: "Governance", zh: "管治" },
];

export const workstreamById = (id: WorkstreamId) => workstreams.find((w) => w.id === id)!;
