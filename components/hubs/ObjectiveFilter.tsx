"use client";

import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";

type Group = { id: string; label: string; count: number; content: ReactNode };
type Props = {
  /** The hub’s own URL; the filter lives in `?objective=`. */
  base: string;
  groups: Group[];
  labels: { nav: string; filter: string; all: string; clear: string };
};

const EVENT = "objectivechange";
const read = () => new URLSearchParams(window.location.search).get("objective");
const subscribe = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener(EVENT, notify);
  };
};

/**
 * Objective filter for a static hub (award pass 2, 5.2): every group is rendered on the server and the
 * pills hide the others in place, keeping `?objective=` in the address so a filtered view can be
 * shared. Without JavaScript the pills are plain links and the page shows every group.
 */
export function ObjectiveFilter({ base, groups, labels }: Props) {
  const param = useSyncExternalStore(subscribe, read, () => null);
  const active = groups.some((g) => g.id === param) ? param : null;
  const select = (id: string | null) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState(null, "", id ? `${base}?objective=${id}` : base);
    window.dispatchEvent(new Event(EVENT));
  };
  const total = groups.reduce((n, g) => n + g.count, 0);
  return (
    <>
      <nav className="filter-bar" aria-label={labels.nav}>
        <div className="filter-group">
          <span className="filter-label">{labels.filter}</span>
          <a className="filter-pill" href={base} aria-current={!active ? "true" : undefined} onClick={select(null)}>
            {labels.all} <span className="count">{total}</span>
          </a>
          {groups.map((g) => (
            <a key={g.id} className="filter-pill" href={`${base}?objective=${g.id}`} aria-current={active === g.id ? "true" : undefined} onClick={select(g.id)}>
              {g.label} <span className="count">{g.count}</span>
            </a>
          ))}
        </div>
        {active ? (
          <p className="small">
            <a href={base} onClick={select(null)}>{labels.clear}</a>
          </p>
        ) : null}
      </nav>
      <div className="stack" style={{ ["--stack" as string]: "56px" }}>
        {groups.map((g) => (
          <div key={g.id} hidden={active !== null && active !== g.id}>
            {g.content}
          </div>
        ))}
      </div>
    </>
  );
}
