import Link from "next/link";
import type { ReactNode } from "react";
import { href, t, type Locale, zh } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { pillars } from "@/content/nav";
import { company } from "@/content/company";
import { aipLoginUrl } from "@/lib/env";

/** Monochrome marks for the social row (currentColor, 20 px in a 44 px target). */
const socialIcons: Record<string, ReactNode> = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4V9.5Z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.2c-.4-.1-1.6-.2-2.9-.2-2.9 0-4.6 1.7-4.6 4.8v1.7H6.8V12h2.7v10h4.5V12h2.9l.4-3.5H14Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12c0 1.3.1 2.6.4 3.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />
    </svg>
  ),
};

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <p className="footer-cta__title">
            {locale === "en" ? (
              <>
                Have a workflow <em className="accent">in mind?</em>
              </>
            ) : (
              <>
                {zh("心中已有", locale)}
                <em className="accent">{zh("想改善的流程？", locale)}</em>
              </>
            )}
          </p>
          <div className="footer-cta__actions">
            <a className="footer-cta__mail" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            <Link className="btn btn--accent" href={href(locale, "/contact?intent=demo")} prefetch={false}>
              {t(ui.requestDemo, locale)} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="footer-top">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size raster logo */}
            <img src="/brand/fimmick-logo-light.webp" width={132} height={33} alt="FIMMICK" loading="lazy" />
            <p>{t(ui.footerTagline, locale)}</p>
            <p className="small footer-contact">
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <br />
              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a>
            </p>
            <div className="footer-social">
              {company.social.map((s) => (
                <a key={s.name} href={s.url} rel="noopener noreferrer" target="_blank" aria-label={s.name}>
                  {socialIcons[s.name]}
                </a>
              ))}
            </div>
          </div>
          {/* Four columns of two stacked groups (nav order: platform over transformation, services
              over industries, cases over resources, ecosystem over about). */}
          <nav className="footer-cols" aria-label={t(ui.footerNav, locale)}>
            {[0, 2, 4, 6].map((start) => (
              <div className="footer-col" key={pillars[start].id}>
                {pillars.slice(start, start + 2).map((pillar) => (
                  <div className="footer-group" key={pillar.id}>
                    <h2>{t(pillar.label, locale)}</h2>
                    <ul>
                      <li>
                        <Link href={href(locale, pillar.overview.href)} prefetch={false}>{t(pillar.overview.label, locale)}</Link>
                      </li>
                      {pillar.groups
                        .flatMap((g) => g.links)
                        .slice(0, pillar.id === "services" ? 6 : 5)
                        .map((link) => (
                          <li key={link.href}>
                            <Link href={href(locale, link.href)} prefetch={false}>{t(link.label, locale)}</Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 FIMMICK. {t(ui.rights, locale)}
          </p>
          <nav aria-label={locale === "en" ? "Legal and utility" : zh("法律及實用連結", locale)}>
            <Link href={href(locale, "/how-to-start")} prefetch={false}>{locale === "en" ? "How to start" : zh("如何開始", locale)}</Link>
            <Link href={href(locale, "/contact")} prefetch={false}>{locale === "en" ? "Contact" : zh("聯絡我們", locale)}</Link>
            <a href={aipLoginUrl} rel="noopener">{t(ui.login, locale)}</a>
            <Link href={href(locale, "/privacy")} prefetch={false}>{t(ui.privacy, locale)}</Link>
            <Link href={href(locale, "/terms")} prefetch={false}>{t(ui.terms, locale)}</Link>
            <Link href={href(locale, "/cookies")} prefetch={false}>{t(ui.cookies, locale)}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
