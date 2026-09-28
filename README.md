# FimmickWebsite2

Source for the redesigned FIMMICK corporate and product website
(**FIMMICK — Agentic AI Platform & Business Solutions**).

This repository is the sole implementation destination for the redesign.
Implementation work happens on feature branches and is reviewed through pull
requests. Nothing in this repository publishes to www.fimmick.com by itself;
production release is a separate, explicitly authorised step.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · plain CSS (tokens in `app/styles/tokens.css`). No animation or UI libraries.

## Commands

```bash
npm ci
npm run dev            # http://localhost:3000 → /en
npm run build          # production build (~1,500 static pages)
npm start
npm run lint
npm run typecheck
npm test               # Vitest content/contract tests
npm run test:e2e       # Playwright (run `npm run build` first)
npm run video:render   # re-render the explainer film + captions
node scripts/build-guides.mjs          # regenerate guide PDFs (PREVIEWS_ONLY=1: preview images only)
node scripts/build-photography.mjs     # rebuild photo crops (RAW_DIR=<originals> to replace masters)
node scripts/capture-audit.mjs         # screenshots + visible-prose metrics (BASE_URL, OUT=before|after)
node scripts/capture-motion.mjs        # motion recordings + behaviour checks (BASE_URL; server required)
node scripts/migration/verify-routes.mjs  # verify legacy URLs (server on :3100)
node scripts/qa-sweep.mjs                 # overflow, console and link sweep (server on :3100)
npm run i18n:hans                         # regenerate the Traditional → Simplified table after changing Chinese copy
node scripts/i18n/check-hans.mjs          # scan built zh-Hans pages for leftover Traditional text (server on :3100)
```

## Structure

```text
app/[locale]/        EN (/en), Traditional (/zh-hant) and Simplified Chinese (/zh-hans) pages, one route tree
app/api/enquiries/   Enquiry endpoint (validation, idempotency, optional forwarding)
content/             Typed bilingual records: solutions, products, services, industries,
                     cases, ecosystem, transformation, resources, media, navigation
content/legacy/      Migrated Knowledge Hub articles and events
components/          Shell, cinematic homepage sections (home/), diagrams, interactive examples,
                     photographs and media player, forms
assets-src/          Photography scene briefs (prompts, alt text, focus points) and masters
lib/                 i18n (incl. Simplified conversion), routes, intent parsing, redirects, SEO, resources
video/               Editable film composition and renderer
docs/redesign/       Baseline, design decisions, route migration CSV, verification,
                     release runbook, asset manifest, screenshots
```

## Environment

See `docs/redesign/release-runbook.md`. Without `SITE_ENV=production` every build is `noindex` and analytics are off.
