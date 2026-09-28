# Cinematic redesign — report (29 Sep 2026)

Branch `feat/cinematic-redesign`, based on `origin/main@e6fc775` (the deployment at https://fimmick-website2.vercel.app). Stack unchanged: Next.js 16, React 19, TypeScript, plain CSS. No new runtime dependencies; no animation library.

**Input note:** the attached `FIMMICK_Claude_Opus_5_5_Cinematic_Redesign_Prompt_2026-09-29.md` was not found anywhere on this machine. The work follows the brief as written in the request. The attachment's eight photographic scene briefs were replaced by ten briefs written for this redesign (`assets-src/photography/scenes.json`); please compare them with the originals.

## What changed

### Homepage (all three locales)

The homepage now runs in nine chapters. Positioning ("Agentic AI Platform"), every pillar, all six products, the six ecosystem members, the SEO title and description, and every contextual enquiry value (`demo`, `configuration`, `transformation`, `service`, `deployment`, `managed`, `partnership`) are preserved.

| # | Chapter | Before | After |
|---|---|---|---|
| 1 | Hero | Dark night band, text plus pipeline line | Light, photo-led: headline, one-line promise, two CTAs. The generated desk photograph carries a sample-output card (bilingual caption, "Approved by brand manager", Facts → Drafted → Approved → Exported). |
| 2 | Four business outputs | Four text cards | Four readable output artefacts on "desk" stages: insight brief, approved bilingual captions, a routed enquiry and a checked page-record diff, each labelled "Sample output". |
| 3 | Case evidence | Text feature and rows | Internal case as a before/after infographic, plus three client cases with photographs and outcomes. The anonymisation and withheld-figures note is kept. |
| 4 | Signature platform explanation (dark chapter) | Four-layer platform diagram | "One workflow. Four moments. People decide." — the only long motion sequence (see Motion). Links on to /platform and the film. |
| 5 | Transformation and Services | Text lists | Two photographic "doors". Transformation shows its 4 workstreams and a mini readiness heatmap. Services shows its 6 objectives with counts, a real SEO fix-list sample and "no AIP subscription required". |
| 6 | Industries | Selector diagram | Four photographic cards with each industry's output line. |
| 7 | Ecosystem | Map diagram | Photograph plus six "tangible" brand tiles with role and a relationship tag (production wording), and the boundary note. |
| 8 | Resources | Film plus text cards | Film (click-to-play, unchanged), a real first-page preview of the guide PDF, the latest article and the workshop. |
| 9 | Start and CTA (dark chapter) | Text cards and a CTA band | Three options with a "who does the work" scale bar, the partner line, the collapsed FAQ and a closing night-photo chapter. |

The interactive examples (edit / review / export) moved off the homepage and remain on solution, product and cases-and-demos pages, unchanged. The e2e suite still exercises them.

### Inner-page templates

`PageHero` takes an optional `photo`, which renders a wide cinematic band under the hero while keeping every aside and status panel. It is applied to all 4 solution pages, the 4 industry pages with a matching scene, the 3 matching case pages, and the AI Transformation, Services, Ecosystem and Workshop hubs. `Photo` (`components/media/Photo.tsx`) is the shared art-directed `<picture>`: AVIF/WebP, 3:2 or 4:5 crops around each scene's focus point, intrinsic size, colour placeholder and the "Illustrative photograph" label.

### Removed

The old hero pipeline component and its CSS, the homepage-only card/gateway styles, and the unused `hero.steps` / `flowStages` copy.

## Measured wording change

`scripts/capture-audit.mjs` measures visible text in `<main>`: words for Latin script, characters for CJK. It excludes hidden panels, closed `<details>` and `aria-hidden` content, and measures with reduced motion, so all four signature frames count. **Explanatory** is all text outside sample artefacts; **artefact** is text inside sample outputs, heatmaps and the film card, on both old and new pages. Before is live (vercel.app); after is the local production build.

| Page | All visible text | Explanatory text | Artefact text |
|---|---|---|---|
| Desktop EN | 1,742 → 1,246 (−28%) | **1,462 → 827 (−43%)** | 280 → 419 |
| Desktop 繁中 | 3,080 → 2,137 (−31%) | **2,622 → 1,494 (−43%)** | 458 → 643 |
| Desktop 简中 | 3,081 → 2,138 (−31%) | **2,623 → 1,495 (−43%)** | 458 → 643 |
| Mobile EN | 1,932 → 1,246 (−36%) | **1,652 → 827 (−50%)** | 280 → 419 |
| Mobile 繁中 / 简中 | 3,440 → 2,137 (−38%) | **2,982 → 1,494 (−50%)** | 458 → 643 |

Explanatory prose meets the 40–50% target. Total visible text falls 28–38%, because readable output examples deliberately replace description. With motion allowed, the signature stage shows one frame at a time, so default visible text is lower still. Photographs in `<main>`: 1 (logo only) → 16. Kept on purpose: evidence labels, anonymisation note, sample-data notices, "no AIP subscription required", the ecosystem boundary, the film notice and the FAQ.

## Photography

See `photography-provenance.md`. Ten scenes were generated with the Codex CLI image tool, every one inspected, and none re-rolled. There are 100 delivery files (2.9 MB total); the hero is 48 KB as AVIF. The provenance manifest records prompts, use, inspection notes and original SHA-256 hashes. A unit test checks that every scene has alt text in both languages, its delivery files and a provenance entry.

## Motion

- **Hero:** the headline, CTAs and photo are static. Only the sample-output card rises (700 ms) and its approval tick lands (at 1.15 s). An earlier clip/scale entrance on the photo was measured to delay LCP by the animation length and was removed.
- **Signature sequence** (`components/home/SignatureStage.tsx`): the server renders a four-frame storyboard, which is also the no-JS and reduced-motion version. With motion allowed it becomes a stage that plays once (5 s per step) when 40% is on screen, pauses off-screen or when the tab is hidden, and stops on the final frame. It never loops, never scroll-jacks, and has no audio. Play/pause (`aria-pressed`), step buttons (`aria-current="step"`) and "Show all four" are always available. Inactive frames are `hidden`.
- The existing once-only `.reveal` entrance is reused. Hover lifts are disabled with reduced motion.
- **Evidence** is in `motion/`: `hero-entrance.webm`, `signature-sequence.webm`, `signature-step-1..4.webp`, `signature-static.webp`, and `motion-checks.json`. The checks: headline opacity 1 at load; autoplay visits steps 0–3 and stops; pause holds; keyboard selects a step; 1 frame is exposed while staged and 4 with "show all"; reduced motion gives the storyboard, nothing playing and no hero animation.

## Verification (local production build, `next start -p 3200`)

| Check | Command | Result |
|---|---|---|
| Type-check | `npm run typecheck` | Pass |
| Lint | `npm run lint` | Pass (0 problems) |
| Unit | `npm test` | 23/23. New: photography contract; homepage copy added to the bilingual, retired-metaphor and Hans-table checks. |
| Build | `npm run build` | Pass, 1,549 static pages |
| E2E | `E2E_PORT=3200 npx playwright test` | 24/24. Updated hero test; new signature-controls and photo-labelling tests; reduced-motion test extended. One earlier run had a single load flake in the enquiry test, which passed alone and on the rerun. |
| Site sweep | `BASE_URL=… node scripts/qa-sweep.mjs` | 339 pages × 2 widths: no overflow, console or status problems; 1,021 internal links, none broken |
| zh-Hans | `BASE_URL=… node scripts/i18n/check-hans.mjs` | 136 pages, no leftover Traditional characters |
| Accessibility | axe-core 4 (WCAG 2.2 A/AA), scripted | 0 violations: `/en` (reduced and full motion), `/zh-hant`, an industry page |
| Keyboard | Scripted Tab walk, first 40 stops | Logical order (skip link → header → hero CTAs → output tiles → cases → signature controls → pathways); focus visible on every stop |
| 200% zoom | 720×450 CSS viewport at DPR 2 (= 1440×900 at 200%) | No horizontal overflow on `/en`, `/zh-hant` or a solution page; the hero card covers no hero copy |
| Media | e2e plus manual | Film still loads no video bytes before play; photo files are served; guide previews are real renders |
| Enquiries | — | No real enquiry was sent. The e2e server runs with `ENQUIRY_FORWARD_URL` empty. |

### Lighthouse 13.5, mobile, simulated throttling, median of 3

| Page | Perf | A11y | BP | SEO* | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home `/en` | 87 (83–91) | 100 | 100 | 69 | 2.91 s | 0 | 333 ms |
| Home `/zh-hant` | 92 | 100 | 100 | 69 | 3.11 s | 0 | 100 ms |
| Solution (Content production) | 96 | 100 | 100 | 69 | 2.70 s | 0 | 44 ms |
| Industry (Hospitality) | 95 | 100 | 100 | 69 | 2.85 s | 0 | 89 ms |
| AI Transformation hub | 96 | 100 | 100 | 69 | 2.77 s | 0 | 43 ms |

\*SEO is capped by the intentional review-build `noindex`, as before. For comparison, the old text hero scored Perf 94, LCP 2.68 s and TBT 70 ms. The LCP element is now the hero photograph: it is discoverable, `fetchpriority=high` and loads in about 20 ms, but its paint waits about 1.4 s for hydration under 4× CPU throttling. Homepage transfer is 329 KB.

## Remaining blockers and unverified items

1. **The attachment was not found**, so its eight scene briefs and any requirements that appear only there are unverified.
2. **No real product screenshots exist.** The output artefacts are HTML samples from the sample data and are labelled as such. Approved FIMMICK AIP captures should replace them when available.
3. **Homepage lab performance** fell from 94 to 87–92, and LCP is 2.9–3.1 s against a 2.5 s target. Candidates: a smaller mobile hero crop, deferring header/player hydration, or reducing the RSC payload of the signature frames.
4. **Not run:** a screen-reader pass; real-device and real-browser zoom (zoom was emulated); native zh-Hans copy review of the new strings (machine converted, as for the rest of the site); stakeholder review of the ten photographs.
5. **Not deployed or pushed.** The commit is local on `feat/cinematic-redesign` with no upstream. Pushing would trigger a Vercel preview.
