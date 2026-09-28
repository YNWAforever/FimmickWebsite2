"use client";

import Link from "next/link";
import { useState } from "react";

type LinkView = { label: string; href: string };
export type IndustryView = {
  id: string;
  name: string;
  short: string;
  problem: string;
  journey: { step: string; copy: string; who: string; human: boolean }[];
  products: LinkView[];
  services: LinkView[];
  evidence?: LinkView & { kind: string };
  proof: string;
  output: string;
  cta: LinkView;
  detail: LinkView;
};

/**
 * Sector selector. Changing the sector changes the journey, products,
 * services, evidence and the enquiry context carried by the CTA.
 */
export function IndustryMap({ industries, labels }: { industries: IndustryView[]; labels: { group: string; products: string; services: string; evidence: string; output: string; noEvidence: string } }) {
  const [active, setActive] = useState(industries[0].id);
  const current = industries.find((i) => i.id === active) ?? industries[0];
  return (
    <div className="selector selector--side">
      <div role="group" aria-label={labels.group}>
      <ul className="selector-options">
        {industries.map((industry) => (
          <li key={industry.id}>
            <button type="button" className="selector-btn" aria-pressed={industry.id === active} aria-controls="industry-panel" onClick={() => setActive(industry.id)}>
              {industry.name}
              <small>{industry.short}</small>
            </button>
          </li>
        ))}
      </ul>
      </div>
      <div className="selector-panel" id="industry-panel" key={current.id} aria-live="polite">
        <h3>{current.name}</h3>
        <p className="muted">{current.problem}</p>
        <ol className="journey">
          {current.journey.map((step) => (
            <li key={step.step} data-human={step.human}>
              <strong>{step.step}</strong>
              <p>{step.copy}</p>
              <span className="who">{step.who}</span>
            </li>
          ))}
        </ol>
        <div className="panel-cols">
          <div>
            <h4>{labels.products}</h4>
            <ul className="chips">
              {current.products.map((p) => (
                <li key={p.href}>
                  <Link className="chip chip--magenta" href={p.href}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 style={{ marginTop: 16 }}>{labels.services}</h4>
            <ul className="chips">
              {current.services.map((s) => (
                <li key={s.href}>
                  <Link className="chip" href={s.href}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{labels.output}</h4>
            <p>{current.output}</p>
            <h4 style={{ marginTop: 16 }}>{labels.evidence}</h4>
            {current.evidence ? (
              <p>
                <span className="chip chip--sky">{current.evidence.kind}</span>{" "}
                <Link href={current.evidence.href}>{current.evidence.label}</Link>
              </p>
            ) : (
              <p className="small muted">{labels.noEvidence}</p>
            )}
            <p className="micro muted" style={{ marginTop: 8 }}>
              {current.proof}
            </p>
          </div>
        </div>
        <div className="btn-row" style={{ marginTop: 24 }}>
          <Link className="btn btn--accent btn--small" href={current.cta.href}>
            {current.cta.label}
          </Link>
          <Link className="text-link" href={current.detail.href}>
            {current.detail.label} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
