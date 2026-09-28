"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ContentExample, FollowUpExample, IntelligenceExample, WebsiteOpsExample, type ContentData, type FollowUpData, type IntelData, type WebOpsData } from "./Examples";
import { track } from "@/lib/analytics";

export type ExampleBundle = {
  intelligence: IntelData;
  content: ContentData;
  "follow-up": FollowUpData;
  "website-ops": WebOpsData;
};
type Id = keyof ExampleBundle;

/**
 * Four-tab example viewer. Each tab is a separate deterministic example;
 * switching tabs remounts it so no state leaks between scenarios.
 */
export function ExampleViewer({ bundle, tabs, initial = "content", label }: { bundle: ExampleBundle; tabs: { id: Id; label: string; hint: string }[]; initial?: Id; label: string }) {
  const [active, setActive] = useState<Id>(initial);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const select = (id: Id) => {
    setActive(id);
    track("example_opened", { example: id, sample: true });
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (event.key === "Home" || event.key === "End" || delta) {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + delta + tabs.length) % tabs.length;
      select(tabs[next].id);
      refs.current[tabs[next].id]?.focus();
    }
  };
  return (
    <div>
      <div className="ex-tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            id={`ex-tab-${tab.id}`}
            type="button"
            role="tab"
            className="ex-tab"
            aria-selected={active === tab.id}
            aria-controls={`ex-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => select(tab.id)}
            onKeyDown={(e) => onKey(e, index)}
          >
            {tab.label}
            <small>{tab.hint}</small>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`ex-panel-${active}`} aria-labelledby={`ex-tab-${active}`} key={active}>
        {active === "intelligence" ? <IntelligenceExample data={bundle.intelligence} /> : null}
        {active === "content" ? <ContentExample data={bundle.content} /> : null}
        {active === "follow-up" ? <FollowUpExample data={bundle["follow-up"]} /> : null}
        {active === "website-ops" ? <WebsiteOpsExample data={bundle["website-ops"]} /> : null}
      </div>
    </div>
  );
}

/** Single example without tabs (product and solution pages); only its own data is sent. */
export function SingleExample(props: { [K in Id]: { id: K; data: ExampleBundle[K] } }[Id]) {
  if (props.id === "intelligence") return <IntelligenceExample data={props.data} />;
  if (props.id === "content") return <ContentExample data={props.data} />;
  if (props.id === "follow-up") return <FollowUpExample data={props.data} />;
  return <WebsiteOpsExample data={props.data} />;
}
