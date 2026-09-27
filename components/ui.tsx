import Link from "next/link";
import type { ReactNode } from "react";
import { href, t, type L, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";

export function Crumbs({ locale, items }: { locale: Locale; items: { label: string; path?: string }[] }) {
  const all = [{ label: t(ui.home, locale), path: "/" }, ...items];
  return (
    <nav className="breadcrumbs" aria-label={t(ui.breadcrumb, locale)}>
      <ol>
        {all.map((item, index) =>
          item.path && index < all.length - 1 ? (
            <li key={index}>
              <Link href={href(locale, item.path)}>{item.label}</Link>
            </li>
          ) : (
            <li key={index} aria-current="page">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

export function PageHero({
  locale,
  crumbs,
  eyebrow,
  title,
  lead,
  actions,
  aside,
  notice,
}: {
  locale: Locale;
  crumbs: { label: string; path?: string }[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  notice?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <Crumbs locale={locale} items={crumbs} />
        <div className="page-hero-grid">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {lead ? <p className="lead">{lead}</p> : null}
            {notice ? (
              <p className="notice" style={{ marginTop: 20 }}>
                {notice}
              </p>
            ) : null}
            {actions ? <div className="btn-row">{actions}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, action, as = "h2" }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; action?: ReactNode; as?: "h2" | "h3" }) {
  const Heading = as;
  return (
    <div className={action ? "section-head section-head--row" : "section-head"}>
      <div className="stack" style={{ ["--stack" as string]: "14px" }}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading>{title}</Heading>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function LinkButton({ to, children, variant = "primary", small }: { to: string; children: ReactNode; variant?: "primary" | "accent" | "ghost" | "light"; small?: boolean }) {
  const cls = ["btn", variant === "primary" ? "" : `btn--${variant}`, small ? "btn--small" : ""].filter(Boolean).join(" ");
  return (
    <Link className={cls} href={to}>
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="text-link" href={to}>
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export function Faq({ items, locale }: { items: { q: L; a: L }[]; locale: Locale }) {
  return (
    <div className="faq">
      {items.map((item, index) => (
        <details key={index}>
          <summary>{t(item.q, locale)}</summary>
          <div>
            <p>{t(item.a, locale)}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title, body, actions }: { title: ReactNode; body?: ReactNode; actions: ReactNode }) {
  return (
    <div className="cta-band">
      <div className="stack">
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      <div className="btn-row">{actions}</div>
    </div>
  );
}

export function Chips({ items, tone }: { items: { label: string; to?: string }[]; tone?: "magenta" | "lime" | "sky" | "amber" }) {
  const cls = tone ? `chip chip--${tone}` : "chip";
  return (
    <ul className="chips">
      {items.map((item) => (
        <li key={item.label}>
          {item.to ? (
            <Link className={cls} href={item.to}>
              {item.label}
            </Link>
          ) : (
            <span className={cls}>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Render the small inline markup used by preserved legacy content:
 * **bold** and [label](href). Everything else is plain text.
 */
export function RichText({ text, resolveHref }: { text: string; resolveHref: (raw: string) => string }) {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={key++}>{match[1]}</strong>);
    else {
      const target = resolveHref(match[3]);
      const external = /^https?:/i.test(target);
      parts.push(
        external ? (
          <a key={key++} href={target} rel="noopener noreferrer" target="_blank">
            {match[2]}
          </a>
        ) : (
          <Link key={key++} href={target}>
            {match[2]}
          </Link>
        ),
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
