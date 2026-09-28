"use client";

import { useState } from "react";

export type BaStep = { title: string; copy: string; kind: "manual" | "pain" | "ai" | "human" | "system"; tag: string };

/**
 * Before/after workflow comparison. Factual process differences only — no
 * invented savings. Buttons switch views (no drag interaction required).
 */
export function BeforeAfter({ before, after, labels }: { before: BaStep[]; after: BaStep[]; labels: { before: string; after: string; group: string; note: string } }) {
  const [view, setView] = useState<"before" | "after">("after");
  const steps = view === "before" ? before : after;
  return (
    <div className="ba">
      <div className="ba-toggle" role="group" aria-label={labels.group}>
        <button type="button" aria-pressed={view === "before"} onClick={() => setView("before")}>
          {labels.before}
        </button>
        <button type="button" aria-pressed={view === "after"} onClick={() => setView("after")}>
          {labels.after}
        </button>
      </div>
      <ol className="ba-lane" key={view} aria-live="polite">
        {steps.map((step) => (
          <li key={step.title} data-kind={step.kind}>
            <span className="tag">{step.tag}</span>
            <strong>{step.title}</strong>
            <p>{step.copy}</p>
          </li>
        ))}
      </ol>
      <p className="ba-note">{labels.note}</p>
    </div>
  );
}
