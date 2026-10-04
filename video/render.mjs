#!/usr/bin/env node
/**
 * Renders the FIMMICK AIP explainer from video/composition.html.
 *
 *   npm run video:render            # both languages
 *   node video/render.mjs en        # one language
 *
 * Each frame is produced by calling window.setTime(t) in headless Chromium
 * (Playwright) and piped to ffmpeg (ffmpeg-static) twice: H.264 MP4 and
 * VP9 WebM. Also writes the poster (WebP) and caption tracks (WebVTT) from
 * content/media.ts so the film, captions and on-page transcript share one script.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "media", "explainer");
fs.mkdirSync(out, { recursive: true });

const FPS = 25;
const DURATION = 42;
const { explainerScenes } = await import(pathToFileURL(path.join(root, "content", "media.ts")).href);

const vttTime = (s) => `00:00:${String(Math.floor(s)).padStart(2, "0")}.${String(Math.round((s % 1) * 1000)).padStart(3, "0")}`;
for (const [file, key] of [["captions-en.vtt", "en"], ["captions-zh-hant.vtt", "zh"]]) {
  const cues = explainerScenes.map((s, i) => `${i + 1}\n${vttTime(s.start)} --> ${vttTime(Math.min(s.end, DURATION) - 0.05)}\n${s.caption[key]}\n`);
  fs.writeFileSync(path.join(out, file), `WEBVTT\n\n${cues.join("\n")}`);
}

function encoder(args, file) {
  const proc = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", ...args, file], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((resolve, reject) => proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code} for ${file}`)))));
  return { stdin: proc.stdin, done };
}

async function write(stream, buffer) {
  if (!stream.write(buffer)) await new Promise((r) => stream.once("drain", r));
}

const langs = process.argv[2] ? [process.argv[2]] : ["en", "zh-hant"];
const browser = await chromium.launch();
try {
  for (const lang of langs) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    await page.goto(`${pathToFileURL(path.join(root, "video", "composition.html")).href}?lang=${lang}`);
    await page.evaluate(() => document.fonts.ready);
    const mp4 = encoder(["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "slow", "-movflags", "+faststart", "-an"], path.join(out, `fimmick-aip-explainer-${lang}.mp4`));
    const webm = encoder(["-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-crf", "38", "-b:v", "0", "-row-mt", "1", "-an"], path.join(out, `fimmick-aip-explainer-${lang}.webm`));
    const total = FPS * DURATION;
    for (let i = 0; i < total; i++) {
      await page.evaluate((t) => window.setTime(t), i / FPS);
      const png = await page.screenshot({ type: "png" });
      await write(mp4.stdin, png);
      await write(webm.stdin, png);
      // Poster: the title card (1 s), not a mid-interaction frame. New names, because /media is
      // served immutable: a changed file under an old name would stay cached for a year.
      if (lang === "en" && i === FPS * 1) {
        await sharp(png).webp({ quality: 82 }).toFile(path.join(out, "poster-title.webp"));
        await sharp(png).resize(640).webp({ quality: 80 }).toFile(path.join(out, "poster-title-640.webp"));
      }
      if (i % (FPS * 5) === 0) process.stdout.write(`${lang}: ${Math.round((i / total) * 100)}%\n`);
    }
    mp4.stdin.end();
    webm.stdin.end();
    await Promise.all([mp4.done, webm.done]);
    await page.close();
    console.log(`${lang}: done`);
  }
} finally {
  await browser.close();
}
for (const f of fs.readdirSync(out)) console.log(f, fs.statSync(path.join(out, f)).size);
