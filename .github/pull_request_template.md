**Defaults used:** <!-- the Decisions for Willy defaulted in this PR, or "none" -->

<!-- What changed and why, item by item, with the before → after numbers. -->

### Quality gates (every PR)

`node scripts/award-2/quality-gate.mjs` runs most of these locally and writes the table in `docs/redesign/award-2/README.md`.

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test` (vitest, then the hans table and caption check)
- [ ] `npx playwright test`, all projects (Chromium runs every spec; Firefox, WebKit, iPhone 14 and iPad landscape the smoke set)
- [ ] axe: zero violations (`tests/e2e/axe.spec.ts`, two viewports, plus the reduced-motion pass), and on every page this PR touches
- [ ] the `award.css` cascade test (`site.spec.ts`, "award styles win the cascade")
- [ ] hans table current (`node scripts/i18n/build-hans-table.mjs --check`, part of `npm test`)
- [ ] production-build assertion (`scripts/award-2/assert-production-build.mjs`, in CI)
- [ ] Lighthouse mobile `/en` within 2 points of the baseline (CI "Lighthouse gate"; locally an interleaved A/B against `main`)
- [ ] every new regression test was run red against the unfixed code first; the failing run is linked
- [ ] before/after evidence linked (`docs/redesign/award-2/before/…`, `after/…`)
- [ ] a row added to `docs/redesign/award-2/README.md`
- [ ] no new runtime dependency (only `next`, `react`, `react-dom`)
- [ ] `app/fonts.ts` is the committed version (self-hosted, `next/font/local`)
- [ ] `content/legal.ts` untouched; zh-Hans regenerated with `npm run i18n:hans`, never hand-written
