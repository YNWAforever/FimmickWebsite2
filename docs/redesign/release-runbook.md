# Release runbook and blockers

**Status: ready for cutover on the code side (8 Oct 2026); not released.** No DNS, domain or production setting has been changed. The cutover needs the owner of the Vercel account that serves www.fimmick.com (B1).

## Readiness check (8 Oct 2026, main@fcc2ac6)

| Check | Result |
| --- | --- |
| Production-scope build (`SITE_ENV=production`, `NEXT_PUBLIC_GTM_ID` set) and `scripts/award-2/assert-production-build.mjs` | Pass: robots allows crawling with a sitemap, 1,361 prerendered pages without `noindex`, no `X-Robots-Tag` rule, self-canonicals on /en, /zh-hant and /zh-hans; the GTM container appears once. |
| `scripts/migration/verify-routes.mjs` against that build (every production and reference URL) | 1,268 URLs: 1,015 direct 200, 251 one-hop 308, `/` → `/en` (307, language), `/en/launch-plan` retired (404); 0 redirect chains. |
| Vercel production deployment of `fimmick-website2` | `dpl_6BmTrgDvyjwxtDBj8ujdrQoHBhp1` (fcc2ac6), READY. On Vercel, `/en/workforce/cx` serves `/en/functions/cx` with canonical `https://www.fimmick.com/en/functions/cx`; the review build answers `Disallow: /` and `noindex`, as it should. |
| Environment of `fimmick-website2` | `ENQUIRY_FORWARD_URL` on Production only. `SITE_ENV` and `NEXT_PUBLIC_GTM_ID` are deliberately **not** set yet: set before cutover, they would make the `*.vercel.app` copy indexable beside the live site. They are set at release step 2, before the production build. |
| Current production | www.fimmick.com is served by Vercel (`sin1`; A 216.150.1.129 and 216.150.16.129); `fimmick.com` answers 308 → `https://www.fimmick.com/`. Neither the domain nor its project is in team `ynwaforevers-projects`. |

## Blockers (must be resolved before cutover)

| # | Missing | Why it matters | Ready now | Action needed |
|---|---|---|---|---|
| B1 | **Production project mapping.** Production is served by Vercel from an account outside `ynwaforevers-projects` (checked 8 Oct 2026: `fimmick.com` is not among this team's domains or projects). This repo deploys to `fimmick-website2` in `ynwaforevers-projects` (previews on every push; production deployments from `main` on its own `*.vercel.app` URL). | A GitHub push does not update the domain; cutover needs the right project. | The Next.js 16 app builds, and all routes and redirects are verified locally. | The owner of the production Vercel account chooses one: (a) remove `www.fimmick.com` and `fimmick.com` from the current project and add them to `fimmick-website2` (Vercel asks for a TXT verification record when a domain moves between accounts; DNS already points at Vercel, so the A records stay), or (b) connect the current production project to `YNWAforever/FimmickWebsite2` and copy the environment variables below into it. Either way, record the current production deployment ID first. Rollback for (a) is re-adding the domains to the old project; for (b) it is an instant rollback in that project. Note: merging to `main` will produce a production deployment of `fimmick-website2`, but only on its own URL until the domain is moved. |
| B2 | **Enquiry delivery — partly resolved.** | Enquiries are now forwarded, but only as an email notification through the existing endpoint; this site stores nothing, so Q09's durability criterion still isn't met. | On 28 Sep 2026, at the owner's request, `ENQUIRY_FORWARD_URL=https://www.fimmick.com/api/contact` was set on Vercel project `fimmick-website2` for Production and Preview. The endpoint's contract was confirmed with a deliberately empty request, which returned 400 "Missing required fields: name, company, email". | 1. Send one test enquiry from the preview and confirm it reaches business@fimmick.com. 2. Decide whether a persistence store is also needed. **Note:** on 28 Sep 2026 the variable was removed from Preview, so previews never forward; it remains on Production. To run the end-to-end test from a preview, temporarily re-add it to Preview and redeploy. |
| B3 | **Simplified Chinese review.** | Every page is now served at `/zh-hans/*` (production parity), machine-converted from the Traditional (HK) copy. The script is fully Simplified (checked by `scripts/i18n/check-hans.mjs`, now in CI), and since award pass 2 (8.3) a glossary replaces the twelve most frequent Hong Kong words (電郵 → 邮件, 搜尋 → 搜索, 存取 → 访问, 資訊 → 信息, …); other Hong Kong usage remains (e.g. 倾谈). | Conversion is automatic and regenerated with `npm run i18n:hans` (table and the explainer's Simplified captions); `npm test` fails if either is stale; the archive keeps its native Simplified articles. | **Open (Decision #7, default: glossary only).** A native Simplified reviewer checks the zh-Hans home, platform, services and the top 20 articles. Their corrections go into the glossary in `scripts/i18n/build-hans-table.mjs`, never into generated strings; then `npm run i18n:hans` and `npm run test:i18n` against a build. |
| B4 | **Approvals for public claims.** | The site deliberately withholds unverified figures. | Qualitative cases; product availability shown as "Discuss". | Confirm (a) product availability per product, (b) ecosystem relationship wording and legal structure, (c) whether any case metrics can be published with scope and dates, (d) additional leadership bios, (e) a vector master logo. |
| B5 | **Legal review.** | The policies are reproduced verbatim; the new enquiry flow and analytics behave as before. | The text is unchanged from production. | The release owner confirms no policy update is needed, particularly on enquiry forwarding and Calendly. |
| B6 | **Production indexing check.** | Review builds are `noindex`. | Code switches on `SITE_ENV=production`. | Set `SITE_ENV=production` and `NEXT_PUBLIC_GTM_ID=GTM-55RBW4F` in production only, then verify there's no `X-Robots-Tag` and that robots allows crawling. |

## Environment variables

| Variable | Review | Production |
|---|---|---|
| `SITE_ENV` | unset → `review` (noindex, robots disallow, no GTM) | `production` |
| `NEXT_PUBLIC_GTM_ID` | unset | `GTM-55RBW4F` |
| `NEXT_PUBLIC_CANONICAL_ORIGIN` | default `https://www.fimmick.com` | same |
| `ENQUIRY_FORWARD_URL` | unset on Vercel Preview (removed 28 Sep 2026 so shared previews cannot send real enquiries) and locally/CI → 503 and email handoff | `https://www.fimmick.com/api/contact` (set). Must be `https:` in production (otherwise the endpoint answers 503 and logs a config error). Since award pass 2 the forwarder's redirects are not followed: only a direct 2xx counts as delivered, so the URL must be the endpoint's final address (re-run B2's test enquiry after any change). |

## Release procedure (after separate launch authorisation)

**Indexability is baked in at build time.** `SITE_ENV` decides robots.txt, the robots meta on every prerendered page and the `X-Robots-Tag` header rule when the site is *built*, not when it is served. A preview deployment is built without `SITE_ENV=production`, so **promoting a preview deployment to production is forbidden**: it would ship `noindex` and `Disallow: /` to www.fimmick.com. Production is always a fresh build in the production scope (a production-branch deployment, or `vercel --prod`), with `SITE_ENV=production` set for that scope.

1. Merge the reviewed PR into `main` of `YNWAforever/FimmickWebsite2`, or deploy the reviewed commit directly. CI (`.github/workflows/ci.yml`) must be green: it builds with `SITE_ENV=production` and runs `scripts/award-2/assert-production-build.mjs` on that output.
2. In the production host project, set the environment variables above (production scope) and a build command of `npm ci && npm run build` (Node ≥ 22.13). Record the current production deployment as the rollback target.
3. Check the reviewed commit on its preview URL: `BASE_URL=<preview> node scripts/migration/verify-routes.mjs` and the Playwright suite (`E2E_PORT`/`baseURL` pointed at the preview). The preview is for review only; do not promote it.
4. Deploy the same commit as a **production build** (production branch or `vercel --prod`), then attach `www.fimmick.com`. Locally, the same check is `SITE_ENV=production npx next build && node scripts/award-2/assert-production-build.mjs`.
5. Smoke test immediately:
   - `/`, `/en`, `/zh-hant`, a service, an industry, an article, `/zh-hans/knowledge-hub/<slug>` and `/en/contact` all return 200.
   - Legacy redirects work (`/en/workforce/cx`, `/zh-hk/`).
   - The film plays with captions.
   - One enquiry reaches the authorised test destination.
   - `robots.txt` allows crawling and `sitemap.xml` loads.
   - GTM fires exactly once.
6. Within 24 hours: submit `sitemap.xml` in Search Console, then watch 404s and redirect errors.

## Rollback

Triggers:
- widespread 5xx or 404 on key routes
- the contact journey is unavailable
- a production `noindex`, or wrong canonicals
- a serious rendering regression on mobile
- analytics firing twice

Procedure:
1. In the hosting project, promote the recorded previous deployment. On Vercel this is an instant rollback, and domains and redirects revert with it.
2. Enquiries already accepted by the downstream endpoint are unaffected. Nothing is stored in this application, so no data is lost.
3. Record the reason, then fix it on the branch.
