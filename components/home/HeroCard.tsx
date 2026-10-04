"use client";

import { useRef, useState, type KeyboardEvent } from "react";

/** A caption as runs of text; a run with a fact id is the wording that fact supplied. */
export type CaptionRun = [text: string, fact?: string];
type Role = "source" | "work" | "review" | "result";
type Props = {
  label: string;
  facts: { id: string; label: string }[];
  factsLabel: string;
  captions: { lang: string; runs: CaptionRun[] }[];
  approved: string;
  approve: string;
  ledgerLabel: string;
  ledger: { role: Role; label: string }[];
  record: { label: string; id: string };
  notice: string;
};

const keys: Record<string, (i: number, last: number) => number> = {
  ArrowRight: (i, last) => (i === last ? 0 : i + 1),
  ArrowDown: (i, last) => (i === last ? 0 : i + 1),
  ArrowLeft: (i, last) => (i === 0 ? last : i - 1),
  ArrowUp: (i, last) => (i === 0 ? last : i - 1),
  Home: () => 0,
  End: (_, last) => last,
};

/**
 * The homepage hero card, live (award pass 2, 7). Hovering, focusing or pressing a fact chip
 * underlines the caption words that fact supplied, in both languages; Approve toggles the stamp and
 * the export step. The server renders the finished state (approved, exported), so the view without
 * JavaScript and the LCP are unchanged; nothing moves without input and no timer runs.
 */
export function HeroCard({ label, facts, factsLabel, captions, approved: approvedLabel, approve, ledgerLabel, ledger, record, notice }: Props) {
  const [lit, setLit] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [approved, setApproved] = useState(true);
  const [touched, setTouched] = useState(false);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const active = lit ?? pinned;
  // The stamp and the typed record play only after a press, never on load.
  const stamp = touched && approved;

  // One tab stop for the chips (roving tabindex); arrows, Home and End move between them.
  const onKeyDown = (e: KeyboardEvent) => {
    const step = keys[e.key];
    if (!step) return;
    e.preventDefault();
    const next = step(focusIndex, facts.length - 1);
    setFocusIndex(next);
    chips.current[next]?.focus();
  };

  return (
    <aside className="hero-card" aria-label={label}>
      <p className="hero-card__label">{label}</p>
      <div className="hero-facts" role="toolbar" aria-label={factsLabel} onKeyDown={onKeyDown}>
        {facts.map((f, i) => (
          <button
            key={f.id}
            ref={(el) => {
              chips.current[i] = el;
            }}
            type="button"
            className="hero-fact"
            tabIndex={i === focusIndex ? 0 : -1}
            aria-pressed={pinned === f.id}
            onPointerEnter={() => setLit(f.id)}
            onPointerLeave={() => setLit(null)}
            onFocus={() => {
              setLit(f.id);
              setFocusIndex(i);
            }}
            onBlur={() => setLit(null)}
            onClick={() => setPinned((p) => (p === f.id ? null : f.id))}
          >
            {f.label}
          </button>
        ))}
      </div>
      {captions.map((c) => (
        <p key={c.lang} className="hero-card__draft" lang={c.lang}>
          {c.runs.map(([text, fact], i) =>
            fact ? (
              <span key={i} data-fact={fact} data-lit={active === fact || undefined}>
                {text}
              </span>
            ) : (
              text
            ),
          )}
        </p>
      ))}
      <button
        type="button"
        className="hero-card__approved"
        aria-pressed={approved}
        data-stamp={stamp || undefined}
        onClick={() => {
          setApproved((a) => !a);
          setTouched(true);
        }}
      >
        {approved ? (
          <>
            <span aria-hidden="true">✓</span> {approvedLabel}
          </>
        ) : (
          approve
        )}
      </button>
      <ol className="hero-ledger" aria-label={ledgerLabel}>
        {ledger.map((step, i) => (
          <li key={step.role} data-role={step.role} data-state={approved || step.role === "source" || step.role === "work" ? "done" : "pending"}>
            <span className="hero-ledger__node" aria-hidden="true">
              {step.role === "review" && approved ? "✓" : String(i + 1).padStart(2, "0")}
            </span>
            <span className="hero-ledger__label">{step.label}</span>
          </li>
        ))}
      </ol>
      {/* Kept in the layout while pending (no jump); typed out when an approval exports it. */}
      <p className="hero-card__record" data-pending={!approved || undefined} data-typed={stamp || undefined} aria-hidden={!approved || undefined}>
        {record.label} <span className="hero-card__record-id">{record.id}</span>
      </p>
      <p className="hero-card__notice">{notice}</p>
    </aside>
  );
}
