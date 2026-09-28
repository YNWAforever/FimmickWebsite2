import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { href, formatDate, zh } from "@/lib/i18n";
import { localeSlugParams, resolveLocale, type SlugParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { eventById, eventIsoDate, legacyEvents } from "@/lib/resources";
import { Crumbs } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return localeSlugParams(legacyEvents.map((e) => e.id));
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const e = eventById((await params).slug);
  if (!e) return {};
  return pageMetadata({ locale, path: `/events/${e.id}`, title: e.title, description: e.summary });
}

const strip = (s: string) => s.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** Render the legacy markdown body (headings, lists, paragraphs) as plain structured text. */
function Body({ md }: { md: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) out.push(<ul key={`l${out.length}`}>{list.map((l, i) => <li key={i}>{strip(l)}</li>)}</ul>);
    list = [];
  };
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    flush();
    const h = line.match(/^#{1,4}\s+(.*)$/);
    out.push(h ? <h2 key={out.length}>{strip(h[1])}</h2> : <p key={out.length}>{strip(line)}</p>);
  }
  flush();
  return <>{out}</>;
}

export default async function EventPage({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const e = eventById((await params).slug);
  if (!e) notFound();
  const en = locale === "en";
  const iso = eventIsoDate(e.date);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          description: e.summary,
          startDate: iso,
          organizer: { "@type": "Organization", name: "FIMMICK" },
          ...(e.venue ? { location: { "@type": "Place", name: e.venue, address: e.venue } } : { eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode" }),
        }}
      />
      <article className="section">
        <div className="container">
          <Crumbs locale={locale} items={[{ label: en ? "Events" : zh("活動", locale), path: "/events" }, { label: e.title }]} />
          <div className="detail-grid">
            <div>
              <div className="archive-banner" role="note">
                <strong>{en ? "Past event" : zh("已舉行的活動", locale)}</strong>
                <span>{en ? "This event has taken place and registration is closed. The record is kept for reference." : zh("此活動已舉行，報名已截止；紀錄保留作參考，並以英文提供。", locale)}</span>
              </div>
              <h1 lang="en" style={{ fontSize: "clamp(1.8rem, 1.4rem + 1.6vw, 2.7rem)" }}>{e.title}</h1>
              <p className="lead" lang="en" style={{ marginTop: 16 }}>{e.summary}</p>
              <div className="prose" lang="en" style={{ marginTop: 28 }}>
                <Body md={e.body} />
              </div>
            </div>
            <aside className="detail-aside">
              <dl className="status-panel">
                <div><dt>{en ? "Date" : zh("日期", locale)}</dt><dd>{e.date}</dd></div>
                {e.time ? <div><dt>{en ? "Time (HKT)" : zh("時間（香港時間）", locale)}</dt><dd>{e.time}</dd></div> : null}
                <div><dt>{en ? "Format" : zh("形式", locale)}</dt><dd>{e.format ?? "—"}</dd></div>
                <div><dt>{en ? "Language" : zh("語言", locale)}</dt><dd>{e.language ?? "—"}</dd></div>
                {e.venue ? <div><dt>{en ? "Venue" : zh("地點", locale)}</dt><dd className="small">{e.venue}</dd></div> : null}
                <div><dt>{en ? "Status" : zh("狀態", locale)}</dt><dd>{en ? `Past · ${formatDate(iso, "en")}` : zh(`已舉行・${formatDate(iso, "zh-hant")}`, locale)}</dd></div>
              </dl>
              <Link className="text-link" href={href(locale, "/events")}>← {en ? "All events" : zh("全部活動", locale)}</Link>
            </aside>
          </div>
        </div>
      </article>
      <EnquirySection locale={locale} title={en ? "Interested in a similar session?" : zh("對類似活動有興趣？", locale)} primary={{ label: en ? "Ask about events" : zh("查詢活動", locale), to: "/contact?intent=event" }} secondary={{ label: en ? "Leadership workshop" : zh("管理層工作坊", locale), to: "/workshop" }} />
    </>
  );
}
