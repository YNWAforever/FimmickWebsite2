"use client";

import type { MouseEvent, ReactNode } from "react";
import { pushSearch, useSearch } from "./url-state";

type Key = "kind" | "industry" | "capability";
type Card = { id: string; kind: string; industry: string[]; capability: string[]; content: ReactNode };
type Group = { key: Key; label: string; options: { id: string; label: string }[] };
type Props = {
  /** The hub’s own URL; the filters live in `?kind=`, `?industry=` and `?capability=`. */
  base: string;
  cards: Card[];
  groups: Group[];
  labels: { nav: string; all: string; results: string; clear: string; noResults: string };
};

const has = (card: Card, key: Key, id: string) => (key === "kind" ? card.kind === id : card[key].includes(id));

/**
 * Case-study filters on a static hub (award pass 2, 8.2.1): every card is rendered on the server and
 * the pills hide the others in place, keeping the filters in the query string. Without JavaScript the
 * pills are plain links and the page shows every case.
 */
export function CaseFilter({ base, cards, groups, labels }: Props) {
  const params = new URLSearchParams(useSearch());
  const active = Object.fromEntries(groups.map((g) => [g.key, g.options.some((o) => o.id === params.get(g.key)) ? params.get(g.key)! : undefined])) as Partial<Record<Key, string>>;
  const matches = (card: Card, ignore?: Key) => groups.every((g) => g.key === ignore || !active[g.key] || has(card, g.key, active[g.key]!));
  const url = (patch: Partial<Record<Key, string | undefined>>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...active, ...patch })) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  const go = (next: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    pushSearch(next);
  };
  const shown = cards.filter((c) => matches(c));
  const filtered = Object.values(active).some(Boolean);
  return (
    <>
      <nav className="filter-bar" aria-label={labels.nav}>
        {groups.map((g) => (
          <div key={g.key} className="filter-group">
            <span className="filter-label">{g.label}</span>
            <a className="filter-pill" href={url({ [g.key]: undefined })} aria-current={!active[g.key] ? "true" : undefined} onClick={go(url({ [g.key]: undefined }))}>
              {labels.all}
            </a>
            {g.options.map((o) => (
              <a key={o.id} className="filter-pill" href={url({ [g.key]: o.id })} aria-current={active[g.key] === o.id ? "true" : undefined} onClick={go(url({ [g.key]: o.id }))}>
                {o.label} <span className="count">{cards.filter((c) => matches(c, g.key) && has(c, g.key, o.id)).length}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="result-meta" role="status">
        <span>
          {shown.length} {labels.results}
        </span>
        {filtered ? <a href={base} onClick={go(base)}>{labels.clear}</a> : null}
      </div>
      <div className="related-grid" hidden={!shown.length}>
        {cards.map((c) => (
          <div key={c.id} className="related-grid__cell" hidden={!shown.includes(c)}>
            {c.content}
          </div>
        ))}
      </div>
      {shown.length ? null : <p className="empty-state">{labels.noResults}</p>}
    </>
  );
}
