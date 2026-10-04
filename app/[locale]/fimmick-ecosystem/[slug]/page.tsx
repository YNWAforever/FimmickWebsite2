import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, t, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { members, memberGroups, ecosystemBoundary } from "@/content/ecosystem";
import { ui } from "@/content/ui";
import { casesFor } from "@/content/relations";
import { PageHero, LinkButton } from "@/components/ui";
import { CaseCards, EnquirySection, IndustryCards, RelatedSection, ServiceCards } from "@/components/blocks";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(members.map((m) => m.id));
}

const find = (slug: string) => members.find((m) => m.id === slug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const m = find((await params).slug);
  if (!m) return {};
  return pageMetadata({ locale, path: paths.member(m.id), title: `${m.name} — ${t(m.role, locale)}`, description: t(m.need, locale) });
}

export default async function MemberPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const m = find((await params).slug);
  if (!m) notFound();
  const en = locale === "en";
  const group = memberGroups.find((g) => g.id === m.group)!;
  const contact = paths.contact({ intent: "partnership", member: m.id });
  const related = casesFor({ service: m.services[0], industry: m.industries[0] }, 3).filter((c) => c.kind === "client-work");
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Ecosystem" : zh("生態系統", locale), path: "/fimmick-ecosystem" }, { label: m.name }]}
        eyebrow={`${t(group.name, locale)} · ${t(m.role, locale)}`}
        title={m.name}
        lead={t(m.need, locale)}
        actions={
          <>
            <LinkButton to={href(locale, contact)} variant="accent">{en ? "Explore a partnership" : zh("探討合作", locale)}</LinkButton>
            {m.externalUrl ? (
              <a className="btn btn--ghost" href={m.externalUrl.url} rel="noopener noreferrer" target="_blank">
                {t(m.externalUrl.label, locale)} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </>
        }
        aside={
          <div className="member-mark" role="img" aria-label={m.name}>
            <div>
              <strong>{m.name}</strong>
              <span>{t(m.relationship, locale)}</span>
            </div>
          </div>
        }
      />
      <section className="section">
        <div className="container">
          <div className="io-grid">
            <div className="io-card">
              <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>{en ? "Audience" : zh("受眾", locale)}</h2>
              <p>{t(m.audience, locale)}</p>
              <h2 style={{ fontSize: "1.1rem", margin: "20px 0 12px" }}>{en ? "FIMMICK’s relationship" : zh("與 FIMMICK 的關係", locale)}</h2>
              <p>{t(m.relationship, locale)}</p>
            </div>
            <div className="io-card io-card--out">
              <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>{en ? "What it offers" : zh("提供甚麼", locale)}</h2>
              <ul className="check-list">{t(m.offers, locale).map((o) => <li key={o}>{o}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{en ? "Why it matters" : zh("重要之處", locale)}</p>
            <h2>{t(m.why, locale)}</h2>
            <p className="muted">{t(m.scope, locale)}</p>
            {m.canonicalInternal ? (
              <p>
                <Link className="text-link" href={href(locale, m.canonicalInternal)}>{en ? "Full platform explanation" : zh("完整平台介紹", locale)} →</Link>
                {" · "}
                <Link className="text-link" href={href(locale, "/products")}>{en ? "Six products" : zh("六個產品", locale)} →</Link>
              </p>
            ) : null}
          </div>
          <div className="io-card">
            <h3 style={{ marginBottom: 12 }}>{en ? "Activity" : zh("相關活動", locale)}</h3>
            <ul className="dot-list small">{t(m.activity, locale).map((a) => <li key={a}>{a}</li>)}</ul>
            <p className="micro muted" style={{ marginTop: 16 }}>{t(ecosystemBoundary, locale)}</p>
          </div>
        </div>
      </section>
      <RelatedSection title={t(ui.relatedServices, locale)}>
        <ServiceCards locale={locale} ids={m.services} />
      </RelatedSection>
      <RelatedSection title={t(ui.relatedIndustries, locale)} tint>
        <IndustryCards locale={locale} ids={m.industries} />
      </RelatedSection>
      {related.length ? (
        <RelatedSection title={en ? "Related client work" : zh("相關客戶項目", locale)}>
          <CaseCards locale={locale} items={related} />
        </RelatedSection>
      ) : null}
      <EnquirySection locale={locale} title={t(m.partnershipPrompt, locale)} body={en ? "Partnership terms are agreed directly with the member; nothing is committed by sending an enquiry." : zh("合作條款與相關成員直接議定；提交查詢並不構成任何承諾。", locale)} primary={{ label: en ? "Explore a partnership" : zh("探討合作", locale), to: contact }} secondary={{ label: en ? "Ecosystem overview" : zh("生態系統概覽", locale), to: "/fimmick-ecosystem" }} />
    </>
  );
}
