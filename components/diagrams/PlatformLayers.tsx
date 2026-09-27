"use client";

import { useState } from "react";

export type LayerView = {
  id: string;
  number: string;
  name: string;
  question: string;
  explanation: string;
  shows: string[];
  scenarioLabel: string;
  scenarioItems: string[];
};

/** Scenario step index → layer that carries it. */
const stepLayer = ["data", "tasks", "approvals", "records", "records"];

/**
 * Four platform layers tied to one scenario. Desktop: select a layer to see
 * its explanation beside the scenario. Mobile (<960px): every layer is shown
 * as a labelled vertical step, so nothing depends on interaction or motion.
 */
export function PlatformLayers({
  layers,
  steps,
  variant = "dark",
  labels,
}: {
  layers: LayerView[];
  steps: string[];
  variant?: "dark" | "light";
  labels: { shows: string; scenario: string; select: string; journey: string };
}) {
  const [active, setActive] = useState(layers[0].id);
  return (
    <div className={variant === "light" ? "layers layers--light" : "layers"}>
      <div>
        <div className="layer-stack" role="group" aria-label={labels.select}>
          {layers.map((layer) => (
            <button key={layer.id} type="button" className="layer-btn" aria-pressed={active === layer.id} aria-controls={`layer-${layer.id}`} onClick={() => setActive(layer.id)}>
              <span className="num">{layer.number}</span>
              <span>
                <strong>{layer.name}</strong>
                <span className="q">{layer.question}</span>
              </span>
            </button>
          ))}
        </div>
        <ol className="scenario-strip" aria-label={labels.journey}>
          {steps.map((step, index) => (
            <li key={step} data-on={stepLayer[index] === active}>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="layer-panels" aria-live="polite">
        {layers.map((layer) => (
          <section key={layer.id} id={`layer-${layer.id}`} className="layer-panel" data-active={active === layer.id} aria-label={layer.name}>
            <p className="eyebrow" style={{ marginBottom: 10 }}>
              {layer.number} · {layer.name}
            </p>
            <h3>{layer.question}</h3>
            <p className="muted">{layer.explanation}</p>
            <div className="scenario">
              <div>
                <h4>{labels.shows}</h4>
                <ul className="dot-list small">
                  {layer.shows.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>
                  {labels.scenario}: {layer.scenarioLabel}
                </h4>
                <ul className="check-list small">
                  {layer.scenarioItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
