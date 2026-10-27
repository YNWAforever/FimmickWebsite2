import { SectionHead } from "@/components/ui";
import { zh, type Locale } from "@/lib/i18n";
import "@/app/styles/aiso.css";

type Copy = readonly [en: string, zh: string];

type Shot = {
  id: string;
  src: string;
  href: string;
  /** Wide frames for the two screens the page must show clearly. */
  lead?: boolean;
  title: Copy;
  caption: Copy;
  alt: Copy;
};

const product = "https://aiso-kappa.vercel.app/en";

/** Live Fimmick AISO screens. Pricing is a link-out and is not captured here. */
export const aisoProductShots: readonly Shot[] = [
  {
    id: "home-hero",
    src: "/media/products/aiso/home-hero.png",
    href: product,
    lead: true,
    title: ["Home", "主頁"],
    caption: ["Free check for whether AI tools can read and quote a website.", "免費檢查 AI 工具能否讀取並引用網站。"],
    alt: ["Fimmick AISO homepage with a website URL field, a Run Free Scan button, and an AI score preview.", "Fimmick AISO 主頁，顯示網站網址欄、免費掃描按鈕及 AI 評分預覽。"],
  },
  {
    id: "sample-report",
    src: "/media/products/aiso/sample-report.png",
    href: `${product}/sample-report`,
    lead: true,
    title: ["Sample report", "示例報告"],
    caption: ["Score, grade and prioritised fixes for the invented Example Brand.", "虛構 Example Brand 的評分、評級及優先修正。"],
    alt: ["Synthetic AISO sample report for Example Brand: 62 out of 100, Grade C, and a score-over-time chart.", "合成 AISO 示例報告，Example Brand 100 分中獲得 62 分、C 級，以及分數走勢圖。"],
  },
  {
    id: "scan",
    src: "/media/products/aiso/scan.png",
    href: `${product}/scan`,
    title: ["Free scan", "免費掃描"],
    caption: ["Enter a URL and run the readiness checks.", "輸入網址，執行準備度檢查。"],
    alt: ["AISO scan page titled Scan your website for AI search readiness, with a website URL field.", "AISO 掃描頁，標題為掃描網站的 AI 搜尋準備度，並有網站網址欄。"],
  },
  {
    id: "site-health",
    src: "/media/products/aiso/site-health.png",
    href: `${product}/platform/site-health`,
    title: ["Site health", "網站健康"],
    caption: ["Review crawl access and structured information before changing the site.", "改動網站前，先檢視爬取權限及結構化資料。"],
    alt: ["AISO site health page: website issues you can act on, from crawl access to structured information.", "AISO 網站健康頁，說明可處理的網站問題，涵蓋爬取權限至結構化資料。"],
  },
  {
    id: "ai-visibility",
    src: "/media/products/aiso/ai-visibility.png",
    href: `${product}/platform/ai-visibility`,
    title: ["AI visibility", "AI 可見度"],
    caption: ["Inspect sampled AI answers, one question at a time.", "逐條問題檢視抽樣的 AI 答案。"],
    alt: ["AISO AI visibility page for inspecting sampled answers to selected questions.", "AISO AI 可見度頁，用以檢視選定問題的抽樣答案。"],
  },
];

function text(copy: Copy, locale: Locale) {
  return locale === "en" ? copy[0] : zh(copy[1], locale);
}

function ShotCard({ shot, locale }: { shot: Shot; locale: Locale }) {
  return (
    <a className="card card--link aiso-shot" href={shot.href}>
      <span className="aiso-shot__frame">
        {/* eslint-disable-next-line @next/next/no-img-element -- product screenshot served from /media, same as guide previews */}
        <img src={shot.src} alt={text(shot.alt, locale)} width={1920} height={1113} loading="lazy" decoding="async" />
      </span>
      <span className="aiso-shot__copy">
        <h3>{text(shot.title, locale)}</h3>
        <p className="small muted">{text(shot.caption, locale)}</p>
        <span className="card-foot">
          {text(["Open in AISO", "在 AISO 開啟"], locale)} <span aria-hidden="true">→</span>
        </span>
      </span>
    </a>
  );
}

export function AisoProductShots({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const copy = (english: string, chinese: string) => (en ? english : zh(chinese, locale));
  const lead = aisoProductShots.filter((shot) => shot.lead);
  const rest = aisoProductShots.filter((shot) => !shot.lead);
  return (
    <section className="section section--surface" id="product-screens" aria-labelledby="aiso-product-screens-title">
      <div className="container stack" style={{ ["--stack" as string]: "28px" }}>
        <SectionHead
          titleId="aiso-product-screens-title"
          eyebrow={copy("Product screens", "產品畫面")}
          title={copy("The live AISO product", "實況 AISO 產品")}
          lead={copy(
            "Screens from Fimmick AISO. The walkthrough above follows the same sample report.",
            "以下畫面來自 Fimmick AISO。上方的準備度導覽沿用同一份示例報告。",
          )}
        />
        <div className="aiso-shots aiso-shots--lead">
          {lead.map((shot) => (
            <ShotCard key={shot.id} shot={shot} locale={locale} />
          ))}
        </div>
        <div className="grid grid-3 aiso-shots">
          {rest.map((shot) => (
            <ShotCard key={shot.id} shot={shot} locale={locale} />
          ))}
        </div>
        <p className="small muted">
          {copy(
            "The sample report is synthetic. Example Brand and example.invalid are invented, and no customer website was scanned to produce these screens.",
            "示例報告為合成資料。Example Brand 及 example.invalid 均屬虛構，這些畫面並非掃描客戶網站所得。",
          )}
        </p>
      </div>
    </section>
  );
}
