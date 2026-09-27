import type { L } from "@/lib/i18n";
import { solutions } from "./solutions";
import { products } from "./products";
import { workstreams } from "./transformation";
import { services, objectives } from "./services";
import { industries, industryGroups } from "./industries";
import { members } from "./ecosystem";

export type NavLink = { label: L; href: string; note?: L };
export type NavGroup = { heading: L; links: NavLink[] };
export type NavPillar = {
  id: string;
  label: L;
  overview: NavLink;
  groups: NavGroup[];
  featured?: NavLink;
  /** Shown in the compact utility row at medium widths. */
  utility?: boolean;
};

/** Eight information-architecture pillars (locale-neutral hrefs). */
export const pillars: NavPillar[] = [
  {
    id: "platform",
    label: { en: "Platform & Solutions", zh: "平台與解決方案" },
    overview: { label: { en: "Platform overview", zh: "平台概覽" }, href: "/platform" },
    groups: [
      { heading: { en: "Business jobs", zh: "業務工作" }, links: solutions.map((s) => ({ label: s.name, href: `/solutions/${s.id}` })) },
      { heading: { en: "Products", zh: "產品" }, links: [...products.map((p) => ({ label: { en: p.name, zh: p.name }, href: `/products/${p.id}` })), { label: { en: "All products", zh: "全部產品" }, href: "/products" }] },
      { heading: { en: "Explore", zh: "深入了解" }, links: [
        { label: { en: "All solutions", zh: "全部解決方案" }, href: "/solutions" },
        { label: { en: "Examples & demos", zh: "示例與示範" }, href: "/cases-and-demos" },
        { label: { en: "Integrations", zh: "系統串接" }, href: "/platform/integrations" },
        { label: { en: "Governance", zh: "管治" }, href: "/platform/governance" },
      ] },
    ],
    featured: { label: { en: "Inspect a sample workflow", zh: "查看示例流程" }, href: "/platform#layers", note: { en: "Source, work, review and record in one scenario.", zh: "以一個情境展示來源、工作、審閱及記錄。" } },
  },
  {
    id: "transformation",
    label: { en: "AI Transformation", zh: "AI 轉型" },
    overview: { label: { en: "Transformation overview", zh: "轉型概覽" }, href: "/ai-transformation" },
    groups: [
      { heading: { en: "Decision pathways", zh: "決策路徑" }, links: workstreams.map((w) => ({ label: w.name, href: `/ai-transformation/${w.id}` })) },
      { heading: { en: "Get started", zh: "開始" }, links: [
        { label: { en: "Leadership workshop", zh: "管理層工作坊" }, href: "/workshop" },
        { label: { en: "AI readiness checklist", zh: "AI 準備度清單" }, href: "/resources/guides" },
        { label: { en: "How to start", zh: "如何開始" }, href: "/how-to-start" },
      ] },
    ],
  },
  {
    id: "services",
    label: { en: "Services", zh: "專業服務" },
    overview: { label: { en: "All services", zh: "全部服務" }, href: "/services" },
    groups: objectives.map((o) => ({
      heading: o.name,
      links: services.filter((s) => s.objective === o.id).map((s) => ({ label: s.name, href: s.canonicalPath ?? `/services/${s.id}` })),
    })),
  },
  {
    id: "industries",
    label: { en: "Industries", zh: "行業應用" },
    overview: { label: { en: "All industries", zh: "全部行業" }, href: "/industries" },
    groups: industryGroups.map((g) => ({
      heading: g.name,
      links: industries.filter((i) => i.group === g.id).map((i) => ({ label: i.name, href: `/industries/${i.id}` })),
    })),
  },
  {
    id: "cases",
    label: { en: "Case Studies", zh: "成功案例" },
    overview: { label: { en: "Case library", zh: "案例庫" }, href: "/case-studies" },
    groups: [
      { heading: { en: "Browse", zh: "瀏覽" }, links: [
        { label: { en: "Client work", zh: "客戶項目" }, href: "/case-studies?kind=client-work" },
        { label: { en: "FIMMICK's own transformation", zh: "FIMMICK 自身轉型" }, href: "/case-studies/fimmick-ai-native-operating-model" },
        { label: { en: "Examples & demos", zh: "示例與示範" }, href: "/cases-and-demos" },
      ] },
    ],
  },
  {
    id: "resources",
    label: { en: "Resources", zh: "資源中心" },
    overview: { label: { en: "Resource Centre", zh: "資源中心" }, href: "/resources" },
    groups: [
      { heading: { en: "Formats", zh: "類型" }, links: [
        { label: { en: "Insights & Knowledge Hub", zh: "洞察與知識庫" }, href: "/knowledge-hub" },
        { label: { en: "Guides & playbooks", zh: "指南與實務手冊" }, href: "/resources/guides" },
        { label: { en: "Videos & demos", zh: "影片與示範" }, href: "/resources/videos" },
        { label: { en: "Events", zh: "活動" }, href: "/events" },
        { label: { en: "Workshops & training", zh: "工作坊與培訓" }, href: "/workshop" },
      ] },
    ],
  },
  {
    id: "ecosystem",
    label: { en: "Ecosystem", zh: "FIMMICK 生態系統" },
    overview: { label: { en: "Ecosystem overview", zh: "生態系統概覽" }, href: "/fimmick-ecosystem" },
    groups: [
      { heading: { en: "Built by FIMMICK", zh: "FIMMICK 建立" }, links: members.map((m) => ({ label: { en: m.name, zh: m.name }, href: `/fimmick-ecosystem/${m.id}`, note: m.role })) },
    ],
  },
  {
    id: "about",
    label: { en: "About", zh: "關於 FIMMICK" },
    overview: { label: { en: "About FIMMICK", zh: "關於 FIMMICK" }, href: "/about" },
    utility: true,
    groups: [
      { heading: { en: "Company", zh: "公司" }, links: [
        { label: { en: "Our story", zh: "我們的故事" }, href: "/about/our-story" },
        { label: { en: "How we work", zh: "工作方式" }, href: "/about/how-we-work" },
        { label: { en: "Why FIMMICK", zh: "為何選擇 FIMMICK" }, href: "/about/why-fimmick" },
        { label: { en: "Leadership", zh: "領導團隊" }, href: "/about/team" },
        { label: { en: "Contact & offices", zh: "聯絡及辦事處" }, href: "/contact" },
      ] },
    ],
  },
];
