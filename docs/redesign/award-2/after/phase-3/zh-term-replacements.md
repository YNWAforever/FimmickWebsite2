# Phase 3 — zh term replacements

Every occurrence of an old term on `main` (06c0786) that the branch replaced, with ±10 characters of context from the branch. `記錄` is kept where it is the verb.

## 審批 → 批核

| File | Old term count | New text (context) |
| --- | --- | --- |
| `app/[locale]/platform/architecture/page.tsx` | 1 → 0 | 「資料 → 任務 → 批核 → 記錄", lo」 |
| `app/[locale]/platform/governance/page.tsx` | 1 → 0 | 「ce" : zh("批核及記錄層的實際運作"」 |
| `app/[locale]/platform/page.tsx` | 2 → 0 | 「料、AI 任務及人手批核連成團隊可以運作及檢」 |
| `content/ecosystem.ts` | 1 → 0 | 「平台層：資料、任務、批核、記錄", "涵蓋四」 |
| `content/home.ts` | 1 → 0 |  |
| `content/platform.ts` | 1 → 0 | 「fs", zh: "批核與交接" },」 |

## 記錄 → 紀錄

| File | Old term count | New text (context) |
| --- | --- | --- |
| `app/[locale]/ai-transformation/[slug]/page.tsx` | 6 → 5 | 「lete", "變更紀錄完整")],」 |
| `components/blocks.tsx` | 6 → 5 | 「ry: zh("變更紀錄", locale)」 |
| `content/cases.ts` | 10 → 8 | 「人員審閱", "保留紀錄，令下一輪有所改善"」 「閱建議，CRM 商機紀錄為下一輪提供依據。"」 「進草稿，管理層直接從紀錄查看銷售管道狀況。"」 |
| `content/home.ts` | 1 → 0 | 「審閱批准，匯出時連同紀錄。",」 |
| `content/industries.ts` | 6 → 5 | 「zh: "保留變更紀錄。" } },」 |
| `content/platform.ts` | 7 → 5 | 「nt", zh: "紀錄與改善" },」 「", zh: "匯出紀錄" },」 |
| `content/products.ts` | 14 → 12 | 「預覽／匯出檔及變更紀錄。" },」 「"匯出或發布並保留紀錄。" } },」 |
| `content/solutions.ts` | 13 → 8 | 「"選定的內容連同審閱紀錄一併匯出，方便日後重」 「覽或匯出檔，以及變更紀錄。",」 「或匯出檔", "變更紀錄"],」 「匯出或發布，並保留紀錄。" } },」 「zh: "變更紀錄會顯示哪個欄位改動了」 |
| `content/transformation.ts` | 5 → 4 | 「", zh: "審閱紀錄、修改、例外" },」 |

## 電子商貿 → 電商

| File | Old term count | New text (context) |
| --- | --- | --- |
| `content/functions.ts` | 1 → 0 | 「"適合營運、數碼及電商主管" },」 |
| `content/platform-pages.ts` | 1 → 0 | 「"連繫宣傳、CRM、電商及營運資料，讓團隊得」 |

## 預約產品示範 → 申請產品示範

| File | Old term count | New text (context) |
| --- | --- | --- |
| `app/[locale]/cases-and-demos/page.tsx` | 1 → 0 | 「mo" : zh("申請產品示範", locale)」 |
| `app/[locale]/resources/videos/page.tsx` | 1 → 0 | 「mo" : zh("申請產品示範", locale)」 |
| `content/ui.ts` | 1 → 0 | 「mo", zh: "申請產品示範" },」 |
| `lib/intent.ts` | 1 → 0 | 「mo", zh: "申請產品示範" },」 |

## 成功案例 → 客戶案例

| File | Old term count | New text (context) |
| --- | --- | --- |
| `app/[locale]/case-studies/[slug]/page.tsx` | 2 → 0 | 「es" : zh("客戶案例", locale)」 「es" : zh("客戶案例", locale)」 |
| `app/[locale]/case-studies/page.tsx` | 1 → 0 | 「es", zh: "客戶案例" },」 |
| `app/[locale]/cases-and-demos/page.tsx` | 1 → 0 | 「es" : zh("客戶案例", locale)」 |
| `content/home.ts` | 1 → 0 |  |
| `content/nav.ts` | 2 → 0 | 「es", zh: "客戶案例" },」 「es", zh: "客戶案例" },」 |

## ・ → ·

| File | Old term count | New text (context) |
| --- | --- | --- |
| `app/[locale]/cases-and-demos/page.tsx` | 1 → 0 | 「: zh("流程示範·示例資料", loc」 |
| `app/[locale]/events/[slug]/page.tsx` | 1 → 0 | 「: zh('已舉行·${formatDa」 |
| `app/[locale]/growth/page.tsx` | 2 → 0 | 「" : zh("獲客·轉化·留客", lo」 |
| `app/[locale]/platform/page.tsx` | 1 → 0 | 「: zh("四個層面·一個情境", loc」 |
| `app/[locale]/resources/page.tsx` | 1 → 0 | 「"英文·繁中", local」 |
| `components/blocks.tsx` | 1 → 0 | 「: zh("頁面預覽·示例", local」 |
| `components/diagrams/FlowScene.tsx` | 2 → 0 | 「stagram 文案·草稿", local」 「錄 REC-0412·附來源、修改及審閱意」 |
| `components/home/sections.tsx` | 2 → 0 | 「: zh("洞察簡報·示例品牌", loc」 「locale)} · {en ? "Sa」 「h("影片·42 秒", loc」 |
| `content/cases.ts` | 2 → 0 | 「sector.zh}·${d.market」 「: "FIMMICK·內部營運" },」 |
| `content/examples.ts` | 5 → 0 | 「鎖扣杯蓋水樽。海港藍·石灰·青檸。",」 「zh: "雙層不銹鋼·鎖扣杯蓋" }, {」 「zh: "雙層不銹鋼·鎖扣杯蓋" }, {」 「zh: "流程示範·示例資料" };」 |
| `content/functions.ts` | 2 → 0 | 「"已準備 12 項·3 項因語調退回"]」 「"已草擬 9 則回覆·2 則轉交專人（價格」 |
| `content/home.ts` | 8 → 0 | 「zh: "示例成果·推出文案" } as」 「zh: "品牌經理·調整語氣後批准" }」 「h: "網站表格·10:12" } a」 「: "簡報：推出貼文·Instagram·」 「", zh: "指南·PDF·2 頁" }」 「, zh: "工作坊·按需安排" } as」 |
| `content/platform.ts` | 1 → 0 | 「zh: "示例品牌·可重用水樽" },」 |
| `content/resources.ts` | 1 → 0 | 「zh: "流程示範·示例資料。由網站示例」 |
| `content/ui.ts` | 1 → 0 | 「zh: "互動示例·資料為虛構" },」 |

Total occurrences replaced: 67.
