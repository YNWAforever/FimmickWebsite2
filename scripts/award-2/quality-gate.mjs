#!/usr/bin/env node
/**
 * The award-pass-2 quality gate (Phase 9): runs the checks every PR must pass, takes a Lighthouse median,
 * compares it with the committed baseline (docs/redesign/award-2/quality-baseline.json) and writes the
 * "Current quality gate" table in docs/redesign/award-2/README.md. Exit code 1 when any check fails or
 * mobile /en drops more than `tolerance` points below its baseline.
 *
 *   node scripts/award-2/quality-gate.mjs                    # everything, on an existing build
 *   node scripts/award-2/quality-gate.mjs --build            # next build first
 *   node scripts/award-2/quality-gate.mjs --only=lighthouse  # just the Lighthouse gate
 *   node scripts/award-2/quality-gate.mjs --env=ci --no-write
 *
 * Axe runs inside Playwright (tests/e2e/axe.spec.ts), so an axe violation fails the Playwright step.
 * Lighthouse uses RUNS (default 5) runs and, when the median is under the floor, 5 more, judging the
 * median of all of them: single runs swing by several points.
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { root } from "./lib.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const only = args.only ? String(args.only).split(",") : null;
const env = String(args.env || (process.env.CI ? "ci" : "local"));
const port = Number(process.env.E2E_PORT || 3100);
const base = `http://localhost:${port}`;
const runs = Number(process.env.RUNS || 5);
const wanted = (step) => !only || only.includes(step);

const results = [];
function run(step, command) {
  if (!wanted(step)) return;
  const started = Date.now();
  console.log(`\n▶ ${step}: ${command}`);
  const r = spawnSync(command, { cwd: root, shell: true, stdio: "inherit", env: process.env });
  results.push({ step, ok: r.status === 0, seconds: Math.round((Date.now() - started) / 1000) });
}

if (args.build) run("build", "npx next build");
run("typecheck", "npm run typecheck");
run("lint", "npm run lint");
run("unit + hans table", "npm test");
run("playwright", "npx playwright test");

if (wanted("lighthouse")) await lighthouseGate();

writeReadme();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.map((r) => `${r.ok ? "✓" : "✗"} ${r.step} (${r.seconds}s)${r.detail ? ` — ${r.detail}` : ""}`).join("\n")}`);
process.exit(failed.length ? 1 : 0);

async function lighthouseGate() {
  const baselines = JSON.parse(fs.readFileSync(path.join(root, "docs/redesign/award-2/quality-baseline.json"), "utf8"));
  const baseline = baselines.lighthouse[env]?.["/en"]?.mobile;
  const floor = baseline === undefined ? undefined : baseline - baselines.tolerance;
  const started = Date.now();
  const server = (await up()) ? null : await startServer();
  try {
    let scores = measure(runs);
    let median = middle(scores);
    if (floor !== undefined && median < floor) {
      console.log(`  median ${median} is under the floor ${floor}: measuring ${runs} more`);
      scores = scores.concat(measure(runs));
      median = middle(scores);
    }
    const ok = scores.length > 0 && (floor === undefined || median >= floor);
    const detail =
      floor === undefined
        ? `median ${median} of ${scores.length} (no ${env} baseline yet: record ${median} in quality-baseline.json)`
        : `median ${median} of ${scores.length}, baseline ${baseline}, floor ${floor}`;
    results.push({ step: `lighthouse mobile /en (${env})`, ok, seconds: Math.round((Date.now() - started) / 1000), detail });
  } finally {
    server?.kill();
  }
}

function measure(n) {
  const scores = [];
  for (let i = 0; i < n; i++) {
    const file = path.join(root, ".next", `quality-gate-lh-${i}.json`);
    fs.rmSync(file, { force: true });
    // Playwright's Chromium, as in scripts/award-2/lighthouse.mjs; the report file decides, not the exit
    // code (chrome-launcher can exit non-zero on Windows after writing it).
    spawnSync("npx", ["-y", "lighthouse@13.5.0", `${base}/en`, "--only-categories=performance", "--output=json", `--output-path=${file}`, "--quiet", "--chrome-flags=\"--headless=new --no-sandbox\""], {
      cwd: root,
      shell: true,
      stdio: "ignore",
      env: { ...process.env, CHROME_PATH: chromiumPath() },
    });
    if (!fs.existsSync(file)) continue;
    const score = Math.round(JSON.parse(fs.readFileSync(file, "utf8")).categories.performance.score * 100);
    console.log(`  run ${i + 1}: ${score}`);
    scores.push(score);
    fs.rmSync(file, { force: true });
  }
  return scores;
}

function middle(xs) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function chromiumPath() {
  const r = spawnSync("node", ["-e", "console.log(require('@playwright/test').chromium.executablePath())"], { cwd: root, encoding: "utf8" });
  return r.stdout.trim();
}

async function up() {
  try {
    return (await fetch(`${base}/en`)).ok;
  } catch {
    return false;
  }
}

async function startServer() {
  // Next's own binary in this process's node, not npx in a shell: killing a shell or npx wrapper
  // leaves the server running and holding the port.
  const next = path.join(root, "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [next, "start", "-p", String(port)], { cwd: root, stdio: "ignore", env: { ...process.env, ENQUIRY_FORWARD_URL: "" } });
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 1000));
  return child;
}

function writeReadme() {
  if (args["no-write"]) return;
  const file = path.join(root, "docs/redesign/award-2/README.md");
  const readme = fs.readFileSync(file, "utf8");
  const start = "<!-- quality-gate:start -->";
  const end = "<!-- quality-gate:end -->";
  const from = readme.indexOf(start);
  const to = readme.indexOf(end);
  if (from < 0 || to < from) return;
  const head = spawnSync("git", ["rev-parse", "--short", "HEAD"], { cwd: root, encoding: "utf8" }).stdout.trim();
  const dirty = spawnSync("git", ["status", "--porcelain", "--untracked-files=no"], { cwd: root, encoding: "utf8" }).stdout.trim();
  const commit = dirty ? `${head} with uncommitted changes` : head;
  const rows = results.map((r) => `| ${r.step} | ${r.ok ? "pass" : "**fail**"}${r.detail ? ` — ${r.detail}` : ""} | ${r.seconds} s |`);
  const table = [
    start,
    `Last run ${new Date().toISOString().slice(0, 10)} on ${commit} (${env}): \`node scripts/award-2/quality-gate.mjs${only ? ` --only=${only.join(",")}` : ""}\`.`,
    "",
    "| Check | Result | Time |",
    "| --- | --- | --- |",
    ...rows,
    end,
  ].join("\n");
  fs.writeFileSync(file, readme.slice(0, from) + table + readme.slice(to + end.length));
}
