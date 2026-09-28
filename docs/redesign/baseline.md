# Baseline — FimmickWebsite2 redesign

Recorded 28 September 2026.

## Repositories

| Repository | Role | State at start |
|---|---|---|
| `YNWAforever/FimmickWebsite2` | Sole implementation destination | Public, empty (no branches). Initialised with a minimal baseline commit on `main` (`f4a8901`: README + .gitignore). All work is on `feat/fimmick-agentic-platform-redesign`. |
| `YNWAforever/fimmick-newsitegpt` | Read-only reference | `main` @ `bf8134febb7913bbf83e73af9c3b8b5b1159523c` (84 files). Cloned to a scratch directory only; never written to. |
| `YNWAforever/remix-7-of-fimmick-studio` | Read-only reference | `main` @ `aa25c59e569cb8b3a34f4bf35857189a83ac3904` (84 files; differs from the above only in `.openai/hosting.json`, `README.md`, `app/layout.tsx`, `package.json`). Never written to. |

The push remote of the working checkout is `https://github.com/YNWAforever/FimmickWebsite2.git`. No `.openai/hosting.json`, Sites project identifier, secrets, dependencies or build output were copied.

## Runtime decision

The reference stack builds with Vinext + Vite for a ChatGPT Sites/Cloudflare worker, driven by Linux-only bash scripts and bound to a Sites project ID. FimmickWebsite2 uses **standard Next.js 16.3 (App Router) + React 19.3 + TypeScript**, which the reference application code already targets. Reasons: no inherited hosting identity, cross-platform builds, and the current production site is served by **Vercel** (observed `Server: Vercel`, `X-Vercel-*` headers), where Next.js is the native runtime. No framework rewrite of business logic was needed; content and components were rebuilt for the new positioning.

Commands: `npm run dev`, `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm test` (Vitest), `npm run test:e2e` (Playwright; build first), `npm run video:render`.

Node 24 (`>=22.13` supported). The Windows development machine required approving npm install scripts for `esbuild`, `unrs-resolver` and `ffmpeg-static` (npm `allowScripts`).

## Production inventory (observed, not assumed)

- **Host:** `www.fimmick.com` serves a prerendered Vite/React SPA from Vercel. Root `/` → `/en/`. Locales: `/en`, `/zh-hant`, `/zh-hans`; `/zh-hk/` → `/zh-hant/` (308).
- **Sitemaps:** index + `sitemap-en.xml` (435), `sitemap-zh-hant.xml` (410), `sitemap-zh-hans.xml` (410). Full list: `docs/redesign/production-urls.txt`.
- **Content:** 357 Knowledge Hub articles (344 EN, 319 zh-hant, 319 zh-hans; 36 zh-hant entries are actually English text), 22 category URLs, 24 events (all past; latest 3 Sep 2025), 14 service pages, 8 workforce pages, 6 platform pages, 5 ecosystem pages, about/team, case studies hub (20 anonymised cases, no detail URLs), workshop, growth, legal.
- **Contact:** POST `/api/contact` JSON `{name, company, email, phone, message, intent, lang, utm, referrer}` (Resend email per CSP), Calendly link `calendly.com/fimmick/30min`. Offices and emails captured in `content/company.ts`.
- **Analytics:** Google Tag Manager `GTM-55RBW4F` with Consent Mode defaults (analytics granted, advertising denied).
- **Login:** `https://aip.fimmick.com/`.
- **Logo:** the only logo asset found is a 625×300 raster embedded in the SPA bundle (no vector). Trimmed copies: `public/brand/fimmick-logo.{png,webp}`.
- **Ecosystem external links** (from the production pages): kinnso.ai, adfocate.com, 50addoil.com/zh-hk, facebook.com/EldageHK. None found for KOCmax.

Capture method: sitemap download, prerendered HTML parse (`scripts/migration/convert-legacy-articles.mjs`), `/data/events-detail.json`, and rendered-page text in a browser for SPA-only pages. Raw captures are not committed.

## Deployment mapping

Unresolved. Production runs on Vercel, but the Vercel project, its Git connection and production branch were **not** inspected (no access was used or granted in this session). See `release-runbook.md` → blockers.
