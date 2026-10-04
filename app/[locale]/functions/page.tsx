import type { Metadata } from "next";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { businessFunctions } from "@/content/functions";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EditorialList, EnquirySection } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

const copy = {
  title: { en: "Workflows by business function", zh: "按業務職能劃分的流程" },
  lead: {
    en: "The same platform, organised around the teams that use it. For each function: the recurring work AI can prepare, what your people still decide, and where to start.",
    zh: "同一個平台，按使用它的團隊來組織。每個職能都列明 AI 可以準備的重複工作、仍由你的團隊決定的事項，以及如何開始。",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/functions", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function FunctionsHub({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t(ui.home, locale), path: "/" }, { name: t(copy.title, locale), path: "/functions" }])} />
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Platform" : zh("平台", locale), path: "/platform" }, { label: t(copy.title, locale) }]}
        eyebrow={en ? "Platform & Solutions" : zh("平台與解決方案", locale)}
        title={en ? "Find the work your team repeats every week." : zh("找出團隊每星期都在重複的工作。", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, paths.contact({ intent: "configuration" }))} variant="accent">{t(ui.discussScope, locale)}</LinkButton>
            <LinkButton to={href(locale, "/solutions")} variant="ghost">{t(ui.exploreSolutions, locale)}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={en ? "Seven functions" : zh("七個職能", locale)} title={en ? "Choose the team" : zh("選擇團隊", locale)} lead={en ? "Each page shows four example workflows with their inputs, the prepared output and the human decision." : zh("每頁列出四個流程例子，包括輸入、準備好的輸出及由人作出的決定。", locale)} />
          <EditorialList
            rows={businessFunctions.map((f) => ({
              id: f.id,
              href: href(locale, paths.function(f.id)),
              label: t(f.owner, locale),
              headline: t(f.name, locale),
              line: t(f.summary, locale),
              aside: (
                <ul className="editorial-row__list">
                  {f.workflows.slice(0, 2).map((w) => <li key={w.name.en}>{t(w.name, locale)}</li>)}
                </ul>
              ),
              cue: t(ui.seeWorkflows, locale),
            }))}
          />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "How to read these pages" : zh("如何閱讀這些頁面", locale)}</p>
            <h2>{en ? "Workflows, not headcount" : zh("談的是流程，不是人手", locale)}</h2>
            <p className="muted">
              {en
                ? "Earlier versions of this website described AI as a workforce. We now describe exactly what a workflow prepares and who decides, because that is what you are buying and what your team will run."
                : zh("本網站較早的版本把 AI 形容為「員工」。現在我們會清楚說明每個流程準備甚麼、由誰決定，因為這才是你實際購買、團隊實際運作的內容。", locale)}
            </p>
          </div>
          <ul className="check-list">
            <li>{en ? "Every workflow names its approved inputs." : zh("每個流程都列明已確認的輸入。", locale)}</li>
            <li>{en ? "Every output is prepared for review, not published automatically." : zh("每項輸出都供審閱，不會自動發布。", locale)}</li>
            <li>{en ? "Every function lists what stays with people." : zh("每個職能都列出仍由人負責的事項。", locale)}</li>
            <li>{en ? "Sample rows are illustrative, not client data." : zh("示例資料僅供說明，並非客戶資料。", locale)}</li>
          </ul>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Start with one function and one workflow" : zh("由一個職能、一個流程開始", locale)} body={en ? "Tell us which team and which recurring work. We reply by email to arrange a scope conversation." : zh("告訴我們是哪個團隊、哪項重複工作；我們會以電郵回覆並安排範圍傾談。", locale)} primary={{ label: t(ui.discussScope, locale), to: paths.contact({ intent: "configuration" }) }} secondary={{ label: en ? "How to start" : zh("如何開始", locale), to: "/how-to-start" }} />
    </>
  );
}
