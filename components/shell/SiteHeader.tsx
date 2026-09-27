"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LanguageSwitch, type LanguageOption } from "./LanguageSwitch";

export type HeaderLink = { label: string; href: string; note?: string };
export type HeaderPillar = {
  id: string;
  label: string;
  utility?: boolean;
  overview: HeaderLink & { description: string };
  groups: { heading: string; links: HeaderLink[] }[];
  featured?: HeaderLink;
};

type Props = {
  home: string;
  pillars: HeaderPillar[];
  cta: HeaderLink;
  login: HeaderLink;
  about: HeaderLink;
  languages: LanguageOption[];
  labels: { menu: string; close: string; primary: string; logoAlt: string; language: string };
};

export function SiteHeader({ home, pillars, cta, login, about, languages, labels }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();

  const close = useCallback((returnFocus = false) => {
    setOpen((current) => {
      if (returnFocus && current) triggerRefs.current[current]?.focus();
      return null;
    });
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname]);

  // Escape and outside click for mega panels.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, close]);

  // Drawer: lock scroll, trap focus, Escape returns focus to the toggle.
  useEffect(() => {
    document.body.dataset.menuOpen = drawer ? "true" : "false";
    if (!drawer) return;
    const node = drawerRef.current;
    const focusables = () => Array.from(node?.querySelectorAll<HTMLElement>('a[href], button, summary, [tabindex]:not([tabindex="-1"])') ?? []).filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.dataset.menuOpen = "false";
    };
  }, [drawer]);

  const activePillar = pillars.find((p) => [p.overview.href, ...p.groups.flatMap((g) => g.links.map((l) => l.href))].some((h) => {
    const clean = h.split(/[?#]/)[0];
    return clean !== home && (pathname === clean || pathname.startsWith(`${clean}/`));
  }))?.id;

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <Link className="utility-about" href={about.href}>{about.label}</Link>
          <a href={login.href} rel="noopener">{login.label}</a>
          <LanguageSwitch options={languages} label={labels.language} />
        </div>
      </div>
      <div className="container header-main">
        <Link className="brand" href={home} aria-label={labels.logoAlt}>
          {/* eslint-disable-next-line @next/next/no-img-element -- small raster logo, fixed size, eagerly loaded */}
          <img src="/brand/fimmick-logo.webp" width={124} height={31} alt={labels.logoAlt} />
        </Link>
        <nav className="primary-nav" aria-label={labels.primary} ref={navRef}>
          <ul className="pillar-list">
            {pillars.map((pillar) => {
              const panelId = `${uid}-${pillar.id}`;
              const expanded = open === pillar.id;
              return (
                <li key={pillar.id} className={pillar.utility ? "pillar pillar--utility" : "pillar"}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[pillar.id] = el;
                    }}
                    type="button"
                    className="pillar-trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    data-active={activePillar === pillar.id}
                    onClick={() => setOpen(expanded ? null : pillar.id)}
                  >
                    {pillar.label}
                  </button>
                  <div className="mega" id={panelId} hidden={!expanded}>
                    <div className="container mega-inner">
                      <div className="mega-overview">
                        <h2>{pillar.label}</h2>
                        <p>{pillar.overview.description}</p>
                        <Link className="btn btn--small" href={pillar.overview.href}>
                          {pillar.overview.label} <span className="arrow" aria-hidden="true">→</span>
                        </Link>
                      </div>
                      <div className="mega-groups">
                        {pillar.groups.map((group) => (
                          <div className="mega-group" key={group.heading}>
                            <h3>{group.heading}</h3>
                            <ul>
                              {group.links.map((link) => (
                                <li key={link.href}>
                                  <Link href={link.href}>
                                    {link.label}
                                    {link.note ? <small>{link.note}</small> : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {pillar.featured ? (
                          <Link className="mega-featured" href={pillar.featured.href}>
                            <strong>{pillar.featured.label} →</strong>
                            {pillar.featured.note ? <span>{pillar.featured.note}</span> : null}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="header-actions">
          <Link className="btn btn--accent btn--small header-cta" href={cta.href}>
            {cta.label}
          </Link>
          <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={drawer} aria-controls={`${uid}-drawer`} onClick={() => setDrawer(true)}>
            <span className="bars" aria-hidden="true"><span /></span>
            {labels.menu}
          </button>
        </div>
      </div>

      <div className="drawer" id={`${uid}-drawer`} hidden={!drawer} ref={drawerRef} role="dialog" aria-modal="true" aria-label={labels.menu}>
        <div className="container drawer-head">
          <Link className="brand" href={home} aria-label={labels.logoAlt}>
            {/* eslint-disable-next-line @next/next/no-img-element -- see header logo */}
            <img src="/brand/fimmick-logo.webp" width={112} height={28} alt={labels.logoAlt} />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded="true"
            onClick={() => {
              setDrawer(false);
              toggleRef.current?.focus();
            }}
          >
            <span className="bars" aria-hidden="true"><span /></span>
            {labels.close}
          </button>
        </div>
        <nav className="container drawer-body" aria-label={labels.primary}>
          {pillars.map((pillar) => (
            <details key={pillar.id} open={activePillar === pillar.id}>
              <summary>{pillar.label}</summary>
              <div className="drawer-group">
                <Link className="overview-link" href={pillar.overview.href}>
                  {pillar.overview.label} →
                </Link>
                {pillar.groups.map((group) => (
                  <div key={group.heading}>
                    <h3>{group.heading}</h3>
                    <ul>
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}
          <div className="drawer-actions">
            <Link className="btn btn--accent" href={cta.href}>{cta.label}</Link>
            <a className="btn btn--ghost" href={login.href} rel="noopener">{login.label}</a>
            <LanguageSwitch options={languages} label={labels.language} />
          </div>
        </nav>
      </div>
    </header>
  );
}
