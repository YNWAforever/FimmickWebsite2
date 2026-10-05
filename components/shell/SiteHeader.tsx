"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { LanguageSwitch, type LanguageOption } from "./LanguageSwitch";
// Header, mega-panel and drawer links prefetch on intent, not on sight (8.2.2): the logo is a
// self-link on the home page, and an opened panel would otherwise fetch every page it lists.
import { HoverPrefetchLink as Link } from "./HoverPrefetchLink";

export type HeaderLink = { label: string; href: string; note?: string };
export type HeaderPillar = {
  id: string;
  label: string;
  /** Shown instead of `label` on the 1024–1279 px desktop bar (CSS swaps them; only one is ever rendered). */
  short?: string;
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

  // Close menus on navigation (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setDrawer(false);
  }

  // Escape and outside press for mega panels (pointerdown also covers touch and pen, e.g. iPad Safari).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPress = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [open, close]);

  // Hover intent on fine pointers: open after 150 ms over a trigger (at once when another panel is
  // already open), close 200 ms after the pointer leaves the trigger and its panel. A panel opened
  // by click or keyboard stays until it is dismissed; clicking a hover-opened trigger pins it.
  const openedBy = useRef<"hover" | "click">("click");
  const hoverTimer = useRef<number | undefined>(undefined);
  const clearHover = useCallback(() => window.clearTimeout(hoverTimer.current), []);
  useEffect(() => clearHover, [clearHover]);
  const finePointer = (e: ReactPointerEvent) => e.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hoverEnter = (e: ReactPointerEvent, id: string) => {
    if (!finePointer(e)) return;
    clearHover();
    if (open === id) return;
    const show = () => {
      openedBy.current = "hover";
      setOpen(id);
    };
    if (open) show();
    else hoverTimer.current = window.setTimeout(show, 150);
  };
  const hoverLeave = (e: ReactPointerEvent) => {
    if (!finePointer(e)) return;
    clearHover();
    if (open && openedBy.current === "hover") hoverTimer.current = window.setTimeout(() => setOpen(null), 200);
  };
  const toggle = (id: string, expanded: boolean) => {
    clearHover();
    if (expanded && openedBy.current === "hover") {
      openedBy.current = "click";
      return;
    }
    openedBy.current = "click";
    setOpen(expanded ? null : id);
  };

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
    // Rotating a tablet or widening a window past the desktop breakpoint leaves the drawer with no
    // visible way back: close it and release the scroll lock.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      document.body.dataset.menuOpen = "false";
    };
  }, [drawer]);

  const activePillar = pillars.find((p) => [p.overview.href, ...p.groups.flatMap((g) => g.links.map((l) => l.href))].some((h) => {
    const clean = h.split(/[?#]/)[0];
    return clean !== home && (pathname === clean || pathname.startsWith(`${clean}/`));
  }))?.id;

  return (
    <>
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
          <img src="/brand/fimmick-logo-248.webp" width={124} height={31} alt={labels.logoAlt} />
        </Link>
        <nav
          className="primary-nav"
          aria-label={labels.primary}
          ref={navRef}
          onBlur={(e) => {
            const next = e.relatedTarget as Node | null;
            if (open && next && !navRef.current?.contains(next)) close(false);
          }}
        >
          <ul className="pillar-list">
            {pillars.map((pillar) => {
              const panelId = `${uid}-${pillar.id}`;
              const expanded = open === pillar.id;
              return (
                <li key={pillar.id} className={pillar.utility ? "pillar pillar--utility" : "pillar"} onPointerEnter={(e) => hoverEnter(e, pillar.id)} onPointerLeave={hoverLeave}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[pillar.id] = el;
                    }}
                    type="button"
                    className="pillar-trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    data-active={activePillar === pillar.id}
                    onClick={() => toggle(pillar.id, expanded)}
                  >
                    <span className="pillar-label">{pillar.label}</span>
                    {pillar.short ? <span className="pillar-label pillar-label--short">{pillar.short}</span> : null}
                  </button>
                  <div
                    className="mega"
                    id={panelId}
                    hidden={!expanded}
                    onClick={(e) => {
                      if ((e.target as Element).closest("a")) close(false);
                    }}
                  >
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
                            {/* A miniature of the signature frame: facts, draft, approval, export. */}
                            <span className="mega-featured__frame" aria-hidden="true">
                              <i>01</i>
                              <i>02</i>
                              <i data-state="approved">03</i>
                              <i>04</i>
                            </span>
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
    </header>

      {/* Dims the page under an open mega panel; a press on it closes the panel (document pointerdown). */}
      <div className="mega-scrim" hidden={!open} aria-hidden="true" />

      {/* The drawer is a sibling of <header>, not a child: the header moves with a transform while
          reading, which would make it the drawer’s containing block and squash the opening frames. */}
      <div
        className="drawer-scrim"
        hidden={!drawer}
        aria-hidden="true"
        onClick={() => {
          setDrawer(false);
          toggleRef.current?.focus();
        }}
      />
      <div className="drawer" id={`${uid}-drawer`} hidden={!drawer} ref={drawerRef} role="dialog" aria-modal="true" aria-label={labels.menu}>
        <div className="container drawer-head">
          <Link className="brand" href={home} aria-label={labels.logoAlt}>
            {/* eslint-disable-next-line @next/next/no-img-element -- see header logo */}
            <img src="/brand/fimmick-logo-248.webp" width={112} height={28} alt={labels.logoAlt} />
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
    </>
  );
}
