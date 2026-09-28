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
npm run build          # production build (~1,200 static pages)
npm start
npm run lint
npm run typecheck
npm test               # Vitest content/contract tests
npm run test:e2e       # Playwright (run `npm run build` first)
npm run video:render   # re-render the explainer film + captions
node scripts/build-guides.mjs          # regenerate guide PDFs
node scripts/migration/verify-routes.mjs  # verify legacy URLs (server on :3100)
```

## Structure

```text
app/[locale]/        EN (/en) and Traditional Chinese (/zh-hant) pages, one route tree
app/zh-hans/         Preserved Simplified Chinese Knowledge Hub archive
app/api/enquiries/   Enquiry endpoint (validation, idempotency, optional forwarding)
content/             Typed bilingual records: solutions, products, services, industries,
                     cases, ecosystem, transformation, resources, media, navigation
content/legacy/      Migrated Knowledge Hub articles and events
components/          Shell, diagrams, interactive examples, media player, forms
lib/                 i18n, routes, intent parsing, redirects, SEO, resources
video/               Editable film composition and renderer
docs/redesign/       Baseline, design decisions, route migration CSV, verification,
                     release runbook, asset manifest, screenshots
```

## Environment

See `docs/redesign/release-runbook.md`. Without `SITE_ENV=production` every build is `noindex` and analytics are off.
