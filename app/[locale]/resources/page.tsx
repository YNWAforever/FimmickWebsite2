import type { Metadata } from "next";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { filterRows } from "@/lib/resource-filter";
import { resourceFormats, resourceTopics } from "@/content/resources";
import { ui } from "@/content/ui";
import { PageHero } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";
import { ResourceBrowser } from "@/components/hubs/ResourceBrowser";
import { resourceRows } from "./rows";

const copy = {
  title: { en: "Resource Centre", zh: "資源中心" },
  lead: { en: "Articles, guides, the product explainer, events and workshops — searchable and filterable. Older articles are kept with their original dates and language.", zh: "文章、指南、產品示範影片、活動及工作坊，均可搜尋及篩選。較舊的文章保留原有日期及語言。" },
};

const chip = { article: "chip", guide: "chip chip--lime", video: "chip chip--magenta", event: "chip chip--sky", workshop: "chip chip--sky" } as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/resources", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

/** Static: the first page is rendered here; filters, search and paging run in ResourceBrowser (8.2.1). */
export default async function ResourcesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const base = href(locale, "/resources");
  const first = filterRows(resourceRows(locale), {});
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={t(copy.title, locale)} title={en ? "Guides, films and worked examples you can reuse." : zh("指南、短片及實例，都可以重用。", locale)} accent={en ? "you can reuse." : zh("都可以重用", locale)} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container">
          <ResourceBrowser
            base={base}
            dataUrl={`${base}/items.json`}
            initial={{
              rows: first.items,
              total: first.total,
              page: first.page,
              pages: first.pages,
              formatCounts: Object.fromEntries(resourceFormats.map((f) => [f.id, first.formatCount(f.id)])),
              topicCounts: Object.fromEntries(resourceTopics.map((tp) => [tp.id, first.topicCount(tp.id)])),
            }}
            formats={resourceFormats.map((f) => ({ id: f.id, name: t(f.name, locale), plural: t(f.plural, locale), chip: chip[f.id] }))}
            topics={resourceTopics.map((tp) => ({ id: tp.id, name: t(tp.name, locale) }))}
            labels={{
              search: t(ui.search, locale),
              placeholder: en ? "Search titles and summaries" : zh("搜尋標題及摘要", locale),
              nav: en ? "Filter resources" : zh("篩選資源", locale),
              format: en ? "Format" : zh("類型", locale),
              topic: en ? "Topic" : zh("主題", locale),
              all: t(ui.all, locale),
              results: t(ui.results, locale),
              page: t(ui.page, locale),
              previous: t(ui.previous, locale),
              next: t(ui.next, locale),
              clear: t(ui.clearFilters, locale),
              noResults: t(ui.noResults, locale),
              pastEvent: en ? "Past event" : zh("已舉行", locale),
              originalLanguage: t(ui.originalLanguage, locale),
              pagination: en ? "Pagination" : zh("分頁", locale),
            }}
          />
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Want to talk it through?" : zh("想進一步傾談？", locale)} primary={{ label: en ? "Contact FIMMICK" : zh("聯絡 FIMMICK", locale), to: "/contact?intent=general" }} secondary={{ label: en ? "Leadership workshop" : zh("管理層工作坊", locale), to: "/workshop" }} />
    </>
  );
}
