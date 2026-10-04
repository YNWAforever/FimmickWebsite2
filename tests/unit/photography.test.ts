import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import scenes from "@/assets-src/photography/scenes.json";
import built from "@/content/photography.generated.json";

/** Award pass 2, Phase 6: the photography pipeline's output matches its spec. */
const dir = path.join(process.cwd(), "public", "media", "photography");
const widths = { landscape: [2560, 1536, 1280, 1024, 640], portrait: [1024, 800, 480], wide: [2560, 1536] } as const;
type Crop = keyof typeof widths;
type Entry = {
  width: number;
  height: number;
  portrait: { width: number; height: number };
  wide: { width: number; height: number };
  files: Record<Crop, Record<string, { avif: string; webp: string }>>;
  grade: { warmthBefore: number; warmthAfter: number };
};
const manifest = built as unknown as Record<string, Entry>;
const sourceWidth = (e: Entry, crop: Crop) => (crop === "landscape" ? e.width : e[crop].width);

describe("photography pipeline (6)", () => {
  it("records the shared grade in scenes.json", () => {
    expect((scenes as { grade?: unknown }).grade).toMatchObject({ saturation: 0.92, linear: [1.06, -6], warmth: { target: 12, tolerance: 4 } });
  });

  for (const scene of scenes.scenes) {
    it(`${scene.id}: every width/crop pair the master allows, hashed, never upscaled, graded warmth 12 ± 4`, async () => {
      const e = manifest[scene.id];
      expect(e, "manifest entry").toBeDefined();
      for (const crop of Object.keys(widths) as Crop[]) {
        for (const w of widths[crop]) {
          const file = e.files[crop]?.[String(w)];
          if (w > sourceWidth(e, crop)) {
            expect(file, `${crop} ${w} should be skipped`).toBeUndefined();
            continue;
          }
          expect(file, `${crop} ${w}`).toBeDefined();
          for (const name of [file.avif, file.webp]) {
            expect(name).toMatch(new RegExp(`^${scene.id}-${crop[0]}-${w}\.[0-9a-f]{8}\.(avif|webp)$`));
            const bytes = fs.readFileSync(path.join(dir, name));
            expect(name.split(".")[1]).toBe(createHash("sha256").update(bytes).digest("hex").slice(0, 8));
            const meta = await sharp(bytes).metadata();
            expect(meta.width).toBe(w);
            expect(meta.width).toBeLessThanOrEqual(e.width);
          }
        }
      }
      expect(Math.abs(e.grade.warmthAfter - 12)).toBeLessThanOrEqual(4);
    });
  }

  it("delivers no file the manifest does not list", () => {
    const listed = new Set(Object.values(manifest).flatMap((e) => Object.values(e.files).flatMap((byWidth) => Object.values(byWidth).flatMap((f) => [f.avif, f.webp]))));
    expect(fs.readdirSync(dir).filter((f) => !listed.has(f))).toEqual([]);
  });
});
