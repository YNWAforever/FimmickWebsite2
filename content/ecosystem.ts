import type { L } from "@/lib/i18n";
import type { EcosystemMember, MemberId } from "./types";

/**
 * Relationship wording follows how fimmick.com described each unit on
 * 28 Sep 2026 (e.g. "business unit", "incubated social enterprise"). It does
 * not describe legal corporate structure. External URLs are the destinations
 * linked from the production site; KOCmax has no verified external URL.
 */
export const memberGroups: { id: EcosystemMember["group"]; name: L; copy: L }[] = [
  { id: "platform", name: { en: "Technology platform", zh: "技術平台" }, copy: { en: "The workflow layer behind FIMMICK’s products.", zh: "FIMMICK 產品背後的流程層。" } },
  { id: "creators", name: { en: "Creators & advocacy", zh: "創作者與口碑" }, copy: { en: "Creator, KOC and customer-advocacy programmes.", zh: "創作者、KOC 及顧客口碑計劃。" } },
  { id: "communities", name: { en: "Communities & discovery", zh: "社群與探索" }, copy: { en: "Audience communities and discovery platforms.", zh: "受眾社群及探索平台。" } },
  { id: "culture", name: { en: "Culture & social impact", zh: "文化與社會影響" }, copy: { en: "Heritage, storytelling and purpose-led partnerships.", zh: "文化傳承、故事及以使命為本的合作。" } },
];

export const members: EcosystemMember[] = [
  {
    id: "aip",
    name: "FIMMICK AIP",
    group: "platform",
    role: { en: "Agentic AI platform and configured business workflows", zh: "企業 AI 智能體平台及已配置的業務流程" },
    relationship: { en: "Built and operated by FIMMICK.", zh: "由 FIMMICK 建立及營運。" },
    audience: { en: "Business teams in marketing, content, customer follow-up and website operations.", zh: "市場推廣、內容、客戶跟進及網站營運的業務團隊。" },
    need: { en: "Teams want AI to do real, reviewable work — connected to their data, tools and approvals — rather than another standalone tool.", zh: "團隊希望 AI 能完成真正、可審閱的工作，並連接其資料、工具及批核流程，而不是多一個獨立工具。" },
    offers: { en: ["Four platform layers: data, tasks, approvals, records", "Six named products across four business jobs", "Configuration and managed support"], zh: ["四個平台層：資料、任務、批核、記錄", "涵蓋四項業務工作的六個產品", "配置及託管支援"] },
    scope: { en: "The full product and platform specification lives on the Platform and Products pages; this entry explains its place in the ecosystem.", zh: "完整的產品及平台說明見「平台」及「產品」頁面；此處說明其在生態系統中的角色。" },
    activity: { en: ["Powers the sample workflows shown on this site", "Grew out of FIMMICK’s own delivery work"], zh: ["支援本網站展示的示例流程", "源自 FIMMICK 自身的交付工作"] },
    why: { en: "It turns years of campaign, content and customer operations experience into repeatable workflows.", zh: "把多年宣傳、內容及顧客營運經驗，轉化為可重複運作的流程。" },
    externalUrl: { url: "https://aip.fimmick.com/", label: { en: "AIP login (existing customers)", zh: "AIP 登入（現有客戶）" } },
    canonicalInternal: "/platform",
    services: ["ai-transformation", "workflow-automation", "data-hub"],
    industries: ["retail-ecommerce", "property-real-estate", "b2b-professional-services"],
    partnershipPrompt: { en: "Discuss which workflow to configure first.", zh: "討論先配置哪一個流程。" },
  },
  {
    id: "kocmax",
    name: "KOCmax",
    group: "creators",
    role: { en: "Workflow layer for KOC and micro-creator programmes", zh: "KOC 及小型創作者計劃的流程層" },
    relationship: { en: "Operated with Adfocate, FIMMICK’s creator-marketing business unit, as its workflow layer.", zh: "作為 Adfocate（FIMMICK 的創作者營銷業務單位）的流程層一同運作。" },
    audience: { en: "Brands running programmes with many everyday consumers and micro-creators.", zh: "與大量普通消費者及小型創作者合作推行計劃的品牌。" },
    need: { en: "Running dozens of KOCs by hand breaks down: recruitment, briefs, submissions, reminders and reporting get lost.", zh: "人手管理數十位 KOC 很快便會失控：招募、簡報、提交、提醒及報告都容易遺漏。" },
    offers: { en: ["Structured recruitment and briefing", "Submission tracking and reminders", "Content validation against mandatories", "Programme reporting"], zh: ["有系統的招募及簡報", "提交追蹤及提醒", "按必要事項檢查內容", "計劃報告"] },
    scope: { en: "Available as part of Adfocate and FIMMICK creator programmes.", zh: "作為 Adfocate 及 FIMMICK 創作者計劃的一部分提供。" },
    activity: { en: ["Supports KOC programme operations described on the Adfocate page", "Connects to the Influencer, KOL & KOC service"], zh: ["支援 Adfocate 頁面所述的 KOC 計劃運作", "連繫「網紅、KOL 與 KOC」服務"] },
    why: { en: "It shows how FIMMICK turns a repeated operation into a workflow that can be tracked and improved.", zh: "展示 FIMMICK 如何把重複運作轉化為可追蹤、可改善的流程。" },
    services: ["koc-community", "content-creative"],
    industries: ["beauty-luxury", "food-beverage", "retail-ecommerce"],
    partnershipPrompt: { en: "Discuss a KOC programme and how it would be managed.", zh: "討論一個 KOC 計劃及其管理方式。" },
  },
  {
    id: "adfocate",
    name: "Adfocate",
    group: "creators",
    role: { en: "Creator, KOL and KOC marketing", zh: "創作者、KOL 及 KOC 營銷" },
    relationship: { en: "FIMMICK’s creator-marketing business unit.", zh: "FIMMICK 的創作者營銷業務單位。" },
    audience: { en: "Brands that need creators whose audience, style and credibility fit the goal — not just follower counts.", zh: "需要受眾、風格及可信度都切合目標的創作者，而不只看粉絲數目的品牌。" },
    need: { en: "Creator marketing fails when the workflow is weak: wrong-fit creators, slow approvals and reports that are only screenshots.", zh: "流程薄弱時，創作者營銷便會失效：創作者不合適、批核緩慢，報告只有截圖。" },
    offers: { en: ["Influencer and KOL pairing by audience fit", "KOC programmes for real consumer experience", "Short-form, live and UGC-style creator content", "Content validation and reporting"], zh: ["按受眾適配度配對網紅及 KOL", "以真實消費體驗為本的 KOC 計劃", "短片、直播及 UGC 風格的創作者內容", "內容檢查及報告"] },
    scope: { en: "Programmes are scoped per brand and campaign objective.", zh: "按品牌及宣傳目標界定計劃範圍。" },
    activity: { en: ["Co-hosted FIMMICK webinars on influencer marketing and Reels/performance ads (see Events archive)"], zh: ["曾與 FIMMICK 合辦網紅營銷及 Reels／成效廣告網上研討會（見活動檔案）"] },
    why: { en: "Direct experience of creator operations feeds FIMMICK’s content and advocacy services.", zh: "創作者營運的直接經驗，支援 FIMMICK 的內容及口碑服務。" },
    externalUrl: { url: "https://www.adfocate.com", label: { en: "Visit Adfocate", zh: "瀏覽 Adfocate" } },
    services: ["koc-community", "digitalmarketing", "content-creative"],
    industries: ["beauty-luxury", "food-beverage", "hospitality-travel"],
    partnershipPrompt: { en: "Discuss a creator or advocacy programme.", zh: "討論一個創作者或口碑計劃。" },
  },
  {
    id: "kinnso",
    name: "Kinnso",
    group: "communities",
    role: { en: "Travel and lifestyle discovery", zh: "旅遊及生活探索" },
    relationship: { en: "Described by FIMMICK as its AI-powered travel and lifestyle platform.", zh: "FIMMICK 形容其為旗下以 AI 支援的旅遊及生活平台。" },
    audience: { en: "Travellers planning trips, and the hotels, attractions and merchants who want to reach them while they plan.", zh: "正在計劃行程的旅客，以及希望在旅客計劃期間接觸他們的酒店、景點及商戶。" },
    need: { en: "Travellers want practical answers — where to go, what fits their time and budget, which offers are worth it — and merchants want to appear at that moment with useful context.", zh: "旅客需要實用答案：去哪裏、甚麼行程配合時間及預算、哪些優惠值得；商戶則希望在這一刻以有用的資訊出現。" },
    offers: { en: ["Destination discovery and trip-planning help", "Community and creator travel content", "Stays, dining and experience offers with context", "Partner collaborations with travel and lifestyle brands"], zh: ["目的地探索及行程規劃協助", "社群及創作者旅遊內容", "附背景資訊的住宿、餐飲及體驗優惠", "與旅遊及生活品牌的合作"] },
    scope: { en: "Positioning follows Kinnso’s current brief; merchant and partnership terms are agreed directly.", zh: "定位以 Kinnso 最新簡介為準；商戶及合作條款另行直接議定。" },
    activity: { en: ["Travel and lifestyle content and offers on kinnso.ai"], zh: ["kinnso.ai 上的旅遊及生活內容和優惠"] },
    why: { en: "It gives FIMMICK first-hand knowledge of how AI recommendations and content influence real decisions.", zh: "讓 FIMMICK 直接了解 AI 推薦及內容如何影響真實決定。" },
    externalUrl: { url: "https://www.kinnso.ai", label: { en: "Visit Kinnso", zh: "瀏覽 Kinnso" } },
    services: ["seo-aeo", "koc-community", "ecommerce-growth"],
    industries: ["hospitality-travel", "food-beverage", "retail-ecommerce"],
    partnershipPrompt: { en: "Discuss a travel, merchant or content partnership.", zh: "討論旅遊、商戶或內容合作。" },
  },
  {
    id: "50-add-oil",
    name: "50 Add Oil",
    group: "communities",
    role: { en: "Community and content for Hong Kong’s 50+ audience", zh: "服務香港 50 歲以上人士的社群及內容" },
    relationship: { en: "Described by FIMMICK as its digital community platform for mature consumers in Hong Kong.", zh: "FIMMICK 形容其為旗下服務香港成熟消費者的數碼社群平台。" },
    audience: { en: "People in Hong Kong around 45 to 65 and above who are preparing for, or entering, a new stage of life.", zh: "香港約 45 至 65 歲或以上、正準備或已踏入人生新階段的人士。" },
    need: { en: "Mature consumers are digitally active but often addressed with outdated assumptions. Brands need respectful, useful communication that earns trust.", zh: "成熟消費者積極使用數碼渠道，卻常被以過時的假設對待。品牌需要尊重、實用並能建立信任的溝通。" },
    offers: { en: ["Health, finance, family, travel and lifestyle content", "Community sharing and events", "Curated lifestyle offers", "Brand partnerships and educational campaigns"], zh: ["健康、財務、家庭、旅遊及生活內容", "社群分享及活動", "精選生活優惠", "品牌合作及教育宣傳"] },
    scope: { en: "Partnership formats and audience access are agreed per campaign; no audience data is shared by default.", zh: "合作形式及受眾接觸按每次宣傳議定；預設不會共用任何受眾資料。" },
    activity: { en: ["FIMMICK × 50 Add Oil webinar on the silver-hair market (Oct 2024, see Events archive)"], zh: ["FIMMICK × 50 Add Oil 銀髮市場網上研討會（2024 年 10 月，見活動檔案）"] },
    why: { en: "It keeps FIMMICK close to an audience many brands overlook, informing content and campaign practice.", zh: "令 FIMMICK 貼近一個常被品牌忽略的受眾，並把經驗應用於內容及宣傳工作。" },
    externalUrl: { url: "https://www.50addoil.com/zh-hk", label: { en: "Visit 50 Add Oil", zh: "瀏覽 50 Add Oil" } },
    services: ["content-creative", "koc-community", "digitalmarketing"],
    industries: ["healthcare-wellness", "financial-services", "food-beverage"],
    partnershipPrompt: { en: "Discuss a campaign or education partnership for mature audiences.", zh: "討論針對成熟受眾的宣傳或教育合作。" },
  },
  {
    id: "eldage",
    name: "Eldage",
    group: "culture",
    role: { en: "Heritage crafts, storytelling and community", zh: "傳統工藝、故事與社群" },
    relationship: { en: "A social enterprise incubated by FIMMICK.", zh: "由 FIMMICK 培育的社會企業。" },
    audience: { en: "People interested in Hong Kong’s craft heritage, and brands, schools and organisations seeking purpose-led collaborations.", zh: "對香港工藝傳承有興趣的人士，以及尋求以使命為本合作的品牌、學校及機構。" },
    need: { en: "Hong Kong’s master craftspeople carry skills and stories that are disappearing from everyday life, and they have fewer opportunities to share them.", zh: "香港工藝師傅的技藝與故事正逐漸從日常生活中消失，他們分享手藝的機會亦愈來愈少。" },
    offers: { en: ["Digital storytelling about craftspeople", "Workshops, guided tours and cultural events", "Heritage products and custom gifts", "Brand and CSR collaborations"], zh: ["工藝師傅的數碼故事", "工作坊、導賞及文化活動", "傳統工藝產品及訂製禮品", "品牌及企業社會責任合作"] },
    scope: { en: "Collaborations are agreed with Eldage and the craftspeople involved.", zh: "合作須與 Eldage 及參與的工藝師傅共同議定。" },
    activity: { en: ["Crafts such as neon signs, rattan weaving, sign painting and miniature art featured in its storytelling"], zh: ["其故事內容涵蓋霓虹招牌、藤織、手寫招牌及微型藝術等工藝"] },
    why: { en: "It shows how content, community and commerce can create cultural value, not only marketing output.", zh: "展示內容、社群及商業如何創造文化價值，而不只是營銷產出。" },
    externalUrl: { url: "https://www.facebook.com/EldageHK", label: { en: "Follow Eldage on Facebook", zh: "在 Facebook 關注 Eldage" } },
    services: ["content-creative", "koc-community"],
    industries: ["hospitality-travel", "retail-ecommerce"],
    partnershipPrompt: { en: "Discuss a heritage workshop, product or CSR collaboration.", zh: "討論傳統工藝工作坊、產品或企業社會責任合作。" },
  },
];

export const memberById = (id: MemberId) => members.find((m) => m.id === id)!;

export const ecosystemBoundary: L = {
  en: "Being part of the FIMMICK ecosystem does not mean automatic access to any member’s audience, personal data, CRM records or accounts. Any shared activity is agreed per partnership.",
  zh: "屬於 FIMMICK 生態系統並不代表可自動取得任何成員的受眾、個人資料、CRM 紀錄或帳戶。任何共同活動均按每項合作另行議定。",
};
