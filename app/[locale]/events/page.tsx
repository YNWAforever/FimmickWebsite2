import type { Metadata } from "next";
import Link from "next/link";
import { href, t, formatDate, zh } from "@/lib/i18n";
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
        crumbs={[{ label: en ? "Resources" : zh("資源中心", locale), path: "/resources" }, { label: t(copy.title, locale) }]}
        eyebrow={t(copy.title, locale)}
        title={en ? "Seminars and workshops we have run." : zh("我們舉辦過的講座及工作坊。", locale)}
        accent={en ? "we have run." : zh("講座及工作坊", locale)}
        lead={t(copy.lead, locale)}
        actions={
          <>
            <LinkButton to={href(locale, "/contact?intent=event")} variant="accent">{en ? "Ask about upcoming events" : zh("查詢未來活動", locale)}</LinkButton>
            <LinkButton to={href(locale, "/workshop")} variant="ghost">{en ? "Private leadership workshop" : zh("私人管理層工作坊", locale)}</LinkButton>
          </>
        }
      />
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: 20 }}>{en ? "Past events" : zh("過往活動", locale)} <span className="muted small">({sorted.length})</span></h2>
          {/* The event records exist in English only, so the Chinese hubs link to that archive (8.1.6). */}
          {en ? (
          <div className="related-grid">
            {sorted.map((e) => (
              <Link key={e.id} className="card card--link" href={href(locale, `/events/${e.id}`)} lang="en">
                <span className="card-meta">
                  <span className="chip chip--sky">{e.format ?? (en ? "Event" : zh("活動", locale))}</span>
                  <time dateTime={eventIsoDate(e.date)}>{formatDate(eventIsoDate(e.date), locale)}</time>
                  <span>· {en ? "Past" : zh("已舉行", locale)}</span>
                </span>
                <h3>{e.title}</h3>
                <p className="small muted">{e.summary}</p>
                <span className="micro muted">{en ? "Language: " : zh("語言：", locale)}{e.language ?? "—"} · {en ? "Record in English" : zh("英文紀錄", locale)}</span>
              </Link>
            ))}
          </div>
          ) : (
            <p className="notice">
              {zh("過往活動的紀錄只有英文版本。", locale)}{" "}
              <Link href={href("en", "/events")} lang="en" hrefLang="en">
                Events archive <span aria-hidden="true">→</span>
              </Link>
            </p>
          )}
        </div>
      </section>
      <EnquirySection locale={locale} title={en ? "Bring a session to your team" : zh("為你的團隊安排一節", locale)} body={en ? "Requests are confirmed by our team; submitting one is not a booking." : zh("申請會由我們的團隊確認；提交申請並不等於已預約。", locale)} primary={{ label: en ? "Request a workshop" : zh("申請工作坊", locale), to: "/contact?intent=workshop" }} />
    </>
  );
}
