# FimmickWebsite2 — Award Pass 2 handoff bundle

Prepared 4 Oct 2026 for the Claude Opus 5.5 implementation session. Everything the agent needs to execute the 21-item fix plan is in this folder; nothing here depends on the chat it came from.

## What is in the bundle

| File / folder | What it is | Who reads it |
| --- | --- | --- |
| `00-README.md` | This file: how the bundle fits together and how to start the session | Willy, then the agent |
| `01-PROMPT.md` | The kick-off prompt to paste into Opus 5.5, plus the short "continue" prompts for each later phase and for review rounds | Willy pastes; the agent follows |
| `02-FimmickWebsite2-Award-Level-Audit.md` | The audit of `main@10c886e`: verdict (6.8/10), findings by area with file:line references, photography briefs, the 21-item fix plan, self-check log | The agent, for the *why* and the evidence numbers |
| `03-FimmickWebsite2-Fix-Plan-Implementation-Brief.md` | The execution spec: ground rules, Phase 0–9 with per-item change + acceptance test, PR sequence, decisions for Willy | The agent, for the *what* and *in which order* |
| `04-EVIDENCE.md` | Index of every screenshot: which finding it shows, which fix-plan item it belongs to, what the "after" must look like | The agent, before each item |
| `delivery-sequence.png` | The nine-PR roadmap with its three gates (also embedded in the brief) | Both |
| `evidence/` | 62 screenshots from the audit's local build of `main@10c886e`, grouped by phase | The agent, as the "before" reference |

## How to start the session

1. Give Opus 5.5 access to a clone of `YNWAforever/FimmickWebsite2` (any commit at or after `10c886e`) and to this folder (attach it, or copy it to `docs/redesign/award-2/handoff/` inside the clone so it travels with the repo).
2. Paste the kick-off prompt from `01-PROMPT.md` as the first message.
3. The agent will run Phase 0 (baseline, no PR) and then open one PR per phase from `feat/award-pass-2-<phase>` branches. Review each PR on its Vercel preview; the gates in `delivery-sequence.png` are the points where your review unblocks the next row.
4. Answer the ten decisions in the brief's last section as early as you can; the agent uses the listed default for any you leave open.

## Rules the bundle encodes (short form)

The agent must keep the repo's design constraints (`docs/redesign/design-decisions.md`): three runtime dependencies, CSS-only motion with no loops or scroll-jacking, a static LCP photograph, the `award.css`-after-`cinematic.css` cascade, the honesty policy (no case figures, products "configured per engagement", photographs labelled as generated), verbatim legal text, and EN + zh-Hant authoring with generated zh-Hans. Every fix lands with a regression test that was run red first, and every PR carries before/after evidence against the screenshots in `evidence/`.

## What this bundle does not contain

- New photography masters. The six regeneration briefs are in the audit's Photography section; generating them is a decision for Willy (brief, Decisions #5). The pipeline work in Phase 6 lands either way.
- Portraits for the leadership page (Decisions #4).
- The original Chinese event export (Decisions #6).
- Production-only checks: real devices, Safari/Firefox by hand, GTM and headers on www.fimmick.com. The brief lists them as still open after Phase 9.

## Regenerating the evidence

All screenshots were taken with Playwright against `next start -p 3100` of the local production build at 1440×900, 1200×800, 820×1180 and 390×844, as viewport-by-viewport frames (full-page capture is unreliable on this site because `content-visibility: auto` leaves lower bands as placeholders). Phase 0 of the brief rebuilds the same set into `docs/redesign/award-2/before/` so the agent's own "before" matches these.
