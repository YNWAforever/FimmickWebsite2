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

## Phase 2 — enquiry correctness and the release gate (fix plan 8–9)

Evidence: `before/phase-2/` (the red test runs on main, and the production-build check failing on a review build) and `after/phase-2/` (green runs, form screenshots, the check passing on a production build).

| Item | Before | After |
| --- | --- | --- |
| 2.1 Forwarder redirect | a 302 → 200 from the forwarder reported "accepted" (nothing delivered) | redirects are not followed; only a direct 2xx is accepted (502 otherwise, 504 on timeout) |
| 2.1 Bad JSON | `null` body → 500 | 400 `invalid_json` for any non-object |
| 2.1 Idempotency | three concurrent posts with one key reached the forwarder 3 times; key reuse with a new body returned the old result | key bound to a body fingerprint and stored with its in-flight promise: one delivery; reuse with a new body → 409 |
| 2.1 Abuse guards | rate limit keyed on the spoofable first `X-Forwarded-For`; maps never evicted; honeypot answered 400; no content-type/origin check | platform IP (`x-vercel-forwarded-for`, then `x-real-ip`); swept on write, capped at 5,000; honeypot answers like a success and is dropped; JSON + same-site required (403) |
| 2.1 Logs | none | one line per request `{requestId, status, durationMs, keyPrefix}`, no field values |
| 2.2 Form without JavaScript | native GET put name, email and company in the URL | `method="post"`, controls disabled until hydrated, `<noscript>` email link |
| 2.2 Validation | an error in the collapsed "more detail" was invisible; a too-long work description was reported on "Anything else" | the disclosure opens and the first invalid field (DOM order) takes focus; errors land on their own field; hints and errors sit outside the label |
| 2.2 Status | the live region mounted with its message; success unmounted the focused button | one persistent `role="status"` region; success focuses its heading |
| 2.2 Keys and handoff | an edit after a timeout kept the old key; offline shown as a timeout; "Copied" never reset; 12 px chip remove button | key derived from the payload; offline → "failed"; Copied resets after 2 s and a refused clipboard selects the text; 44 px remove target; long emails offer Copy first |
| 2.3 Release gate | runbook said "deploy to a preview, then promote" (ships noindex); no CI | runbook forbids promoting a preview; `.github/workflows/ci.yml` (typecheck, lint, vitest, hans check, production build + `assert-production-build.mjs`, review build + Playwright); the check fails a review build with 1,534 problems and passes a production build (1,530 pages) |

Tests: `tests/unit/enquiries.test.ts` (12; 9 red on main), `tests/e2e/enquiry.spec.ts` (9; all red on main), the production-build check; Playwright 104/104, vitest 38/38. Also found by the new CI step: `lib/hans-table.ts` had been stale since the scroll cue's 「向下捲動」 (zh-Hans showed a Traditional 捲); regenerated.

## Phase 3 — headlines, hero and content (fix plan 10–12)

Evidence: `before/phase-3/` (red runs on `main`: `copy-spec-red.log` 6/6 failing, `unit-award-2-red.log` 6/9 failing, `axe-heading-order-red.log`, `zh-hero-body-break-red.log`, `hero-repeat-red.log`; screenshots of `main` from `scripts/award-2/capture-copy.mjs`) and `after/phase-3/` (the same screenshots on the branch, `axe.json`, `heights.json`, the Lighthouse A/B, `playwright-full.log`, `zh-term-replacements.md`).

| Item | Before | After |
| --- | --- | --- |
| 3.1 inner-page headlines | `PageHero` and `SectionHead` titles were plain sans; detail pages used the record name as the h1 | `accent` routes the title through `Headline`; 34 records carry `headlineAccent` (solutions → `job`, products → `descriptor`, services → `eyebrow`, industries → `output`) with the name in the eyebrow; `/platform`, `/case-studies`, `/resources` and `/fimmick-ecosystem` use the audit's headlines |
| 3.1 Chinese accent | magenta sans phrase | emphasis dots (着重號) under the phrase, `--magenta-ink`, `#ff7dbd` on dark chapters, a colour fallback where `text-emphasis` is unsupported |
| 3.1 Chinese line breaks | the zh hero body split 批准 across lines at 390 px | `word-break: keep-all` on zh h1, h2, `.lead` and the hero body; `<wbr>` after 與/及 (`zhBreaks()` in `Headline`); 決定 and 批准 each on one line |
| 3.2 hero | "Put AI into real business work." | "AI prepares the work. *Your people decide.*" / 「AI 準備工作，＊由你的人決定＊。」; the new hero body is the meta description; dead keys removed (`hero.body`, `hero.support`, `sections.*` except `faq`, `company.brandLine`, `company.identity`) |
| 3.2 microcopy | 31 zh strings with U+30FB; 「預約產品示範」; "Request a Demo", "Explore Solutions"; 75 straight apostrophes | U+00B7; 「申請產品示範」; sentence case on buttons and nav; typographic apostrophes (`scripts/award-2/curly.mjs`, with a `--check` mode) |
| 3.2 zh terms | 審批, noun 記錄, 電子商貿, 成功案例 | 批核, 紀錄, 電商, 客戶案例; every replacement in `after/phase-3/zh-term-replacements.md` (the verb 記錄 is kept) |
| 3.3 disclaimers | "Illustrative" 6 times on `/en` outside photo pills (11 with them): a chapter notice, a heatmap caption, "Illustrative photographs." | one page-level notice under the hero card, a `Sample` tag on artefacts, "Sample scores"; 2 outside photo pills (7 with the 5 pills that Phase 6's badge policy reduces) |
| 3.3 case evidence | 10 of 21 outcomes used deny-listed words ("a clearer performance view"); legacy basis, period and limitations on the 20 client cases | outcomes restate each record's after-state (who now does what, from which record); one provenance line, no period row when unknown; the page reads job → what changed (the outcome over the before/after lanes) → who decided → now offered as (with links to the products the case reuses) |
| Detail-page heroes | moving the job, output and descriptor into the h1 left the solution lead repeating the "The problem" heading and the industry aside repeating the h1 (caught by a new test before commit) | solution heroes have no lead (the problem heads the next section); the industry aside keeps only the starting scope |
| Accessibility | `/en/case-studies` and `/en/resources` jumped from the h1 to h3 card titles (heading-order; neither page was in the Phase 0 list) | card titles are h2 on those listing pages; the axe spec now covers them |

Checks: typecheck, lint, vitest 44/44, Playwright 118/118 (axe on 19 pages × 2 widths), hans table current (427 characters), `curly.mjs --check` 0, `content/legal.ts` untouched. `scripts/award-2/axe.mjs` over 20 touched pages × 2 widths: 0 violations. Drift (1440 / 390) with re-measured bands: /en 6 / 7 · /zh-hant 12 / 20. Lighthouse mobile `/en`, 5 interleaved pairs: `main` 87 / branch 89 (Phase 0 baseline 89).

Phase 3 deviations from the brief (reasons in the PR): the "Illustrative at most 3" test counts words outside photo pills until Phase 6 lands the badge policy; the case-outcome deny-list is the brief's four words; listing-page card titles moved to h2 for the axe gate.

## Phase 4 — shell and share surfaces (fix plan 13, 16)

Evidence: `before/phase-4/` (`shell-spec-red.log`: 15/15 failing on `main`; screenshots of `main` from `scripts/award-2/capture-shell.mjs`, which also records the share-image routes as 404) and `after/phase-4/` (the same screenshots on the branch, the five share images, `axe.json`, the Lighthouse A/B in two runs, `playwright-full.log`).

| Item | Before | After |
| --- | --- | --- |
| 4.1 footer | eight groups in an auto-fit grid: 5 + 3 at 1440, two-column at 390, first-row lists offset by up to 17 px (two-line headings); underlined text social links; every footer link prefetched once visible (96 RSC requests for footer-only routes after jumping to the footer of `/en/privacy`) | four columns of two stacked groups (two on tablets, one at 390), headings reserve two lines so the lists start level (0 px); a 44 px icon row with `aria-label`s; `prefetch={false}` on all eight footer `Link`s (0 prefetches); the hrefs are unchanged (vitest snapshot taken on `main`) |
| 4.2 mega menu | click only; no scrim; the featured card alone under column 1 (762 px short of the panel's right edge); stayed open after Tab left the nav or a link to the current page; outside click on `mousedown` | hover intent on fine pointers (opens after 150 ms, closes 200 ms after the pointer leaves; clicking a hover-opened trigger pins it); fixed scrim `rgb(7 11 31 / 24%)` and a bottom shadow; the featured card is the last, wider column with a miniature of the signature frame (40 px, the container padding); closes on focusout and on any panel link; `pointerdown` outside |
| 4.3 contact | browser disclosure triangle; the prepared email in a monospace block; offices without an address showed an empty line (26 px gap) | the FAQ's + / × indicator; the email is a card in the body face beside the existing Copy button; address and contact lines are blocks (no empty line) |
| 4.4 share images | one static `og.png` for every URL; no `og:locale:alternate` | `ImageResponse` cards (1200 × 630) for the homepage, articles, cases, events, solutions and services: eyebrow, title with the serif accent (Chinese: accent colour, Noto Sans HK / SC), wordmark, localised tagline; each page's `og:image` points at its own card (Next fills `twitter:image` from it); `og:locale:alternate` lists the other locales; other pages keep `og.png` |
| 4.5 hero at 1920 | headline on 4 lines in a 528 px copy column | 2 lines (the English accent sentence on its own line) in a 704 px column; grid `container edge / 1.1fr / 1fr` from 1680 px |

Checks: typecheck, lint, vitest 47/47, Playwright 133/133 (the new `tests/e2e/shell.spec.ts`: 15, all red on `main`), hans table current, `curly.mjs --check` 0, `content/legal.ts` untouched. `scripts/award-2/axe.mjs` on 11 touched pages × 2 widths: 0 violations; axe on the header with a mega panel open (en, zh-hant): 0. Bands re-measured for the new footer (390 px footer band 1,610 → 2,480 px). Lighthouse mobile `/en`, 15 interleaved pairs over two runs (5 then 10): `main` 87 / branch 87 (the first 5 alone read 88 / 83, within this machine's ±10 noise); Phase 0 baseline 89.

Phase 4 deviations from the brief (reasons in the PR): share-image fonts are TTF from the Google Fonts CSS API, not the local woff2 (satori cannot read woff2), with `og.png` served if a font fetch fails; the images render on request with a CDN cache header rather than at build (1,263 detail pages); `pageMetadata` gains `generatedImage` because Next 16 applies a file image only when the page sets no `openGraph.images`; the ≥1680 hero rule lives in `award.css` (which owns the hero grid) and sets the headline at 4.5rem with the accent on its own line so the new, longer headline fits two lines.

## Phase 5 — inner-page template (fix plan 14)

Evidence: `before/phase-5/` (`hubs-spec-red.log`: 6/6 failing on `main`; `unit-summary-red.log`; full-page shots of the four hubs at 1440 and 390 from `scripts/award-2/capture-hubs.mjs`) and `after/phase-5/` (the same shots on the branch, viewport shots of the services rows, `summary-cuts.md`, `axe.json`, the Lighthouse A/B for `/en/services` and `/en`, `playwright-full.log`).

| Item | Before | After |
| --- | --- | --- |
| 5.1 layout | `/services`, `/products`, `/functions` and three grids on `/platform` were 2-, 3- and 4-column `.hub-card` grids with "Deliverables:" lists and "Learn more →" | `EditorialList` (`components/blocks.tsx`): one row per record, serif-italic index, the record's headline with its accent (24 px), one line, one supporting artefact on the right (two deliverables, the product's output, two workflows or the products of a job); a hairline between rows; the headline is the only link, stretched over the row, with the focus ring drawn on the row; hover moves only the arrow; one column on phones |
| 5.2 filter | the objective pills were links that re-rendered the page on the server (`/services` dynamic) | `ObjectiveFilter` client island: groups render on the server and the pills hide the others in place, keeping `?objective=` in the address (shared links open filtered); `/services` is now prerendered |
| 5.3 copy | 14 summaries over 16 words (all 6 products at 22–26, all 7 functions at 22–26, `digital-experience` at 25) | all 14 cut to 12–15 words, EN and zh together, by removing or compressing clauses (no claim added; the evaluative "Routine needs are handled faster" is gone); every before/after in `after/phase-5/summary-cuts.md`. Words in `<main>`: services 668 → 539 (−19 %), products 411 → 367 (−11 %), functions 441 → 411 (−7 %), platform 1,019 → 1,087 (+7 %: the job headlines now lead the rows) |
| 5.4 links | "Learn more →" on every card | "How it works" (products), "See the workflows" (functions), "Read the architecture" / "Meet the agents" / "See the templates" (platform pages), "Explore {capability}"; the arrow alone where no specific label exists; the cue is `aria-hidden` (the link is named by its headline) |
| 5.5 CSS | — | list styles appended to `award.css`; `.hub-card` stays in `pages.css` (still used by eight other pages); `.card-grid` never existed |

Checks: typecheck, lint, vitest 48/48, Playwright 145/145 (new `tests/e2e/hubs.spec.ts`: 6, all red on `main`; axe spec gains `/en/products`, `/en/functions`, `/zh-hant/services`), hans table current, `curly.mjs --check` 0, `content/legal.ts` untouched. `scripts/award-2/axe.mjs` on the four hubs in EN and zh (10 pages × 2 widths): 0 violations. Lighthouse mobile, interleaved against `main` 9856207: `/en/services` 10 pairs main 91 / branch 90; `/en` 5 pairs main 82 / branch 83. Both sides read lower than earlier runs on this machine (Phase 0: `/services` 93, `/en` 89), so the absolute "not below the baseline" check is not met on either side today; the paired deltas are within noise.

Phase 5 deviations from the brief (reasons in the PR): the audit has no "Content §7" and none of the four before/after examples the brief cites, so the cut is limited to the 14 summaries over the word limit, made by deletion; `whoFor`, `distinction` and `output` are unchanged; the test checks `.hub-card` (the grid's real class) as well as `.card-grid`.

## Phase 6 — photography pipeline (fix plan 15)

Evidence: `before/phase-6/` (`unit-photography-red.log` 12/12 failing, `photo-spec-red.log` 4 failing + 1 skipped, screenshots of the photo surfaces on `main` from `scripts/award-2/capture-photo.mjs`) and `after/phase-6/` (the same screenshots, `axe.json`, the Lighthouse A/B, `playwright-full.log`), plus the grade contact sheet `photo-grade.webp`.

| Item | Before | After |
| --- | --- | --- |
| 6.1 widths and crops | landscape 1536 / 1024 / 640, portrait 800 / 480, named `<id>-<w>` | landscape 2560 / 1536 / 1280 / 1024 / 640, portrait 1024 / 800 / 480, wide 21:8 2560 / 1536; a width wider than its crop's source is skipped and logged (with today's 1536 px masters: landscape 2560, portrait 1024 and wide 2560 wait for regenerated masters); `Photo crop="wide"` on the page-hero band (from 800 px) and `crop="art"` on the closing chapter (portrait on phones) |
| 6.2 object position | focus applied to landscape only, as an inline style | the scene's focus within whichever crop is shown (`--pos-l / -p / -w`), switching with the art-directed source |
| 6.3 shared grade | none; mean R−B ranged 0.5–36.8 across masters | `modulate(saturation 0.92)`, `linear(1.06, −6)`, warmth brought to 12 ± 4 (parameters in `scenes.json` `grade`); every scene now 9.5–12.6; contact sheet `docs/redesign/award-2/photo-grade.webp` |
| 6.5 badge policy | "Illustrative photograph" pill on 5 homepage images; "Illustrative" 7 times on `/en` | `label: 'pill' \| 'caption' \| 'none'`: the pill stays on heroes (homepage, page heroes, leadership photo); photo chapters print one line, "Photographs are generated illustrations." (5 on the homepage); decorative images carry nothing; the footer carries the same line site-wide; every photograph keeps its provenance in `title`. Homepage: 1 pill, "Illustrative" 3 times |
| 6.6 cache | unhashed names under an immutable `/media` header; `/brand` uncached | `<id>-<crop>-<w>.<hash8>.<ext>` with the mapping in `content/photography.generated.json`; files the manifest no longer lists are deleted by the build; `/brand/*` `max-age=86400, stale-while-revalidate=604800` |

Checks: typecheck, lint, vitest 60/60 (new `tests/unit/photography.test.ts`: 12), Playwright 149/149 + 1 skipped (new `tests/e2e/photo.spec.ts`: 4 + the DPR 2 sharpness check, which skips until a 2560 candidate exists), hans table current, `curly.mjs --check` 0, `content/legal.ts` untouched. `scripts/award-2/axe.mjs` on 8 touched pages × 2 widths: 0. Bands re-measured (five caption lines). Lighthouse mobile `/en`, 8 interleaved pairs: `main` 85 / branch 86. Photography on disk 3.1 → 4.9 MB (two new crops/widths); the `/services` hero at 1440 now loads the 1536 wide crop (30 KB) instead of the 1536 landscape (46 KB).

Pending (handoff, brief 6.4): regenerated masters at ≥ 2,560 px. Dropping them into `assets-src/photography/incoming/` and running `RAW_DIR=… node scripts/build-photography.mjs` fills in the skipped widths; the provenance table then gets a new hash table in `award-2/`.

## Phase log

| Phase | PR | What changed | Before → after |
| --- | --- | --- | --- |
| 0 | — (first commit of the Phase 1 branch) | Baseline, scripts, axe gate (`tests/e2e/axe.spec.ts`), `@axe-core/playwright` devDependency | see above |
| 1 | feat/award-pass-2-craft | Locale 404, nav from 1024 px + sheet drawer, per-band intrinsic sizes, focus/contrast/targets, drawer and route-change coordination, badge/marquee/cue/video/poster, icons/titles/banner/leadership | drift /en 390 4,766 → 8 px; axe 0 → 0 (2 pages added); 40 new regression tests |
| 2 | feat/award-pass-2-enquiry | Enquiry API hardening (redirects, idempotency, guards, logs), contact form (no-JS safe, validation focus, status region, keys), CI with a production-build indexability check | forwarder 302 no longer reads as delivered; 21 new regression tests; release check catches a promoted preview |
| 3 | feat/award-pass-2-copy | Headline accents on inner pages (EN serif, zh emphasis dots, keep-all), the new hero line, microcopy and zh terms, one sample notice, case outcomes as observable states and the four-block case page | "Illustrative" outside photo pills 6 → 2; deny-listed outcomes 10 → 0; 12 new regression tests, all red on main, and 4 pages added to the axe spec |
| 4 | feat/award-pass-2-shell | Footer in four columns with an icon row and no prefetch, hover-intent mega menu with scrim and a featured column, contact disclosure and email card, per-template share images, two-line hero at 1920 | footer-only prefetches 96 → 0; hero 4 → 2 lines at 1920; share images 1 static → per page; 16 new regression tests (15 red on main, plus the href snapshot guard) |
| 5 | feat/award-pass-2-hubs | Editorial list on the four hubs (one row per record, headline link, one artefact), objective filter as a client island (`/services` static), 14 summaries cut to ≤ 15 words, object-specific link labels | card grids 4 hubs → 0; `/services` dynamic → static; summaries over 16 words 14 → 0; 7 new regression tests, all red on main |
| 6 | feat/award-pass-2-photo | Photo pipeline: 1280 / 2560 / wide 21:8 / portrait 1024 (skipped until larger masters), focus per crop, shared grade, content-hashed names, badge policy (pill on heroes, one caption per chapter, footer note), `/brand` cache header | homepage pills 5 → 1, "Illustrative" 7 → 3; R−B spread 0.5–36.8 → 9.5–12.6; 17 new regression tests, 16 red on main (+1 skipped by design) |
