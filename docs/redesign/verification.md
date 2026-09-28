# Verification register

Environment: Windows 11, Node 24.18, Next.js 16.3.6 production build (`next build && next start -p 3100`), review mode (SITE_ENV unset), Chromium via Playwright 1.63, Lighthouse 13.5 (mobile emulation, simulated throttling). Date: 28 Sep 2026.

Results use **Pass / Fail / Blocked / Not run**. Automated evidence: `npm test` (17 unit tests), `npm run test:e2e` (20 browser tests, all passing), `scripts/migration/verify-routes.mjs` (1,268 URLs), Lighthouse JSON (not committed; figures below).

## Acceptance gates

| ID | Result | Evidence |
|---|---|---|
| Q01 Repository identity | Pass | Remote `YNWAforever/FimmickWebsite2`; baseline `main@f4a8901`; all work on `feat/fimmick-agentic-platform-redesign`. Reference repos only cloned read-only to a scratch folder. No `.openai/hosting.json` or Sites ID in the tree. |
| Q02 Full page scope | Pass (with noted gaps) | 1,203 prerendered HTML pages: every pillar hub and detail in EN and zh-HK, 357 archived articles in EN/zh-HK and 319 in zh-Hans, 24 events and 22 archive categories. **Gaps:** Simplified Chinese core pages are not translated (see blockers); legacy articles and events are shown in their original language. |
| Q03 Buyer clarity | Pass (formative) | Hero states the offer and has two actions; four job cards each show a deliverable, products and a distinct destination. This is a design review, not external buyer testing. |
| Q04 Navigation | Pass | e2e: desktop menu opens with the keyboard, Escape closes it and returns focus; the mobile drawer lists all 8 pillars, traps focus and closes on Escape. The primary CTA resolves to `/contact?intent=demo`. |
| Q05 Locale continuity | Pass | e2e: switching EN→繁 keeps `/contact?intent=service&service=seo-aeo` and the context chip is localised. `html lang` is correct on every checked route. Personal fields are never in the URL. |
| Q06 Direct URLs | Pass | e2e: 10 legacy redirects, each to a 200 with no chain; 404s for unknown slugs, `/fr` and `/en/launch-plan`. Route verifier: 1,268/1,268 old URLs resolve (1,135 live, 132 redirect to a 200, `/en/launch-plan` intentionally 404). |
| Q07 Examples | Pass | e2e: export is disabled until review; the export filename and "ILLUSTRATIVE SAMPLE" header are checked; editing invalidates review; changing scenario resets state; reset restores; the human-only enquiry has no draft; an invalid record is held. |
| Q08 Truthfulness | Pass | Every example carries a sample notice and footnote ("nothing is sent, published, synced"). The film is labelled "Product demonstration · illustrative sample data". Cases carry a publication basis and limitations, with no unsupported figures (unit test). Product availability is "Discuss". |
| Q09 Enquiry success/failure | Blocked (durable backend) | API validates (422), bounds input, rejects the honeypot, rate-limits and caches idempotency. Without `ENQUIRY_FORWARD_URL` it returns 503 and the UI shows the email handoff, never a false success (e2e). Forwarding to the production `/api/contact` endpoint is configured on Vercel (Production + Preview, 28 Sep 2026). An empty request confirmed its field contract (400 "Missing required fields: name, company, email"). An end-to-end delivery test has **not** been run, because it would email the real inbox. Durable storage does not exist. |
| Q10 Data boundaries | Pass | No secrets in the repo. Personal data is not put in URLs, analytics (`track()` drops values containing "@" or >80 chars) or storage. The mailto handoff is local and opens only on the visitor's click. |
| Q11 Media | Pass | Actual 42 s films (EN and zh-HK; MP4 H.264 and WebM VP9, 0.48–0.57 MB), a 37 KB poster, EN/zh VTT captions and an on-page transcript. e2e: no video request before play, and the captions track defaults to the page language. No audio track. |
| Q12 Responsive layout | Pass | e2e: no horizontal overflow at 360/390/768/1024/1440 on 8 templates (a phone-width grid overflow was found and fixed). Screenshots: `docs/redesign/screenshots/`. |
| Q13 Accessibility | Pass (automated + partial manual) | Lighthouse a11y 100 on home, contact and zh-HK home, and 97→fixed on platform (the last contrast issue was fixed after the run). Manual: keyboard menus, drawer focus trap, tablist arrow keys, form error focus. **Not run:** screen-reader pass, 200% zoom review on every template. |
| Q14 Reduced motion | Pass | e2e: with `reduce`, all `.reveal` content has opacity 1. The hero animation and menu transitions are gated by the media query; the film is click-to-play. |
| Q15 SEO migration | Pass (review build) | Canonicals point to `https://www.fimmick.com/...` with hreflang alternates (EN, zh-Hant-HK, zh-Hans where present, x-default); the sitemap has 1,203 canonical entries with real dates. The review build sends `X-Robots-Tag: noindex` and robots `Disallow: /` (Lighthouse SEO 69 is solely `is-crawlable`). Production indexing is **not run** (requires SITE_ENV=production on the release host). |
| Q16 Legacy continuity | Pass | All production sitemap URLs verified (above). AIP login `aip.fimmick.com`, Calendly, the ecosystem external links and GTM `GTM-55RBW4F` (production only) are retained. |
| Q17 Runtime | Pass | `next build`, `eslint .` and `tsc --noEmit` are clean; e2e checks 7 key pages for console errors (none) and fixes hydration warnings. |
| Q18 Production boundary | Blocked | The Vercel project and domain mapping were not inspected. The release runbook lists the exact steps and rollback. |
| Q19 Architecture completeness | Pass | 8 pillars in the header, drawer and footer, each with a hub and homepage entry (sections 2, 4, 5, 6, 7, 8, 9); unit test counts the pillars. |
| Q20 Transformation & services | Pass | 4 deep dives with sample artifacts; 15 services (14 detail pages, plus `/services/ai-transformation` → 308 to the hub by design); a working objective filter; service-specific enquiry context. |
| Q21 Industry-to-case journey | Pass | 8 industry pages each link products, services and a case (or say "no published case"); the homepage/hub selector changes the journey and CTA context; case filters are URL-driven with counts. |
| Q22 Resource usability | Pass | Format/topic filters, search, reset and pagination are all in the URL (Back/Forward work); only populated formats are shown; guide PDFs exist (2 pages each, EN + 繁); events are shown as past; the workshop is "on request, not a booking". |
| Q23 Ecosystem depth | Pass | 6 member pages with role, relationship (production wording), audience, offers, activity and verified external link (none for KOCmax), plus a boundary statement on audience/data access. |
| Q24 Cross-pillar continuity | Pass | Every CTA carries only known IDs (solution, product, service, industry, workstream, case, member, example, resource); unknown values are dropped (unit + e2e); context survives a locale switch. |

## Performance (Lighthouse mobile, median of 3, local production build)

| Template | Perf | A11y | BP | SEO* | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home `/en` | 94 | 95→100 | 100 | 69 | 2.68 s | 0.000 | 70 ms |
| Platform | 95 | 97 | 100 | 69 | 2.82 s | 0.000 | 69 ms |
| Product (CreativeMax) | 96 | 97 | 100 | 69 | 2.61 s | 0.000 | 50 ms |
| Industry (Property) | 96 | 96 | 100 | 69 | 2.62 s | 0.000 | 82 ms |
| Contact | 97 | 97→100 | 100 | 69 | 2.58 s | 0.000 | 63 ms |

\*SEO is capped by the intentional review-build `noindex`. The A11y "→" values are single confirming runs after the contrast and list fixes. Lab LCP (simulated slow 4G) sits slightly above the 2.5 s field target; the LCP element is the hero text, and there are no hero images. Field data is not available pre-launch.

## Eight-pillar coverage matrix

| Pillar | Hub (EN / 繁) | Detail pages | Content source | Journey | Evidence |
|---|---|---|---|---|---|
| Platform & Solutions | `/platform`, `/solutions`, `/products` | 4 solutions, 6 products, integrations, governance, `/cases-and-demos` | `content/solutions.ts`, `products.ts`, `platform.ts`, `examples.ts` | Product buyer | e2e examples, key pages |
| AI Transformation | `/ai-transformation` | 4 deep dives | `content/transformation.ts` | Leader | key pages, overflow |
| Services | `/services` (objective filter) | 14 detail pages + hub redirect | `content/services.ts` | Specialist buyer | key pages, redirects |
| Industries | `/industries` (selector + matrix) | 8 | `content/industries.ts` | Sector buyer | key pages, overflow |
| Case Studies | `/case-studies` (filters) | 21 | `content/cases.ts` | All | key pages |
| Resources | `/resources`, guides, videos, knowledge hub, events, workshop | 357 articles, 24 events, 22 categories | `content/legacy/*`, `content/resources.ts`, `content/media.ts` | Learner | resources unit, media e2e, route verifier |
| Ecosystem | `/fimmick-ecosystem` (map) | 6 | `content/ecosystem.ts` | Partner | key pages |
| About | `/about` | story, how we work, why FIMMICK, team | `content/company.ts` | All | key pages |

## Interaction truth matrix

| Interaction | Kind | What really happens |
|---|---|---|
| Four examples (intelligence, content, follow-up, website ops) | Simulation | Local state only; fixed sample data; export creates a local `.txt` labelled as a sample. |
| Explainer film | Recorded demonstration of the sample UI | Static media file; no live AI run. |
| Enquiry form "Send request" | Website → server API | Validated. Forwarded **only if** `ENQUIRY_FORWARD_URL` is set; otherwise 503 → email handoff. |
| "Prepare email → Open email app" | Website → visitor's mail client | Nothing is sent until the visitor presses Send in their own app. |
| Calendly link | External, preserved | Scheduling happens and is confirmed on calendly.com. |
| AIP login | External, preserved | Links to `aip.fimmick.com`. |
| GTM analytics | Preserved integration | Loads only when `SITE_ENV=production` and `NEXT_PUBLIC_GTM_ID` is set; consent defaults match production. |
| Guide downloads | Static files | PDFs in `public/downloads`. |
