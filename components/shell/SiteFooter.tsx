import Link from "next/link";
import { href, t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { pillars } from "@/content/nav";
import { company } from "@/content/company";
import { aipLoginUrl } from "@/lib/env";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size raster logo */}
            <img src="/brand/fimmick-logo.webp" width={132} height={33} alt="FIMMICK" loading="lazy" />
            <p>{t(ui.footerTagline, locale)}</p>
            <p className="small" style={{ marginTop: 12 }}>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <br />
              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a>
            </p>
            <div className="footer-social">
              {company.social.map((s) => (
                <a key={s.name} href={s.url} rel="noopener noreferrer" target="_blank">
                  {s.name}
                </a>
              ))}
            </div>
          </div>
          <nav className="footer-cols" aria-label={t(ui.footerNav, locale)}>
            {pillars.map((pillar) => (
              <div key={pillar.id}>
                <h2>{t(pillar.label, locale)}</h2>
                <ul>
                  <li>
                    <Link href={href(locale, pillar.overview.href)}>{t(pillar.overview.label, locale)}</Link>
                  </li>
                  {pillar.groups
                    .flatMap((g) => g.links)
                    .slice(0, pillar.id === "services" ? 6 : 5)
                    .map((link) => (
                      <li key={link.href}>
                        <Link href={href(locale, link.href)}>{t(link.label, locale)}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 FIMMICK. {t(ui.rights, locale)}
          </p>
          <nav aria-label={locale === "en" ? "Legal and utility" : "法律及實用連結"}>
            <Link href={href(locale, "/how-to-start")}>{locale === "en" ? "How to start" : "如何開始"}</Link>
            <Link href={href(locale, "/contact")}>{locale === "en" ? "Contact" : "聯絡我們"}</Link>
            <a href={aipLoginUrl} rel="noopener">{t(ui.login, locale)}</a>
            <Link href={href(locale, "/privacy")}>{t(ui.privacy, locale)}</Link>
            <Link href={href(locale, "/terms")}>{t(ui.terms, locale)}</Link>
            <Link href={href(locale, "/cookies")}>{t(ui.cookies, locale)}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
