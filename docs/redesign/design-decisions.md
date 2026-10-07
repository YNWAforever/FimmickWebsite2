# Design decisions

## Direction chosen

Two directions were considered:

1. **Dark, cinematic "AI platform"** (the reference's direction): high drama, but product detail and Chinese text read poorly on dark, and it competes with the content.
2. **Confident product studio with visible business workflows** (chosen): light, comprehension-first surfaces; navy ink typography; logo magenta and lime used as meaningful accents; one focused dark surface for the platform section.

The identity comes from the **flow motif** — *Source → Prepared work → Human decision → Usable result* — used in the hero scene, flow strips, the film, the share image and the colour roles: slate = source, magenta = AI-prepared work, lime = people decide, ink = result.

## System

- **Type:** Manrope (variable, Latin) with Traditional Chinese falling back to PingFang HK / Noto Sans TC / Microsoft JhengHei. Chinese headings use zero letter-spacing and a looser line height. No serif display face, so both languages match.
- **Layout:** 1280 px container, 20–40 px fluid gutters, 17 px body, fluid headings.
- **Colour:** tokens in `app/styles/tokens.css`. Magenta text uses a darker ink (`#b0005f`) for contrast; lime is used as a fill and border, with dark-green text.
- **Navigation:**
  - At 1520 px and wider, all eight pillars are shown inline.
  - From 1280 to 1519 px, the seven commercial pillars stay inline and About moves to the visible utility row.
  - From 1024 to 1279 px, the same seven stay inline with short English labels (Platform, Transformation, Cases) and tighter spacing (award pass 2).
  - Below 1024 px, a menu opens a drawer listing all eight pillars as accordions: a 420 px sheet from the right over a scrim from 700 px, full screen below. It is rendered beside the header, not inside it, and closes when the window widens past 1024 px.
  - Menus are click- and keyboard-driven (no hover-only access), close on Escape with focus restored, and the drawer traps focus.
- **Motion:** CSS only; no animation library.
  - Staged hero arrival, once-only section reveal and short feedback transitions.
  - Everything is gated by `prefers-reduced-motion`, and the hidden starting state is scoped to `html.js` so content never depends on JavaScript.
  - The film is click-to-play.
- **Examples:** deterministic client components with no backend. Each has a visible "Illustrative example — sample data" notice and a reset. Editing an approved draft invalidates the approval, and export needs a reviewed draft.
- **Server-first:** all pages are server components. Only the header, language switch, diagrams, examples, player and form are client components. The content registries are never imported into client code; the safe-query helper is dependency-free for this reason.

## Content decisions

- **Retired metaphors:** "AI workforce", "hire AI staff" and "digital employees" are removed from customer-facing copy (a unit test enforces this). The seven production workforce pages (`/workforce/{growth,operations,finance,hr,cx,expansion,executive}`) are rebuilt as **workflows by business function** at `/functions/*`: each lists four example workflows (input → prepared output → human decision), what always stays with people, a sample record and related solutions/services. `/workforce/*` redirects there (308).
- **Cases:** the 20 anonymised production cases are kept as qualitative summaries. Their headline figures (e.g. "32% CPA reduction") are withheld because no scope, date or baseline is documented.
- **Leadership:** only the two leaders with published bios (Kenny Yiu, Willy Lai) are shown; production's seven unfilled placeholder slots are not. Names stay in English in every locale.
- **Legal text:** preserved verbatim; production also shows it in English on Chinese pages.
- **Products:** all six are shown as "configured per engagement — availability confirmed when we scope your workflow" (*Discuss Configuration*), because public availability was not verified.
- **Ecosystem:** relationship wording follows production ("business unit", "incubated social enterprise"), not inferred corporate structure. A boundary note states that no audience or data access is implied.
- **Simplified Chinese:** every page now exists at `/zh-hans/*`, as production had. Copy is authored once in Traditional Chinese (HK) and converted at render time by `lib/hans.ts`, using a generated table (`npm run i18n:hans`, OpenCC hk→cn per character plus a short word list such as 回覆→回复). The same table runs on server and client, so hydration matches. `scripts/i18n/check-hans.mjs` scans every built zh-Hans page for leftover Traditional text; a unit test fails if the table is stale. This is **machine conversion**: Hong Kong vocabulary is not replaced with Mainland terms (e.g. 电邮, 资讯), so a native review is still recommended (runbook B3). Knowledge Hub articles keep their native Simplified text; articles without a Simplified version fall back to the original language with a canonical to that version.
- **Services:** `/services/ai-transformation` permanently redirects to the `/ai-transformation` hub, so there is one comprehensive overview. `/services/digital-experience` (production) is a full service page again (objective: Convert), bringing the catalogue to 16.
- **Platform sub-pages (production and reference):** `/platform/architecture` (four layers, the seven steps of one workflow run, eight building blocks), `/platform/agents` (what every agent must define, eight task patterns with limits, three autonomy levels), `/platform/marketplace` (nine workflow templates — design starting points, not buyable apps) and five capability pages (`/platform/{intelligence,data-analysis,creative-studio,marketing-strategy,workflow-automation}`). Capability pages list "what should change" as aims, explicitly not measured results; the reference site's metric bands (e.g. "4,000+ agents", "3× output", "200+ connections") are not reproduced.
- **Pricing:** `/platform/pricing` explains what drives cost, the three engagement models and what every written proposal states. The previously published plans (Lite/Pro/Enterprise with prices) are not reproduced; the page says they have been withdrawn.
- **Other restored pages:** `/growth` (acquire → convert → retain services, supporting solutions and function workflows), `/insights` (latest guides, video and articles by topic) and `/about/asia-delivery` ("Regional delivery": verified offices and contact points, how multi-market work is organised; no market or client counts).
- **Knowledge Hub archive:** preserved articles carry an "Archive article" banner with their original date, and their in-body links are rewritten through the same redirect table.

## Bundle and assets

- No animation, UI or state libraries were added.
- Runtime dependencies: `next`, `react`, `react-dom`.
- Dev-only additions: `@playwright/test`, `vitest` and `ffmpeg-static` (film rendering).
- Hero: HTML/CSS only, with no image.
- Film: 0.48–0.57 MB per encoding, and nothing is loaded before the visitor plays it.
- Poster: 37 KB.

## Cinematic redesign (29 Sep 2026)

Supersedes parts of "Direction chosen" and "Motion" above; full report in `docs/redesign/cinematic/README.md`.

- **Show before telling.** The homepage leads with a photograph and a sample output, then four readable output artefacts, before any explanation. The source → preparation → human approval → output story is told once, in the signature sequence; deeper architecture stays on /platform.
- **Light surfaces, two dark chapters.** The dark hero is gone. Only the signature workflow and the closing call to action are dark.
- **Photography rules.** Photographs are generated illustrations and always labelled as such. People appear only from behind, at the edge of frame or out of focus. Photographs illustrate context only: product evidence comes from sample artefacts or real captures, and diagrams are HTML/SVG.
- **Motion.** A card-only hero entrance (the photo is the LCP element and must not animate), one signature sequence with controls and a static storyboard equivalent, and the existing once-only reveal. Nothing loops, scroll-jacks or plays audio.

## Award pass (4 Oct 2026)

Extends the cinematic redesign; full report in `docs/redesign/award/README.md`.

- **One accent face.** Instrument Serif italic sets one phrase per display headline (`components/motion/Headline.tsx`). Chinese pages keep the sans and mark the phrase with colour only. Manrope remains the UI and body face. Both fonts are defined once in `app/fonts.ts` and applied by every root layout.
- **Motion stays CSS-driven, with no library and no scroll-jacking.** JavaScript only sets state: reveal classes, `<html data-scroll>` for the header, and the media bubble's position. Continuous effects are scroll-linked (`animation-timeline`), so nothing moves unless the visitor scrolls, and nothing loops. An inertial smooth-scroll library was evaluated and rejected under this rule.
- **The hero photograph is never animated.** Only the hero copy eases away as it scrolls out. The headline words animate (transform only); the photo is the LCP element, not the text. Scroll-linked drift is limited to a handful of large editorial photographs, and nothing carries `will-change`, so first paint does not pay for layers.
- **Dark ending.** The closing chapter flows into a dark footer with grain. The footer CTA is hidden where the page already ends with one (the homepage).
- **Below-the-fold bands are lazily rendered.** `content-visibility: auto` (with a remembered intrinsic size) applies to `main section.section`, the closing chapter and the footer, never to heroes. New full-width bands should use the `.section` class to get this for free. Small components that happen to be `<section>` elements are deliberately excluded. *Superseded by award pass 2:* only the homepage's named bands are lazily rendered, each with its measured height per locale at three widths (`scripts/award-2/bands.mjs`), because a flat 800 px placeholder made the document height drift by up to 5,300 px on the first scroll; inner pages render normally.
- **Stylesheet order is part of the design.** `award.css` overrides `cinematic.css` at equal specificity, so it is imported only by the locale layout, after `cinematic.css`. CSS imported by both root layouts is hoisted into the shared chunk and loads first, which would silently undo those overrides. Shared rules go in `editorial.css`, which overrides nothing. An e2e test checks the order in the production bundle.
- **Scroll-driven effects need non-scrolling ancestors.** Use `overflow: clip`, not `hidden`, on any box that contains a `view()` timeline subject; `hidden` creates a scroll container and freezes the timeline.
- **Runtime dependencies unchanged:** `next`, `react`, `react-dom`.

## Award pass 3 (7 Oct 2026)

Extends award pass 2; critique log and measurements in `docs/redesign/award-3/README.md`.

- **A photograph appears once per page.** The homepage repeated the case photographs in the industries chapter; chapter 05 is now a big-type sector index whose scenes open only as hover previews (hover-capable screens ≥1000 px). New homepage chapters should not reuse a photograph another chapter already shows.
- **One closing call to action per page.** A page that ends with its own `CtaBand` (with the page's intent) hides the footer's generic one (`main:has(.cta-band) + .site-footer .footer-cta`).
- **Rows end in an arrow disc.** Editorial rows (hubs, platform, sector index) end in a 44–56 px arrow disc at the row's end; hover wipes a pale panel across the row (transform only) and fills the disc. No arrow sits alone under text.
- **Link cues name their object** ("How it works", "See the deliverables", "See the sector"); "Learn more" is retired.
- **The English hero accent starts its own line** beside the photo, sized (`min(5vw, 4.1rem)`) so the sentence stays on one line clear of the sample card.
- **Chapter rail.** From 1480 px the homepage shows its eight chapters as ticks in the left margin while a chapter is current, clear of the rows' hover panels. JavaScript (an IntersectionObserver) only sets the current chapter; the links are ordinary anchors, so scrolling is untouched. Hidden, it is also unfocusable.
- **The 404 speaks the product's language:** the address comes back as a returned request record. Its styles ship as a hoisted `<style>` from `LocaleNotFound`, because a stylesheet imported by `not-found.tsx` is preloaded on every route of the layout.
- **Phone footer in two columns.** One column made it three screens long.
- **The header is fully opaque.** At 96 % without a blur, scrolled headings ghosted through it.
- **Runtime dependencies unchanged:** `next`, `react`, `react-dom`.
