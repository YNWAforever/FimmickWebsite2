"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { track } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";
import { ENQUIRY_FIELDS, ENQUIRY_LIMITS, ENQUIRY_OPTIONAL_DETAIL, emptyEnquiry, validateEnquiry, type EnquiryError, type EnquiryField, type EnquiryFields } from "@/lib/enquiry-schema";

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
type Errors = Partial<Record<EnquiryField, EnquiryError>>;

const CLIENT_TIMEOUT_MS = 12_000;
/** Above this, some mail clients truncate a mailto: body, so Copy is offered first. */
const MAILTO_BODY_LIMIT = 1800;

/** cyrb53: a small non-cryptographic string hash; the request key only has to change with the payload. */
function hash(text: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
const newSalt = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 12) : Math.random().toString(36).slice(2, 14));
/** True once hydrated: the fields stay disabled until then, so a pre-hydration submit cannot happen. */
const noopSubscribe = () => () => {};

/**
 * Enquiry form. Short first step; optional detail on request. Context comes from the originating
 * page (known IDs only) and can be corrected. Personal data never goes into URLs, analytics or
 * browser storage: the form posts (never GETs), and its controls stay disabled until JavaScript is
 * running, with an email link for visitors without it. Success is shown only when the server
 * confirms acceptance; otherwise an honest email handoff is offered.
 *
 * Request keys are derived from the payload: retrying the same request reuses its key (the server
 * answers once), and any change to a field, the intent or the context makes a new one.
 */
export function ContactForm({ lang, action, intents, initialIntent, initialContext, email, s }: { lang: Locale; action: string; intents: { id: string; label: string }[]; initialIntent: string; initialContext: ContextItem[]; email: string; s: ContactStrings }) {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [fields, setFields] = useState<EnquiryFields>(emptyEnquiry);
  const [intent, setIntent] = useState(initialIntent);
  const [context, setContext] = useState<ContextItem[]>(initialContext);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [salt] = useState(newSalt);
  const started = useRef(false);
  const hp = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const previewRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const intentLabel = intents.find((i) => i.id === intent)?.label ?? "";
  const errorText = (name: EnquiryField, error: EnquiryError) => (error === "required" ? s.required : error === "too_long" ? s.tooLong : name === "email" ? s.invalidEmail : s.invalidPhone);

  /** After an uncertain attempt, any edit means a different request: drop the "retry safely" state. */
  const edited = () => {
    if (status === "timeout") setStatus("idle");
  };
  const set = (name: EnquiryField) => (value: string) => {
    if (!started.current) {
      started.current = true;
      track("enquiry_started", { intent });
    }
    edited();
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  /** Focus the first invalid field in DOM order, opening the optional-detail disclosure if it is inside. */
  const focusFirst = (errs: Errors) => {
    const first = ENQUIRY_FIELDS.find((k) => errs[k]);
    if (!first) return;
    if (ENQUIRY_OPTIONAL_DETAIL.includes(first) && !detailsOpen) flushSync(() => setDetailsOpen(true));
    document.getElementById(`f-${first}`)?.focus();
  };

  const validate = (): boolean => {
    const next = validateEnquiry(fields);
    setErrors(next);
    focusFirst(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "submitting" || !validate()) return;
    setStatus("submitting");
    const ctx: Record<string, string> = { intent };
    for (const c of context) ctx[c.key] = c.value;
    const idempotencyKey = `${salt}-${hash(JSON.stringify([fields, ctx, lang]))}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fields, context: ctx, idempotencyKey, lang, hp: hp.current?.value || "" }),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok && body.status === "accepted") {
        flushSync(() => setStatus("accepted"));
        successRef.current?.focus();
        track("enquiry_accepted", { intent });
        return;
      }
      if (response.status === 422 && body.errors) {
        const server = body.errors as Record<string, EnquiryError>;
        const map: Errors = Object.fromEntries(ENQUIRY_FIELDS.filter((k) => server[k]).map((k) => [k, server[k]]));
        setErrors(map);
        setStatus("idle");
        focusFirst(map);
        return;
      }
      setStatus(response.status === 503 ? "unavailable" : response.status === 504 ? "timeout" : response.status === 429 ? "rate_limited" : "failed");
    } catch {
      // Our own timer: the request may have arrived, so it is safe to retry with the same key.
      // Anything else (offline, DNS, connection refused): nothing was confirmed sent.
      setStatus(controller.signal.aborted ? "timeout" : "failed");
    } finally {
      clearTimeout(timer);
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(emailBody);
      setCopied(true);
    } catch {
      // Clipboard refused (permissions, insecure context): select the text so it can be copied by hand.
      setCopied(false);
      const preview = previewRef.current;
      const selection = window.getSelection();
      if (preview && selection) {
        const range = document.createRange();
        range.selectNodeContents(preview);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const message = { idle: "", submitting: "", accepted: s.accepted, unavailable: s.unavailable, failed: s.failed, timeout: s.timeout, rate_limited: s.rateLimited }[status];
  const kind = status === "unavailable" ? "info" : "error";

  const field = (name: EnquiryField, label: string, opts: { type?: string; required?: boolean; textarea?: boolean; hint?: string; autoComplete?: string } = {}) => {
    const id = `f-${name}`;
    const error = errors[name];
    const describedBy = [error ? `e-${name}` : "", opts.hint ? `h-${name}` : ""].filter(Boolean).join(" ") || undefined;
    const common = { id, name, value: fields[name], "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, required: opts.required, maxLength: ENQUIRY_LIMITS[name] };
    return (
      <div className="f">
        <label htmlFor={id}>
          {label} {opts.required ? <span aria-hidden="true">*</span> : <span className="opt">({s.optional})</span>}
        </label>
        {opts.textarea ? (
          <textarea {...common} onChange={(e) => set(name)(e.target.value)} />
        ) : (
          <input {...common} type={opts.type ?? "text"} autoComplete={opts.autoComplete} onChange={(e) => set(name)(e.target.value)} />
        )}
        {opts.hint ? <span id={`h-${name}`} className="micro muted">{opts.hint}</span> : null}
        {error ? <span id={`e-${name}`} className="field-error">{errorText(name, error)}</span> : null}
      </div>
    );
  };

  const long = emailBody.length > MAILTO_BODY_LIMIT;
  const openLink = <a key="open" className="btn btn--small" href={mailto}>{s.openEmail} ({email})</a>;
  const copyButton = <button key="copy" type="button" className="btn btn--ghost btn--small" onClick={copy}>{copied ? s.copied : s.copyEmail}</button>;

  return (
    <div className="enquiry">
      {status === "accepted" ? (
        <div className="form form--done">
          <h2 ref={successRef} tabIndex={-1} className="form-status" data-kind="success">{s.accepted}</h2>
          <p className="muted">{s.acceptedNext}</p>
        </div>
      ) : (
        <form className="form" method="post" action={action} onSubmit={submit} noValidate aria-describedby="form-privacy">
          <fieldset disabled={!hydrated}>
            <legend>{s.legend}</legend>
            <div className="f">
              <label htmlFor="f-intent">{s.intent}</label>
              <select id="f-intent" name="intent" value={intent} onChange={(e) => { edited(); setIntent(e.target.value); }}>
                {intents.map((i) => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>
            {context.length ? (
              <div className="context-box">
                <p className="small"><strong>{s.context}</strong> — {s.contextHint}</p>
                <ul className="chips">
                  {context.map((c) => (
                    <li key={c.key}>
                      <span className="chip chip--sky">
                        {c.kind}: {c.label}
                        <button type="button" className="chip__remove" onClick={() => { edited(); setContext((list) => list.filter((x) => x.key !== c.key)); }} aria-label={`${s.remove} ${c.label}`}>×</button>
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
            <details open={detailsOpen} onToggle={(e) => setDetailsOpen(e.currentTarget.open)}>
              <summary className="form-disclosure">{s.more}</summary>
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
            <button className="btn btn--accent" type="submit" disabled={!hydrated} aria-disabled={status === "submitting" || undefined}>
              {status === "submitting" ? s.submitting : status === "timeout" ? s.retry : s.submit}
            </button>
            <button className="btn btn--ghost" type="button" disabled={!hydrated} onClick={() => { if (validate()) { setEmailOpen(true); track("enquiry_email_prepared", { intent }); } }}>{s.prepareEmail}</button>
          </div>
          <noscript>
            <div className="context-box">
              <a className="btn btn--small" href={`mailto:${email}?subject=${encodeURIComponent(s.emailSubject)}`}>{s.openEmail} ({email})</a>
            </div>
          </noscript>
        </form>
      )}
      {/* One persistent live region: mounted from the start so success and errors are announced. */}
      <div role="status" aria-live="polite" className="form-live">
        {message ? <p className={status === "accepted" ? "sr-only" : "form-status"} data-kind={kind}>{message}</p> : null}
      </div>
      {status !== "accepted" && (emailOpen || status === "unavailable" || status === "failed") ? (
        <div className="context-box email-handoff">
          <p className="small">{s.emailNote}</p>
          <pre ref={previewRef} className="email-preview">{emailBody}</pre>
          <div className="btn-row">{long ? [copyButton, openLink] : [openLink, copyButton]}</div>
        </div>
      ) : null}
    </div>
  );
}
