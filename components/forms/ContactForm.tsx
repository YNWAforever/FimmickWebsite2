"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

export type ContextItem = { key: string; value: string; label: string; kind: string };
export type ContactStrings = {
  legend: string;
  name: string;
  email: string;
  company: string;
  work: string;
  workHint: string;
  optional: string;
  more: string;
  phone: string;
  website: string;
  tools: string;
  message: string;
  intent: string;
  context: string;
  contextHint: string;
  remove: string;
  submit: string;
  submitting: string;
  required: string;
  invalidEmail: string;
  tooLong: string;
  invalidPhone: string;
  accepted: string;
  acceptedNext: string;
  unavailable: string;
  failed: string;
  timeout: string;
  retry: string;
  rateLimited: string;
  prepareEmail: string;
  openEmail: string;
  copyEmail: string;
  copied: string;
  emailNote: string;
  emailSubject: string;
  privacy: string;
};

type Status = "idle" | "submitting" | "accepted" | "unavailable" | "failed" | "timeout" | "rate_limited";
type Fields = { name: string; email: string; company: string; work: string; phone: string; website: string; tools: string; message: string };

const empty: Fields = { name: "", email: "", company: "", work: "", phone: "", website: "", tools: "", message: "" };
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const newKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `k-${Date.now()}-${Math.random().toString(36).slice(2)}`);

/**
 * Enquiry form. Short first step; optional detail on request. Context comes
 * from the originating page (known IDs only) and can be corrected. Personal
 * data never goes into URLs, analytics or browser storage. Success is shown
 * only when the server confirms acceptance; otherwise an honest email handoff
 * is offered.
 */
export function ContactForm({ lang, intents, initialIntent, initialContext, email, s }: { lang: Locale; intents: { id: string; label: string }[]; initialIntent: string; initialContext: ContextItem[]; email: string; s: ContactStrings }) {
  const [fields, setFields] = useState<Fields>(empty);
  const [intent, setIntent] = useState(initialIntent);
  const [context, setContext] = useState<ContextItem[]>(initialContext);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const key = useRef(newKey());
  const started = useRef(false);
  const hp = useRef<HTMLInputElement>(null);

  const intentLabel = intents.find((i) => i.id === intent)?.label ?? "";
  const set = (name: keyof Fields) => (value: string) => {
    if (!started.current) {
      started.current = true;
      track("enquiry_started", { intent });
    }
    // Any change after an uncertain attempt starts a fresh request.
    if (status !== "timeout") key.current = newKey();
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = s.required;
    if (!fields.email.trim()) next.email = s.required;
    else if (!EMAIL.test(fields.email.trim())) next.email = s.invalidEmail;
    if (!fields.company.trim()) next.company = s.required;
    if (!fields.work.trim()) next.work = s.required;
    if (fields.work.length > 500 || fields.message.length > 3000) next.message = s.tooLong;
    if (fields.phone && !/^[+()\d\s-]{6,40}$/.test(fields.phone)) next.phone = s.invalidPhone;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !first;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "submitting" || !validate()) return;
    setStatus("submitting");
    const ctx: Record<string, string> = { intent };
    for (const c of context) ctx[c.key] = c.value;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fields, context: ctx, idempotencyKey: key.current, lang, hp: hp.current?.value || "" }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const body = await response.json().catch(() => ({}));
      if (response.ok && body.status === "accepted") {
        setStatus("accepted");
        track("enquiry_accepted", { intent });
        return;
      }
      if (response.status === 422 && body.errors) {
        const map: Partial<Record<keyof Fields, string>> = {};
        for (const [k, v] of Object.entries(body.errors as Record<string, string>)) map[k as keyof Fields] = v === "invalid" ? (k === "email" ? s.invalidEmail : s.invalidPhone) : v === "too_long" ? s.tooLong : s.required;
        setErrors(map);
        setStatus("idle");
        return;
      }
      setStatus(response.status === 503 ? "unavailable" : response.status === 504 ? "timeout" : response.status === 429 ? "rate_limited" : "failed");
    } catch {
      setStatus("timeout");
    }
  };

  const emailBody = useMemo(() => {
    const lines = [
      `${s.intent}: ${intentLabel}`,
      ...context.map((c) => `${c.kind}: ${c.label}`),
      "",
      `${s.name}: ${fields.name}`,
      `${s.company}: ${fields.company}`,
      `${s.email}: ${fields.email}`,
      fields.phone ? `${s.phone}: ${fields.phone}` : "",
      "",
      `${s.work}: ${fields.work}`,
      fields.website ? `${s.website}: ${fields.website}` : "",
      fields.tools ? `${s.tools}: ${fields.tools}` : "",
      fields.message ? `\n${fields.message}` : "",
    ];
    return lines.filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
  }, [fields, context, intentLabel, s]);

  const mailto = `mailto:${email}?subject=${encodeURIComponent(`${s.emailSubject}: ${intentLabel}`)}&body=${encodeURIComponent(emailBody)}`;

  if (status === "accepted") {
    return (
      <div className="form" role="status" aria-live="polite">
        <p className="form-status" data-kind="success">{s.accepted}</p>
        <p className="muted">{s.acceptedNext}</p>
      </div>
    );
  }

  const field = (name: keyof Fields, label: string, opts: { type?: string; required?: boolean; textarea?: boolean; hint?: string; autoComplete?: string } = {}) => (
    <label className="f" htmlFor={`f-${name}`}>
      <span>
        {label} {opts.required ? <span aria-hidden="true">*</span> : <span className="opt">({s.optional})</span>}
      </span>
      {opts.textarea ? (
        <textarea id={`f-${name}`} name={name} value={fields[name]} onChange={(e) => set(name)(e.target.value)} aria-invalid={errors[name] ? true : undefined} aria-describedby={errors[name] ? `e-${name}` : opts.hint ? `h-${name}` : undefined} maxLength={name === "work" ? 500 : 3000} required={opts.required} />
      ) : (
        <input id={`f-${name}`} name={name} type={opts.type ?? "text"} value={fields[name]} onChange={(e) => set(name)(e.target.value)} aria-invalid={errors[name] ? true : undefined} aria-describedby={errors[name] ? `e-${name}` : undefined} autoComplete={opts.autoComplete} required={opts.required} maxLength={200} />
      )}
      {opts.hint && !errors[name] ? <span id={`h-${name}`} className="micro muted">{opts.hint}</span> : null}
      {errors[name] ? <span id={`e-${name}`} className="field-error">{errors[name]}</span> : null}
    </label>
  );

  return (
    <form className="form" onSubmit={submit} noValidate aria-describedby="form-privacy">
      <fieldset>
        <legend>{s.legend}</legend>
        <label className="f" htmlFor="f-intent">
          <span>{s.intent}</span>
          <select id="f-intent" value={intent} onChange={(e) => setIntent(e.target.value)}>
            {intents.map((i) => (
              <option key={i.id} value={i.id}>{i.label}</option>
            ))}
          </select>
        </label>
        {context.length ? (
          <div className="context-box">
            <p className="small"><strong>{s.context}</strong> — {s.contextHint}</p>
            <ul className="chips">
              {context.map((c) => (
                <li key={c.key}>
                  <span className="chip chip--sky">
                    {c.kind}: {c.label}
                    <button type="button" onClick={() => setContext((list) => list.filter((x) => x.key !== c.key))} aria-label={`${s.remove} ${c.label}`} style={{ border: 0, background: "none", padding: "0 0 0 6px", fontWeight: 800, color: "inherit" }}>×</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="form-row">
          {field("name", s.name, { required: true, autoComplete: "name" })}
          {field("company", s.company, { required: true, autoComplete: "organization" })}
        </div>
        {field("email", s.email, { type: "email", required: true, autoComplete: "email" })}
        {field("work", s.work, { required: true, textarea: true, hint: s.workHint })}
        <details>
          <summary className="small" style={{ cursor: "pointer", fontWeight: 750, minHeight: 44, display: "flex", alignItems: "center" }}>{s.more}</summary>
          <div className="stack" style={{ ["--stack" as string]: "14px", marginTop: 8 }}>
            <div className="form-row">
              {field("phone", s.phone, { type: "tel", autoComplete: "tel" })}
              {field("website", s.website, { type: "url", autoComplete: "url" })}
            </div>
            {field("tools", s.tools)}
            {field("message", s.message, { textarea: true })}
          </div>
        </details>
        <div className="hp" aria-hidden="true">
          <label>Leave empty<input ref={hp} type="text" name="hp" tabIndex={-1} autoComplete="off" /></label>
        </div>
      </fieldset>
      <p id="form-privacy" className="micro muted">{s.privacy}</p>
      <div className="btn-row">
        <button className="btn btn--accent" type="submit" disabled={status === "submitting"}>{status === "submitting" ? s.submitting : status === "timeout" ? s.retry : s.submit}</button>
        <button className="btn btn--ghost" type="button" onClick={() => { if (validate()) { setEmailOpen(true); track("enquiry_email_prepared", { intent }); } }}>{s.prepareEmail}</button>
      </div>
      <div aria-live="polite">
        {status === "unavailable" ? <p className="form-status" data-kind="info">{s.unavailable}</p> : null}
        {status === "failed" ? <p className="form-status" data-kind="error">{s.failed}</p> : null}
        {status === "timeout" ? <p className="form-status" data-kind="error">{s.timeout}</p> : null}
        {status === "rate_limited" ? <p className="form-status" data-kind="error">{s.rateLimited}</p> : null}
      </div>
      {emailOpen || status === "unavailable" || status === "failed" ? (
        <div className="context-box">
          <p className="small">{s.emailNote}</p>
          <pre className="email-preview">{emailBody}</pre>
          <div className="btn-row">
            <a className="btn btn--small" href={mailto}>{s.openEmail} ({email})</a>
            <button type="button" className="btn btn--ghost btn--small" onClick={async () => { try { await navigator.clipboard.writeText(emailBody); setCopied(true); } catch { setCopied(false); } }}>{copied ? s.copied : s.copyEmail}</button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
