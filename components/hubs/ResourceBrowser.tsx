"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { filterQuery, filterRows, readFilter, type ResourceFilter, type ResourceRow } from "@/lib/resource-filter";
import { pushSearch, useSearch } from "./url-state";

type Format = { id: ResourceRow["format"]; name: string; plural: string; chip: string };
type Topic = { id: ResourceRow["topic"]; name: string };
type Result = { rows: ResourceRow[]; total: number; page: number; pages: number; formatCounts: Record<string, number>; topicCounts: Record<string, number> };
type Props = {
  /** The hub’s own URL; filters, search and page live in its query string. */
  base: string;
  /** Every row for this locale (items.json), fetched once a visitor filters, searches or pages. */
  dataUrl: string;
  /** The first, unfiltered page, rendered on the server. */
  initial: Result;
  formats: Format[];
  topics: Topic[];
  labels: { search: string; placeholder: string; nav: string; format: string; topic: string; all: string; results: string; page: string; previous: string; next: string; clear: string; noResults: string; pastEvent: string; originalLanguage: string; pagination: string };
};

/**
 * Resource Centre listing on a static page (award pass 2, 8.2.1). The server renders the first page of
 * everything; filters, search and paging run here against items.json and keep the query string in
 * step, so a filtered view can still be shared. Without JavaScript the controls are plain links and a
 * GET form, and the page shows the unfiltered list.
 */
export function ResourceBrowser({ base, dataUrl, initial, formats, topics, labels }: Props) {
  const filter = readFilter(
    useSearch(),
    formats.map((f) => f.id),
    topics.map((t) => t.id),
  );
  const filtered = Boolean(filter.format || filter.topic || filter.q);
  const needsAll = filtered || (filter.page ?? 1) > 1;
  const [all, setAll] = useState<ResourceRow[] | null>(null);
  const [typed, setTyped] = useState<string | null>(null);

  useEffect(() => {
    if (!needsAll || all) return;
    let live = true;
    fetch(dataUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((rows: ResourceRow[]) => live && setAll(rows))
      .catch(() => {
        /* the unfiltered first page stays on screen */
      });
    return () => {
      live = false;
    };
  }, [needsAll, all, dataUrl]);

  const result: Result = (() => {
    if (!all || !needsAll) return initial;
    const r = filterRows(all, filter);
    return {
      rows: r.items,
      total: r.total,
      page: r.page,
      pages: r.pages,
      formatCounts: Object.fromEntries(formats.map((f) => [f.id, r.formatCount(f.id)])),
      topicCounts: Object.fromEntries(topics.map((t) => [t.id, r.topicCount(t.id)])),
    };
  })();
  const busy = needsAll && !all;
  // Until the rows arrive the page shows the unfiltered list, so the controls describe that list.
  const current: ResourceFilter = all ? filter : {};
  const url = (patch: ResourceFilter) => `${base}${filterQuery({ ...current, page: undefined, ...patch })}`;
  const go = (next: string, scroll = false) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    pushSearch(next);
    if (scroll) document.getElementById("resource-results")?.scrollIntoView({ block: "start" });
  };
  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim().slice(0, 80);
    pushSearch(`${base}${filterQuery({ ...filter, q: q || undefined, page: undefined })}`);
    setTyped(null);
  };

  return (
    <>
      <form className="search-form" action={base} method="get" role="search" style={{ marginBottom: 24 }} onSubmit={search}>
        <label className="sr-only" htmlFor="resource-q">{labels.search}</label>
        <input id="resource-q" type="search" name="q" value={typed ?? filter.q ?? ""} onChange={(e) => setTyped(e.target.value)} placeholder={labels.placeholder} maxLength={80} />
        <button className="btn" type="submit">{labels.search}</button>
      </form>
      <nav className="filter-bar" aria-label={labels.nav}>
        <div className="filter-group">
          <span className="filter-label">{labels.format}</span>
          <a className="filter-pill" href={url({ format: undefined })} aria-current={!current.format ? "true" : undefined} onClick={go(url({ format: undefined }))}>{labels.all}</a>
          {formats.map((f) => {
            const n = result.formatCounts[f.id];
            return n ? (
              <a key={f.id} className="filter-pill" href={url({ format: f.id })} aria-current={current.format === f.id ? "true" : undefined} onClick={go(url({ format: f.id }))}>
                {f.plural} <span className="count">{n}</span>
              </a>
            ) : null;
          })}
        </div>
        <div className="filter-group">
          <span className="filter-label">{labels.topic}</span>
          <a className="filter-pill" href={url({ topic: undefined })} aria-current={!current.topic ? "true" : undefined} onClick={go(url({ topic: undefined }))}>{labels.all}</a>
          {topics.map((t) => {
            const n = result.topicCounts[t.id];
            return n ? (
              <a key={t.id} className="filter-pill" href={url({ topic: t.id })} aria-current={current.topic === t.id ? "true" : undefined} onClick={go(url({ topic: t.id }))}>
                {t.name} <span className="count">{n}</span>
              </a>
            ) : null;
          })}
        </div>
      </nav>
      <div className="result-meta" role="status" id="resource-results">
        <span>
          {result.total} {labels.results}
          {result.pages > 1 ? ` · ${labels.page} ${result.page} / ${result.pages}` : ""}
        </span>
        {filtered && all ? <a href={base} onClick={go(base)}>{labels.clear}</a> : null}
      </div>
      {result.rows.length ? (
        <div className="related-grid" aria-busy={busy || undefined}>
          {result.rows.map((item) => {
            const fmt = formats.find((f) => f.id === item.format)!;
            return (
              <Link key={item.id} className="card card--link" href={item.href}>
                <span className="card-meta">
                  <span className={fmt.chip}>{fmt.name}</span>
                  {item.date}
                  {item.past ? <span>· {labels.pastEvent}</span> : null}
                </span>
                <h2>{item.title}</h2>
                <p className="small muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.summary}</p>
                <span className="micro muted">{labels.originalLanguage}: {item.lang}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">
          {labels.noResults} <a href={base} onClick={go(base)}>{labels.clear}</a>
        </p>
      )}
      {result.pages > 1 ? (
        <nav className="pagination" aria-label={labels.pagination}>
          {result.page > 1 ? <a className="btn btn--ghost btn--small" href={url({ page: result.page - 1 })} rel="prev" onClick={go(url({ page: result.page - 1 }), true)}>← {labels.previous}</a> : null}
          <span className="small muted">{labels.page} {result.page} / {result.pages}</span>
          {result.page < result.pages ? <a className="btn btn--ghost btn--small" href={url({ page: result.page + 1 })} rel="next" onClick={go(url({ page: result.page + 1 }), true)}>{labels.next} →</a> : null}
        </nav>
      ) : null}
    </>
  );
}
