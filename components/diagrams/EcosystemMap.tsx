"use client";

import Link from "next/link";
import { useState } from "react";

type LinkView = { label: string; href: string };
export type MemberView = {
  id: string;
  name: string;
  role: string;
  relationship: string;
  audience: string;
  why: string;
  services: LinkView[];
  industries: LinkView[];
  detail: LinkView;
  external?: LinkView;
};
export type GroupView = { id: string; name: string; copy: string; members: MemberView[] };

/**
 * Grouped ecosystem portfolio. Selecting a member reveals its audience, role,
 * FIMMICK relationship and related work. Relationships are labelled business
 * connections — no data-flow arrows or orbiting logos.
 */
export function EcosystemMap({ groups, labels }: { groups: GroupView[]; labels: { group: string; audience: string; relationship: string; services: string; industries: string; why: string; boundary: string } }) {
  const all = groups.flatMap((g) => g.members);
  const [active, setActive] = useState(all[0].id);
  const current = all.find((m) => m.id === active) ?? all[0];
  return (
    <div className="eco">
      <div>
        <div className="eco-groups" role="group" aria-label={labels.group}>
          {groups.map((group) => (
            <div className="eco-group" key={group.id}>
              <h3>{group.name}</h3>
              <p>{group.copy}</p>
              <ul className="members">
                {group.members.map((m) => (
                  <li key={m.id}>
                    <button type="button" className="eco-member" aria-pressed={m.id === active} aria-controls="eco-panel" onClick={() => setActive(m.id)}>
                      {m.name}
                      <small>{m.role}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="eco-note">{labels.boundary}</p>
      </div>
      <div className="selector-panel" id="eco-panel" key={current.id} aria-live="polite">
        <p className="eyebrow" style={{ marginBottom: 8 }}>
          {current.role}
        </p>
        <h3>{current.name}</h3>
        <dl className="panel-cols" style={{ margin: "16px 0 0" }}>
          <div>
            <dt className="micro muted">{labels.relationship}</dt>
            <dd style={{ margin: "4px 0 0" }}>{current.relationship}</dd>
          </div>
          <div>
            <dt className="micro muted">{labels.audience}</dt>
            <dd style={{ margin: "4px 0 0" }}>{current.audience}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 16 }}>
          <strong>{labels.why}</strong> {current.why}
        </p>
        <div className="panel-cols">
          <div>
            <h4>{labels.services}</h4>
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
            <h4>{labels.industries}</h4>
            <ul className="chips">
              {current.industries.map((s) => (
                <li key={s.href}>
                  <Link className="chip" href={s.href}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="btn-row" style={{ marginTop: 22 }}>
          <Link className="btn btn--small" href={current.detail.href}>
            {current.detail.label}
          </Link>
          {current.external ? (
            <a className="text-link" href={current.external.href} rel="noopener noreferrer" target="_blank">
              {current.external.label} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
