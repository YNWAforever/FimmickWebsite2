#!/usr/bin/env node
/**
 * Builds delivery files for the editorial photography in assets-src/photography.
 *
 *   RAW_DIR=<folder of generated PNG originals> node scripts/build-photography.mjs
 *
 * - Keeps a WebP master of each original in assets-src/photography/masters (used when RAW_DIR is not
 *   given, so the build is reproducible from the repo).
 * - Applies one shared grade (scenes.json `grade`) to every master before resizing: saturation, a
 *   mild S-curve, and a warmth normalisation that brings the mean R−B to the target ± tolerance.
 * - Writes three crops in AVIF and WebP to public/media/photography, named
 *   <id>-<crop>-<width>.<hash8>.<ext> (l = landscape 3:2, p = portrait 4:5, w = wide 21:8; portrait and
 *   wide are cut around the scene's focus). A width wider than the crop's source is skipped and
 *   logged, never upscaled; dropping larger masters in and re-running fills them in.
 * - Records sizes, the focus point within each crop, file names, the dominant colour (the loading
 *   placeholder) and the measured warmth in content/photography.generated.json, deletes delivered
 *   files the manifest no longer lists, and writes a before/after contact sheet of the grade to
 *   docs/redesign/award-2/photo-grade.webp.
 */
import { createHash } from "node:crypto";
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
const grade = spec.grade;

/** Crop key in the file name, delivered widths, and the aspect ratio (width / height). */
const crops = {
  landscape: { key: "l", widths: [2560, 1536, 1280, 1024, 640] },
  portrait: { key: "p", widths: [1024, 800, 480], ratio: 4 / 5 },
  wide: { key: "w", widths: [2560, 1536], ratio: 21 / 8 },
};

const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
const round = (n, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const hash8 = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

/** Mean red minus mean blue: positive is warm. */
async function warmth(input) {
  const { channels } = await sharp(input).stats();
  return channels[0].mean - channels[2].mean;
}

/** The shared grade. linear() scales R−B by its multiplier, so the warmth shift is solved after it. */
async function applyGrade(input) {
  const saturated = await sharp(input).removeAlpha().modulate({ saturation: grade.saturation }).png().toBuffer();
  const [a, b] = grade.linear;
  const predicted = (await warmth(saturated)) * a;
  const { target, tolerance } = grade.warmth;
  const k = Math.abs(predicted - target) > tolerance ? (target - predicted) / 2 : 0;
  return sharp(saturated).linear([a, a, a], [b + k, b, b - k]).png().toBuffer();
}

/** The crop's region in the master and the scene's focus point within that region (0–1). */
function region(crop, width, height, [fx, fy]) {
  if (crop === "portrait") {
    const w = Math.round(height * crops.portrait.ratio);
    const left = clamp(Math.round(fx * width - w / 2), 0, width - w);
    return { area: { left, top: 0, width: w, height }, focus: [round((fx * width - left) / w), fy] };
  }
  if (crop === "wide") {
    const h = Math.round(width / crops.wide.ratio);
    const top = clamp(Math.round(fy * height - h / 2), 0, height - h);
    return { area: { left: 0, top, width, height: h }, focus: [fx, round((fy * height - top) / h)] };
  }
  return { area: { left: 0, top: 0, width, height }, focus: [fx, fy] };
}

const manifest = {};
const sheet = [];
for (const scene of spec.scenes) {
  const raw = rawDir && path.join(rawDir, `${scene.id}.png`);
  const master = path.join(masters, `${scene.id}.webp`);
  if (raw && fs.existsSync(raw)) await sharp(raw).webp({ quality: 90 }).toFile(master);
  if (!fs.existsSync(master)) {
    console.log(`pending: ${scene.id} (no original yet)`);
    continue;
  }
  const { width, height } = await sharp(master).metadata();
  const graded = await applyGrade(master);
  const [r, g, b] = await sharp(graded).resize(1, 1).raw().toBuffer();
  const entry = { width, height, color: hex({ r, g, b }), focus: {}, files: {}, skipped: [] };

  for (const [crop, { key, widths }] of Object.entries(crops)) {
    const { area, focus } = region(crop, width, height, scene.focus);
    entry.focus[crop] = focus;
    if (crop !== "landscape") entry[crop] = { width: area.width, height: area.height };
    entry.files[crop] = {};
    for (const w of widths) {
      if (w > area.width) {
        entry.skipped.push(`${crop} ${w} (source ${area.width} px)`);
        continue;
      }
      const resized = sharp(graded).extract(area).resize({ width: w });
      const files = {};
      for (const [ext, encode] of [["avif", (s) => s.avif({ quality: 52, effort: 5 })], ["webp", (s) => s.webp({ quality: 74 })]]) {
        const buf = await encode(resized.clone()).toBuffer();
        files[ext] = `${scene.id}-${key}-${w}.${hash8(buf)}.${ext}`;
        fs.writeFileSync(path.join(out, files[ext]), buf);
      }
      entry.files[crop][w] = files;
    }
  }

  entry.grade = { warmthBefore: round(await warmth(master), 1), warmthAfter: round(await warmth(graded), 1) };
  manifest[scene.id] = entry;
  sheet.push({ id: scene.id, master, graded, ...entry.grade });
  console.log(`built: ${scene.id} ${width}×${height} ${entry.color} R−B ${entry.grade.warmthBefore} → ${entry.grade.warmthAfter}${entry.skipped.length ? ` · skipped ${entry.skipped.join(", ")}` : ""}`);
}

fs.writeFileSync(path.join(root, "content/photography.generated.json"), JSON.stringify(manifest, null, 2) + "\n");

// Delivered files the manifest no longer lists (older names or crops) are removed.
const listed = new Set(Object.values(manifest).flatMap((e) => Object.values(e.files).flatMap((byWidth) => Object.values(byWidth).flatMap((f) => [f.avif, f.webp]))));
for (const file of fs.readdirSync(out)) {
  if (!listed.has(file)) fs.unlinkSync(path.join(out, file));
}

// Contact sheet: each master before and after the grade, with the measured warmth.
const thumb = { width: 320, height: 213 };
const gap = 16;
const label = 26;
const rowHeight = label + thumb.height + gap;
const sheetWidth = gap * 3 + thumb.width * 2;
const text = (value, x, y, size = 13) =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" fill="#1c2340">${value}</text>`;
const layers = [
  { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${label + 8}">${text("Before (master)", gap, 24, 14)}${text("After (shared grade)", gap * 2 + thumb.width, 24, 14)}</svg>`), top: 0, left: 0 },
];
for (const [i, s] of sheet.entries()) {
  const top = label + 8 + i * rowHeight;
  layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${label}">${text(`${s.id} · R−B ${s.warmthBefore} → ${s.warmthAfter}`, gap, 18)}</svg>`), top, left: 0 });
  layers.push({ input: await sharp(s.master).resize(thumb).toBuffer(), top: top + label, left: gap });
  layers.push({ input: await sharp(s.graded).resize(thumb).toBuffer(), top: top + label, left: gap * 2 + thumb.width });
}
await sharp({ create: { width: sheetWidth, height: label + 8 + sheet.length * rowHeight, channels: 3, background: "#f4f5f8" } })
  .composite(layers)
  .webp({ quality: 82 })
  .toFile(path.join(root, "docs/redesign/award-2/photo-grade.webp"));
console.log(`contact sheet: docs/redesign/award-2/photo-grade.webp (${sheet.length} scenes)`);
