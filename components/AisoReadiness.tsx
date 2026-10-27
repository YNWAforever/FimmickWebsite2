import { LinkButton, SectionHead } from "@/components/ui";
import { zh, type Locale } from "@/lib/i18n";

const areas = [
  { name: "Core", points: 45, checks: ["robots.txt AI Policy", "llms.txt Present", "Bot Accessibility", "Structured Data", "Content Extractability"] },
  { name: "Extended", points: 30, checks: ["llms.txt completeness (optional)", "AI Metadata Card", "Sitemap Quality", "Meta Description", "Heading Structure", "FAQ Schema", "Canonical URL", "Server-Side Text", "Internal Linking", "Entity Signals", "Content Freshness"] },
  { name: "GEO", points: 25, checks: ["Citation Density", "Factual Density", "Topical Authority", "Chunkability"] },
];

export function AisoReadiness({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <section className="section" id="example">
      <div className="container stack">
        <SectionHead eyebrow={en ? "Website readiness for AI search" : zh("網站 AI 搜尋準備度", locale)} title={en ? "20 checks. Three areas. 100 points." : zh("20 項檢查、三個範疇、100 分。", locale)} lead={en ? "Grades A+ to F help prioritise fixes. Readiness covers ChatGPT, Google AI, Perplexity, Claude and Gemini; it is not live mention monitoring." : zh("評級由 A+ 至 F，協助排列修正次序。準備度涵蓋 ChatGPT、Google AI、Perplexity、Claude 及 Gemini，並非即時提及監察。", locale)} />
        <div className="grid grid-3">
          {areas.map((area) => <div className="io-card" key={area.name}><h3>{area.name} · {area.points}/100</h3><ul className="dot-list small">{area.checks.map((check) => <li key={check}>{check}</li>)}</ul></div>)}
        </div>
        <p>{en ? "Start with a free scan, then review the evidence and prioritised fixes. The sample report is a static, synthetic example: no customer data and no website scanned to produce it." : zh("先免費掃描，再檢視證據及優先修正建議。示例報告為靜態合成示例，不含客戶資料，亦未掃描網站來產生該示例。", locale)}</p>
        <div className="btn-row">
          <LinkButton to="https://aiso-kappa.vercel.app/en/scan" variant="accent">{en ? "Run free scan" : zh("免費掃描", locale)}</LinkButton>
          <LinkButton to="https://aiso-kappa.vercel.app/en/sample-report" variant="ghost">{en ? "View sample report" : zh("查看示例報告", locale)}</LinkButton>
        </div>
        <p className="small muted">{en ? "No sign-up or credit card for the scan itself. Create a free account to save your result and Fix Pack. Paid plans support ongoing scans and history." : zh("掃描本身毋須註冊或信用卡；儲存結果及修正套件需要免費帳戶。付費方案提供持續掃描及歷史記錄。", locale)} <a className="text-link" href="https://aiso-kappa.vercel.app/en/pricing">{en ? "Compare plans and pricing →" : zh("比較方案及價格 →", locale)}</a></p>
        <p className="small"><a className="text-link" href="mailto:aeo@fimmick.com">{en ? "Enterprise Custom: aeo@fimmick.com" : zh("企業自訂方案：aeo@fimmick.com", locale)}</a> · <a className="text-link" href={`/${locale}/products/social-listening`}>{en ? "For social conversation analysis, see Social Listening →" : zh("社交討論分析請參閱社交聆聽 →", locale)}</a></p>
      </div>
    </section>
  );
}
