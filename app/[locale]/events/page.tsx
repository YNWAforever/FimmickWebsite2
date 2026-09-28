import type { Metadata } from "next";
import Link from "next/link";
import { href, t, formatDate } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { eventIsoDate, legacyEvents } from "@/lib/resources";
import { PageHero, LinkButton } from "@/components/ui";
import { EnquirySection } from "@/components/blocks";

const copy = {
  title: { en: "Events", zh: "活動" },
  lead: { en: "Seminars and webinars FIMMICK has run since 2019. There are no upcoming public events listed right now; new dates are published here when confirmed.", zh: "FIMMICK 自 2019 年起舉辦的研討會及網上研討會。目前沒有已公布的公開活動；新日期確認後會在此公布。" },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/events", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

export default async function EventsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const sorted = [...legacyEvents].sort((a, b) => eventIsoDate(b.date).localeCompare(eventIsoDate(a.date)));
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Resources" : "資源中心", path: "/resources" }, { label: t(copy.title, locale) }]}
        eyebrow={t(copy.title, locale)}
        title={en ? "Events archive" : "活動檔案"}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, "/contact?intent=event")} variant="accent">{en ? "Ask about upcoming events" : "查詢未來活動"}</LinkButton>
            <LinkButton to={href(locale, "/workshop")} variant="ghost">{en ? "Private leadership workshop" : "私人管理層工作坊"}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: 20 }}>{en ? "Past events" : "過往活動"} <span className="muted small">({sorted.length})</span></h2>
          <div className="related-grid">
            {sorted.map((e) => (
              <Link key={e.id} className="card card--link" href={href(locale, `/events/${e.id}`)} lang="en">
                <span className="card-meta">
                  <span className="chip chip--sky">{e.format ?? (en ? "Event" : "活動")}</span>
                  <time dateTime={eventIsoDate(e.date)}>{formatDate(eventIsoDate(e.date), locale)}</time>
                  <span>· {en ? "Past" : "已舉行"}</span>
                </span>
                <h3>{e.title}</h3>
                <p className="small muted">{e.summary}</p>
                <span className="micro muted">{en ? "Language: " : "語言："}{e.language ?? "—"} · {en ? "Record in English" : "英文紀錄"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Bring a session to your team" : "為你的團隊安排一節"} body={en ? "Requests are confirmed by our team; submitting one is not a booking." : "申請會由我們的團隊確認；提交申請並不等於已預約。"} primary={{ label: en ? "Request a workshop" : "申請工作坊", to: "/contact?intent=workshop" }} />
    </>
  );
}
