import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, type L, type Locale } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { workstreams, workstreamById } from "@/content/transformation";
import { caseBySlug } from "@/content/cases";
import { ui } from "@/content/ui";
import type { WorkstreamId } from "@/content/types";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { CaseCards, EnquirySection, FlowStrip, HeatmapTable, ProductCards, RelatedSection, ServiceCards } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(workstreams.map((w) => w.id));
}

const find = (slug: string) => workstreams.find((w) => w.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const w = find((await params).slug);
  if (!w) return {};
  return pageMetadata({ locale, path: paths.workstream(w.id), title: t(w.name, locale), description: t(w.leadershipQuestion, locale) });
}

function Table({ locale, head, rows, caption }: { locale: Locale; head: L[]; rows: L[][]; caption: L }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <caption style={{ captionSide: "bottom", padding: "10px 16px", textAlign: "left", fontSize: "var(--fs-micro)", color: "var(--muted)" }}>{t(caption, locale)}</caption>
        <thead>
          <tr>{head.map((h) => <th scope="col" key={h.en}>{t(h, locale)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th scope="row" key={j} style={{ background: "var(--surface)", textTransform: "none", letterSpacing: 0, color: "var(--ink)", fontSize: "var(--fs-small)" }}>{t(c, locale)}</th> : <td key={j}>{t(c, locale)}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sampleCaption: L = { en: "Illustrative sample — not client data.", zh: "示例——並非客戶資料。" };
const x = (en: string, zh: string): L => ({ en, zh });

/** Concrete sample artifacts for each decision pathway. */
function Artifact({ id, locale }: { id: WorkstreamId; locale: Locale }) {
  const en = locale === "en";
  if (id === "ai-readiness-maturity") {
    return (
      <div className="stack" style={{ ["--stack" as string]: "24px" }}>
        <HeatmapTable locale={locale} />
        <h3>{en ? "Opportunity portfolio (sample)" : "機會組合（示例）"}</h3>
        <Table locale={locale} caption={sampleCaption} head={[x("Workflow", "流程"), x("Value", "價值"), x("Readiness", "準備度"), x("Main dependency", "主要依賴"), x("Recommendation", "建議")]} rows={[
          [x("Content production", "內容製作"), x("High", "高"), x("Ready", "已準備"), x("Approved facts list", "已確認資料清單"), x("First workflow", "首個流程")],
          [x("Enquiry follow-up", "查詢跟進"), x("High", "高"), x("Needs preparation", "需準備"), x("Answer library", "答案庫"), x("Prepare, then start", "先準備後開始")],
          [x("Management reporting", "管理報告"), x("Medium", "中"), x("Not ready", "未準備"), x("Metric definitions", "指標定義"), x("Wait", "暫緩")],
        ]} />
        <h3>{en ? "Constraint register (sample)" : "限制清單（示例）"}</h3>
        <Table locale={locale} caption={sampleCaption} head={[x("Constraint", "限制"), x("Type", "類型"), x("Owner", "負責人"), x("Needed before", "須於何時前解決")]} rows={[
          [x("Product claims not in one place", "產品宣稱分散各處"), x("Data", "資料"), x("Brand manager", "品牌經理"), x("Content workflow", "內容流程")],
          [x("No agreed enquiry categories", "未有議定查詢類別"), x("Process", "流程"), x("Head of Sales", "銷售主管"), x("Follow-up workflow", "跟進流程")],
          [x("CRM write access undefined", "未界定 CRM 寫入權限"), x("Systems", "系統"), x("IT lead", "IT 主管"), x("Any CRM connection", "任何 CRM 串接")],
        ]} />
      </div>
    );
  }
  if (id === "strategy-roadmap") {
    return (
      <div className="stack" style={{ ["--stack" as string]: "24px" }}>
        <Table locale={locale} caption={x("Illustrative sequence. Timing is agreed per engagement; no durations are implied.", "示例次序。時間按項目議定，此處不代表任何時長。")} head={[x("Stage", "階段"), x("Workflows", "流程"), x("Reusable capability", "可重用能力"), x("Owner", "負責人"), x("Decision gate", "決策關卡")]} rows={[
          [x("Prove", "驗證"), x("Content production", "內容製作"), x("Approved facts library; review step", "已確認資料庫；審閱步驟"), x("CMO", "市場總監"), x("Quality of reviewed outputs", "已審閱輸出的質素")],
          [x("Extend", "擴展"), x("Enquiry follow-up", "查詢跟進"), x("Answer library; routing rules", "答案庫；分派規則"), x("Head of Sales", "銷售主管"), x("Response ownership visible", "回應責任清晰可見")],
          [x("Connect", "連接"), x("Listing updates", "資料更新"), x("Structured records; CMS connection", "結構化紀錄；CMS 串接"), x("Digital lead", "數碼主管"), x("Change history complete", "變更記錄完整")],
        ]} />
        <h3>{en ? "Target operating model (sample)" : "目標營運模式（示例）"}</h3>
        <Table locale={locale} caption={sampleCaption} head={[x("Layer", "層面"), x("Leaders", "管理層"), x("Teams", "團隊"), x("AI tasks", "AI 任務"), x("Systems", "系統")]} rows={[
          [x("Purpose", "目的"), x("Set outcomes", "訂立成果"), x("Own workflows", "負責流程"), x("—", "—"), x("—", "—")],
          [x("Work", "工作"), x("Review evidence", "檢視證據"), x("Approve outputs", "批准輸出"), x("Prepare drafts", "準備草稿"), x("Store records", "儲存記錄")],
          [x("Change", "轉變"), x("Decide next stage", "決定下一階段"), x("Report exceptions", "匯報例外"), x("—", "—"), x("Provide history", "提供歷史記錄")],
        ]} />
      </div>
    );
  }
  if (id === "workflow-agent-design") {
    return (
      <div className="stack" style={{ ["--stack" as string]: "24px" }}>
        <h3>{en ? "Workflow blueprint (sample: product launch content)" : "流程藍圖（示例：新品推出內容）"}</h3>
        <FlowStrip locale={locale} steps={[
          { title: x("Trigger: launch brief approved", "觸發：新品簡報獲批"), copy: x("Inputs: brief, approved facts, formats.", "輸入：簡報、已確認資料、格式。") },
          { title: x("Task: prepare variants", "任務：準備不同版本"), copy: x("Allowed: draft copy from facts. Not allowed: add claims, publish.", "獲准：根據資料草擬；不准：加入宣稱、發布。") },
          { title: x("Decision: brand review", "決定：品牌審閱"), copy: x("Approve, edit or return. Edits reset approval.", "批准、修改或退回；修改後須重新批准。") },
          { title: x("Output: export + record", "輸出：匯出＋記錄"), copy: x("Exception route: missing facts go back to the product team.", "例外路線：缺漏資料交回產品團隊。") },
        ]} />
        <h3>{en ? "Input/output contract (sample)" : "輸入／輸出規格（示例）"}</h3>
        <Table locale={locale} caption={sampleCaption} head={[x("Step", "步驟"), x("Required input", "必需輸入"), x("Permitted actions", "獲准行動"), x("Output", "輸出"), x("Quality criteria", "質素準則")]} rows={[
          [x("Prepare variants", "準備版本"), x("Approved facts; format list", "已確認資料；格式清單"), x("Draft text", "草擬文字"), x("2 variants per format", "每格式 2 個版本"), x("Only listed facts; no price", "只用所列資料；不提價錢")],
          [x("Brand review", "品牌審閱"), x("Drafts with facts shown", "附資料的草稿"), x("Approve / edit / return", "批准／修改／退回"), x("Decision + notes", "決定＋意見"), x("Named reviewer recorded", "記錄指定審閱人")],
          [x("Export", "匯出"), x("Approved items", "已批准內容"), x("Create file", "建立檔案"), x("Labelled export", "已標示的匯出檔"), x("Record ID attached", "附紀錄編號")],
        ]} />
      </div>
    );
  }
  return (
    <div className="stack" style={{ ["--stack" as string]: "24px" }}>
      <h3>{en ? "Responsibility matrix (sample)" : "責任矩陣（示例）"}</h3>
      <Table locale={locale} caption={x("Illustrative sample. P = prepares, R = reviews, A = approves, I = informed.", "示例。P＝準備，R＝審閱，A＝批准，I＝知會。")} head={[x("Step", "步驟"), x("AI task", "AI 任務"), x("Content lead", "內容主管"), x("Brand manager", "品牌經理"), x("Risk owner", "風險負責人")]} rows={[
        [x("Draft content", "草擬內容"), x("P", "P"), x("R", "R"), x("I", "I"), x("—", "—")],
        [x("Approve for use", "批准使用"), x("—", "—"), x("R", "R"), x("A", "A"), x("I", "I")],
        [x("New claim requested", "要求新增宣稱"), x("—", "—"), x("P", "P"), x("R", "R"), x("A", "A")],
      ]} />
      <div className="grid grid-2">
        <div className="io-card">
          <h3>{en ? "Review checklist (sample)" : "審閱清單（示例）"}</h3>
          <ul className="check-list small">
            {(en ? ["Every claim appears in the approved facts", "No price, offer or date unless supplied", "Tone matches brand rules", "Sensitive topics routed to a person", "Decision and notes recorded"] : ["每項宣稱均見於已確認資料", "除非已提供，否則不提及價錢、優惠或日期", "語調符合品牌規範", "敏感話題轉交專人", "記錄決定及意見"]).map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
        <div className="io-card">
          <h3>{en ? "Adoption plan (sample)" : "推行計劃（示例）"}</h3>
          <ul className="dot-list small">
            {(en ? ["Reviewer calibration session with real drafts", "Weekly look at corrections and returned items", "Monthly rule and fact-list update", "Adoption measures: share of work through the workflow, returns, exceptions"] : ["以真實草稿進行審閱人標準校準", "每週檢視修改及退回內容", "每月更新規則及資料清單", "推行指標：經流程處理的工作比例、退回、例外"]).map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default async function WorkstreamPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const w = find((await params).slug);
  if (!w) notFound();
  const en = locale === "en";
  const contact = paths.contact({ intent: "transformation", workstream: w.id });
  const internal = caseBySlug("fimmick-ai-native-operating-model")!;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "AI Transformation" : "AI 轉型", path: "/ai-transformation" }, { name: t(w.name, locale), path: paths.workstream(w.id) }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "AI Transformation" : "AI 轉型", path: "/ai-transformation" }, { label: t(w.name, locale) }]}
        eyebrow={`${w.code} · ${t(w.name, locale)}`}
        title={t(w.leadershipQuestion, locale)}
        lead={t(w.answer, locale)}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{en ? "Discuss this pathway" : "討論此路徑"}</LinkButton>
            <LinkButton to="#artifact" variant="ghost">{en ? "See the sample output" : "查看成果示例"}</LinkButton>
          </>
        }
        aside={
          <div className="io-card">
            <h2 style={{ fontSize: "1rem", marginBottom: 8 }}>{en ? "Who this is for" : "適合對象"}</h2>
            <p className="small">{t(w.buyerFit, locale)}</p>
            <h2 style={{ fontSize: "1rem", margin: "16px 0 8px" }}>{t(ui.startingScope, locale)}</h2>
            <p className="small">{t(w.scope, locale)}</p>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "The problem" : "問題"} title={t(w.problem, locale)} />
          <div className="io-grid">
            <div className="io-card">
              <h3>{t(ui.inputs, locale)}</h3>
              <ul className="dot-list">{t(w.inputs, locale).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="io-card">
              <h3>{en ? "What we look at" : "我們會審視"}</h3>
              <ul className="check-list">{w.lenses.map((l) => <li key={l.title.en}><strong>{t(l.title, locale)}</strong> — {t(l.copy, locale)}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container">
          <SectionHead eyebrow={en ? "Approach" : "方法"} title={en ? "How the work runs" : "工作如何進行"} />
          <ol className="steps steps--row">
            {w.stages.map((s) => (
              <li key={s.title.en}>
                <h3>{t(s.title, locale)}</h3>
                <p>{t(s.copy, locale)}</p>
                <ul className="chips" style={{ marginTop: 12 }}>{t(s.details, locale).map((d) => <li key={d}><span className="chip">{d}</span></li>)}</ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section" id="artifact">
        <div className="container">
          <SectionHead eyebrow={t(w.artifactLabel, locale)} title={en ? "What you receive" : "你會得到"} lead={w.deliverables.map((d) => `${t(d.title, locale)}: ${t(d.copy, locale)}`).join(" ")} />
          <Artifact id={w.id} locale={locale} />
        </div>
      </section>
      <RelatedSection title={t(ui.relatedServices, locale)} tint>
        <ServiceCards locale={locale} ids={w.services} />
      </RelatedSection>
      {w.products.length ? (
        <RelatedSection title={en ? "Platform products this often leads to" : "常見的後續平台產品"}>
          <ProductCards locale={locale} ids={w.products} />
        </RelatedSection>
      ) : null}
      <RelatedSection title={en ? "Evidence" : "實證"} tint>
        <CaseCards locale={locale} items={[internal]} />
      </RelatedSection>
      <section className="section section--tight">
        <div className="container related-block">
          <h2>{en ? "Related pathways" : "相關路徑"}</h2>
          <div className="related-grid">
            {w.related.map((id) => {
              const r = workstreamById(id);
              return (
                <Link key={id} className="card card--link" href={href(locale, paths.workstream(id))}>
                  <span className="number-tag">{r.code}</span>
                  <h3>{t(r.name, locale)}</h3>
                  <p className="small muted">{t(r.leadershipQuestion, locale)}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? `Discuss ${t(w.name, locale)}` : `討論${t(w.name, locale)}`} body={t(w.scope, locale)} primary={{ label: en ? "Discuss this pathway" : "討論此路徑", to: contact }} secondary={{ label: en ? "Request a workshop" : "申請工作坊", to: paths.contact({ intent: "workshop", workstream: w.id }) }} />
    </>
  );
}
