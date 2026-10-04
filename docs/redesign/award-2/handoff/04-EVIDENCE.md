# Evidence index

Every file under `evidence/` was captured on the local production build of `main@10c886e` with Playwright (Chromium 1194, no H.264), as viewport-by-viewport frames; "sheet" images are contact sheets of consecutive frames at 50 %, read left to right, top to bottom. Use these as the "before" for the matching fix-plan item; the Phase 0 baseline regenerates the same views into `docs/redesign/award-2/before/`.

## 00-baseline — the site as audited

| File | Shows | Use |
| --- | --- | --- |
| `home-desktop-1440-fold.webp` | Homepage first viewport at 1440×900 | Reference for the hero; must stay visually unchanged by Phase 1–2, changes only in Phase 3 (copy) and 7 (live card) |
| `home-mobile-390-fold.webp` | Homepage first viewport at 390×844 | Reference; note the sample card's top edge at the fold |
| `home-zh-hant-desktop-fold.webp`, `home-zh-hant-mobile-fold.webp` | zh-Hant hero: full magenta sans accent, body breaks inside 「決定」 on mobile | Phase 3.1 (着重號 accent, `keep-all`) |
| `home-zh-hans-desktop-fold.webp` | zh-Hans hero rendered with Traditional glyph forms | Phase 8.3 (SC font stack, `lang`) |
| `home-desktop-scroll-frames-stitched.webp` | All 15 desktop frames of the homepage stitched | The nine chapters in order; Phase 1.3 (bands), 1.6 (marquee), 3 (chapter heads) |
| `home-mobile-scroll-contact-sheet.webp` | All 18 mobile frames | Same, mobile |
| `home-fold-1280-and-1920.webp` | Top: 1280×720; bottom: 1920×1080 scaled | Phase 4.5 — at 1920 the headline wraps "Put AI / into real / business work." with the left half empty |
| `home-fold-820-tablet.webp` | 820×1180 | Phase 1.2 tablet behaviour |
| `platform-desktop-fold.webp`, `services-desktop-fold.webp`, `contact-desktop-fold.webp`, `knowledge-hub-desktop-fold.webp`, `case-study-desktop-fold.webp` | Inner-page heroes: plain sans H1s without the serif accent | Phase 3.1 |
| `about-desktop-scroll-sheet.webp` | /about frames; the repeated footer frames show the drift artefact (scrollHeight overestimated by placeholders) | Phase 1.3 |
| `home-zh-hant-desktop-scroll-sheet.webp` | zh-Hant homepage frames | Phase 3 zh checks |

## 01-craft-breaks — Phase 1

| File | Shows | Item | After must show |
| --- | --- | --- | --- |
| `1.1-locale-404-zh-hant-renders-english-global-page.webp` | `/zh-hant/...` unknown URL returns the bare English global 404, no header, `lang="en"` | 1.1 | zh 404 with header, footer, language switch, zh copy, status 404 |
| `1.1-404-en.webp` | Same for `/en/...` | 1.1 | Locale 404 with the shell |
| `1.2-fold-1200px-hamburger-only.webp` | At 1200×800 the primary nav is hidden; only the hamburger shows | 1.2 | Primary nav visible from 1024 px |
| `1.2-drawer-stretched-at-1200px.webp` | The phone drawer opened at 1200 px: 1,120 px accordion rows and CTA pill | 1.2 | Right-hand sheet ≤ 420 px wide with scrim |
| `1.4-utility-row-focus-offscreen-after-scroll.webp` | After scrolling, focus on "About" sits above the viewport (header translated −37 px) | 1.4 | Header returns when the utility row has focus |
| `1.4-focus-nav.webp` | Focus ring on a nav item (box-shadow only) | 1.4 | Visible outline also in forced-colours mode |
| `1.5-drawer-mid-transition-109px.webp` | Drawer mid-open at 109 px tall with two logos and two toggles stacked | 1.5 | Drawer at full height from the first frame |
| `1.5-drawer-end-state.webp` | Drawer after the 520 ms transition | 1.5 | Unchanged end state |
| `1.5-route-change-end.webp` | Page after navigating from a scrolled position; header slid back separately from the page entrance | 1.5 | Header present from the first frame of the new page |
| `1.6-hero-badge-covered-by-card-390.webp` | "Illustrative photograph" badge hidden under the sample card at 390 px | 1.6 | Badge visible top-left of the photo |
| `1.6-marquee-rests-mid-word.webp` | Dark-chapter marquee at rest: "…erson decides • Exported with its reco…" | 1.6 | A whole phrase centred at chapter entry; hairlines full-bleed |
| `1.6-video-poster.webp`, `1.6-video-poster-cursor-ring-zoom.webp` | Poster frame carries a baked-in cursor ring | 1.6 | Poster from the title frame, 640 w variant |
| `1.6-video-error-no-h264-browser.webp` | "The video could not be played in this browser" although the WebM plays | 1.6 | `<video>` playing from the `.webm` source |
| `1.7-archive-banner-on-2026-guide.webp` | "Archive article — may be out of date" on a June 2026 guide | 1.7 | No banner on post-relaunch articles |
| `1.7-knowledge-hub-fold-amp-entities.webp` | Knowledge Hub cards with literal `&amp;` in titles | 1.7 | Decoded `&` |
| `1.7-leadership-page-note.webp` | /about/team: two text cards, no images, the "will be added once approved" note | 1.7 | Note removed; composed block or portraits |

Numbers for items without a picture (from the audit): scroll-height drift /en 390 px +4,227, /en/platform 390 px +4,668, /en/solutions/content-production 1440 px −2,814 (item 1.3); field-border contrast 1.58:1 (item 1.4); two 24 px targets, footer "Cookies" and the zh ghost "Resources" button (item 1.4); favicon 28×28 16-colour, no apple-touch-icon (item 1.7).

## 02-shell-and-share — Phases 2 and 4 (plus Low items)

| File | Shows | Item | After must show |
| --- | --- | --- | --- |
| `4.1-footer-1440-wrap-5-plus-3.webp` | 61 links in eight groups wrapping 5 + 3; two-line headings misalign the lists; underlined social text links | 4.1 | Four columns × two groups, aligned lists, icon row |
| `4.1-footer-390.webp` | Footer on mobile | 4.1 | Single column, same link set |
| `4.2-mega-menu-open-1440.webp`, `4.2-mega-menu-no-scrim-hard-edge.webp` | Mega panel with no scrim; hero step indicators peek under the hard edge; featured card alone under column 1 | 4.2 | Scrim + shadow, hover-intent, featured card in its own column |
| `4.3-contact-top-empty-address-lines.webp` | Contact page: office cards with empty address lines; "Add more detail" summary with no affordance | 4.3 (and Phase 2.2) | Marker on the summary; empty rows collapsed |
| `4.3-contact-errors.webp` | Validation errors state | 2.2 | Errors inside `<details>` open it and get focus |
| `4.3-contact-prepared-email-block.webp` | The monospace `<pre>` fallback block | 4.3 | Styled card with Copy |
| `4.5-hero-1920-awkward-wrap.webp` | 1920 px hero, three-line headline, empty left half | 4.5 | Two-line headline, wider copy column |
| `faq-closed.webp`, `faq-open-no-animation.webp` | FAQ accordion snaps open; small "+" glyph | Low (audit Design table) | Height transition, 16 px glyph |
| `cursor-bubble-read-the-case-wrap.webp` | "Read the case" wrapping inside the 92 px bubble over card text | Medium (hover states) | Shorter label, bubble only over the image |
| `print-article-page-1-no-print-sheet.webp` | Printed article: sticky header, banner and dark footer | Phase 8.2 print sheet | Header/footer hidden, light backgrounds |

## 03-hub-template — Phase 5

| File | Shows | After must show |
| --- | --- | --- |
| `services-hub-desktop-scroll-sheet.webp` | /services: photo band, filter pills, then 4-column card grids with "Deliverables:" and "Learn more →" | Editorial list rows per objective group; filter pills kept |
| `platform-hub-desktop-scroll-sheet.webp` | /platform: capability and architecture card grids | Editorial list; H1 with accent |
| `products-hub-desktop-scroll-sheet.webp` | /products card grid | Editorial list |
| `services-card-grid-frame-1440.webp` | One full-size frame of the services grid | Row anatomy per the brief (index, 24 px headline, one-line deliverable, one artefact) |
| `platform-hero-no-accent-1440.webp` | Platform hero: 13-word sans H1, no accent | "Four layers. *One workflow you can run.*" |
| `services-tablet-820-a.webp` | Services hub at 820 px | Single-column list |
| `services-zh-hant-fold.webp` | zh-Hant services fold | Same layout with zh headline + 着重號 |

## 04-photography — Phase 6 and the regeneration handoff

| File | Shows | Use |
| --- | --- | --- |
| `masters-contact-sheet-10-scenes.webp` | All ten masters at 512 px: seven with the harbour skyline, eight with oak desks | The homogeneity finding; which six to regenerate (audit Photography table) |
| `master-detail-crops-hands-and-pseudo-text.webp` | 100 % crops: pseudo-text on proof sheets and the open brochure, the two-hands proposal table, sticky-note wall, hotel desk, studio hand | Pseudo-text and hand quality checks for the regenerated set |
| `home-doors-band-crop-cuts-heads.webp` | Workshop-wall band crop cutting heads at the crown | Focus-point `object-position` and the wide crop |
| `home-ecosystem-photo-busy-frame.webp` | Community-event photo: 20 heads, tote bags, tripod | Replace per the brief |
| `services-hero-band-upscaled-on-2x.webp` | The 21:8 services hero band (1,536 px source painted at ~2,870 px on 2×) | 2560 width + wide crop |

## 05-content — Phase 3

| File | Shows | After must show |
| --- | --- | --- |
| `home-outputs-chapter-sample-labels.webp` | Chapter 01 with "Sample output" pills on every artefact | One page-level notice, one-word "Sample" tags |
| `home-evidence-chapter-case-cards.webp` | Case cards with evaluative outcomes and the two-line disclaimer caption | Observable-state outcomes; one provenance line |
| `case-study-page-provenance-blocks.webp` | Case page with the three provenance blocks ("Not stated in the source record") | Single provenance line; four-block structure |
| `zh-hant-event-english-body.webp` | zh-Hant event page with English body under a "並以英文提供" note | zh body or events hidden from zh hubs (Phase 8.1) |
| `article-template-full.webp` | Full article template | Banner gated (1.7), `&amp;` decoded, lang fixed (8.1) |
