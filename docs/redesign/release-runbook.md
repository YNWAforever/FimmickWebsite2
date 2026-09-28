# Release runbook and blockers

**Status: review candidate. Not released.** Nothing in this repository has been deployed, and no DNS, domain or production setting has been changed.

## Blockers (must be resolved before cutover)

| # | Missing | Why it matters | Ready now | Action needed |
|---|---|---|---|---|
| B1 | **Production project mapping.** Production is served by Vercel (response headers), but the project, team, Git source and production branch were not inspected. | A GitHub push does not update the domain; cutover needs the right project. | The Next.js 16 app builds, and all routes and redirects are verified locally. | The owner confirms the Vercel project serving `www.fimmick.com`. Either connect it to `YNWAforever/FimmickWebsite2`, or create a new project and move the domain to it. Record the current production deployment ID for rollback. |
| B2 | **Durable enquiry backend.** | Q09 cannot pass: there is no persistence, only optional forwarding. | The API contract, validation, idempotency and honest fallback; forwarding uses production's `/api/contact` field contract. | Decide the destination. Option A: set `ENQUIRY_FORWARD_URL` to the existing production contact endpoint (email notification only). Option B: approve a persistence store (e.g. a database plus an access-controlled inbox). Then test against an authorised test inbox. |
| B3 | **Simplified Chinese core pages.** | Visitors at `/zh-hans/*` (other than the Knowledge Hub) are temporarily redirected (307) to Traditional Chinese. | The archive is preserved; the redirect is temporary by design. | Owner decision: translate the core pages to Simplified Chinese, or make the redirect permanent. |
| B4 | **Approvals for public claims.** | The site deliberately withholds unverified figures. | Qualitative cases; product availability shown as "Discuss". | Confirm (a) product availability per product, (b) ecosystem relationship wording and legal structure, (c) whether any case metrics can be published with scope and dates, (d) additional leadership bios, (e) a vector master logo. |
| B5 | **Legal review.** | The policies are reproduced verbatim; the new enquiry flow and analytics behave as before. | The text is unchanged from production. | The release owner confirms no policy update is needed, particularly on enquiry forwarding and Calendly. |
| B6 | **Production indexing check.** | Review builds are `noindex`. | Code switches on `SITE_ENV=production`. | Set `SITE_ENV=production` and `NEXT_PUBLIC_GTM_ID=GTM-55RBW4F` in production only, then verify there's no `X-Robots-Tag` and that robots allows crawling. |

## Environment variables

| Variable | Review | Production |
|---|---|---|
| `SITE_ENV` | unset → `review` (noindex, robots disallow, no GTM) | `production` |
| `NEXT_PUBLIC_GTM_ID` | unset | `GTM-55RBW4F` |
| `NEXT_PUBLIC_CANONICAL_ORIGIN` | default `https://www.fimmick.com` | same |
| `ENQUIRY_FORWARD_URL` | unset (email handoff) | per B2 |

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
