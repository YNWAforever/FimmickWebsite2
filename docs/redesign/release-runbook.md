# Release runbook and blockers

**Status: review candidate. Not released.** Nothing in this repository has been deployed, and no DNS, domain or production setting has been changed.

## Blockers (must be resolved before cutover)

| # | Missing | Why it matters | Ready now | Action needed |
|---|---|---|---|---|
| B1 | **Production project mapping.** Production is served by Vercel (response headers). This repo already deploys to a separate Vercel project, `fimmick-website2` (previews on every push; production deployments from `main` on its own `*.vercel.app` URL). The project that serves `www.fimmick.com` was not inspected. | A GitHub push does not update the domain; cutover needs the right project. | The Next.js 16 app builds, and all routes and redirects are verified locally. | Choose one: (a) move the `www.fimmick.com` domain to the `fimmick-website2` project, or (b) point the existing production project at this repo. Record the current production deployment ID for rollback. Note: merging to `main` will produce a production deployment of `fimmick-website2`, but only on its own URL until the domain is moved. |
| B2 | **Enquiry delivery — partly resolved.** | Enquiries are now forwarded, but only as an email notification through the existing endpoint; this site stores nothing, so Q09's durability criterion still isn't met. | On 28 Sep 2026, at the owner's request, `ENQUIRY_FORWARD_URL=https://www.fimmick.com/api/contact` was set on Vercel project `fimmick-website2` for Production and Preview. The endpoint's contract was confirmed with a deliberately empty request, which returned 400 "Missing required fields: name, company, email". | 1. Send one test enquiry from the preview and confirm it reaches business@fimmick.com. 2. Decide whether a persistence store is also needed. **Note:** while this is set, any enquiry submitted on a preview goes to the real inbox. |
| B3 | **Simplified Chinese review.** | Every page is now served at `/zh-hans/*` (production parity), machine-converted from the Traditional (HK) copy. The script is fully Simplified (checked by `scripts/i18n/check-hans.mjs`), but the vocabulary is Hong Kong usage (e.g. 电邮, 资讯, 倾谈). | Conversion is automatic and regenerated with `npm run i18n:hans`; the archive keeps its native Simplified articles. | A native Simplified reviewer checks the key pages (home, platform, solutions, contact). Where Mainland wording is wanted, add word pairs to `scripts/i18n/build-hans-table.mjs` or author zh-Hans copy for those strings. |
| B4 | **Approvals for public claims.** | The site deliberately withholds unverified figures. | Qualitative cases; product availability shown as "Discuss". | Confirm (a) product availability per product, (b) ecosystem relationship wording and legal structure, (c) whether any case metrics can be published with scope and dates, (d) additional leadership bios, (e) a vector master logo. |
| B5 | **Legal review.** | The policies are reproduced verbatim; the new enquiry flow and analytics behave as before. | The text is unchanged from production. | The release owner confirms no policy update is needed, particularly on enquiry forwarding and Calendly. |
| B6 | **Production indexing check.** | Review builds are `noindex`. | Code switches on `SITE_ENV=production`. | Set `SITE_ENV=production` and `NEXT_PUBLIC_GTM_ID=GTM-55RBW4F` in production only, then verify there's no `X-Robots-Tag` and that robots allows crawling. |

## Environment variables

| Variable | Review | Production |
|---|---|---|
| `SITE_ENV` | unset → `review` (noindex, robots disallow, no GTM) | `production` |
| `NEXT_PUBLIC_GTM_ID` | unset | `GTM-55RBW4F` |
| `NEXT_PUBLIC_CANONICAL_ORIGIN` | default `https://www.fimmick.com` | same |
| `ENQUIRY_FORWARD_URL` | Vercel Preview: `https://www.fimmick.com/api/contact` (set); local/CI: unset → email handoff | `https://www.fimmick.com/api/contact` (set) |

## Release procedure (after separate launch authorisation)

1. Merge the reviewed PR into `main` of `YNWAforever/FimmickWebsite2`, or deploy the reviewed commit directly.
2. In the production host project, set the environment variables above and a build command of `npm ci && npm run build` (Node ≥ 22.13). Record the current production deployment as the rollback target.
3. Deploy to a preview URL first. Run `BASE_URL=<preview> node scripts/migration/verify-routes.mjs` and the Playwright suite (`E2E_PORT`/`baseURL` pointed at the preview).
4. Promote to production and attach `www.fimmick.com`.
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
