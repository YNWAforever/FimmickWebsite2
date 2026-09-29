# Photography provenance

Every photograph on the redesigned site is an **original generated illustration**. None of them is a record of real people, real FIMMICK staff, client premises or a real product interface. Each one carries a visible "Illustrative photograph / 示意相片" label on the page, or sits in a section whose caption says the photographs are illustrative (case cards, industry cards). Decorative uses (the closing chapter and the workshop thumbnail) have empty alt text.

| | |
|---|---|
| Generation tool | OpenAI Codex CLI 0.145.0, built-in `image_generation` tool. The session model was `gpt-5.5` (the account's default `gpt-6-luna` and `gpt-6-sol` were rejected for this ChatGPT sign-in). |
| Generated | 2026-09-28 18:36–18:59 UTC (2026-09-29 HKT), one 1536×1024 PNG per scene, first attempt each (no re-rolls) |
| Prompts | `assets-src/photography/scenes.json`: shared `style` block plus one `prompt` per scene. The attached brief's own eight scene briefs were not available on disk, so these briefs were written for this redesign. |
| Masters | `assets-src/photography/masters/<id>.webp` (quality 90, 1536×1024), from which all delivery files are rebuilt |
| Delivery | `public/media/photography/<id>-{1536,1024,640}.{avif,webp}` (3:2) and `<id>-p-{800,480}.{avif,webp}` (4:5, cropped around the scene's focus point), built by `node scripts/build-photography.mjs` |
| Total delivered | 2.9 MB for all 100 files. A page downloads only the one size per photograph that it needs, e.g. hero AVIF 1536 w = 48 KB. |
| Rights | Generated for FIMMICK from original prompts. No stock, reference photographs, logos or third-party likenesses were used as input. |

## Scenes

| ID | Used on | Inspection notes |
|---|---|---|
| `review-desk` | Homepage hero | Hands only (no face). Proof sheets carry illegible placeholder text. A generic Hong Kong skyline, not a named building. |
| `workshop-wall` | Transformation pathway; AI Transformation hub; Workshop page; workshop resource thumbnail | Three people, seen from behind. Wall column headings read "Discover / Define / Develop / Deliver": generic words, no claim. |
| `specialist-studio` | Content output panel (portrait crop); Content & Creative Production solution | Hands and arm only. The camera screen shows the bottle. The monitor is dark. |
| `specialist-desk` | Services pathway; Services hub | Hands only. The background monitor is blurred with no legible interface. |
| `property-gallery` | Property industry card and page; real-estate case | A couple seen from behind; no faces. Harbour view is generic. |
| `retail-counter` | Retail industry card and page; retail case; Website operations solution | Shop owner shown from the neck down. The packing slip is illegible. The phone lies face down. |
| `hotel-desk` | Hospitality industry card and page; hotel case; Customer engagement solution | Receptionist out of focus and turned away. The feedback card is illegible handwriting. |
| `proposal-table` | B2B & professional services industry card and page; Market intelligence solution | Hands only. The whiteboard reads "Sales Pipeline — Awareness, Engage, Proposal, Close" (generic, legible). Charts carry no real data. |
| `community-event` | Ecosystem chapter; Ecosystem hub | About 20 audience members seen from behind; the speaker is small and out of focus. No brand marks on the tote bags. |
| `night-table` | Closing chapter (decorative) | No people. The left third is dark, leaving space for text. |

### Original file hashes (SHA-256 of the PNG returned by the tool)

```text
review-desk        70cfa5f54eeeb144ebc08914aeaecc8c2ffa06d8e34f605a21cf7e4fdddd6dc6
workshop-wall      6b2f5baaa20ff9b71e56b1973c9f89a79eb4b592f3e160b34325e350abc67474
specialist-studio  0a498ce6c53bfac157faa0a9d840822f9ed2c9f0a1b2232b1be0600f43d78ee6
property-gallery   b8fc6ef582418e5d092d9128b751672f1e11ed0b50cd5a111536264efcb493eb
retail-counter     009d5e2b4c00df7a80dcf6ee7512504c70f82b055d59ffb619b5d4a6744662e7
hotel-desk         d13236337d0ec9968d1c20785a954117549b9d78f776039cf6b274ed626bd967
proposal-table     4a2965d51a7275e68919aba997c91a2c26a49ae1e5267d86cc6a6db8d643ad64
community-event    b2e55b2fef5733d6548d3951108886d8fb48090e38205bfdde3c0ce06e287daf
night-table        7b60d1f37ff0b8b1bc75cdc11742b012b0b5968fe4f401d265605522c14dfeb3
specialist-desk    10e30a0a6b5b5b1856697db8708d6b63b99d86350156bf067a067360b77c2243
```

## Evidence that is **not** generated

- **Output artefacts on the homepage** (insight brief, captions, enquiry, record diff, and the four signature frames) are HTML rendered from the same sample data as the working examples (`content/examples.ts`). Each is labelled "Sample output" or "Illustrative example — sample data".
- **Guide previews** (`public/media/guides/*.webp`) are the first page of the real PDFs. `PREVIEWS_ONLY=1 node scripts/build-guides.mjs` renders them from the same HTML source.
- **Explainer film** is unchanged (`public/media/explainer/*`).
- **Pending:** there are still no real FIMMICK AIP product screenshots. When approved captures exist, they should replace the sample artefacts in the output tiles and be labelled with their capture date.
