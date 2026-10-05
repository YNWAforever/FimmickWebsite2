import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, t, zh } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { policies } from "@/content/legal";
import { Crumbs } from "@/components/ui";

type Props = { params: Promise<{ locale: string; legal: string }> };

/** Only the three preserved policy routes exist; anything else is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => policies.map((p) => ({ locale, legal: p.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { legal } = await params;
  const p = policies.find((x) => x.id === legal);
  if (!p) return {};
  return pageMetadata({ locale, path: `/${p.id}`, title: t(p.title, locale), description: `${p.sections[0].body[0]} Last updated ${p.updated}.` });
}

export default async function PolicyPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { legal } = await params;
  const p = policies.find((x) => x.id === legal);
  if (!p) notFound();
  const en = locale === "en";
  return (
    <article className="section">
      <div className="container">
        <Crumbs locale={locale} items={[{ label: t(p.title, locale) }]} />
        <h1>{t(p.title, locale)}</h1>
        <p className="meta-row">{en ? "Last updated" : zh("最後更新", locale)}: {p.updated}</p>
        {!en ? <p className="archive-banner" style={{ marginTop: 20 }}>{zh("此政策以英文發布，以下為英文原文。", locale)}</p> : null}
        <div className="prose" lang="en" style={{ marginTop: 28 }}>
          {p.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((b, i) => <p key={i}>{b}</p>)}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
