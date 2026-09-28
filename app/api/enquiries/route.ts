import { NextResponse } from "next/server";
import { contextKeys, intentLabels, parseContext } from "@/lib/intent";

/**
 * Enquiry endpoint.
 *
 * Contract: POST JSON { name, email, company, work, phone?, website?, tools?,
 * message?, context: {intent, ...ids}, idempotencyKey, lang, hp }.
 *
 * Delivery adapter: when ENQUIRY_FORWARD_URL is configured, the enquiry is
 * forwarded server-to-server using the field contract of the existing
 * fimmick.com /api/contact endpoint (name, company, email, phone, message,
 * intent, lang). Without it the endpoint answers 503 "unavailable" and the
 * form offers the honest email handoff instead. No acceptance is reported
 * unless the downstream endpoint confirms it.
 *
 * Limitations (see docs/redesign/verification.md): the idempotency cache and
 * rate limiter are per-instance memory; durable storage requires an approved
 * persistence backend.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Result = { status: number; body: Record<string, unknown> };

const idempotency = new Map<string, { at: number; result: Result }>();
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const limits = { name: 120, email: 200, company: 160, work: 500, phone: 40, website: 200, tools: 300, message: 3000 } as const;

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

function json(result: Result) {
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return json({ status: 429, body: { status: "rate_limited" } });
  hits.set(ip, [...recent, now]);

  let payload: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 16_000) return json({ status: 413, body: { status: "too_large" } });
    payload = JSON.parse(text);
  } catch {
    return json({ status: 400, body: { status: "invalid", errors: { form: "invalid_json" } } });
  }

  const key = str(payload.idempotencyKey, 64);
  if (!/^[A-Za-z0-9-]{8,64}$/.test(key)) return json({ status: 400, body: { status: "invalid", errors: { form: "missing_key" } } });
  const cached = idempotency.get(key);
  if (cached && now - cached.at < IDEMPOTENCY_TTL_MS) return json(cached.result);

  if (str(payload.hp, 200)) return json({ status: 400, body: { status: "rejected" } });

  const fields = {
    name: str(payload.name, limits.name),
    email: str(payload.email, limits.email),
    company: str(payload.company, limits.company),
    work: str(payload.work, limits.work),
    phone: str(payload.phone, limits.phone),
    website: str(payload.website, limits.website),
    tools: str(payload.tools, limits.tools),
    message: str(payload.message, limits.message),
  };
  const errors: Record<string, string> = {};
  if (!fields.name) errors.name = "required";
  if (!fields.email) errors.email = "required";
  else if (!EMAIL.test(fields.email)) errors.email = "invalid";
  if (!fields.company) errors.company = "required";
  if (!fields.work) errors.work = "required";
  for (const [k, v] of Object.entries(fields)) if (v.length > limits[k as keyof typeof limits]) errors[k] = "too_long";
  if (fields.phone && !/^[+()\d\s-]{6,40}$/.test(fields.phone)) errors.phone = "invalid";
  if (Object.keys(errors).length) return json({ status: 422, body: { status: "invalid", errors } });

  const rawContext = (payload.context && typeof payload.context === "object" ? payload.context : {}) as Record<string, string>;
  const context = parseContext(rawContext);
  const lang = payload.lang === "zh-hant" || payload.lang === "zh-hans" ? payload.lang : "en";

  const target = process.env.ENQUIRY_FORWARD_URL;
  if (!target) return json({ status: 503, body: { status: "unavailable" } });

  const contextLines = contextKeys.filter((k) => context[k]).map((k) => `${k}: ${context[k]}`);
  const message = [
    `Work to improve: ${fields.work}`,
    fields.website && `Website: ${fields.website}`,
    fields.tools && `Current tools: ${fields.tools}`,
    fields.message && `Details: ${fields.message}`,
    contextLines.length ? `Context: ${contextLines.join("; ")}` : "",
    `Source: website enquiry (${lang})`,
  ]
    .filter(Boolean)
    .join("\n");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  let result: Result;
  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": key },
      body: JSON.stringify({ name: fields.name, company: fields.company, email: fields.email, phone: fields.phone || undefined, message, intent: intentLabels[context.intent].en, lang }),
      signal: controller.signal,
    });
    result = response.ok ? { status: 200, body: { status: "accepted" } } : { status: 502, body: { status: "failed" } };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    // Uncertain outcome: not cached, so a retry with the same key is allowed.
    return json({ status: aborted ? 504 : 502, body: { status: aborted ? "timeout" : "failed" } });
  } finally {
    clearTimeout(timer);
  }
  if (result.status === 200) idempotency.set(key, { at: now, result });
  return json(result);
}

export function GET() {
  return NextResponse.json({ status: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
