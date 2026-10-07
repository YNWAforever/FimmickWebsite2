# Award pass 3

Self-critique rounds after award pass 2 (main@6673908), aimed at Awwwards / Webby / FWA level. Each round: capture every chapter at 1440 and 390 px (plus 820, 1024, 1200, 1920 where layout changes), critique as a juror would in the first minute, fix, re-measure, test. Binding rules from `../design-decisions.md` still hold: no animation library, CSS-driven motion, nothing loops or scroll-jacks, the hero photograph never moves.

- `before/frames/` — fold and contact sheet per page and width, captured from the pass 2 build before any change (`OUT=pass3-before node scripts/award-2/capture-scroll.mjs`).
- `ab/` — the last interleaved Lighthouse A/B against a `main` build (`scripts/award-2/lighthouse-ab.mjs`).

## Round 1 — what a juror meets in the first minute

| Finding (before) | Fix |
| --- | --- |
| Hero at 1280–1679 px: the accent broke "the work. *Your* / *people decide.*", "Your" hanging against the sample card | The English accent sentence starts its own line, sized `min(5vw, 4.1rem)` so it stays on one line clear of the card (test: one line, ≥16 px from the card) |
| The case photographs (property, hotel, retail) appeared twice on the homepage: case cards, then industry tiles | Chapter 05 is a big-type sector index; each scene opens only as a hover preview on wide screens |
| Every inner page ended with two dark calls to action (the page's band, then the footer's) | The footer's is hidden when the page has its own band |
| Hub rows: a stray arrow under each row's text, 4 px of hover feedback | Arrow disc at the row's end, row-wide hover wipe, title colour change |
| Resources shelf: a pill wrapped to two lines, three column bottoms at three heights, the workshop photo repeated chapter 04 | Equal-height columns, no-wrap pill, text-only workshop item |
| The film's play button covered the poster's sample text | Moved below the brief card |
| Signature stage: the left half of each step was empty below its title | One sentence per step: what happens and who does it |
| FAQ: empty left column | Where anything else goes, with the address |
| Phone footer: three screens of links in one column | Two columns |
| "Learn more →" on every card | Object-specific cues |
| 404: plain text | The address comes back as a returned request record, in the product's own language |

## Round 2 — measurement and craft

- **A regression the critique would have missed.** The 404 record's stylesheet, imported by `not-found.tsx`, was preloaded on every route (an extra high-priority request before the LCP image): A/B −5 on mobile `/en`. The rules now ship as a hoisted `<style>` from `LocaleNotFound`; dead global rules were removed so `/en/services` is back under its 50 KB CSS budget.
- **Chapter rail.** From 1480 px the homepage's eight chapters are ticks in the left margin while a chapter is current (light and dark palettes, hover labels, ordinary anchors). JavaScript only sets the current chapter.
- **Chinese emphasis marks** are the small dot, not the circle, which read as a row of polka dots at display sizes.
- **Below 900 px** the row's arrow disc sits top-right beside its label.

## Round 3 — adversarial pass

- **Keyboard.** Tabbing into the sector index shows the row panel with a focus ring and opens the scene; the rail's links are reachable and labelled ("02 Case-study evidence"). At 1440 px the row panel overlapped the rail's ticks, so the rail starts at 1480 px, 80 px left of the container, clear of every row panel.
- **Bleed-through.** The header was 96 % white without a blur: scrolled headings ghosted between the logo and the navigation. It is opaque now (test).
- **Containment.** The last sector's hover scene stays inside its band (content-visibility clips paint at the band edge): 100 px of margin.
- **Flaky test found and fixed.** An instant jump into lazily rendered bands can shift a row from under the pointer; the hover test retries.

## Round 4 — phones

- **The hero orphan was also on phones** ("the work. *Your* / *people decide.*"). The English accent sentence now starts its own line at every width and may run to the container's width, so it is one line at 390 px and wraps only inside itself at 360 px.
- **The film's play button covered its two-line caption bar** on narrow players; below 700 px it sits right of the poster's brief card, at 60 px.

## Measurements (local build, Windows, Lighthouse 13.5, simulated throttling)

| Check | main@6673908 | branch | |
| --- | --- | --- | --- |
| Lighthouse mobile `/en`, 7 interleaved pairs, median | 87 | 88 | +1 |
| Lighthouse desktop `/en`, 3 pairs, median | 99 | 99 | 0 |
| CSS on `/en/services` | ≤50 KB | 49.8 KB | budget 50 |
| Playwright, all projects (axe, cascade, smoke) | — | 273 pass, 1 skipped | |
| Unit tests + hans table, `test:i18n` (134 zh-Hans pages) | — | pass | |

Single Lighthouse runs on this machine swing by up to 10 points, so only interleaved medians are compared.

## Still open (decisions for Willy)

- **Photography.** Masters are 1536 px, so inner-page heroes are soft on 2× screens; ≥2560 px masters are needed (pass 2, Decision #5). Six scenes were briefed for regeneration in the pass 2 audit.
- **Case-page headlines** are still the case names; a job headline per case (as solutions, products and services now have) needs copy for 20 records in two languages.
- **Native zh-Hans review** (runbook B3) and the zh strings added here: the four signature notes, the 404 record, the FAQ line and five link cues.
