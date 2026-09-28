"use client";

import Link from "next/link";
import { useState } from "react";

export type RoadmapStep = { id: string; number: string; name: string; decision: string; inputs: string; deliverable: string; humanRole: string; link?: { label: string; href: string } };

/**
 * Six programme workstreams. All six stay visible; selecting one reveals its
 * decision, inputs, deliverable and human responsibility. Not a mandatory
 * purchase sequence — the note says so explicitly.
 */
export function Roadmap({ steps, labels }: { steps: RoadmapStep[]; labels: { group: string; decision: string; inputs: string; deliverable: string; human: string; note: string } }) {
  const [active, setActive] = useState(steps[0].id);
  const step = steps.find((s) => s.id === active) ?? steps[0];
  return (
    <div>
      <div role="group" aria-label={labels.group}>
      <ol className="roadmap-steps">
        {steps.map((s) => (
          <li key={s.id}>
            <button type="button" aria-pressed={s.id === active} aria-controls="roadmap-detail" onClick={() => setActive(s.id)}>
              <span className="n">{s.number}</span>
              {s.name}
            </button>
          </li>
        ))}
      </ol>
      </div>
      <div className="selector-panel roadmap-detail" id="roadmap-detail" key={step.id} aria-live="polite">
        <h3>
          {step.number} · {step.name}
        </h3>
        <div className="panel-cols">
          <div>
            <h4>{labels.decision}</h4>
            <p>{step.decision}</p>
          </div>
          <div>
            <h4>{labels.inputs}</h4>
            <p>{step.inputs}</p>
          </div>
          <div>
            <h4>{labels.deliverable}</h4>
            <p>
              <strong>{step.deliverable}</strong>
            </p>
          </div>
          <div>
            <h4>{labels.human}</h4>
            <p>{step.humanRole}</p>
          </div>
        </div>
        {step.link ? (
          <p style={{ marginTop: 18 }}>
            <Link className="text-link" href={step.link.href}>
              {step.link.label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        ) : null}
      </div>
      <p className="micro muted" style={{ marginTop: 12 }}>
        {labels.note}
      </p>
    </div>
  );
}
