#!/usr/bin/env node
/** Renders public/og.png (1200×630) for the new positioning. `node scripts/build-og.mjs` */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = `data:image/png;base64,${fs.readFileSync(path.join(root, "public", "brand", "fimmick-logo.png")).toString("base64")}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&display=block"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;font-family:Manrope,"Segoe UI",sans-serif;background:#fff;color:#0d1433;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(700px 400px at 100% 0%,rgba(229,0,127,.12),transparent 65%),radial-gradient(600px 380px at 0% 100%,rgba(141,198,63,.18),transparent 65%)}
.wrap{position:absolute;left:72px;top:64px;right:72px}img{height:44px}
h1{font-size:64px;letter-spacing:-.035em;line-height:1.05;margin-top:64px;max-width:760px}
p{font-size:26px;color:#545d7a;margin-top:22px;font-weight:600}
.flow{position:absolute;left:72px;bottom:64px;display:flex;gap:12px}
.flow span{padding:12px 18px;border-radius:12px;background:#f4f5f8;font-weight:800;font-size:20px}
.flow span:nth-child(2){background:#fde8f3;color:#b0005f}.flow span:nth-child(3){background:#edf6e0;color:#3d6112}.flow span:nth-child(4){background:#0d1433;color:#fff}
</style></head><body><div class="bg"></div><div class="wrap"><img src="${logo}"><h1>Put AI into real business work.</h1><p>Agentic AI Platform &amp; Business Solutions</p></div>
<div class="flow"><span>Source</span><span>Prepared work</span><span>Human decision</span><span>Usable result</span></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, "public", "og.png") });
await browser.close();
console.log("og.png", fs.statSync(path.join(root, "public", "og.png")).size);
