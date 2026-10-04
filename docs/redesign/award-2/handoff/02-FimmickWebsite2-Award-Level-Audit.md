# FimmickWebsite2 Award-Level Audit

Oct 4, 2026 · @Willy

## Verdict

The site scores about **6.8 / 10** on the Awwwards rubric: Honorable Mention territory, not yet Site of the Day (typically 7.5+ with no criterion under 7). The homepage is already close to the bar; what pulls the average down is Creativity (one good idea executed conventionally), the inner pages (template-grade card grids with label headlines), and a set of craft breaks a jury hits within the first minute: a stretched phone drawer at laptop widths, a bare English 404 for every bad Chinese URL, and a scrollbar that changes length as you read.

| Criterion (weight) | Score | What earns it | What caps it |
| --- | --- | --- | --- |
| Design (40 %) | 7.0 | Editorial type pairing, calm palette, photo-led chapters, dark closing sheet | Inner pages drop to 4-column SaaS cards; 7 of 10 photos share the same harbour-and-oak look; "Illustrative photograph" pill on every image reads as a watermark; 61-link footer; single generic OG image and a 28 px favicon |
| Usability (30 %) | 7.0 | Zero axe violations after settle, CLS 0, Lighthouse 100 desktop / 94–98 mobile, keyboard-safe header, honest form | Desktop nav only from 1280 px, so 1024–1279 px windows get a full-width phone drawer; the locale 404 never renders (every bad /zh-hant URL gets the bare English page); scroll height drifts up to 5,300 px on first pass; keyboard focus lands off-screen in the hidden utility row; mobile drawer jumps 109 px to full height; video fails in browsers without H.264 although a WebM is shipped |
| Creativity (20 %) | 6.0 | "See the output before the explanation" and the four-moment signature sequence are a real idea | No signature interaction a visitor would remember; marquee rests mid-word; motion vocabulary is wipe-and-rise only; route changes fight the header slide; Chinese accent is colour-only |
| Content (10 %) | 7.0 | Disciplined, honest, bilingual-native copy | Hero states the category, not the idea; 37 disclaimers and 150+ "sample" labels; 19 inner H1s are bare names; "Archive — may be out of date" banner on four-month-old guides; 34 article titles show a literal `&amp;`; zh CTA says "book" while the policy says "request" |

The gap to the award bar is about +0.7 overall. More than half of it is reachable with fixes that need no new design (the items in the fix plan marked "craft break", most of them under half a day); the rest needs one creative decision (a signature interaction or a stronger hero idea), the inner-page template, and a second photography pass. Nothing found is structural: the stack, performance base and accessibility base are strong enough to carry an award entry.

## Method

Production on fimmick-website2.vercel.app serves `main@10c886e` (PR #4, the award pass), confirmed from the Vercel deployment list, so the repository at that commit is what was audited. The same commit was built locally (`next build`, `next start`) and inspected with Playwright at 1440×900 and 390×844 in `/en`, `/zh-hant` and `/zh-hans`, after a full scroll so every reveal and scroll-linked effect had fired.

Each page was scored against the four Awwwards criteria (Design 40 %, Usability 30 %, Creativity 20 %, Content 10 %) and cross-checked against what Webby and FWA juries reward: a single memorable idea, flawless execution at every breakpoint, and no moment where the craft breaks. Scores are out of 10; an Awwwards Site of the Day typically lands at 7.5+ overall with no criterion below 7.

The codebase was read file by file (`app/`, `components/`, `lib/`, `app/styles/`, `content/`), the repo's own checks were run (`typecheck`, `lint`, `vitest`, Playwright e2e), and axe-core and Lighthouse were run on the local production build. Photographs were inspected at the master resolution and in every delivered crop, with sharpness and noise measured numerically and the art direction compared scene to scene.

## Design and craft

The homepage holds up at 1280, 1440 and 390 px; the problems are concentrated in the inner templates, the wide (1920 px) hero, and a few moments where motion and lazy rendering show their seams. Everything below was reproduced on the local build of `main@10c886e`.

| Sev | Where | Finding | Fix |
| --- | --- | --- | --- |
| High | `app/styles/shell.css:114-119` | Desktop navigation exists only from 1280 px. At 1024–1279 px (iPad landscape, 13″ laptops at 125–150 % scaling, any non-maximised window) the hamburger opens a phone drawer stretched to 1,120 px: full-width accordion rows and a 1,120 px "Request a Demo" pill. A juror resizing the window sees it within five seconds. | Bring the primary nav down to ~1024 px with tighter gaps and shorter labels; above 700 px render the drawer as a right-hand sheet (`max-width: 420px`). |
| High | Every inner page (`components/ui.tsx` PageHero, `SectionHead`) | Inner H1s are plain sans with no editorial accent, and 19 of them are bare names ("CreativeMax", "Retail & E-commerce"). The display language the homepage establishes stops at the fold of page two. | Give `PageHero` an `accent` prop that routes through `components/motion/Headline.tsx`; move names to the eyebrow and write a job headline per record (rewrites in the Content section). |
| High | Services, Platform, Products, Functions hubs | 4-column card grids at 15–16 px with "Deliverables:" lists and "Learn more →" on every card. Unused CSS is 71–83 % on these routes; visually they read as a different, cheaper site. | Replace the grid with an editorial list: one row per service, 24 px title, one-line deliverable, a single photo or sample artefact per objective group. Cut copy ~40 % (Content §7). Keep the filter pills. |
| High | `app/styles/award.css:438-439` | `content-visibility: auto` with a flat `contain-intrinsic-size: auto 800px` on every band. On the first pass the document height drifts: /en mobile 14,741 → 18,968 px (+4,227), /en/platform mobile +4,668, /en/solutions/content-production desktop −2,814. The scrollbar thumb resizes at every chapter, in-page anchors land short, and any full-page screenshot (including the ones in `docs/redesign/`) captures blank placeholders for the lower bands. | Per-band `contain-intrinsic-block-size` at three breakpoints (values in the Codebase section) and drop the rule from inner-page bands; residual drift falls from 4,767 px to about 220 px at 390 px. |
| High | Hero at 1920 px | The copy column stays ~540 px wide, so the headline breaks "Put AI / into real / business work." and the left half of the viewport is empty below the buttons. | Add a ≥1680 px step: hero grid `minmax(0, 1.1fr) minmax(0, 1fr)`, headline `text-wrap: balance`, cap at 6.4 rem. |
| High | Hero on phones (`cinematic.css:90-96`) | The sample-output card covers the "Illustrative photograph" badge (verified at 390 and 320 px: topmost element under the badge is `.hero-card`). | Below 700 px move the badge to top-left of the photo, or lift the badge above the card in z-order. |
| High | `public/favicon.ico`, `app/[locale]/layout.tsx:41` | The only icon is a 28×28, 16-colour `.ico`: blurry in every HiDPI tab, no `apple-touch-icon` (404), no SVG icon, no manifest. The first pixel of the brand a juror sees. | `app/icon.svg`, `app/apple-icon.png` (180 px), a 32/48 ICO, a manifest with `theme_color`. |
| Medium | `public/og.png`, `lib/seo.ts:25` | One static OG image for ~450 URLs, set in Manrope only (no serif accent) with the right half empty; every article, case and event share card shows the homepage headline. | `app/[locale]/opengraph-image.tsx` with `ImageResponse` per template: title with the serif accent, category, locale. |
| Medium | `components/shell/SiteFooter.tsx:52` | 61 links in eight groups that wrap 5 + 3 at 1440 px with two empty slots; two-line group headings push their lists 14 px lower than neighbours; social links are underlined text. | Four columns × two stacked groups (or four pillars + "More"), `min-height` on headings, icon row for social. |
| Medium | Mega menu (`SiteHeader.tsx`, `shell.css`) | Opens on click only (many desktop users read a non-hovering menu as broken); no scrim or shadow, so the hero's step indicators peek out under a hard edge; the dark featured card sits alone under column 1 with the right 60 % empty. | Hover-intent open (~150 ms) with click fallback; scrim `rgb(7 11 31 / 24%)` plus bottom shadow; featured card in its own column or spanning the last two. |
| Medium | Route change (`app/[locale]/template.tsx`, `award.css:55-56`) | Navigating from a scrolled position shows the new page at opacity 0 while the header slides back from −110 px over 520 ms: two uncoordinated motions, header missing from the first frames of every page. | On navigation set `data-scroll="top"` and a one-frame `no-transition` class on the header before paint. |
| Medium | Dark chapter marquee | At rest the band shows "…erson decides • Exported with its reco…": a phrase cut at both ends, which reads as a bug rather than a scroll-linked element. The hairlines are inset to the container while the type runs full-bleed. | Offset the timeline so a whole phrase is centred at the chapter's entry, or seed the track so the cut lands on the dot separators; run the hairlines full-bleed to match. |
| Medium | Inner-page photo bands (`ui.tsx:69`, `cinematic.css:451`, `award.css:155-174`) | 21:8 strip is a centre crop of a 3:2 master and the `photo-drift` effect scales it 1.12×, so the painted image is 1,434 CSS px from a 1,536 px source (1.87× upscale on 2× screens); heads are cut at the crown (workshop-wall) and the subject sits at the edge (community-event). | Use the scene focus point for `object-position`, add a wide crop and larger masters (Photography section). |
| Medium | Knowledge Hub article template (`components/ArticleView.tsx:112-121`) | An "Archive article — may be out of date" banner renders on every article, including guides published in June 2026, pushing the H1 below the fold and undermining the site's own content. | Gate the banner on `published < relaunch date` (or older than N months), or on fallback-language articles only. |
| Medium | `/about/team` (`about/[slug]/page.tsx:169`) | Leadership page has two text cards, zero images, and the public line "Additional leadership profiles will be added once they are approved for publication." | Remove the note; add portraits or one composed leadership block before launch. |
| Medium | Mobile drawer (`award.css:55-57`, `SiteHeader.tsx:192`) | After a scroll-down/up the drawer opens at 109 px tall and jumps to full screen 520 ms later, because it is positioned inside the transforming header (mid-frame shows two logos and two toggles stacked). | Portal the drawer to `body`, or set `transition: none` on the header while `data-menu-open`. |
| Medium | Resize with drawer open (`shell.css:115-117`) | Drawer stays open past 1280 px with its close button hidden (`.menu-toggle{display:none}` also hides the in-drawer close). Tablet rotation triggers it. | Close on `matchMedia('(min-width:1280px)')` change; scope the hide rule to `.header-actions .menu-toggle`. |
| Medium | zh-Hant hero | The accent becomes a full line of heavy magenta sans, louder than the English italic and without the editorial nuance. On mobile the body breaks inside a word: "由你的團隊決 / 定". | Use 着重號 for the accent (`text-emphasis: filled circle; text-emphasis-position: under left`) or Noto Serif TC; add `word-break: keep-all` plus `<wbr>` after 與/及 on zh headings and lead copy. |
| Medium | Signature stage (`SignatureStage.tsx:122,130`) | Pause resets the step progress bar to zero and resume restarts the 5 s step; SSR renders all four frames and hydration collapses them (539 → 433 px desktop, 1,683 → 615 px mobile). | Key the bar by `active` only and pause with `animation-play-state`; reserve the final height in CSS. |
| Medium | Hover states | Card hover transitions animate `box-shadow` (600 ms repaint) and `.sig-progress` animates `width`; the 1.2 s image zoom on `.door` and `.output-tile` plus the paper tilt all run under `prefers-reduced-motion: reduce`. The cursor bubble's "Read the case" wraps inside its 92 px circle and hides the pointer over the card's text, not just the photo. | Shadows on a pseudo-element with opacity fade; `scaleX` for the bar; one catch-all reduced-motion rule; shorter bubble label ("Read →") and `[data-cursor]` only on the image. |
| Low | Contact form (`ContactForm.tsx:212`) | The "Add more detail (optional)" `<details>` has no affordance: `display:flex` on the summary suppresses the marker and nothing replaces it, so it reads as a bold heading. The prepared-email fallback is a system-monospace `<pre>` block; office cards for SG/CN/UK/UAE show an empty address line. | Reuse the FAQ "+/×" style on `form summary`; style the prepared-email block; collapse the empty row. |
| Low | FAQ accordion | Snaps open with no height animation (`details { transition: all }` does nothing); the "+/×" glyph is ~12 px. | `interpolate-size: allow-keywords` + `::details-content` transition (or the grid-rows technique); 16 px glyph. |
| Low | Video poster (`public/media/explainer/poster.webp`) | The poster is a mid-interaction frame with a baked-in cursor ring on "Approved with edits", under the play button. | Use the title frame (0–1 s). |
| Low | Header utility row | Three sizes of the same control sit on one line (About / AIP login / EN 繁 简); "About" moves between the utility row (1280–1519 px) and the primary bar (≥1520 px), so 1440 and 1920 screens show two different IAs. | One home for About and for the language switch above 1024 px. |
| Low | Scroll cue (`award.css:106`) | 3 × 1.8 s after a 1.8 s delay is 7.2 s of movement, past the 5 s auto-stop convention. | Two iterations. |
| Low | Print | No `@media print` rules: printing an article outputs the sticky header with "Menu" and "Request a Demo", the yellow banner and the dark footer across 8 pages. | A 20-line print sheet hiding header, footer, aside and banner, forcing light backgrounds. |

What already meets the bar: the hero at 1280–1440 px, the Manrope + Instrument Serif pairing, the output-tile chapter, the dark closing sheet into the footer, the mega menu's typography, and the motion restraint (nothing loops, the LCP photo never moves).

## Content and copy

The copy is disciplined, British-English, bilingual-native and free of superlatives, which a jury notices. Four things hold it below the bar: the hero states a category rather than the idea; the honesty policy is voiced as disclaimers (37 "what we are not" statements, 150+ "sample / illustrative" labels across the registries); inner pages abandon the headline craft the homepage sets up; and the Chinese primary CTA contradicts the site's own rule that a request is not a booking.

### Messaging

| Sev | Where | Now | Proposed |
| --- | --- | --- | --- |
| High | `content/home.ts` hero.title | Put AI into *real business work.* | AI prepares the work. *Your people decide.* — the ownable idea is already one line lower in the body and in the best headline on the site ("One workflow. Four moments. People decide.") |
| High | `content/home.ts` hero.body vs `cinema.heroBody` | Two different heroes exist; the older one is only used as the meta description (`app/[locale]/page.tsx:19`) and contradicts the visible page | Make the meta description the new hero body; delete the dead keys (`hero.support`, `sections.*` except faq, `company.brandLine`, `company.identity`) |
| Medium | Chapters 05–07 | Industries, Ecosystem and Resources are catalogue chapters that repeat the thesis without advancing it; "people decide" is stated nine times before chapter 08 | Give each a job in the argument via its headline (below), or fold 06+07 into one "proof we live it" band; say "people decide" in the hero and the signature chapter only |

### Headlines (keep the one-italic-phrase pattern)

| Page | Now | Proposed |
| --- | --- | --- |
| Home 05 | The same products, configured for your sector. | Same four jobs. *Your sector's rules.* |
| Home 06 | Platforms, communities and ventures we build and run. | What we build, *we also run.* |
| Home 07 | Watch, download, read. | Take something *you can use today.* |
| /platform | Connect data, AI tasks and human approvals into workflows you can run. (13 words) | Four layers. *One workflow you can run.* |
| /solutions/\[slug\] | the solution name | its `job` field, e.g. "Every enquiry gets an owner *before it goes cold.*" |
| /products/\[slug\] | the product name | its `descriptor`, e.g. "Drafts you can edit, *approvals you can trace.*" |
| /services/\[slug\] | the service name | its `eyebrow`, e.g. "Found in search *and AI answers.*" |
| /case-studies | Real work, described honestly. | Work we did. *Decisions people made.* |
| /resources | Learn, inspect and download. | Guides, films and worked examples *you can reuse.* |
| /fimmick-ecosystem | What FIMMICK has built — and why it matters to your work. | Built by FIMMICK. *Run by FIMMICK.* |

### Hedging that reads as apology

| Sev | Key | Now | Proposed |
| --- | --- | --- | --- |
| High | `ui.ts` availabilityDiscuss | Configured per engagement — availability confirmed when we scope your workflow | Set up for your workflow. We confirm fit and timing when we scope it together. |
| High | `ui.ts` discussConfiguration | Discuss Configuration | Scope this product |
| High | `cases.ts` legacyPeriod | Not stated in the source record | Omit the row when unknown |
| High | `cases.ts` legacyBasis / legacyLimits | 40 + 30 words about what is missing, on every case | One line: "Anonymised client engagement. Described, not quantified until the client approves figures." |
| Medium | `ui.ts` modeSample, `examples.ts` sampleNotice | "Illustrative example — sample data" appears 7× on the homepage | One page-level notice plus a one-word "Sample" tag on artefacts; delete the separate "Illustrative photographs." caption (`sections.tsx:571`) since `Photo` already labels images |
| Medium | `home.ts` cinema.closing.body | …Sending a request does not book a meeting until we confirm a time with you. | We read every request and reply by email to set up a conversation. A time is fixed once we've both agreed it. |
| High | `cases.ts` outcome (20 cases) | Evaluative ("Better follow-up discipline") | Observable states, e.g. "Every lead now carries a named owner and a next-task date; managers read the pipeline from the record instead of asking agents." |

### Microcopy and consistency

| Sev | Finding | Fix |
| --- | --- | --- |
| High | zh CTA 「預約產品示範」 means *book* a demo (`ui.ts`, `lib/intent.ts`) | 「申請產品示範」 |
| High | "Learn more →" on 20+ cards | Object-specific links: "How it works →", "Meet the agents →", "See the workflows →" |
| High | Button casing: "Request a Demo" / "Discuss configuration" / "Discuss a starting scope" | Sentence case everywhere |
| Medium | zh 「成功案例」 (success stories) while figures are withheld | 「客戶案例」 |
| Medium | zh 「流程示範」 for sample examples collides with 示範 = recorded demo | 「互動示例・資料為虛構」; keep 示例 = sample, 示範 = demo |
| Medium | zh separator is U+30FB (Japanese middle dot) in home.ts, cases.ts, ui.ts, resources.ts | U+00B7 |
| Medium | zh terms: 審閱 182 / 批准 137 / 批核 33 / 審批 3; 紀錄 99 vs 記錄 68 | 審閱 = review, 批准 = approve, 批核 = the gate; retire 審批. 紀錄 noun, 記錄 verb ("記錄與改善" → "紀錄與改善", "匯出記錄" → "匯出紀錄") |
| Medium | Footer tagline "Agentic AI Platform … built in Hong Kong since 2008" (platform work began 2024 per `company.timeline`) | "Agentic AI platform and business solutions. Hong Kong, since 2008." |
| Medium | "Insight brief" (home) vs "Intelligence brief" (examples) for the same artefact; straight vs curly apostrophes across files | Pick one name; typographic apostrophes sitewide |
| Low | Three names for one platform in legal text ("FIMMICK AIP", "Agentic AI Platform", "Fimmick AI Agent Platform") | Flag to the legal owner; do not edit verbatim text |

zh-Hant rewrites for the hero and chapter heads (accent in ＊＊): 「AI 準備工作，＊由你的人決定＊。」、「先看成果，＊再講做法＊。」、「為客戶做過的工作，＊我們自己也在用＊。」、「規劃轉變，＊或直接找專家＊。」、「同樣四項工作，＊按你行業的規矩＊。」、「我們建立的，＊我們也在營運＊。」、「想改善哪項工作？＊告訴我們＊。」. Mechanics are already clean: full-width punctuation, CJK/Latin spacing and Hong Kong register (私隱、電郵、人手) passed a full scan of all 17 registries.

Claims inherited from production that the repo cannot verify and should be confirmed before an award entry: the two leadership bios, timeline years 2012 and 2019, the 50 Add Oil webinar date, the Calendly URL, and the Taiwan phone number format.

## Photography

The set is technically clean but reads as one AI-stock mood board: seven of ten scenes contain the Victoria Harbour skyline, eight have a pale oak desk, eight have a plant, and every person is faceless. The pipeline (1536×1024 masters, AVIF + WebP at five widths, 2.8 MB for 100 files) is good; the masters are the limit. Six scenes need regenerating; four can stay.

| Scene | Used on | Sharpness\* | Verdict | Problem |
| --- | --- | --- | --- | --- |
| review-desk | Home hero (LCP) | 126 | Keep, re-crop | Proof sheets carry smeared pseudo-text visible at hero scale on 2× screens; laptop corner cut; skyline |
| workshop-wall | Transformation, workshop, hub hero | 221 | Keep | Best scene: real depth, legible generic wall text; the 21:8 band crop cuts heads at the crown |
| community-event | Ecosystem chapter and hub hero | 276 | Replace | Busiest frame on the site: 20 heads, tote bags and a tripod compete; subject (the speaker) is a smudge |
| specialist-studio | Content output tile, solution page hero | 66 | Replace | Softest master; upscaled 1.67× on the solution hero at 2× DPR |
| specialist-desk | Services pathway and hub hero | 100 | Replace | Generic "hands on paper" with no service-specific cue; upscaled on the services hero |
| proposal-table | B2B industry, market-intelligence solution | 70 | Replace | Two hands from different people point at the same chart; skyline again; soft |
| retail-counter | Retail industry, retail case, website solution | 75 | Keep | Reads as a real shop; soft but the crop is tight enough |
| hotel-desk | Hospitality industry, hotel case, engagement solution | 170 | Keep | Receptionist out of focus works; bell is the hero object |
| property-gallery | Property industry, real-estate case hero | 122 | Replace | Couple-at-window is the most generic property stock trope; upscaled on the case hero |
| night-table | Closing chapter | 78 | Keep | Deliberately soft; the dark left third carries the type well |

\*Laplacian variance of the master; above ~150 reads crisp on a 2× display, below ~90 reads soft.

### Technical findings

1. **Masters are too small for the full-bleed uses.** The five inner-page hero bands render at 1,280 × 488 CSS px, and the photo-drift effect scales them a further 1.12×, so a 2× display paints about 2,870 px from the 1,536 master: a 1.87× upscale. On a MacBook (the jury's default device) every inner-page hero is soft. Regenerate at ≥ 2,560 px wide, or at 1,536 and upscale once with a proper model before encoding.
2. **No 1280 candidate and no wide crop.** `content/photography.ts:46` and `scripts/build-photography.mjs:27` list 640/1024/1536 only; at 390 px × 3 DPR six images load the 1,536 file where 1,170 px is needed (about 66 KB wasted), and the 21:8 band discards 43 % of each master. Add 1280 and 2560 widths and a `w` (wide) crop keyed to the scene focus point.
3. **Pseudo-text.** Documents in review-desk, proposal-table and workshop-wall carry generated "lorem" glyphs. At card size it passes; at hero size on 2× it is the first AI tell a juror sees. Regenerate with blank or out-of-focus paper, or retouch.
4. **Grade.** Warmth (R−B) ranges from 0.5 (night-table) to 36.9 (retail-counter) and saturation from 30 to 83: the set has no shared grade. Apply one LUT in `build-photography.mjs` (sharp `.modulate`/`.recomb`) so the ten frames sit on one palette next to the magenta and lime accents.
5. **The "Illustrative photograph" pill on every image** is the right policy expressed the wrong way. Keep provenance but move it into a single caption line per chapter and into `alt`/`title`, with one site-wide note in the footer; keep the pill only on the hero and the case cards, where a viewer could mistake the scene for a client.

### Regeneration briefs (same style block as `assets-src/photography/scenes.json`; no faces, no skyline unless stated)

| Scene | Brief | Focus point |
| --- | --- | --- |
| community-event | Small FIMMICK-style meetup, 8–10 people seen from behind, warm room light, one speaker in soft focus at a lectern with a lime-green slide; foreground is one empty chair back and a lanyard, nothing on the table. 3:2 and 21:8 safe. | Speaker, right third |
| specialist-studio | Product shoot from the photographer's shoulder: bottle on a seamless white sweep lit by a softbox, camera back screen in focus showing the bottle, hands only. No window. | Camera screen, left third |
| specialist-desk | Over-the-shoulder of a specialist's monitor showing a blurred dashboard with one magenta highlight, keyboard and a printed brief with a lime sticky note; hands only. | Sticky note, lower centre |
| proposal-table | One person's hands annotating a printed proposal with a pen, magenta highlighter marks, a closed laptop and a cup; no second person, no skyline, window light from the left. | Pen tip, centre |
| property-gallery | Agent's hands on a tablet showing a blurred floor plan, keys and a brochure on a marble ledge, out-of-focus show flat behind; no couple, no window view. | Tablet, left third |
| review-desk (re-shoot) | Same composition as today, but the proof sheets show only product photographs and blank caption areas; laptop fully in frame; skyline replaced by soft bokeh of a window. | Hands and pen, lower right |

Each brief should be generated at 2,560 × 1,707 minimum, first attempt plus two re-rolls, picked for the crispest hands (the current set was one roll each).

## Codebase

`typecheck`, `lint` and the 23 unit tests pass; the production build emits 1,549 static pages; axe reports zero violations on 11 pages at two viewports once animations settle (the only hits were two 24 px tap targets: the footer "Cookies" link and the small ghost "Resources" button on zh pages). The code is strict TypeScript with no `any`, three runtime dependencies and a tidy server-first split. What follows are the defects that survive that bar, verified on the local build unless marked "code reading".

### Critical

| Where | Defect | Fix |
| --- | --- | --- |
| `app/api/enquiries/route.ts:110-116` | `fetch` follows redirects, so a 301/302 from the forwarder replays the POST as a GET, lands on a 200 page and the route returns `accepted`. A mock forwarder answering 302→200 produced "your request has been sent" with nothing delivered. | `redirect: "error"`, treat only 2xx as accepted, assert `https:` in production, add a test with a 302/500/hang mock. |
| `components/forms/ContactForm.tsx:180` | `<form onSubmit noValidate>` has no `method`; a submit with JS disabled or before hydration is a native GET, putting name, email and company in the URL, history, server logs and GTM page\_view. The page's privacy line says the opposite. | `method="post"`, disable the fieldset until hydrated, `<noscript>` mailto fallback, Playwright test with `javaScriptEnabled:false`. |
| `lib/env.ts:11-17`, `app/robots.ts`, `docs/redesign/release-runbook.md:28-30` | Indexability is baked at build time; the runbook builds on preview then promotes. A promoted preview artefact without `SITE_ENV=production` ships noindex + `Disallow: /` to www.fimmick.com. | Rebuild in the production scope (never promote a preview build), or decide indexing per request on the Host header; add a CI assertion on a `SITE_ENV=production` build. |

### High

| Area | Where | Defect | Fix |
| --- | --- | --- | --- |
| Routing | `app/[locale]/layout.tsx:23` and every `[slug]/page.tsx` (`dynamicParams = false`) | The locale 404 (`app/[locale]/not-found.tsx`, with Chinese copy, header and footer) never renders. `/en/nonexistent`, `/zh-hant/platform/nope` and `/zh-hant/knowledge-hub/nope` all return the bare `global-not-found.tsx`: `lang="en"`, English only, no shell, no language switch. Every stale Chinese link lands on an English dead end. | Add `app/[locale]/[...rest]/page.tsx` that calls `notFound()` so the locale tree and its 404 render (or `dynamicParams = true` + `notFound()` on the slug routes). |
| Media | `components/media/ExplainerPlayer.tsx:42-46` | The `onError` on `<video>` catches the MP4 `<source>` failure, so the WebM is never tried. In a browser without H.264 (verified in Chromium without proprietary codecs: `canPlayType` H.264 = "", VP9 = "probably") the player shows "The video could not be played in this browser" although `/media/explainer/*.webm` plays. | In the video handler `if (e.target !== e.currentTarget) return;`, or keep only the handler on the last `<source>`. |
| Robustness | `route.ts:60-63,124` | Idempotency is check-then-set after the `await`; three concurrent POSTs with one key reached the forwarder three times; the key ignores the body, and the client keeps the old key after a timeout (`ContactForm.tsx:80`). | Store the in-flight promise first; bind the key to a body hash; rotate on any field change. |
| Robustness | `route.ts:27-65` | `JSON.parse("null")` → 500; rate limit keyed on spoofable first `x-forwarded-for`; `hits`/`idempotency` maps never evict; no content-type/origin guard; honeypot answers 400 (tells bots). | Type-check the payload; key on `x-vercel-forwarded-for`; sweep on write; require JSON + same-site; fake 200 on honeypot; log `{requestId,status,durationMs}` only. |
| Accessibility | `app/styles/award.css:55` | After scrolling, Shift+Tab into the header focuses About / AIP login / language switch at top −36 px: off-screen (WCAG 2.4.11). The `:focus-within` escape exists only on the −100 % rule. | `html[data-scroll] .site-header:has(.utility-bar :focus-visible){transform:none}`. |
| Accessibility | `base.css:95-99`, `cinematic.css:145`, `award.css:321` | Focus ring is box-shadow only, so it vanishes in forced-colours mode; `.output-tile:hover` replaces the `:focus-within` shadow. | Add `outline: 3px solid transparent` beside each shadow and a `forced-colors` rule. |
| Accessibility | `pages.css:105-113`, `components.css:310`, `diagrams.css:281` | Field borders and the industry-matrix "–" use `--line-strong` at 1.58:1 (needs 3:1). | Use `--subtle` (5.2:1). |
| Accessibility | `ContactForm.tsx:92-96,155-162,164-177,212` | Errors inside a collapsed `<details>` are invisible and focus stays on Submit; success replaces the focused button with a freshly mounted `role=status`; hints and errors sit inside `<label>` so the name reads "Phone (optional) Please check…". | Open the details on error, focus by DOM order, persistent live region, move hints out of the label. |
| Accessibility | `sections.tsx:70,135,351`, `tokens.css:51` | zh-Hans text carries `lang="zh-Hant-HK"` (and the meta label still says 繁中), and the font stack has no Simplified family, so zh-Hans renders with Traditional glyph forms. | `lang` from locale; `:lang(zh-Hans)` stack with PingFang SC / Noto Sans SC / Microsoft YaHei. |
| SEO | `content/legacy/article-index.json`, `ArticleView.tsx:90-123` | About 200 Traditional-Chinese archive articles sit under `/en/` with `lang="en"`, hreflang `en` and a self-canonical: duplicate content with a false language signal. | Detect script in the converter; canonical the `/en` fallback to `/zh-hant` and drop it from the sitemap (or 308). |
| SEO | `content/legacy/*.json` | 34–45 article titles across locales carry a literal `&amp;` (double-escaped), visible in `<h1>`, `<title>`, cards, breadcrumbs, JSON-LD and SERPs (e.g. `/en/knowledge-hub/4-types-of-crm-system`). | Decode entities once in the converter and regenerate. |
| SEO | `services/[slug]/page.tsx:31`, `industries/[slug]`, `solutions/[slug]`, `case-studies/[slug]` | Titles are \`Name | FIMMICK\` and descriptions are the card summary or the problem statement; none names Hong Kong, AI or the service category. | Add `seoTitle`/`seoDescription` per record (50–60 / 120–155 chars; zh 60–80). |
| Performance | `award.css:438-439` | `contain-intrinsic-size: auto 800px` on every band: measured placeholders 1,040 px desktop / 944 px mobile versus real bands of 130–4,119 px. Drift up to +5,338 px (platform, mobile) on the first pass (`auto` remembers sizes afterwards). Content-visibility is worth keeping on the homepage (load main-thread 1.16 → 0.92 s at 4× CPU) and marginal elsewhere. | Per-band `contain-intrinsic-block-size` (mobile / 700–999 / ≥1000): outputs 2600/1700/1300, evidence 2450/1650/1100, night 1100/1000/1000, paths 2300/2500/1350, industries 1400/1150/650, eco 1750/1300/950, resources 1200/1000/550, start 1100/800/600, faq 650/550/350, closing 650/700/700, footer 1550/950/700; remove the rule from inner pages. Tested: drift at 390 px falls 4,767 → 221 px. |
| Performance | `services/page.tsx:13,28`, `contact`, `resources`, `case-studies`, `knowledge-hub` | Reading `searchParams` makes five hubs dynamic: `Cache-Control: private, no-store`, no bfcache, function invocation per request. | Static render; filters in a client island under `<Suspense>`; path-based pagination. |
| Performance | `SiteFooter.tsx:29-79`, `Shell.tsx`, `SiteHeader.tsx` | 98–117 RSC prefetches per page (325–361 KB gz on a full scroll, more than the page itself); the logo prefetches the current route. | `prefetch={false}` on footer, self-link and below-fold cards; hover/focus prefetch wrapper. |
| Performance | `next.config.ts:29-30` | `/media/*` is `immutable` for a year with un-hashed names (`captions-en.vtt`, `poster.webp`, every photo); `/brand/*` and `og.png` have `max-age=0`. | Hash filenames in the build scripts, or `max-age=86400, stale-while-revalidate`. |
| i18n | `lib/hans.ts`, `build-hans-table.mjs:30-37` | zh-Hans is per-character OpenCC only: 電郵 (44×), 搜尋 (41), 存取 (30), 質素 (19), 影片 (15), 預設 (13), 檔案 (13) stay Hong Kong vocabulary on pages tagged zh\_CN; `check-hans` is not wired into `npm test` and there is no CI. | Glossary layer in `hansPhrases`; `test:i18n` in CI; native review of home, platform, services and top-20 articles before launch. |
| i18n | `content/legacy/events.json` | Events have no zh fields: `/zh-hant/events/*` renders the English body under a "並以英文提供" note, even for Cantonese seminars; eight past-event cards still say "Register now". | Import the zh versions or hide events from the zh hubs; strip registration CTAs from past summaries at import. |
| i18n (low) | `lib/i18n.ts:24` | `hreflang="zh-Hant-HK"` is valid BCP-47 but region-qualified: a zh-TW or zh-MO searcher has no exact match while the company lists a Taiwan office. A preference, not a defect. | `zh-Hant`; keep `html lang="zh-Hant-HK"`. |

### Medium (selected)

| Where | Defect | Fix |
| --- | --- | --- |
| `components/JsonLd.tsx:3` | `.replace(/</g, "\u003c")` replaces `<` with `<` (the escape is resolved at compile time): a no-op, so a `</script>` in imported article text would break out of the tag. | `"\\u003c"`, also U+2028/2029. |
| `lib/seo.ts:48-69` | No `WebSite` node or `@id`s; BreadcrumbList missing on articles, hubs, events and `/about/*` although `<Crumbs>` renders everywhere; Article has no `image`; VideoObject points at a `<video>` that only mounts on click. | Generate JSON-LD from `Crumbs`; add `WebSite`; server-render the `<video preload="none">`. |
| `content/legacy/*.json` | 45 titles carry a literal `&amp;` (double-escaped), visible in `<title>`, `<h1>` and SERPs. | Decode entities in the converter. |
| `lib/pages.ts:53-72` | 66 Knowledge Hub category URLs (indexed on production) are missing from the sitemap; `dynamicParams = true` on that route alone. | Add to `publicPages()`; `dynamicParams = false`. |
| `next.config.ts:40-53` | Two-hop chains (`/zh-hk/workforce` → `/zh-hant/workforce` → `/zh-hant/functions`); no rule for prefix-less `/knowledge-hub` and `/events`; retired cases 308 to the hub (soft-404 pattern). | Combined rules first; add prefix-less redirects; 410 for retired slugs. |
| `app/[locale]/layout.tsx:3-12` | All ten stylesheets ship to every route (98.6 KB raw); unused CSS 54 % home, 71–83 % inner. | Import `cinematic.css`, `diagrams.css`, `examples.css` from the routes/components that use them, keeping the award-after-cinematic order the e2e test guards. |
| `app/fonts.ts` (original) | Instrument Serif is preloaded on every route; inner pages fetch 22.6 KB they never render. | `preload: false` for the serif, or preload on the home route only. |
| `components/shell/LanguageSwitch.tsx:32-38` | With a query present, `preventDefault` runs on Ctrl/Cmd-click (no new tab); hash is kept with a query and dropped without one. | Only intercept plain primary clicks; build the full href after mount. |
| `components/shell/SiteHeader.tsx:53-68` | Mega panel stays open after clicking a link to the current page and after Tab leaves the nav; outside-click uses `mousedown` (iPad Safari). | Close on link click and `focusout`; use `pointerdown`. |
| `components/motion/Motion.tsx:49-92` | Cursor bubble: `pointerleave` on `document` is unreliable, pointer-type and reduced-motion are read once, `current` is not reset on route change (bubble glides from the old card). | `mouseleave` on `documentElement`, subscribe to media-query changes, reset on navigation. |
| `IndustryMap.tsx:43`, `BeforeAfter.tsx:24`, `Roadmap.tsx:30`, `EcosystemMap.tsx:53` | `aria-live` on keyed elements that remount: nothing is announced. | One persistent `role="status"` with the selected name. |
| `components/ui.tsx:156-183` (code reading) | `resolveLegacyHref` passes any non-`/` value to `<Link>`, including `javascript:` from the WordPress export. | Allowlist `^(https?:\|mailto:\|tel:\|#\|/)` in `RichText`; render anything else as plain text. |
| `tests/`, `playwright.config.ts:18` | Chromium only; no WebKit/Firefox project, no mobile profile, no axe scan, no API tests beyond two calls, no test for the drawer-resize, language-switch or signature-stage behaviours. | Add WebKit + a mobile project, `@axe-core/playwright`, and route-level vitest cases (`POST(new Request(…))`). |

### Lighthouse 13 (medians of 3, local build, simulated throttling)

| Page | Mobile | Desktop | Mobile LCP | Mobile TBT | Weight |
| --- | --- | --- | --- | --- | --- |
| /en | 94 | 100 | 3.02 s | 58 ms | 350 KB |
| /en/platform | 98 | 100 | 2.21 s | 50 ms | 295 KB |
| /en/services | 95 | 100 | 2.88 s | 53 ms | 312 KB |
| /zh-hant | 91 | 100 | 3.12 s | 176 ms | 354 KB |

Under applied throttling (1.6 Mbps, 150 ms RTT, 4× CPU) the real LCP is 0.9–1.6 s; the zh-Hant page pays 300 ms extra layout when no CJK family in the stack matches an installed font (`tokens.css:51` names "Noto Sans TC", not the "Noto Sans CJK" families most Linux and Android devices ship). CLS is 0 everywhere, the LCP image is discoverable, eager and `fetchpriority=high`, and no video bytes load before intent.

One ops note: the build fetches Manrope and Instrument Serif from Google Fonts at build time, so a sandbox without egress cannot build; self-hosting the two woff2 files (the `@fontsource` packages are the same typefaces) removes that dependency and makes builds reproducible.

## Fix plan

Ordered by effect on the award score per day of work. "Craft break" items are the ones a juror hits without looking for them; they come first regardless of size. Effort is for one engineer or one designer; score effect is my estimate against the rubric in the Verdict.

| # | Change | Kind | Files | Effort | Effect |
| --- | --- | --- | --- | --- | --- |
| 1 | Locale 404: catch-all `[...rest]/page.tsx` calling `notFound()` | Craft break | `app/[locale]/` | 0.25 d | Usability +0.2 |
| 2 | Desktop nav from ~1024 px; drawer as a right-hand sheet above 700 px | Craft break | `shell.css:114-125`, `SiteHeader.tsx` | 1 d | Usability +0.2, Design +0.1 |
| 3 | Per-band intrinsic sizes; drop content-visibility from inner pages | Craft break | `award.css:438-439` | 0.5 d | Usability +0.2 |
| 4 | Utility-row focus escape; outline beside every focus shadow; `--subtle` borders | Craft break | `award.css:55`, `base.css:95`, `pages.css:105`, `diagrams.css:281` | 0.5 d | Usability +0.1 |
| 5 | Drawer out of the transforming header; close on breakpoint change; route-change header coordination | Craft break | `SiteHeader.tsx`, `award.css:55-57`, `shell.css:115`, `template.tsx` | 1 d | Usability +0.1, Creativity +0.1 |
| 6 | Hero badge above the card on phones; marquee rest on a whole phrase; scroll cue ×2; video `onError` guard; poster from the title frame | Craft break | `cinematic.css:90-96`, marquee CSS, `award.css:106`, `ExplainerPlayer.tsx:42`, `poster.webp` | 0.5 d | Design +0.1 |
| 7 | Icons: `icon.svg`, `apple-icon.png`, 32/48 ICO, manifest; entity-decode the 34–45 article titles; gate the archive banner; remove the leadership note | Craft break | `app/`, converter script, `ArticleView.tsx:112`, `about/[slug]/page.tsx:169` | 0.5 d | Design +0.1, Content +0.1 |
| 8 | Enquiry API: `redirect:"error"`, atomic idempotency, payload guard; `method="post"` + hydrated gate on the form | Correctness | `route.ts`, `ContactForm.tsx` | 1 d | Removes a launch risk |
| 9 | Release: build in the production scope; CI assertion on `SITE_ENV=production` output | Correctness | runbook, CI | 0.5 d | Prevents a noindex launch |
| 10 | `PageHero` accent prop + job headlines on the 19 name-only H1s; zh 着重號 accent; `keep-all` on zh headings | Design / Content | `ui.tsx`, `Headline.tsx`, `content/*.ts`, `award.css` | 2 d | Design +0.3, Content +0.2 |
| 11 | New hero line and body (EN/zh), meta description aligned, dead keys removed, zh CTA 申請, sentence-case buttons | Content | `home.ts`, `ui.ts`, `intent.ts`, `page.tsx:19` | 1 d | Content +0.3 |
| 12 | Collapse disclaimers: one page-level sample notice, one case footer line, outcome rewrites for 20 cases | Content | `ui.ts`, `cases.ts`, `sections.tsx:571` | 1.5 d | Content +0.2, Design +0.1 |
| 13 | Footer: four columns × two groups, icon row; mega menu scrim, hover-intent, balanced featured card; contact disclosure affordance | Design | `SiteFooter.tsx`, `SiteHeader.tsx`, `shell.css`, `ContactForm.tsx:212` | 1.5 d | Design +0.2 |
| 14 | Services / platform / products hubs: editorial list layout, 40 % copy cut, object-specific links instead of "Learn more" | Design | `services/page.tsx`, `platform/page.tsx`, `blocks.tsx`, `content/services.ts`, `products.ts` | 3 d | Design +0.4 |
| 15 | Photography pass: regenerate six scenes at ≥2,560 px, one shared grade, 1280/2560 widths and a wide crop, badge policy | Design | `scenes.json`, `build-photography.mjs`, `photography.ts`, `Photo.tsx` | 2 d + generation | Design +0.3, Creativity +0.1 |
| 16 | Per-template OG images with the serif accent; hero at ≥1680 px (wider copy column, balanced wrap) | Design | `app/[locale]/opengraph-image.tsx`, `cinematic.css` | 1.25 d | Design +0.1 |
| 17 | One signature interaction: e.g. the hero sample card is live — hovering a fact chip in the brief highlights the sentence it produced in the caption, and "Approve" stamps the export line; or the four-moment sequence driven by scroll with the real artefacts morphing between steps | Creativity | new component, `SignatureStage.tsx` | 3–5 d | Creativity +0.6 |
| 18 | SEO: Chinese articles out of `/en`, `seoTitle`/`seoDescription` per record, BreadcrumbList from `Crumbs`, JSON-LD escape, category URLs in sitemap, redirect chains, events in zh or hidden | SEO | `lib/seo.ts`, `JsonLd.tsx`, converter, `pages.ts`, `next.config.ts`, `events.json` | 2 d | Protects the launch |
| 19 | Static hubs (filters in a client island), `prefetch={false}` on footer/self links, CSS split by route, serif preload off, 1280 image candidate, `/brand` cache header, print sheet | Performance | `services/page.tsx` + 4 siblings, `SiteFooter.tsx`, `layout.tsx`, `fonts.ts`, `photography.ts`, `base.css` | 2 d | Usability +0.1 |
| 20 | zh-Hans glossary layer, `lang` fix, SC font stack, `test:i18n` in CI, native review | i18n | `hans.ts`, `build-hans-table.mjs`, `sections.tsx`, `tokens.css` | 1 d + review | Content +0.1 for zh-Hans |
| 21 | Tests: WebKit + mobile Playwright projects, axe in e2e, API route tests, 404/drawer/language-switch/stage/video tests | Quality | `playwright.config.ts`, `tests/` | 2 d | Keeps the above from regressing |

Sequence: items 1–9 in the first week (about 5.5 days, each with a regression test), 10–13 in the second, 14–17 as the design sprint, 18–21 alongside. After 1–13 the estimate is about 7.5; after 14–17 it is 7.9–8.1, which is Site-of-the-Day range if the signature interaction lands.

## Self-check log

Five rounds were run; each later round was allowed to overturn the one before it, and four claims were downgraded as a result.

| Round | What was done | Found | Changed the report |
| --- | --- | --- | --- |
| 0 — parity and setup | Vercel deployment list: production = `main@10c886e`. Same commit built locally (Google Fonts egress is blocked from this workspace, so the two typefaces were self-hosted for the build only; nothing committed). | The sandbox cannot reach `*.vercel.app`, so production headers (GTM, cache, redirects) were read from config, not the wire. | Noted as a limit below. |
| 1 — visual review | 20 routes × desktop/mobile folds; viewport-by-viewport scroll frames of the homepage and 12 inner pages; 1280, 1920 and 820 px folds; mega menu and drawer open; zh-Hant desktop and mobile. | Inner-page template gap, marquee rest position, 1920 px hero wrap, photo homogeneity, zh accent weight, mid-word CJK break. Full-page screenshots were found to be unreliable (content-visibility placeholders) and replaced by scroll frames. | Design and Photography sections. |
| 2 — specialist audits | Five parallel reviews: TypeScript/React correctness, accessibility, SEO/i18n, performance (Lighthouse + CDP + A/B of content-visibility), content/copy in EN and zh-Hant. | 60+ findings including the enquiry-API redirect and idempotency bugs, the build-time noindex release risk, Chinese articles under `/en`, prefetch volume, the hero and headline rewrites. | Codebase and Content sections. |
| 3 — verification | Re-tested every predicted issue: axe on 11 pages × 2 viewports after settle (0 violations beyond two 24 px targets), utility-row focus position, badge coverage at 390/320 px, document-height drift on 10 routes, 2× upscaling per image, hans term counts, video fallback in a browser without H.264. | Three transient axe hits were discarded (hero copy mid-exit); the content-visibility drift was confirmed on every route. | Severities set from measurement, not prediction. |
| 4 — adversarial review | A fresh reviewer spot-checked ten claims and hunted for misses in the 404, article, event, about, contact, examples, footer, print, icon and tablet surfaces. | 9 of 10 claims confirmed, one (Lighthouse range) partly; 20 new findings, led by the locale 404 never rendering, the 1024–1279 px nav gap, the broken video fallback, the 28 px favicon and the archive banner on fresh guides. Four of my claims were judged overstated: `zh-Hant-HK` is valid (now a preference), drift is first-pass only (kept High for the jury's first scroll, nuance added), the no-JS GET leak is a one-word fix (kept Critical for the privacy statement it contradicts), and the mobile score is 94–98, not "low-to-mid 90s". | Verdict lowered from 7.0 to 6.8; Design, Codebase and Fix plan rewritten. |

Not checked, and still needed before an entry: real devices (an iPhone and a MacBook at 2×), Safari and Firefox by hand (scroll-driven effects fall back to static there), a screen-reader pass, production headers and GTM on www.fimmick.com, and a native zh-Hans read. The remaining gap to the bar after this report is design judgement, not discovery: the signature interaction (fix plan #17), the inner-page template (#14) and the photography pass (#15) are decisions someone has to make, and each will need one more capture-critique-fix round of its own.
