import type { L } from "@/lib/i18n";

/** Company facts as published on fimmick.com (captured 28 Sep 2026). */
export const company = {
  name: "FIMMICK",
  founded: 2008,
  brandLine: { en: "AI for Real Business Impact.", zh: "AI for Real Business Impact." } as L,
  identity: { en: "FIMMICK — Agentic AI Platform & Business Solutions", zh: "FIMMICK — 企業 AI 智能體平台與業務解決方案" } as L,
  phone: "+852 3622 5388",
  email: "business@fimmick.com",
  generalEmail: "info@fimmick.com",
  social: [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/fimmick/" },
    { name: "Facebook", url: "https://www.facebook.com/fimmick" },
    { name: "Instagram", url: "https://www.instagram.com/fimmick/" },
    { name: "YouTube", url: "https://www.youtube.com/@fimmick" },
  ],
};

export const offices: { name: L; address?: L; phone?: string; email: string; hq?: boolean }[] = [
  { name: { en: "Hong Kong (HQ)", zh: "香港（總部）" }, address: { en: "1/F, Hung To Centre, 94–96 How Ming Street, Kwun Tong, Kowloon", zh: "九龍觀塘巧明街 94–96 號鴻圖中心 1 樓" }, phone: "+852 3622 5388", email: "business@fimmick.com", hq: true },
  { name: { en: "Taiwan", zh: "台灣" }, address: { en: "6F, No. 221, Sec. 3, Beixin Rd., Xindian Dist., New Taipei City", zh: "新北市新店區北新路三段 221 號 6 樓" }, phone: "+886 8911 5586", email: "business_tw@fimmick.com" },
  { name: { en: "Singapore", zh: "新加坡" }, email: "business_sg@fimmick.com" },
  { name: { en: "Mainland China", zh: "中國內地" }, email: "business_cn@fimmick.com" },
  { name: { en: "United Kingdom", zh: "英國" }, email: "business_uk@fimmick.com" },
  { name: { en: "UAE", zh: "阿聯酋" }, email: "business_ae@fimmick.com" },
];

export const timeline: { year: string; title: L; copy: L }[] = [
  { year: "2008", title: { en: "Founded in Hong Kong", zh: "於香港成立" }, copy: { en: "Began as a digital agency: campaigns, social, content and local market execution.", zh: "以數碼代理起步：宣傳、社交、內容及本地市場執行。" } },
  { year: "2012", title: { en: "Expanded to Taiwan", zh: "拓展至台灣" }, copy: { en: "Built cross-border operating experience.", zh: "累積跨境營運經驗。" } },
  { year: "2019", title: { en: "MarTech and automation", zh: "營銷科技與自動化" }, copy: { en: "Moved beyond campaigns into CRM, analytics, data and automation.", zh: "由宣傳延伸至 CRM、分析、數據及自動化。" } },
  { year: "2024", title: { en: "AI platform work begins", zh: "展開 AI 平台工作" }, copy: { en: "Started turning FIMMICK's own recurring workflows into configured AI workflows.", zh: "開始把 FIMMICK 自身的經常性工作轉化為已配置的 AI 流程。" } },
  { year: "2026", title: { en: "Agentic AI Platform & Business Solutions", zh: "企業 AI 智能體平台與業務解決方案" }, copy: { en: "FIMMICK AIP, six products, transformation practice, specialist services and a built ecosystem, presented as one business.", zh: "FIMMICK AIP、六個產品、轉型實務、專業服務及自建生態系統，以一個完整業務呈現。" } },
];

export const principles: { title: L; copy: L }[] = [
  { title: { en: "Business before technology", zh: "業務先於技術" }, copy: { en: "The workflow and the outcome decide the architecture — not the other way round.", zh: "由工作流程及成果決定架構，而不是反過來。" } },
  { title: { en: "People decide what matters", zh: "重要決定由人作出" }, copy: { en: "Publishing, sending, spending and exceptions stay with named people.", zh: "發布、發送、支出及例外情況由指定人員負責。" } },
  { title: { en: "Show the work", zh: "工作過程清晰可見" }, copy: { en: "Sources, drafts, decisions and records are visible, so work can be checked and reused.", zh: "來源、草稿、決定及記錄都清晰可見，工作便可被檢查及重用。" } },
  { title: { en: "Start small, prove, then extend", zh: "由小開始，驗證後擴展" }, copy: { en: "One defined workflow first; add products, connections and support as evidence builds.", zh: "先由一個清晰的流程開始，再按實證逐步加入產品、串接及支援。" } },
];

export const methodSteps: { title: L; copy: L }[] = [
  { title: { en: "Frame the outcome", zh: "界定成果" }, copy: { en: "Start with a business result and an owner, not a model or tool.", zh: "由業務成果及負責人出發，而不是由模型或工具出發。" } },
  { title: { en: "Design the workflow", zh: "設計流程" }, copy: { en: "Map inputs, tasks, approvals, exceptions and records together.", zh: "一併描繪輸入、任務、批核、例外及記錄。" } },
  { title: { en: "Run a focused first version", zh: "推行聚焦的首個版本" }, copy: { en: "Real inputs, human review and a clear definition of a good output.", zh: "使用真實輸入、人手審閱，並清楚界定何謂合格輸出。" } },
  { title: { en: "Improve and extend", zh: "改善及擴展" }, copy: { en: "Use corrections and exceptions to improve, then extend deliberately.", zh: "從修改及例外中改善，再有計劃地擴展。" } },
];

export const whyFimmick: { title: L; copy: L }[] = [
  { title: { en: "Operating experience", zh: "營運經驗" }, copy: { en: "Years of running campaigns, content, CRM and reporting for brands in Hong Kong and the region — the work AI now has to fit into.", zh: "多年來為香港及區內品牌處理宣傳、內容、CRM 及報告——正是 AI 如今需要融入的工作。" } },
  { title: { en: "Platform and services together", zh: "平台與服務兼備" }, copy: { en: "Products for defined jobs, plus transformation and specialist services when you need people as well as software.", zh: "既有針對明確工作的產品，亦在你需要人手支援時提供轉型及專業服務。" } },
  { title: { en: "We use what we build", zh: "我們親身使用所建立的工具" }, copy: { en: "FIMMICK redesigned its own recurring work first, so the approach is tested on real delivery.", zh: "FIMMICK 先改造自身的經常性工作，方法經過真實交付的考驗。" } },
  { title: { en: "A built ecosystem", zh: "自建的生態系統" }, copy: { en: "Creator, community, travel and heritage ventures give practical knowledge of audiences and operations.", zh: "創作者、社群、旅遊及文化傳承項目，帶來對受眾及營運的實際了解。" } },
];

/** Only leaders with published, verified bios. Names are shown in English in every locale. */
export const leaders: { name: string; role: L; bio: L; linkedin?: string }[] = [
  {
    name: "Kenny Yiu",
    role: { en: "Founder & Chairman", zh: "創辦人及主席" },
    bio: {
      en: "Kenny Yiu founded FIMMICK. With more than 30 years in digital marketing and printing, he established Focus Imaging in the 1990s and later built FIMMICK into a digital marketing technology group. He sits on industry committees including Our Hong Kong Foundation.",
      zh: "Kenny Yiu 創辦 FIMMICK，擁有逾 30 年數碼營銷及印刷經驗。他於 1990 年代創立 Focus Imaging，其後把 FIMMICK 發展為數碼營銷科技集團，並參與包括團結香港基金在內的行業委員會。",
    },
    linkedin: "https://www.linkedin.com/in/kenny-yiu-583b3119/",
  },
  {
    name: "Willy Lai",
    role: { en: "Co-Founder & CEO", zh: "聯合創辦人及行政總裁" },
    bio: {
      en: "Willy Lai is FIMMICK's Co-Founder and CEO, with a background in information technology and digital marketing. He leads FIMMICK's shift to an AI-native platform and solutions company, leads Kinnso, and serves as Vice Chairman of the Innovation & Creative Industries Council at the Federation of Hong Kong Industries.",
      zh: "Willy Lai 為 FIMMICK 聯合創辦人及行政總裁，具資訊科技及數碼營銷背景。他帶領 FIMMICK 轉型為以 AI 為本的平台及解決方案公司，同時領導 Kinnso，並出任香港工業總會創新及創意產業委員會副主席。",
    },
    linkedin: "https://www.linkedin.com/in/laichiwilly/",
  },
];

/** How multi-market engagements are organised (method, not a capacity claim). */
export const deliverySteps: { title: L; copy: L }[] = [
  { title: { en: "One accountable lead", zh: "一位負責主管" }, copy: { en: "Each engagement has one FIMMICK lead who owns scope, schedule and reporting across every market involved.", zh: "每項合作都有一位 FIMMICK 主管，負責所有相關市場的範圍、進度及報告。" } },
  { title: { en: "A reviewer for each language", zh: "每種語言都有審閱人" }, copy: { en: "English, Traditional Chinese and Simplified Chinese outputs are checked by a named native-language reviewer before approval.", zh: "英文、繁體中文及簡體中文的輸出，在批准前都由指定的母語審閱人檢查。" } },
  { title: { en: "Market-by-market approvals", zh: "按市場批核" }, copy: { en: "Local claims, channels and rules are approved per market — a Hong Kong approval does not carry over to Taiwan or Singapore.", zh: "當地宣稱、渠道及規則按市場逐一批准——香港的批核不會自動適用於台灣或新加坡。" } },
  { title: { en: "One set of records", zh: "同一套紀錄" }, copy: { en: "Sources, decisions and exports for every market sit in the same record, so regional teams can compare like with like.", zh: "各市場的來源、決定及匯出都保存在同一套紀錄中，方便區域團隊作同等比較。" } },
];

export const aboutPages = ["our-story", "how-we-work", "why-fimmick", "team", "asia-delivery"] as const;
export type AboutPage = (typeof aboutPages)[number];
