# Award pass 2

Execution record for the 21-item fix plan in [`handoff/03-FimmickWebsite2-Fix-Plan-Implementation-Brief.md`](handoff/03-FimmickWebsite2-Fix-Plan-Implementation-Brief.md), against the audit in [`handoff/02-FimmickWebsite2-Award-Level-Audit.md`](handoff/02-FimmickWebsite2-Award-Level-Audit.md) (main@10c886e, 6.8/10). This folder supersedes the measurement parts of `docs/redesign/award/` and `docs/redesign/cinematic/`; those reports are kept as written.

- `handoff/` — the bundle as delivered (brief, audit, evidence index, 62 "before" screenshots from the audit).
- `before/` — Phase 0 baseline regenerated on this machine: `frames/` (fold + contact sheet per page and width, plus the mega-menu and drawer states), `heights.json`, `axe.json`, `verify.json`, `bytes.json`, `lighthouse.json`.
- `after/` — the same measurements after each phase.
- Scripts: `scripts/award-2/` (`capture-scroll.mjs`, `heights.mjs`, `verify.mjs`, `axe.mjs`, `bytes.mjs`, `lighthouse.mjs`). All expect a production build on port 3100 (`npm run build && npx next start -p 3100`); `OUT=before|after` picks the folder.

## Phase 0 baseline (4 Oct 2026, main@10c886e)

Local production build (`next build`, 1,549 static pages, Google Fonts reachable so no font substitution), `next start -p 3100`, Playwright Chromium 1243 on Windows 11. Lighthouse 13.5.0, simulated throttling, median of 3.

### Checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm test` (vitest) | 23 / 23 pass |
| `npx playwright test` (existing `site.spec.ts`) | 25 / 25 pass |
| Pre-existing failures | none |

### Lighthouse (median of 3)

| Page | Mobile | Mobile LCP | Mobile TBT | Desktop | Weight |
| --- | --- | --- | --- | --- | --- |
| /en | 89 (90/89/82) | 3.40 s | 157 ms | 99 | 343 KB |
| /en/platform | 90 (90/88/93) | 3.08 s | 190 ms | 100 | 289 KB |
| /en/services | 93 (93/93/87) | 3.05 s | 136 ms | 99 | 307 KB |
| /zh-hant | 86 (86/91/80) | 3.32 s | 259 ms | 99 | 349 KB |

CLS is 0 on every run. Mobile scores sit 4–8 points under the audit's (94/98/95/91): this laptop's simulated runs swing by up to 10 points (see the run spread), so later phases compare medians as an interleaved A/B against a `main` build, not against this table alone.

### Document height drift on the first scroll-through

`scripts/award-2/heights.mjs`: largest |scrollHeight − scrollHeight at load| while scrolling top to bottom.

| Page | 1440 load → end | 1440 drift | 390 load → end | 390 drift |
| --- | --- | --- | --- | --- |
| /en | 12,715 → 12,398 | 762 | 14,784 → 19,550 | **4,766** |
| /zh-hant | 12,601 → 12,020 | 718 | 14,331 → 18,434 | 4,103 |
| /en/platform | 6,913 → 7,515 | 896 | 10,064 → 15,402 | **5,338** |
| /en/services | 5,305 → 5,552 | 247 | 8,269 → 9,386 | 1,117 |
| /en/solutions/content-production | 11,705 → 8,891 | 2,814 | 11,458 → 14,075 | 2,617 |

Matches the audit (4,767 / 762 / 5,338 / 1,117; content-production −2,814 at 1440).

### Accessibility

axe-core 4.13 (`wcag2a wcag2aa wcag21aa wcag22aa best-practice`) on 12 pages (`/en`, `/zh-hant`, `/zh-hans`, platform, services, content-production, industries, the real-estate case, contact, the CRM article, team, `/en/nonexistent`) at 1440×900 and 390×844, after a full scroll and a 1.5 s settle: **0 violations** (24 / 24). Method: every rule at the top of the page, plus `target-size` alone at the bottom on targets wholly inside the viewport (axe sizes only on-screen targets; see `tests/e2e/axe.spec.ts`).

The audit's two 24 px hits (footer "Cookies", 48.6 × 21.4 px; the zh ghost "Resources" button) reproduce only at intermediate scroll positions, where the fixed header overlaps them; at rest axe passes them on spacing. Phase 1.4 guards both with a direct size assertion instead.

### Transfer

| Measure | Value |
| --- | --- |
| CSS per route (all routes identical) | 2 files, 98.3 KB raw, 20.8 KB gzip |
| RSC prefetch, full scroll of /en at 1440 | 96 requests, 1,068 KB raw, 257 KB gzip |
| RSC prefetch, full scroll of /en at 390 | 92 requests, 1,066 KB raw, 257 KB gzip |
| RSC prefetch, full scroll of /en/platform at 1440 | 115 requests, 1,167 KB raw, 281 KB gzip |

Gzip is recomputed at level 9 from the response bodies, so it is a little under the audit's on-the-wire 325–361 KB.

### Phase 1 findings reproduced (`before/verify.json`)

| Item | Measurement |
| --- | --- |
| 1.2 nav | `.primary-nav` `display: none` at 1024 and 1200; drawer at 820 and 1200 is full width (820 / 1,200 px) |
| 1.4 utility focus | after scroll 1500 → 1200, Shift+Tab from the logo focuses 简体中文 at top −35 px (header translated −37 px) |
| 1.5 drawer opening | after scroll down/up, drawer height 109 px at 60, 200 and 450 ms; 844 px only at 700 ms |
| 1.5 drawer resize | opened at 1000, resized to 1300: still open, `body` overflow hidden, in-drawer close button `display: none` |
| 1.5 route change | /en → /en/platform from a scrolled position: header at −37 px on the first frame of the new page, back at 0 after ~670 ms |
| 1.6 hero badge | at 390, topmost element at the badge centre is `aside.hero-card` |

## Phase 1 — craft breaks (fix plan 1–7)

Measured on the branch build (`after/`): `heights.json`, `verify.json`, `axe.json`, `bytes.json`, `items/` (one screenshot per item, same state as `before/items/`), `frames/` for the touched pages.

| Item | Before | After |
| --- | --- | --- |
| 1.1 locale 404 | unknown `/zh-hant/*` and `/en/*` paths → English global page, `lang="en"`, no shell | Chinese or English 404 inside the site shell, localised title, 404 status, `noindex` |
| 1.2 navigation | nav hidden at 1024–1279; drawer stretched to 820 / 1,200 px | nav on one row from 1024 px (short EN labels; CTA clear by 16 px EN, 30 px zh); 420 px sheet over a scrim from 700 px |
| 1.3 drift (1440 / 390) | /en 762 / 4,766 · /zh-hant 718 / 4,103 · /en/platform 896 / 5,338 · /en/services 247 / 1,117 | 6 / 8 · 17 / 5 · 0 / 0 · 0 / 0 |
| 1.4 focus, contrast, targets | utility focus at −35 px; no ring in forced colours; borders 1.58:1; legal links 21 px | 2 px; outline ring; `--subtle` borders; 44 px on coarse pointers |
| 1.5 drawer, route change | drawer 109 px tall for 450 ms; stays open past the breakpoint; header −37 px on the new page's first frame | full height from the first frame; closes at 1024 px; header in place |
| 1.6 badge, marquee, cue, video, poster | badge under the card; marquee rests mid-word; 3 cue drops; MP4 failure blocks the WebM; poster with cursor ring | badge above the photo; rests on a whole, centred phrase; 2 drops; WebM plays; title-card poster with a 640 w candidate |
| 1.7 icons, titles, banner, leadership | 28 px ICO only; 34 titles with `&amp;`; archive banner on 2026 guides; pending-approval note | SVG + 180 px + 16/32/48 ICO + manifest; 0 entities; banner before 2026-01-01 only; composed leadership block |

Checks: typecheck, lint, vitest 26/26, Playwright 93/93 (axe 28/28 on 14 pages × 2 widths: 0 violations), cascade test green. CSS 98.3 → 102.7 KB raw. Lighthouse mobile `/en`, interleaved A/B against a `main` build (`scripts/award-2/lighthouse-ab.mjs`): 12 pairs main 90 / branch 89 (−1); pooled with an earlier 7-pair run on the same build, 19 pairs main 90 / branch 87 (−3); Phase 0 baseline 89, so within 2 points of it. Branch LCP is equal or better (3.32 vs 3.35 s); simulated TBT is higher (246 vs 165 ms median), although Lighthouse's own breakdown shows less style/layout (875–960 vs 1,020–1,146 ms) and script evaluation (522–650 vs 712 ms) on the branch, and a 4×-throttled long-task probe shows equal blocking time. Watch item for Phase 8 (performance).

Phase 1 deviations from the brief (reasons in the PR): nav spacing at 1024–1279 (the brief's values overlapped the CTA by 87 px); per-locale measured band sizes (content box; `scripts/award-2/bands.mjs`, re-run after copy changes); a measured marquee rest instead of a fixed keyframe offset; new poster filenames (immutable `/media` cache); the article entity fix applied to the committed JSON because the original capture is not in the repo.

Open: Next 16 renders a request-time `notFound()` as a 404 recovery shell that the browser fills in, so a visitor without JavaScript sees an empty page with the 404 title (question for Willy in the Phase 1 PR).

## Phase log

| Phase | PR | What changed | Before → after |
| --- | --- | --- | --- |
| 0 | — (first commit of the Phase 1 branch) | Baseline, scripts, axe gate (`tests/e2e/axe.spec.ts`), `@axe-core/playwright` devDependency | see above |
| 1 | feat/award-pass-2-craft | Locale 404, nav from 1024 px + sheet drawer, per-band intrinsic sizes, focus/contrast/targets, drawer and route-change coordination, badge/marquee/cue/video/poster, icons/titles/banner/leadership | drift /en 390 4,766 → 8 px; axe 0 → 0 (2 pages added); 40 new regression tests |
