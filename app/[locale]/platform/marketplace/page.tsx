import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { workflowTemplates } from "@/content/platform-pages";
import { productById } from "@/content/products";
import { serviceById } from "@/content/services";
import { solutionById } from "@/content/solutions";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

const copy = {
  title: { en: "Workflow templates", zh: "流程範本" },
  lead: {
    en: "Reusable starting patterns for common workflows. A template speeds up design, but every workflow that runs is configured around your own data, rules, reviewers and systems.",
    zh: "常見流程的可重用起步範本。範本可加快設計，但每個實際運作的流程都會按你的資料、規則、審閱人及系統配置。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/platform/marketplace", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function TemplatesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: en ? "Platform" : zh("平台", locale), path: "/platform" }, { name: t(copy.title, locale), path: "/platform/marketplace" }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Template library" : zh("範本庫", locale)}
        title={en ? "Start from a proven pattern. Configure it for your work." : zh("由成熟的範本開始，按你的工作配置。", locale)}
        lead={t(copy.lead, locale)}
        actions={<LinkButton to={href(locale, paths.contact({ intent: "configuration" }))} variant="accent">{t(ui.discussConfiguration, locale)}</LinkButton>}
        notice={en ? "Templates are design starting points, not ready-to-buy apps. Availability of each is confirmed when we scope your workflow." : zh("範本是設計的起點，並非可即時購買的應用程式；每個範本的供應安排會在界定流程範圍時確認。", locale)}
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? `${workflowTemplates.length} templates` : zh(`${workflowTemplates.length} 個範本`, locale)} title={en ? "Inputs, output and reviewer for each" : zh("每個範本的輸入、輸出及審閱人", locale)} />
          <div className="grid grid-3">
            {workflowTemplates.map((w, i) => {
              const link = w.solution
                ? { to: paths.solution(w.solution), label: t(solutionById(w.solution).name, locale) }
                : w.service
                  ? { to: paths.service(w.service), label: t(serviceById(w.service).name, locale) }
                  : null;
              return (
                <article key={w.id} className="io-card">
                  <span className="number-tag">{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontSize: "1.1rem", margin: "8px 0" }}>{t(w.name, locale)}</h3>
                  <p className="muted small">{t(w.purpose, locale)}</p>
                  <dl className="stack small" style={{ margin: "14px 0 0" }}>
                    <div><dt style={{ fontWeight: 800 }}>{en ? "Inputs" : zh("輸入", locale)}</dt><dd style={{ margin: 0 }}>{t(w.inputs, locale)}</dd></div>
                    <div><dt style={{ fontWeight: 800 }}>{en ? "Output" : zh("輸出", locale)}</dt><dd style={{ margin: 0 }}>{t(w.output, locale)}</dd></div>
                    <div><dt style={{ fontWeight: 800, color: "var(--lime-ink)" }}>{en ? "Reviewer" : zh("審閱人", locale)}</dt><dd style={{ margin: 0 }}>{t(w.review, locale)}</dd></div>
                  </dl>
                  <p className="small" style={{ marginTop: 14 }}>
                    {w.product ? <><Link href={href(locale, paths.product(w.product))}>{productById(w.product).name}</Link>{link ? " · " : null}</> : null}
                    {link ? <Link href={href(locale, link.to)}>{link.label}</Link> : null}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "From template to running workflow" : zh("由範本到實際運作", locale)}</p>
            <h2>{en ? "What changes when a template is configured" : zh("範本配置後有何改變", locale)}</h2>
          </div>
          <ol className="steps">
            <li><h3>{en ? "Your sources" : zh("你的來源", locale)}</h3><p>{en ? "The template's inputs are replaced with your approved facts, libraries and exports." : zh("以你已確認的資料、答案庫及匯出檔取代範本輸入。", locale)}</p></li>
            <li><h3>{en ? "Your rules" : zh("你的規則", locale)}</h3><p>{en ? "Brand, compliance and format checks are written for your business." : zh("按你的業務制定品牌、合規及格式檢查。", locale)}</p></li>
            <li><h3>{en ? "Your reviewers" : zh("你的審閱人", locale)}</h3><p>{en ? "Named people are assigned to each review point." : zh("每個審閱環節都有指定人員。", locale)}</p></li>
            <li><h3>{en ? "Your systems" : zh("你的系統", locale)}</h3><p>{en ? "Outputs start as exports; connections are added only when agreed." : zh("輸出先以匯出檔提供，串接只在議定後加入。", locale)}</p></li>
          </ol>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Pick a template to start from" : zh("選擇一個範本開始", locale)} primary={{ label: t(ui.discussConfiguration, locale), to: paths.contact({ intent: "configuration" }) }} secondary={{ label: en ? "AI agents & tasks" : zh("AI 智能體與任務", locale), to: "/platform/agents" }} />
    </>
  );
}
