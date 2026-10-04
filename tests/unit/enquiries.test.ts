import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/enquiries/route";

/**
 * /api/enquiries against a mock forwarder on a local port. Each test uses its own client IP so the
 * per-IP rate limit (5 a minute) never couples tests.
 */
let forwarder: http.Server;
let origin = "";
const hits: { path: string; key: string }[] = [];

beforeAll(async () => {
  forwarder = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    hits.push({ path: url.pathname, key: String(req.headers["idempotency-key"] ?? "") });
    req.resume();
    const delay = Number(url.searchParams.get("delay") || 0);
    setTimeout(() => {
      if (url.pathname === "/ok") return res.writeHead(200, { "content-type": "application/json" }).end('{"ok":true}');
      if (url.pathname === "/redirect") return res.writeHead(302, { location: "/landing" }).end();
      if (url.pathname === "/landing") return res.writeHead(200, { "content-type": "text/html" }).end("<p>Thanks</p>");
      if (url.pathname === "/error") return res.writeHead(500).end("boom");
      if (url.pathname === "/hang") return; // never answers
      res.writeHead(404).end();
    }, delay);
  });
  await new Promise<void>((resolve) => forwarder.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${(forwarder.address() as AddressInfo).port}`;
});

afterAll(() => {
  forwarder.closeAllConnections();
  forwarder.close();
});

beforeEach(() => {
  hits.length = 0;
});

let ipCounter = 0;
const nextIp = () => `203.0.113.${++ipCounter}`;
const fields = (extra: Record<string, unknown> = {}) => ({ name: "Ada", company: "Example Ltd", email: "ada@example.com", work: "Launch content approvals", context: { intent: "demo" }, lang: "en", hp: "", ...extra });
let keyCounter = 0;
const newKey = () => `test-key-${Date.now()}-${++keyCounter}`;

function request(body: unknown, { ip = nextIp(), headers = {} as Record<string, string>, raw }: { ip?: string; headers?: Record<string, string>; raw?: string } = {}) {
  return new Request("http://localhost:3100/api/enquiries", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3100", "x-real-ip": ip, ...headers },
    body: raw ?? JSON.stringify(body),
  });
}

async function send(target: string | undefined, req: Request) {
  if (target === undefined) delete process.env.ENQUIRY_FORWARD_URL;
  else process.env.ENQUIRY_FORWARD_URL = target;
  const res = await POST(req);
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

describe("/api/enquiries", () => {
  it("accepts when the forwarder answers 2xx", async () => {
    const r = await send(`${origin}/ok`, request(fields({ idempotencyKey: newKey() })));
    expect(r).toEqual({ status: 200, body: { status: "accepted" } });
    expect(hits.filter((h) => h.path === "/ok")).toHaveLength(1);
  });

  it("does not report acceptance when the forwarder redirects (302 → 200)", async () => {
    const r = await send(`${origin}/redirect`, request(fields({ idempotencyKey: newKey() })));
    expect(r.status).toBe(502);
    expect(r.body.status).toBe("failed");
  });

  it("reports failure when the forwarder answers 500", async () => {
    const r = await send(`${origin}/error`, request(fields({ idempotencyKey: newKey() })));
    expect(r).toEqual({ status: 502, body: { status: "failed" } });
  });

  it("times out after 8 s with 504", { timeout: 15_000 }, async () => {
    const r = await send(`${origin}/hang`, request(fields({ idempotencyKey: newKey() })));
    expect(r).toEqual({ status: 504, body: { status: "timeout" } });
  });

  it("answers 400, not 500, to a JSON body that is not an object", async () => {
    for (const raw of ["null", "[]", '"text"', "42"]) {
      const r = await send(`${origin}/ok`, request(null, { raw }));
      expect(r.status, raw).toBe(400);
      expect(r.body).toEqual({ status: "invalid", errors: { form: "invalid_json" } });
    }
  });

  it("forwards three concurrent requests with one key once", async () => {
    const key = newKey();
    const ip = nextIp();
    const results = await Promise.all([0, 1, 2].map(() => send(`${origin}/ok?delay=300`, request(fields({ idempotencyKey: key }), { ip }))));
    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(hits.filter((h) => h.key === key)).toHaveLength(1);
  });

  it("refuses a reused key with a different body (409)", async () => {
    const key = newKey();
    const ip = nextIp();
    expect((await send(`${origin}/ok`, request(fields({ idempotencyKey: key }), { ip }))).status).toBe(200);
    const r = await send(`${origin}/ok`, request(fields({ idempotencyKey: key, work: "Something else entirely" }), { ip }));
    expect(r).toEqual({ status: 409, body: { status: "key_reuse" } });
  });

  it("lets a retry with the same key through after a failed attempt", async () => {
    const key = newKey();
    const ip = nextIp();
    expect((await send(`${origin}/error`, request(fields({ idempotencyKey: key }), { ip }))).status).toBe(502);
    expect((await send(`${origin}/ok`, request(fields({ idempotencyKey: key }), { ip }))).status).toBe(200);
  });

  it("answers a filled honeypot like a success and never forwards it", async () => {
    const r = await send(`${origin}/ok`, request(fields({ idempotencyKey: newKey(), hp: "https://spam.example" })));
    expect(r).toEqual({ status: 200, body: { status: "accepted" } });
    expect(hits).toHaveLength(0);
  });

  it("rate-limits by the platform's client IP, not a spoofable X-Forwarded-For", async () => {
    const ip = nextIp();
    const statuses: number[] = [];
    for (let i = 0; i < 8; i++) {
      const r = await send(`${origin}/ok`, request({}, { ip, headers: { "x-forwarded-for": `198.51.100.${i}` } }));
      statuses.push(r.status);
    }
    expect(statuses.filter((s) => s === 429).length).toBeGreaterThanOrEqual(3);
  });

  it("requires a JSON content type and a same-site origin (403)", async () => {
    const noType = new Request("http://localhost:3100/api/enquiries", { method: "POST", headers: { origin: "http://localhost:3100", "x-real-ip": nextIp() }, body: JSON.stringify(fields({ idempotencyKey: newKey() })) });
    expect((await send(`${origin}/ok`, noType)).status).toBe(403);
    const crossSite = request(fields({ idempotencyKey: newKey() }), { headers: { origin: "https://evil.example", "sec-fetch-site": "cross-site" } });
    expect((await send(`${origin}/ok`, crossSite)).status).toBe(403);
    expect(hits).toHaveLength(0);
  });

  it("answers 503 without a forwarder and logs no field values", async () => {
    const lines: string[] = [];
    const original = console.info;
    console.info = (...args: unknown[]) => lines.push(args.map(String).join(" "));
    try {
      const r = await send(undefined, request(fields({ idempotencyKey: newKey() })));
      expect(r).toEqual({ status: 503, body: { status: "unavailable" } });
    } finally {
      console.info = original;
    }
    const log = lines.join("\n");
    expect(log).toMatch(/"requestId"/);
    expect(log).toMatch(/"durationMs"/);
    expect(log).not.toMatch(/ada@example\.com|Example Ltd|Launch content/);
  });
});
