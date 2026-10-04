import type { Metadata } from "next";
import Link from "next/link";
import { href, t, zh } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { products } from "@/content/products";
import { solutions } from "@/content/solutions";
import { ui } from "@/content/ui";
import { PageHero, SectionHead, LinkButton } from "@/components/ui";
import { EditorialList, EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "Products", zh: "產品" },
  lead: { en: "Six named products, each with a specific job, a defined output and clear exclusions. Availability is confirmed when we configure your workflow.", zh: "六個產品，各有明確工作、清晰輸出及排除範圍。供應安排於配置流程時確認。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/products", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function ProductsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t(copy.title, locale) }]}
        eyebrow="FIMMICK AIP"
        title={en ? "Six products for four business jobs." : zh("六個產品，對應四項業務工作。", locale)}
        lead={t(copy.lead, locale)}
        actions={<LinkButton to={href(locale, "/contact?intent=configuration")} variant="accent">{t(ui.discussConfiguration, locale)}</LinkButton>}
      />
      {solutions.map((s, index) => (
        <section key={s.id} className={index % 2 ? "section section--tight section--surface" : "section section--tight"}>
          <div className="container">
            <SectionHead eyebrow={`${s.number} · ${t(s.short, locale)}`} title={t(s.name, locale)} lead={t(s.deliverable, locale)} action={<Link className="text-link" href={href(locale, paths.solution(s.id))}>{en ? "Solution overview" : zh("解決方案概覽", locale)} <span className="arrow" aria-hidden="true">→</span></Link>} />
            <EditorialList
              start={products.findIndex((p) => p.solution === s.id) + 1}
              rows={products.filter((p) => p.solution === s.id).map((p) => ({
                id: p.id,
                href: href(locale, paths.product(p.id)),
                label: p.name,
                headline: t(p.descriptor, locale),
                accent: p.headlineAccent ? t(p.headlineAccent, locale) : undefined,
                line: t(p.summary, locale),
                aside: (
                  <p className="editorial-row__output">
                    <strong>{en ? "Output" : zh("輸出", locale)}</strong>
                    {t(p.output, locale)}
                  </p>
                ),
                cue: t(ui.howItWorks, locale),
              }))}
            />
          </div>
        </section>
      ))}
      <EnquirySection locale={locale} title={en ? "Which product fits your workflow?" : zh("哪個產品適合你的流程？", locale)} primary={{ label: t(ui.requestDemo, locale), to: "/contact?intent=demo" }} secondary={{ label: en ? "How to start" : zh("如何開始", locale), to: "/how-to-start" }} />
    </>
  );
}
