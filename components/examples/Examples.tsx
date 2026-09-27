"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

/* ------------------------------------------------------------------ shared */

export type PaneLabels = { input: string; work: string; review: string; output: string };
export type ExampleChrome = {
  title: string;
  lead: string;
  notice: string;
  reset: string;
  panes: PaneLabels;
  footnote: string;
  productCta: { label: string; href: string };
  contactCta: { label: string; href: string };
};

function Workbench({ chrome, onReset, children }: { chrome: ExampleChrome; onReset: () => void; children: ReactNode }) {
  return (
    <div className="workbench">
      <div className="workbench__head">
        <div>
          <h3>{chrome.title}</h3>
          <p className="lead-small">{chrome.lead}</p>
        </div>
        <div className="btn-row">
          <span className="notice">{chrome.notice}</span>
          <button type="button" className="btn btn--ghost btn--small" onClick={onReset}>
            {chrome.reset}
          </button>
        </div>
      </div>
      <div className="workbench__grid">{children}</div>
      <div className="workbench__foot">
        <p>{chrome.footnote}</p>
        <div className="btn-row">
          <Link className="btn btn--small" href={chrome.productCta.href}>
            {chrome.productCta.label}
          </Link>
          <Link className="text-link" href={chrome.contactCta.href}>
            {chrome.contactCta.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Pane({ role, label, children }: { role: "source" | "work" | "review" | "result"; label: string; children: ReactNode }) {
  return (
    <section className="pane" data-role={role} aria-label={label}>
      <p className="pane__label">
        <i aria-hidden="true" />
        {label}
      </p>
      {children}
    </section>
  );
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ------------------------------------------------------------ intelligence */

export type IntelData = {
  chrome: ExampleChrome;
  topics: { id: string; label: string }[];
  sources: { id: string; label: string }[];
  evidence: { id: string; topic: string; source: string; date: string; text: string; tone: string; toneLabel: string }[];
  interpretation: Record<string, { summary: string; priorities: string[] }>;
  aiso: { id: string; topic: string; question: string; assistant: string; date: string; mentioned: boolean; note: string }[];
  s: {
    topic: string;
    dataset: string;
    listening: string;
    aiSearch: string;
    source: string;
    allSources: string;
    evidence: string;
    none: string;
    interpretation: string;
    priorities: string;
    analyst: string;
    markReviewed: string;
    reviewed: string;
    notReviewed: string;
    mentioned: string;
    notMentioned: string;
    separate: string;
  };
};

export function IntelligenceExample({ data }: { data: IntelData }) {
  const initial = { topic: data.topics[0].id, dataset: "listening" as "listening" | "ai", source: "all", reviewed: false };
  const [state, setState] = useState(initial);
  const evidence = data.evidence.filter((e) => e.topic === state.topic && (state.source === "all" || e.source === state.source));
  const checks = data.aiso.filter((c) => c.topic === state.topic);
  const interp = data.interpretation[state.topic];
  const set = (patch: Partial<typeof initial>) => setState((s) => ({ ...s, ...patch, reviewed: false }));
  return (
    <Workbench chrome={data.chrome} onReset={() => setState(initial)}>
      <Pane role="source" label={data.chrome.panes.input}>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="micro muted" style={{ fontWeight: 750, marginBottom: 6 }}>{data.s.topic}</legend>
          <div className="radio-row">
            {data.topics.map((topic) => (
              <label key={topic.id}>
                <input type="radio" name="intel-topic" value={topic.id} checked={state.topic === topic.id} onChange={() => set({ topic: topic.id })} />
                {topic.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="micro muted" style={{ fontWeight: 750, marginBottom: 6 }}>{data.s.dataset}</legend>
          <div className="radio-row">
            <label>
              <input type="radio" name="intel-dataset" checked={state.dataset === "listening"} onChange={() => set({ dataset: "listening" })} />
              {data.s.listening}
            </label>
            <label>
              <input type="radio" name="intel-dataset" checked={state.dataset === "ai"} onChange={() => set({ dataset: "ai" })} />
              {data.s.aiSearch}
            </label>
          </div>
        </fieldset>
        {state.dataset === "listening" ? (
          <label className="field">
            <span>{data.s.source}</span>
            <select value={state.source} onChange={(e) => set({ source: e.target.value })}>
              <option value="all">{data.s.allSources}</option>
              {data.sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <p className="micro muted">{data.s.separate}</p>
      </Pane>
      <Pane role="work" label={data.chrome.panes.work}>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.evidence}</p>
        {state.dataset === "listening" ? (
          evidence.length ? (
            <ul className="evidence" aria-live="polite">
              {evidence.map((e) => (
                <li key={e.id}>
                  {e.text}
                  <span className="meta">
                    <span>{e.id}</span>
                    <span>{data.sources.find((s) => s.id === e.source)?.label}</span>
                    <span>{e.date}</span>
                    <span className={`tone-${e.tone}`}>{e.toneLabel}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted">{data.s.none}</p>
          )
        ) : (
          <ul className="evidence" aria-live="polite">
            {checks.map((c) => (
              <li key={c.id}>
                <strong>{c.question}</strong>
                <p className="small" style={{ marginTop: 4 }}>{c.note}</p>
                <span className="meta">
                  <span>{c.id}</span>
                  <span>{c.assistant}</span>
                  <span>{c.date}</span>
                  <span className={c.mentioned ? "tone-positive" : "tone-negative"}>{c.mentioned ? data.s.mentioned : data.s.notMentioned}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Pane>
      <Pane role="review" label={data.chrome.panes.review}>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.interpretation}</p>
        <p className="small">{interp.summary}</p>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.analyst}</p>
        <button type="button" className="btn btn--small" onClick={() => setState((s) => ({ ...s, reviewed: true }))} disabled={state.reviewed}>
          {data.s.markReviewed}
        </button>
        <span className="status" data-state={state.reviewed ? "reviewed" : "draft"} role="status">
          {state.reviewed ? data.s.reviewed : data.s.notReviewed}
        </span>
      </Pane>
      <Pane role="result" label={data.chrome.panes.output}>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.priorities}</p>
        <ol className="fact-list" style={{ listStyle: "decimal inside" }}>
          {interp.priorities.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </Pane>
    </Workbench>
  );
}

/* ----------------------------------------------------------------- content */

export type ContentData = {
  chrome: ExampleChrome;
  facts: string[];
  scenarios: { id: string; label: string; extraFacts: string[]; formats: { id: string; label: string; draft: string }[] }[];
  s: {
    scenario: string;
    format: string;
    facts: string;
    draft: string;
    editHint: string;
    markReviewed: string;
    statusDraft: string;
    statusReviewed: string;
    statusChanged: string;
    priceCheckOk: string;
    priceCheckWarn: string;
    factsLinked: string;
    exportLabel: string;
    exportDisabled: string;
    exported: string;
    fileHeader: string;
    reviewer: string;
  };
};

const PRICE = /(\$|HK\$|港幣|元|價錢|\bprice\b|\d+\s?(?:dollars|hkd))/i;

export function ContentExample({ data }: { data: ContentData }) {
  const first = data.scenarios[0];
  const fresh = (scenarioId: string, formatId?: string) => {
    const scenario = data.scenarios.find((s) => s.id === scenarioId) ?? first;
    const format = scenario.formats.find((f) => f.id === formatId) ?? scenario.formats[0];
    return { scenario: scenario.id, format: format.id, draft: format.draft, reviewedText: null as string | null, exported: false };
  };
  const [state, setState] = useState(() => fresh(first.id));
  const scenario = data.scenarios.find((s) => s.id === state.scenario) ?? first;
  const format = scenario.formats.find((f) => f.id === state.format) ?? scenario.formats[0];
  const status = state.reviewedText === null ? "draft" : state.reviewedText === state.draft ? "reviewed" : "changed";
  const hasPrice = PRICE.test(state.draft);

  const exportFile = () => {
    const lines = [
      data.s.fileHeader,
      "",
      `${data.s.scenario}: ${scenario.label}`,
      `${data.s.format}: ${format.label}`,
      "",
      `${data.s.facts}:`,
      ...[...data.facts, ...scenario.extraFacts].map((f) => `- ${f}`),
      "",
      `${data.s.draft}:`,
      state.draft,
      "",
      `${data.s.statusReviewed} — ${data.s.reviewer}`,
      `Record: REC-SAMPLE-${scenario.id.toUpperCase()}-${format.id.toUpperCase()}`,
    ];
    download(`fimmick-sample-${scenario.id}-${format.id}.txt`, lines.join("\n"));
    track("example_exported", { example: "content", scenario: scenario.id, sample: true });
    setState((s) => ({ ...s, exported: true }));
  };

  return (
    <Workbench chrome={data.chrome} onReset={() => setState(fresh(first.id))}>
      <Pane role="source" label={data.chrome.panes.input}>
        <label className="field">
          <span>{data.s.scenario}</span>
          <select value={state.scenario} onChange={(e) => setState(fresh(e.target.value))}>
            {data.scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.facts}</p>
        <ul className="fact-list">
          {[...data.facts, ...scenario.extraFacts].map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Pane>
      <Pane role="work" label={data.chrome.panes.work}>
        <label className="field">
          <span>{data.s.format}</span>
          <select value={state.format} onChange={(e) => setState(fresh(state.scenario, e.target.value))}>
            {scenario.formats.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{data.s.draft}</span>
          <textarea value={state.draft} onChange={(e) => setState((s) => ({ ...s, draft: e.target.value, exported: false }))} aria-describedby="content-edit-hint" />
        </label>
        <p id="content-edit-hint" className="micro muted">{data.s.editHint}</p>
      </Pane>
      <Pane role="review" label={data.chrome.panes.review}>
        <div className="check-row">
          <span className={hasPrice ? "warn" : "ok"} aria-hidden="true">{hasPrice ? "!" : "✓"}</span>
          <span>{hasPrice ? data.s.priceCheckWarn : data.s.priceCheckOk}</span>
        </div>
        <div className="check-row">
          <span className="ok" aria-hidden="true">✓</span>
          <span>{data.s.factsLinked}</span>
        </div>
        <button type="button" className="btn btn--small" onClick={() => setState((s) => ({ ...s, reviewedText: s.draft }))} disabled={status === "reviewed"}>
          {data.s.markReviewed}
        </button>
        <span className="status" data-state={status} role="status">
          {status === "draft" ? data.s.statusDraft : status === "reviewed" ? data.s.statusReviewed : data.s.statusChanged}
        </span>
        <p className="micro muted">{data.s.reviewer}</p>
      </Pane>
      <Pane role="result" label={data.chrome.panes.output}>
        <div className="output-card">
          <pre>{state.draft}</pre>
        </div>
        <button type="button" className="btn btn--accent btn--small" onClick={exportFile} disabled={status !== "reviewed"} aria-describedby="content-export-note">
          {data.s.exportLabel}
        </button>
        <p id="content-export-note" className="micro muted" role="status">
          {status !== "reviewed" ? data.s.exportDisabled : state.exported ? data.s.exported : ""}
        </p>
      </Pane>
    </Workbench>
  );
}

/* --------------------------------------------------------------- follow-up */

export type FollowUpData = {
  chrome: ExampleChrome;
  enquiries: { id: string; channel: string; received: string; message: string; intent: string; suggestedOwner: string; suggestedAction: string; priority: string; humanOnly: boolean; drafts: Record<string, string | null> }[];
  owners: { id: string; label: string }[];
  actions: { id: string; label: string }[];
  s: {
    enquiry: string;
    record: string;
    channel: string;
    received: string;
    intent: string;
    priority: string;
    owner: string;
    action: string;
    suggested: string;
    draft: string;
    noDraft: string;
    humanOnly: string;
    approve: string;
    statusOpen: string;
    statusApproved: string;
    notSent: string;
    task: string;
    due: string;
  };
};

export function FollowUpExample({ data }: { data: FollowUpData }) {
  const fresh = (id: string) => {
    const e = data.enquiries.find((x) => x.id === id) ?? data.enquiries[0];
    return { id: e.id, owner: e.suggestedOwner, action: e.suggestedAction, approved: false };
  };
  const [state, setState] = useState(() => fresh(data.enquiries[0].id));
  const enquiry = data.enquiries.find((e) => e.id === state.id) ?? data.enquiries[0];
  const draft = enquiry.drafts[state.action];
  const ownerLabel = data.owners.find((o) => o.id === state.owner)?.label ?? "";
  const actionLabel = data.actions.find((a) => a.id === state.action)?.label ?? "";
  return (
    <Workbench chrome={data.chrome} onReset={() => setState(fresh(data.enquiries[0].id))}>
      <Pane role="source" label={data.chrome.panes.input}>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="micro muted" style={{ fontWeight: 750, marginBottom: 6 }}>{data.s.enquiry}</legend>
          <div className="radio-row">
            {data.enquiries.map((e) => (
              <label key={e.id}>
                <input type="radio" name="enquiry" checked={state.id === e.id} onChange={() => setState(fresh(e.id))} />
                {e.id}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="output-card">
          <p>{enquiry.message}</p>
        </div>
      </Pane>
      <Pane role="work" label={data.chrome.panes.work}>
        <dl className="kv" style={{ gridTemplateColumns: "minmax(90px, 40%) 1fr" }}>
          <dt>{data.s.channel}</dt>
          <dd>{enquiry.channel}</dd>
          <dt>{data.s.received}</dt>
          <dd>{enquiry.received}</dd>
          <dt>{data.s.intent}</dt>
          <dd>{enquiry.intent}</dd>
          <dt>{data.s.priority}</dt>
          <dd>{enquiry.priority}</dd>
        </dl>
        {enquiry.humanOnly ? <span className="status" data-state="human">{data.s.humanOnly}</span> : null}
      </Pane>
      <Pane role="review" label={data.chrome.panes.review}>
        <label className="field">
          <span>
            {data.s.owner} ({data.s.suggested}: {data.owners.find((o) => o.id === enquiry.suggestedOwner)?.label})
          </span>
          <select value={state.owner} onChange={(e) => setState((s) => ({ ...s, owner: e.target.value, approved: false }))}>
            {data.owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{data.s.action}</span>
          <select value={state.action} onChange={(e) => setState((s) => ({ ...s, action: e.target.value, approved: false }))}>
            {data.actions.map((a) => (
              <option key={a.id} value={a.id} disabled={enquiry.humanOnly && a.id !== "route"}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn--small" onClick={() => setState((s) => ({ ...s, approved: true }))} disabled={state.approved}>
          {data.s.approve}
        </button>
        <span className="status" data-state={state.approved ? "approved" : "draft"} role="status">
          {state.approved ? data.s.statusApproved : data.s.statusOpen}
        </span>
      </Pane>
      <Pane role="result" label={data.chrome.panes.output}>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.draft}</p>
        <div className="output-card">{draft ? <p>{draft}</p> : <p className="muted">{data.s.noDraft}</p>}</div>
        <dl className="kv" style={{ gridTemplateColumns: "minmax(90px, 40%) 1fr" }}>
          <dt>{data.s.owner}</dt>
          <dd>{ownerLabel}</dd>
          <dt>{data.s.task}</dt>
          <dd>{actionLabel}</dd>
          <dt>{data.s.due}</dt>
          <dd>{enquiry.humanOnly ? "2026-09-18 16:00" : "2026-09-19 12:00"}</dd>
        </dl>
        {state.approved ? <p className="micro muted">{data.s.notSent}</p> : null}
      </Pane>
    </Workbench>
  );
}

/* ------------------------------------------------------------- website ops */

export type WebOpsData = {
  chrome: ExampleChrome;
  changes: { id: string; label: string; record: string; variant: string; fields: { name: string; before: string; after: string; changed: boolean; valid: boolean; note?: string }[]; preview: { title: string; lines: string[] } }[];
  s: {
    change: string;
    record: string;
    field: string;
    before: string;
    after: string;
    validation: string;
    valid: string;
    invalid: string;
    approve: string;
    returnLabel: string;
    statusPending: string;
    statusApproved: string;
    statusReturned: string;
    statusHeld: string;
    preview: string;
    previewNote: string;
    history: string;
    historyCreated: string;
    historyApproved: string;
    historyReturned: string;
  };
};

export function WebsiteOpsExample({ data }: { data: WebOpsData }) {
  const fresh = (id: string) => ({ id, decision: "pending" as "pending" | "approved" | "returned" });
  const [state, setState] = useState(() => fresh(data.changes[0].id));
  const change = data.changes.find((c) => c.id === state.id) ?? data.changes[0];
  const invalid = change.fields.some((f) => !f.valid);
  const statusKey = invalid ? "held" : state.decision === "approved" ? "approved" : state.decision === "returned" ? "changed" : "draft";
  const statusText = invalid ? data.s.statusHeld : state.decision === "approved" ? data.s.statusApproved : state.decision === "returned" ? data.s.statusReturned : data.s.statusPending;
  const history = useMemo(() => {
    const items = [`${change.record} · ${data.s.historyCreated}`];
    if (state.decision === "approved") items.push(`${change.record} · ${data.s.historyApproved}`);
    if (state.decision === "returned") items.push(`${change.record} · ${data.s.historyReturned}`);
    return items;
  }, [change.record, state.decision, data.s]);
  return (
    <Workbench chrome={data.chrome} onReset={() => setState(fresh(data.changes[0].id))}>
      <Pane role="source" label={data.chrome.panes.input}>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="micro muted" style={{ fontWeight: 750, marginBottom: 6 }}>{data.s.change}</legend>
          <div className="radio-row">
            {data.changes.map((c) => (
              <label key={c.id}>
                <input type="radio" name="webops-change" checked={state.id === c.id} onChange={() => setState(fresh(c.id))} />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="micro muted">
          {data.s.record}: <strong>{change.record}</strong>
        </p>
      </Pane>
      <Pane role="work" label={data.chrome.panes.work}>
        <div style={{ overflowX: "auto" }}>
          <table className="diff">
            <thead>
              <tr>
                <th scope="col">{data.s.field}</th>
                <th scope="col">{data.s.before}</th>
                <th scope="col">{data.s.after}</th>
              </tr>
            </thead>
            <tbody>
              {change.fields.map((f) => (
                <tr key={f.name} data-changed={f.changed} data-valid={f.valid}>
                  <th scope="row" style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.85rem", color: "var(--ink)" }}>{f.name}</th>
                  <td className="before">{f.before}</td>
                  <td className="after">
                    {f.after}
                    {f.note ? <span className="micro" style={{ display: "block", fontWeight: 600 }}>{f.note}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="check-row">
          <span className={invalid ? "warn" : "ok"} aria-hidden="true">{invalid ? "!" : "✓"}</span>
          <span>
            {data.s.validation}: {invalid ? data.s.invalid : data.s.valid}
          </span>
        </div>
      </Pane>
      <Pane role="review" label={data.chrome.panes.review}>
        <div className="btn-row">
          <button type="button" className="btn btn--small" disabled={invalid || state.decision !== "pending"} onClick={() => setState((s) => ({ ...s, decision: "approved" }))}>
            {data.s.approve}
          </button>
          <button type="button" className="btn btn--ghost btn--small" disabled={state.decision !== "pending"} onClick={() => setState((s) => ({ ...s, decision: "returned" }))}>
            {data.s.returnLabel}
          </button>
        </div>
        <span className="status" data-state={statusKey} role="status">
          {statusText}
        </span>
        <p className="micro muted" style={{ fontWeight: 750 }}>{data.s.history}</p>
        <ul className="log">
          {history.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Pane>
      <Pane role="result" label={data.chrome.panes.output}>
        <div className="page-preview" data-variant={change.variant}>
          <div className="pp-bar">{data.s.preview}</div>
          <div className="pp-body">
            <div className="pp-img" aria-hidden="true" />
            <h4>{state.decision === "approved" || invalid ? change.preview.title : change.fields[0].before === "—" ? change.preview.title : change.fields[0].before}</h4>
            {(state.decision === "approved" ? change.preview.lines : invalid ? change.preview.lines : change.preview.lines.slice(0, 1)).map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
        <p className="micro muted">{data.s.previewNote}</p>
      </Pane>
    </Workbench>
  );
}
