"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LinkButton, SectionHead } from "@/components/ui";
import { zh, type Locale } from "@/lib/i18n";
import "@/app/styles/aiso.css";

const scanUrl = "https://aiso-kappa.vercel.app/en/scan";
const reportUrl = "https://aiso-kappa.vercel.app/en/sample-report";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (callback: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const reducedSnapshot = () => window.matchMedia(motionQuery).matches;
const serverSnapshot = () => true;

function ScoreCount({ reduced }: { reduced: boolean }) {
  const [score, setScore] = useState(reduced ? 62 : 0);
  useEffect(() => {
    if (reduced) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 850, 1);
      setScore(Math.round(62 * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);
  return <strong>{reduced ? 62 : score}</strong>;
}

export function AisoReadiness({ locale }: { locale: Locale }) {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, reducedSnapshot, serverSnapshot);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = setInterval(() => setActiveStep((step) => (step + 1) % 4), 3500);
    return () => clearInterval(timer);
  }, [paused, reduced]);
  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);
  const selectStep = (step: number) => {
    setActiveStep(step);
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 8000);
  };
  const panelProps = (step: number) => ({
    id: `aiso-panel-${step}`,
    role: "tabpanel",
    "aria-labelledby": `aiso-tab-${step}`,
    "aria-hidden": activeStep !== step,
    inert: activeStep !== step,
    className: `aiso-stage${activeStep === step ? " is-active" : ""}`,
  });
  const en = locale === "en";
  const copy = (english: string, chinese: string) => en ? english : zh(chinese, locale);
  const fixes = [
    ["Review readable page content", "檢視可讀取的網頁內容", "Content Extractability", "內容擷取能力", "Make key service details easier to extract.", "讓主要服務資料更容易被擷取。"],
    ["Add an llms.txt file", "新增 llms.txt 檔案", "llms.txt Present", "llms.txt 檔案", "Give AI tools a concise guide to your website.", "為 AI 工具提供精簡的網站指南。"],
    ["Review FAQ structured data", "檢視 FAQ 結構化資料", "FAQ Schema", "FAQ 結構描述", "Describe visible questions and answers with JSON-LD.", "以 JSON-LD 描述網頁上的常見問題與答案。"],
  ];
  return (
    <section className="section aiso-section" id="example">
      <div className="container stack">
        <SectionHead eyebrow={copy("Website readiness for AI search", "網站 AI 搜尋準備度")} title={copy("From a website scan to your next fix.", "從網站掃描到下一步修正。")} lead={copy("See the score, inspect the evidence and review practical files for your website. 20 checks. Three areas. 100 points.", "查看評分、檢視證據，並審閱適用於網站的實用檔案。20 項檢查、三個範疇、100 分。")} />
        <div className="aiso-screen" aria-label={copy("AISO readiness product preview", "AISO 準備度產品預覽")}>
          <div className="aiso-screen__bar"><span className="aiso-brand"><span aria-hidden="true">ϟ</span> Fimmick <b>AISO</b></span><span className="aiso-badge">{copy("Synthetic sample · no customer data", "合成示例 · 不含客戶資料")}</span></div>
          <ol role="tablist" className="aiso-steps" aria-label={copy("Readiness workflow", "準備度流程")}>
            {[copy("Scan", "掃描"), copy("Score & grade", "評分與評級"), copy("Top fixes", "優先修正"), "Fix Pack"].map((step, index) => <li key={step} role="presentation"><button type="button" role="tab" id={`aiso-tab-${index}`} aria-controls={`aiso-panel-${index}`} aria-selected={activeStep === index} onClick={() => selectStep(index)}><span>{String(index + 1).padStart(2, "0")}</span>{step}</button></li>)}
          </ol>
          <div className="aiso-screen__body" data-active-step={activeStep} data-paused={paused}>
            <div {...panelProps(0)}>
            <div className="aiso-scan"><div><span className="aiso-label">{copy("Website URL", "網站網址")}</span><code>https://example.invalid</code></div><a className="aiso-button" href={scanUrl}>{copy("Run Free Scan", "免費掃描")} <span aria-hidden="true">↗</span></a></div>
            </div>
            <div {...panelProps(1)}>
            <div className="aiso-report-head"><div><span className="aiso-label">{copy("READINESS REPORT", "準備度報告")}</span><h3>Example Brand</h3><p>{copy("AI tools can reach the site. Key service details need work.", "AI 工具能夠存取網站；主要服務資料仍需改善。")}</p></div><a href={reportUrl}>{copy("Open sample report", "開啟示例報告")} ↗</a></div>

              <div className="aiso-panel"><h4>{copy("Current AISO score", "目前 AISO 評分")}</h4><div className="aiso-score-row"><div className="aiso-score" role="img" aria-label={copy("62 out of 100, Grade C", "100 分中獲得 62 分，C 級")}><div>{activeStep === 1 ? <ScoreCount key={String(reduced)} reduced={reduced} /> : <strong>0</strong>}<span>/100</span></div></div><div><strong className="aiso-grade">{copy("Grade C", "C 級")}</strong><span className="aiso-improvement">↑ 7 {copy("points", "分")}</span><p>{copy("Measured change from the closest eligible scan.", "與最近一次可比較掃描的實測差異。")}</p></div></div><div className="aiso-areas">{[["Core", 28, 45], ["Extended", 19, 30], ["GEO", 15, 25]].map(([name, score, max]) => <div key={name}><span>{name}<b>{score}/{max}</b></span><meter min="0" max={Number(max)} value={Number(score)} aria-label={String(name)} /></div>)}</div><p className="aiso-note">{copy("Illustrative score and change, taken from the synthetic sample report.", "評分及變化來自合成示例報告，僅供說明。")}</p></div>
            </div>
            <div {...panelProps(2)}>
              <div className="aiso-panel"><h4>{copy("Top 3 fixes", "三項優先修正")}</h4><ol className="aiso-fixes">{fixes.map(([title, titleZh, category, categoryZh, detail, detailZh], index) => <li key={title}><span>{index + 1}</span><div><h5>{copy(title, titleZh)}</h5><small>{copy(category, categoryZh)}</small><p>{copy(detail, detailZh)}</p></div></li>)}</ol></div>
            </div>
            <div {...panelProps(3)}>
            <div className="aiso-pack"><div className="aiso-pack__head"><div><span className="aiso-label">{copy("YOUR NEXT STEP", "下一步")}</span><h4>Fix Pack</h4></div><span className="aiso-badge">{copy("Review before applying", "套用前請先審閱")}</span></div><div className="aiso-files">{[["llms.txt", "Website guide for AI tools", "AI 工具的網站指南"], ["robots.txt patch", "Suggested crawler access rules", "建議的爬蟲存取規則"], ["FAQ JSON-LD", "Structured questions & answers", "結構化常見問題與答案"]].map(([name, detail, detailZh]) => <div key={name}><span className="aiso-file-icon" aria-hidden="true">⌘</span><strong>{name}</strong><p>{copy(detail, detailZh)}</p></div>)}</div><p className="aiso-note">{copy("Suggested outputs for human review. Create a free account in AISO to save your result and Fix Pack; apply approved changes yourself.", "建議輸出需由人員審閱。於 AISO 建立免費帳戶以儲存結果及修正套件，再自行套用已核准的修改。")}</p></div>
            </div>
          </div>
          <div className="aiso-screen__foot"><span>{copy("Readiness for", "準備度涵蓋")} <b>ChatGPT · Google AI · Perplexity · Claude · Gemini</b></span><span>{copy("A point-in-time diagnostic", "特定時間的診斷")}</span></div>
        </div>
        <p className="small muted">{copy("This product preview uses invented sample data: no website was scanned to produce it. A readiness score is not a guarantee of citations or visibility in AI answers.", "本產品預覽使用虛構示例資料，並未掃描網站來產生此預覽。準備度評分並不保證 AI 答案會引用或展示你的網站。")}</p>
        <div className="btn-row"><LinkButton to={scanUrl} variant="accent">{copy("Run free scan", "免費掃描")}</LinkButton><LinkButton to={reportUrl} variant="ghost">{copy("View sample report", "查看示例報告")}</LinkButton></div>
        <p className="small muted">{copy("No sign-up or credit card for the scan itself. Paid plans support ongoing scans and history.", "掃描本身毋須註冊或信用卡。付費方案提供持續掃描及歷史記錄。")} <a className="text-link" href="https://aiso-kappa.vercel.app/en/pricing">{copy("Compare plans and pricing →", "比較方案及價格 →")}</a></p>
        <p className="small"><a className="text-link" href="mailto:aeo@fimmick.com">{copy("Enterprise Custom: aeo@fimmick.com", "企業自訂方案：aeo@fimmick.com")}</a></p>
      </div>
    </section>
  );
}
