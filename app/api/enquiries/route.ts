import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { contextKeys, intentLabels, parseContext } from "@/lib/intent";
import { ENQUIRY_FIELDS, ENQUIRY_LIMITS, validateEnquiry, type EnquiryFields } from "@/lib/enquiry-schema";
import { isProduction } from "@/lib/env";

/**
 * Enquiry endpoint.
 *
 * Contract: POST application/json, same-site only, { name, email, company, work, phone?, website?,
 * tools?, message?, context: {intent, ...ids}, idempotencyKey, lang, hp }. Field limits and checks
 * come from lib/enquiry-schema.ts, which the form shares.
 *
 * Answers: 200 accepted · 400 invalid (bad JSON or key) · 403 not JSON or not same-site · 409 key
 * reused with a different body · 413 too large · 422 invalid fields · 429 rate limited · 502 failed
 * (forwarder answered 3xx/4xx/5xx or was unreachable) · 503 unavailable (no forwarder) · 504 timeout.
 *
 * Delivery adapter: when ENQUIRY_FORWARD_URL is configured (https only in production), the enquiry
 * is forwarded server-to-server using the field contract of the existing fimmick.com /api/contact
 * endpoint (name, company, email, phone, message, intent, lang). Acceptance is reported only when
 * the forwarder itself answers 2xx: redirects are not followed, so a 302 to a "thank you" page can
 * never read as delivered. Without a forwarder the endpoint answers 503 and the form offers the
 * email handoff.
 *
 * Idempotency: a key is bound to a fingerprint of the fields and intent and stored with its
 * in-flight promise before the forwarder is awaited, so concurrent retries share one delivery; a
 * failed or uncertain outcome is forgotten so the same key can retry. Logs carry one line per
 * request ({requestId, status, durationMs, keyPrefix}) and never a field value.
 *
 * Limitations (see docs/redesign/verification.md): the idempotency cache and rate limiter are
 * per-instance memory (swept on write, capped at 5,000 entries each); durable storage requires an
 * approved persistence backend.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Result = { status: number; body: Record<string, unknown> };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 5000;
const FORWARD_TIMEOUT_MS = 8000;
const MAX_BODY = 16_000;

const hits = new Map<string, number[]>();
const idempotency = new Map<string, { at: number; fp: string; promise: Promise<Result> }>();

const accepted: Result = { status: 200, body: { status: "accepted" } };
const failed: Result = { status: 502, body: { status: "failed" } };

/** Insert as the newest entry; the oldest (first-inserted) entries go once the cap is reached. */
function remember<V>(map: Map<string, V>, key: string, value: V) {
  map.delete(key);
  map.set(key, value);
  while (map.size > MAX_ENTRIES) map.delete(map.keys().next().value as string);
}

function sweep(now: number) {
  for (const [ip, times] of hits) if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(ip);
  for (const [key, entry] of idempotency) if (now - entry.at >= IDEMPOTENCY_TTL_MS) idempotency.delete(key);
}

/** The platform’s view of the client: Vercel sets x-vercel-forwarded-for; X-Forwarded-For is client-controlled. */
function clientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return vercel || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Browsers send Sec-Fetch-Site; otherwise the Origin must match the host the request came to. */
function isSameSite(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "same-site";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function forwardTarget(): string | null {
  const target = process.env.ENQUIRY_FORWARD_URL;
  if (!target) return null;
  try {
    if (isProduction() && new URL(target).protocol !== "https:") {
      console.error(JSON.stringify({ event: "enquiry_config", error: "ENQUIRY_FORWARD_URL must be https in production" }));
      return null;
    }
  } catch {
    console.error(JSON.stringify({ event: "enquiry_config", error: "ENQUIRY_FORWARD_URL is not a URL" }));
    return null;
  }
  return target;
}

async function forward(target: string, key: string, fields: EnquiryFields, context: ReturnType<typeof parseContext>, lang: string): Promise<Result> {
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
  try {
    const response = await fetch(target, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      headers: { "content-type": "application/json", "idempotency-key": key },
      body: JSON.stringify({ name: fields.name, company: fields.company, email: fields.email, phone: fields.phone || undefined, message, intent: intentLabels[context.intent].en, lang }),
    });
    await response.body?.cancel();
    return response.status >= 200 && response.status < 300 ? accepted : failed;
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return timedOut ? { status: 504, body: { status: "timeout" } } : failed;
  }
}

export async function POST(request: Request) {
  const started = Date.now();
  const requestId = request.headers.get("x-vercel-id") || randomUUID();
  const log: { keyPrefix?: string } = {};
  const respond = (result: Result) => {
    console.info(JSON.stringify({ event: "enquiry", requestId, status: result.status, durationMs: Date.now() - started, keyPrefix: log.keyPrefix }));
    return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
  };

  const contentType = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (contentType !== "application/json" || !isSameSite(request)) return respond({ status: 403, body: { status: "forbidden" } });

  const now = Date.now();
  sweep(now);
  const ip = clientIp(request);
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return respond({ status: 429, body: { status: "rate_limited" } });
  remember(hits, ip, [...recent, now]);

  let payload: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return respond({ status: 413, body: { status: "too_large" } });
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new TypeError("not an object");
    payload = parsed as Record<string, unknown>;
  } catch {
    return respond({ status: 400, body: { status: "invalid", errors: { form: "invalid_json" } } });
  }

  // Honeypot: answered like a success (nothing tells a bot it was caught) and never forwarded.
  if (typeof payload.hp === "string" && payload.hp.trim()) return respond(accepted);

  const key = typeof payload.idempotencyKey === "string" ? payload.idempotencyKey.trim() : "";
  if (!/^[A-Za-z0-9-]{8,64}$/.test(key)) return respond({ status: 400, body: { status: "invalid", errors: { form: "missing_key" } } });
  log.keyPrefix = key.slice(0, 8);

  const fields = Object.fromEntries(
    ENQUIRY_FIELDS.map((name) => {
      const value = payload[name];
      return [name, typeof value === "string" ? value.trim().slice(0, ENQUIRY_LIMITS[name] + 1) : ""];
    }),
  ) as EnquiryFields;
  const errors = validateEnquiry(fields);
  if (Object.keys(errors).length) return respond({ status: 422, body: { status: "invalid", errors } });

  const rawContext = (payload.context && typeof payload.context === "object" && !Array.isArray(payload.context) ? payload.context : {}) as Record<string, string>;
  const context = parseContext(rawContext);
  const lang = payload.lang === "zh-hant" || payload.lang === "zh-hans" ? payload.lang : "en";

  // Bind the key to what it was first used for; between this lookup and the store below there is
  // no await, so concurrent requests with one key always find the first one’s promise.
  const fp = createHash("sha256").update(JSON.stringify(fields) + context.intent).digest("hex");
  const existing = idempotency.get(key);
  if (existing) {
    if (existing.fp !== fp) return respond({ status: 409, body: { status: "key_reuse" } });
    return respond(await existing.promise);
  }

  const target = forwardTarget();
  if (!target) return respond({ status: 503, body: { status: "unavailable" } });

  const promise = forward(target, key, fields, context, lang);
  remember(idempotency, key, { at: now, fp, promise });
  const result = await promise;
  // Only a delivered enquiry is remembered; a failed or uncertain one can be retried with the same key.
  if (result.status !== 200 && idempotency.get(key)?.promise === promise) idempotency.delete(key);
  return respond(result);
}

export function GET() {
  return NextResponse.json({ status: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
