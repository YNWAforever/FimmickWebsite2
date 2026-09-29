#!/usr/bin/env node
/**
 * Builds delivery files for the editorial photography in assets-src/photography.
 *
 *   RAW_DIR=<folder of generated PNG originals> node scripts/build-photography.mjs
 *
 * - Keeps a WebP master of each original in assets-src/photography/masters
 *   (used when RAW_DIR is not given, so the build is reproducible from the repo).
 * - Writes landscape (3:2) and portrait (4:5, cropped around the scene's focus
 *   point) derivatives in AVIF and WebP to public/media/photography.
 * - Records size and dominant colour (used as the loading placeholder) in
 *   content/photography.generated.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(fs.readFileSync(path.join(root, "assets-src/photography/scenes.json"), "utf8"));
const masters = path.join(root, "assets-src/photography/masters");
const out = path.join(root, "public/media/photography");
fs.mkdirSync(masters, { recursive: true });
fs.mkdirSync(out, { recursive: true });
const rawDir = process.env.RAW_DIR;

const landscapeWidths = [1536, 1024, 640];
const portraitWidths = [800, 480];
const manifest = {};

const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

for (const scene of spec.scenes) {
  const raw = rawDir && path.join(rawDir, `${scene.id}.png`);
  const master = path.join(masters, `${scene.id}.webp`);
  if (raw && fs.existsSync(raw)) await sharp(raw).webp({ quality: 90 }).toFile(master);
  if (!fs.existsSync(master)) {
    console.log(`pending: ${scene.id} (no original yet)`);
    continue;
  }
  const { width, height } = await sharp(master).metadata();
  // Average colour (1×1 resize) as the loading placeholder.
  const [r, g, b] = await sharp(master).resize(1, 1).removeAlpha().raw().toBuffer();
  const dominant = { r, g, b };

  for (const w of landscapeWidths) {
    const base = sharp(master).resize({ width: w });
    await base.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(out, `${scene.id}-${w}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(path.join(out, `${scene.id}-${w}.webp`));
  }

  // Portrait 4:5 crop around the focus point, full height.
  const pw = Math.round((height * 4) / 5);
  const left = Math.max(0, Math.min(width - pw, Math.round(scene.focus[0] * width - pw / 2)));
  for (const w of portraitWidths) {
    const base = sharp(master).extract({ left, top: 0, width: pw, height }).resize({ width: w });
    await base.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(out, `${scene.id}-p-${w}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(path.join(out, `${scene.id}-p-${w}.webp`));
  }

  manifest[scene.id] = { width, height, portrait: { width: pw, height }, color: hex(dominant) };
  console.log(`built: ${scene.id} ${width}×${height} ${hex(dominant)}`);
}

fs.writeFileSync(path.join(root, "content/photography.generated.json"), JSON.stringify(manifest, null, 2) + "\n");
