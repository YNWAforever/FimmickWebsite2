#!/usr/bin/env node
/**
 * Browser and home-screen icons from the wordmark's lime "I" (app/icon.svg is the source).
 *   app/apple-icon.png  180×180, full-bleed white (iOS applies its own mask)
 *   public/favicon.ico  16, 32 and 48 px layers (PNG-encoded entries), for clients that ask for it
 * Next's file conventions emit the <link> tags for app/icon.svg and app/apple-icon.png.
 *
 *   node scripts/build-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lime = "#8dc63f";
// Same proportions as app/icon.svg (bar 8 × 44 on a 64 grid), without the rounded corners.
const square = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><rect width="64" height="64" fill="#fff"/><rect x="28" y="10" width="8" height="44" fill="${lime}"/></svg>`);

await sharp(square(180)).png().toFile(path.join(root, "app", "apple-icon.png"));

const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(fs.readFileSync(path.join(root, "app", "icon.svg")), { density: (72 * s) / 64 }).resize(s, s).png().toBuffer()));
// ICO container: 6-byte header, one 16-byte directory entry per image, then the PNG payloads.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
fs.writeFileSync(path.join(root, "public", "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));
console.log("app/apple-icon.png, public/favicon.ico (16/32/48)");
