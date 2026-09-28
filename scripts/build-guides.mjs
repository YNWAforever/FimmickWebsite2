#!/usr/bin/env node
/**
 * Builds the two downloadable guides (EN + Traditional Chinese) as PDFs in
 * public/downloads. Source text lives here so the files can be regenerated
 * and reviewed. Sample rows are labelled as samples inside each document.
 *
 *   node scripts/build-guides.mjs
 *   PREVIEWS_ONLY=1 node scripts/build-guides.mjs   # first-page previews only
 *
 * Also writes a first-page preview of each guide to public/media/guides.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "downloads");
const previewDir = path.join(root, "public", "media", "guides");
const previewsOnly = process.env.PREVIEWS_ONLY === "1";
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(previewDir, { recursive: true });
const logo = `data:image/png;base64,${fs.readFileSync(path.join(root, "public", "brand", "fimmick-logo.png")).toString("base64")}`;

const css = `
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", "Microsoft JhengHei", "PingFang HK", "Noto Sans TC", Arial, sans-serif; color: #161c35; font-size: 10.5pt; line-height: 1.5; margin: 0; }
  header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d1433; padding-bottom: 8px; margin-bottom: 14px; }
  header img { height: 22px; }
  header span { font-size: 8.5pt; color: #545d7a; }
  h1 { font-size: 20pt; margin: 0 0 6px; color: #0d1433; }
  h2 { font-size: 12.5pt; margin: 14px 0 6px; color: #0d1433; border-left: 4px solid #e5007f; padding-left: 8px; }
  p.lead { color: #545d7a; margin: 0 0 10px; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; font-size: 9.5pt; }
  th, td { border: 1px solid #c9cedb; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #eef0f5; }
  td.blank { height: 26px; }
  .sample { background: #fff3dc; color: #7a4b00; font-weight: 700; padding: 3px 8px; border-radius: 4px; font-size: 8.5pt; display: inline-block; }
  ul { margin: 4px 0 8px 18px; padding: 0; }
  li { margin: 2px 0; }
  .note { font-size: 8.5pt; color: #545d7a; border-top: 1px solid #e1e4ec; padding-top: 8px; margin-top: 14px; }
  .break { page-break-before: always; }
  .box { border: 1px solid #c9cedb; border-radius: 6px; min-height: 34px; margin: 4px 0 6px; }
`;

const docs = {
  "ai-readiness-checklist": {
    en: {
      title: "AI readiness checklist",
      lead: "Use this before committing to an AI workflow. It is an indicative self-assessment to structure a conversation — not a diagnosis or a validated maturity score.",
      rating: "Rating guide: 1 = not ready (blocking gaps) · 2 = needs preparation · 3 = ready to design a workflow.",
      areas: [
        ["Business value", ["Which recurring work would matter most if it were faster, more consistent or better reviewed?", "Who owns that outcome, and how would they recognise an improvement?"]],
        ["Workflow", ["Are the steps, inputs, outputs and handoffs written down?", "Do you know the common exceptions and who handles them?"]],
        ["Data & knowledge", ["Is there one approved source for the facts the work depends on?", "Who may access that data, and is consent in place where needed?"]],
        ["Systems", ["Which systems does the work touch today?", "Would an export be acceptable at first, or is a direct connection essential?"]],
        ["People", ["Who will review AI-prepared work, and do they have the time?", "What training would reviewers and operators need?"]],
        ["Governance", ["Which decisions must always stay with a named person?", "How will you record approvals, rejections and exceptions?"]],
      ],
      tableHead: ["Area", "Rating (1–3)", "Evidence / notes", "Owner"],
      sampleRow: ["Content production (SAMPLE)", "3", "Approved facts list exists; brand manager reviews weekly", "Brand manager"],
      bring: ["A list of 5–10 recurring workflows", "The owner of each workflow", "Examples of good and poor outputs", "Current policies on data and AI use"],
      bringTitle: "What to bring to a first conversation",
      footer: "FIMMICK — Agentic AI Platform & Business Solutions · fimmick.com · business@fimmick.com · Sample content is labelled. Published 28 Sep 2026.",
    },
    zh: {
      title: "AI 準備度清單",
      lead: "在投入 AI 流程前使用。此為參考性自我評估，用作整理討論方向，並非診斷或經驗證的成熟度分數。",
      rating: "評級指引：1＝未準備好（有阻礙性缺口）・2＝需要準備・3＝可以開始設計流程。",
      areas: [
        ["業務價值", ["哪些經常性工作若能更快、更一致或得到更好的審閱，會最有價值？", "誰負責該成果？他們如何判斷是否有改善？"]],
        ["流程", ["步驟、輸入、輸出及交接是否已有書面記錄？", "你是否了解常見的例外情況及由誰處理？"]],
        ["資料與知識", ["工作所依賴的資料，是否有單一的已確認來源？", "誰可以存取這些資料？如有需要，是否已取得同意？"]],
        ["系統", ["這項工作目前涉及哪些系統？", "初期以匯出檔形式可否接受？還是必須直接串接？"]],
        ["人員", ["誰會審閱 AI 準備的工作？他們是否有時間？", "審閱人及操作人員需要甚麼培訓？"]],
        ["管治", ["哪些決定必須一直由指定人員作出？", "你會如何記錄批准、拒絕及例外？"]],
      ],
      tableHead: ["範疇", "評級（1–3）", "證據／備註", "負責人"],
      sampleRow: ["內容製作（示例）", "3", "已有已確認資料清單；品牌經理每週審閱", "品牌經理"],
      bring: ["5–10 個經常性流程清單", "每個流程的負責人", "合格與不合格輸出的例子", "現行資料及 AI 使用政策"],
      bringTitle: "首次會面前可準備的資料",
      footer: "FIMMICK — 企業 AI 智能體平台與業務解決方案 · fimmick.com · business@fimmick.com · 示例內容已標示。發布日期：2026 年 9 月 28 日。",
    },
  },
  "workflow-planning-worksheet": {
    en: {
      title: "Workflow planning worksheet",
      lead: "Describe one workflow before discussing automation. Fill in the blank sheet; the second page shows a completed sample.",
      fields: ["Workflow name and owner", "Trigger — what starts the work?", "Inputs — which approved sources does it use?", "Tasks AI may prepare (and what it must not do)", "Human decisions — who approves, edits or returns?", "Exceptions — what goes straight to a person?", "Output — what is delivered, in what format?", "Record — what should be kept for next time?"],
      sampleTitle: "Completed sample — product launch content",
      sample: ["Launch content · Brand manager", "Launch brief approved", "Approved facts list (capacity, material, colours); no price supplied", "Draft captions and invitation copy from the facts. Must not add claims, prices or publish.", "Brand manager approves, edits or returns each item; edits reset approval", "Any new claim; colour names not in the list", "Reviewed caption + invitation as a labelled text export", "Sources used, reviewer notes, returned items and why"],
      checklistTitle: "Human decision checklist",
      checklist: ["Every publishable item has a named approver", "Editing an approved item sends it back for review", "Sensitive or new claims always go to a person", "Sending, publishing and spending need explicit permission"],
      footer: "FIMMICK — Agentic AI Platform & Business Solutions · fimmick.com · business@fimmick.com · Page 2 is an illustrative sample. Published 28 Sep 2026.",
    },
    zh: {
      title: "流程規劃工作紙",
      lead: "在討論自動化之前，先描述一個流程。請填寫空白工作紙；第二頁為已填寫的示例。",
      fields: ["流程名稱及負責人", "觸發點——工作由甚麼開始？", "輸入——使用哪些已確認來源？", "AI 可準備的任務（及不可做的事）", "人手決策——由誰批准、修改或退回？", "例外——哪些情況直接交由專人處理？", "輸出——交付甚麼？以甚麼格式？", "記錄——下次需要保留甚麼？"],
      sampleTitle: "已填寫示例——新品推出內容",
      sample: ["新品內容・品牌經理", "新品簡報獲批", "已確認資料清單（容量、物料、顏色）；未提供價格", "根據資料草擬文案及邀請內容；不得加入宣稱、價錢或自行發布", "品牌經理批准、修改或退回每項內容；修改後須重新批准", "任何新宣稱；清單以外的顏色名稱", "經審閱的文案＋邀請，以已標示的文字檔匯出", "所用來源、審閱意見、被退回的內容及原因"],
      checklistTitle: "人手決策清單",
      checklist: ["每項可發布內容都有指定批核人", "已批准的內容一經修改即退回審閱", "敏感或新增宣稱一律交由專人處理", "發送、發布及支出須取得明確許可"],
      footer: "FIMMICK — 企業 AI 智能體平台與業務解決方案 · fimmick.com · business@fimmick.com · 第二頁為示例。發布日期：2026 年 9 月 28 日。",
    },
  },
};

function readinessHtml(d) {
  return `<header><img src="${logo}"><span>fimmick.com</span></header>
  <h1>${d.title}</h1><p class="lead">${d.lead}</p><p><strong>${d.rating}</strong></p>
  ${d.areas.map(([a, qs]) => `<h2>${a}</h2><ul>${qs.map((q) => `<li>${q}</li>`).join("")}</ul>`).join("")}
  <div class="break"></div><header><img src="${logo}"><span>${d.title}</span></header>
  <table><tr>${d.tableHead.map((h) => `<th>${h}</th>`).join("")}</tr>
  <tr>${d.sampleRow.map((c) => `<td style="background:#fff3dc">${c}</td>`).join("")}</tr>
  ${d.areas.map(([a]) => `<tr><td>${a}</td><td class="blank"></td><td class="blank"></td><td class="blank"></td></tr>`).join("")}</table>
  <h2>${d.bringTitle}</h2><ul>${d.bring.map((b) => `<li>${b}</li>`).join("")}</ul>
  <p class="note">${d.footer}</p>`;
}

function worksheetHtml(d) {
  return `<header><img src="${logo}"><span>fimmick.com</span></header>
  <h1>${d.title}</h1><p class="lead">${d.lead}</p>
  ${d.fields.map((f) => `<h2>${f}</h2><div class="box"></div>`).join("")}
  <div class="break"></div><header><img src="${logo}"><span>${d.title}</span></header>
  <h1 style="font-size:15pt">${d.sampleTitle} <span class="sample">SAMPLE / 示例</span></h1>
  <table>${d.fields.map((f, i) => `<tr><th style="width:38%">${f}</th><td>${d.sample[i]}</td></tr>`).join("")}</table>
  <h2>${d.checklistTitle}</h2><ul>${d.checklist.map((c) => `<li>☐ ${c}</li>`).join("")}</ul>
  <p class="note">${d.footer}</p>`;
}

const browser = await chromium.launch();
try {
  for (const [slug, langs] of Object.entries(docs)) {
    for (const [key, file] of [["en", "en"], ["zh", "zh-hant"]]) {
      const d = langs[key];
      const body = slug === "ai-readiness-checklist" ? readinessHtml(d) : worksheetHtml(d);
      const page = await browser.newPage();
      await page.setContent(`<!doctype html><html lang="${key === "en" ? "en" : "zh-Hant-HK"}"><head><meta charset="utf-8"><title>${d.title}</title><style>${css}</style></head><body>${body}</body></html>`);
      const target = path.join(out, `fimmick-${slug}-${file}.pdf`);
      if (!previewsOnly) {
        await page.pdf({ path: target, format: "A4", printBackground: true, margin: { top: "16mm", bottom: "18mm", left: "16mm", right: "16mm" } });
        console.log(path.basename(target), fs.statSync(target).size);
      }
      // First-page preview for the Resources cards: the same HTML at A4 width with the PDF margins.
      await page.setViewportSize({ width: 794, height: 1123 });
      await page.addStyleTag({ content: "body{margin:0;padding:60px 60px 68px;background:#fff}" });
      // Stop at the second page's header so the preview shows page one only.
      const pageTwo = await page.evaluate(() => document.querySelectorAll("header")[1]?.getBoundingClientRect().top ?? 1123);
      const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 794, height: Math.min(1123, Math.floor(pageTwo) - 24) } });
      const preview = path.join(previewDir, `${slug}-${file}.webp`);
      await sharp(shot).resize({ width: 480 }).webp({ quality: 80 }).toFile(preview);
      console.log(path.relative(root, preview), fs.statSync(preview).size);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
