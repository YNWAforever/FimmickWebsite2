# Prompts for the Opus 5.5 implementation session

Paste the **kick-off prompt** as the first message of a fresh session that has the repo and this bundle available. The **continue prompts** below it are for later turns: one per phase, one for a review round, one for a stuck item. Keep them short; the brief carries the detail.

---

## Kick-off prompt

```
You are the implementation engineer for FimmickWebsite2 (repo YNWAforever/FimmickWebsite2, Next.js 16 / React 19 / TypeScript / plain CSS). Your job is to execute the fix plan that takes the site from its audited 6.8/10 to Awwwards Site-of-the-Day range, exactly as specified in the attached handoff bundle.

Read, in this order, before touching code:
1. 00-README.md — what is in the bundle.
2. 03-FimmickWebsite2-Fix-Plan-Implementation-Brief.md — the execution spec. Its "How to run this plan" and "Ground rules" sections are binding.
3. 02-FimmickWebsite2-Award-Level-Audit.md — the findings behind every item, with file:line references and the measured numbers you must beat.
4. 04-EVIDENCE.md and the evidence/ folder — the "before" screenshots; every PR must show the matching "after".
5. docs/redesign/design-decisions.md in the repo — the constraints the brief's ground rules come from.

Working method (non-negotiable):
- Phases in order: 0 (baseline, no PR), then 1 → 9, one PR per phase from a feat/award-pass-2-<phase> branch. Never push to main.
- For every item: reproduce the finding on the local production build first (capture a screenshot or a number into docs/redesign/award-2/before/), write the regression test and run it red, make the change, run the test green, re-capture into after/, and quote both in the PR description.
- Definition of done per PR: typecheck, lint, vitest, Playwright (all projects), axe zero violations on /en, /zh-hant, /zh-hans and every touched page at 1440×900 and 390×844 after a full scroll, the award.css cascade test green, Lighthouse mobile on /en within 2 points of the Phase 0 baseline, a row added to docs/redesign/award-2/README.md.
- Keep the ground rules: runtime deps stay next/react/react-dom; motion is CSS, nothing loops or scroll-jacks, everything respects prefers-reduced-motion; the hero photo never animates; award.css is imported only by app/[locale]/layout.tsx after cinematic.css; overflow: clip (never hidden) around view() timelines; honesty policy facts unchanged (no case figures, "configured per engagement", photos labelled as generated); content/legal.ts untouched; EN + zh-Hant authored together, zh-Hans regenerated with npm run i18n:hans, never hand-written.
- Copy: use the rewrites in the audit's Content section verbatim. Do not invent new claims, figures, product names or legal wording.
- Stop and ask (in the PR, with options) only when: an item needs copy the audit does not supply; a design item has two viable layouts and the brief states no preference; a change would alter a figure, claim, product name, legal text or the honesty-policy wording; or a test cannot pass without being loosened. For everything else, implement as written and note any deviation with its reason.
- Decisions for Willy (brief, last section): use the stated default unless he has answered; list which defaults you used at the top of each PR.

Environment notes: the build fetches Manrope and Instrument Serif from Google Fonts; if your sandbox has no egress, install @fontsource-variable/manrope and @fontsource/instrument-serif with --no-save and point a local, uncommitted copy of app/fonts.ts at them via next/font/local, restoring the committed file before every commit (Phase 8 makes self-hosting permanent). Playwright's bundled Chromium has no H.264, which is what Phase 1 item 1.6 needs to reproduce the video bug. The repo's scripts expect a server on port 3100.

Start now with Phase 0. Report back with: the baseline table (Lighthouse medians, scrollHeight drift per page, axe counts, CSS bytes per route, prefetch bytes), any pre-existing test failure, and the list of Phase 1 items in the order you will take them. Then proceed to Phase 1 without waiting unless something in Phase 0 contradicts the brief.
```

---

## Continue prompts

**Next phase**

```
Phase <N> is merged. Proceed with Phase <N+1> per the brief: same method (reproduce → red test → change → green test → before/after evidence → PR). Open the PR from feat/award-pass-2-<phase>. List the Willy decisions you are defaulting at the top of the PR description.
```

**After the Gate 1 / Gate 2 / Gate 3 review**

```
Gate <k> review notes are below. Apply them as follow-up commits on the open PR (or a feat/award-pass-2-<phase>-review branch if the PR is merged), each with its own test and after-screenshot, then re-run the full quality gate and post the updated metrics table.

<notes>
```

**Self-review round (use after Phases 5, 7 and the photography rebuild)**

```
Before opening the PR, run one capture-critique-fix round on the preview exactly as the audit did: viewport-by-viewport frames at 1440, 1200, 820 and 390 of every page you touched; compare each against evidence/ and against the audit's Design table; list anything that still reads as unfinished, misaligned or inconsistent (spacing, radius, shadow, type size, link labels, label repetition); fix what you can inside the phase's scope; record the rest as Low findings in docs/redesign/award-2/README.md. Then open the PR.
```

**Stuck item**

```
You are stuck on <item>. Do not loosen the test or skip the item. Post: what you tried, the exact error or measurement, the two options you see with their trade-offs against the ground rules, and your recommendation. Continue with the next item in the phase while you wait.
```

**Decision answers**

```
Decisions: #1 <answer>, #2 <answer>, #3 <answer>, #4 <answer>, #5 <answer>, #6 <answer>, #7 <answer>, #8 <answer>, #9 <answer>, #10 <answer>. Apply them from the current phase onwards; where a merged PR used a different default, open a small follow-up PR.
```

**Photography masters delivered (Phase 6)**

```
New masters are in assets-src/photography/incoming/ (PNG, ≥2560 px). Run the Phase 6 pipeline: move them to masters/ with the scene ids, rebuild all widths and crops with the shared grade, update scenes.json prompts and the provenance table under docs/redesign/award-2/, re-capture the home, services, solution, case and ecosystem pages at 1440 DPR 2, and confirm the hero currentSrc width ≥ 2× rendered width on /en/services.
```
