import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ui } from "@/content/ui";
import { canonicalOrigin } from "./env";
import { t, type Locale } from "./i18n";

/**
 * Share images (Open Graph, 1200 × 630): the template's category as the eyebrow, the title with its
 * accent phrase in the editorial serif (Chinese: the accent colour), the wordmark and the tagline.
 *
 * next/og (satori) reads TTF, OTF and WOFF but not WOFF2, so the site's next/font files cannot be
 * reused. Manrope and Instrument Serif are fetched as TTF from the Google Fonts CSS API (the source
 * next/font/google already uses at build) and kept for the life of the process; Chinese uses a Noto
 * Sans HK / SC subset of the card's own text. If a font cannot be fetched, the static public/og.png
 * is served instead, so a share never fails.
 */
export const shareImageSize = { width: 1200, height: 630 };
export const shareImageAlt = "FIMMICK";
const SHARE_CACHE = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

/** Old Safari user agent: the CSS API then answers with a single TrueType source. */
const TTF_AGENT = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

async function googleFont(family: string, text?: string): Promise<ArrayBuffer> {
  const query = `family=${family}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`, { headers: { "User-Agent": TTF_AGENT } })).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error(`No TrueType source for ${family}`);
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Font download failed for ${family}: ${res.status}`);
  return res.arrayBuffer();
}

let latinFonts: Promise<[ArrayBuffer, ArrayBuffer]> | undefined;
function loadLatinFonts() {
  latinFonts ??= Promise.all([googleFont("Manrope:wght@700"), googleFont("Instrument+Serif:ital@1")]).catch((error) => {
    latinFonts = undefined;
    throw error;
  });
  return latinFonts;
}

let logo: Promise<string> | undefined;
function loadLogo() {
  logo ??= readFile(join(process.cwd(), "public", "brand", "fimmick-logo-light.png")).then((png) => `data:image/png;base64,${png.toString("base64")}`);
  return logo;
}

async function fallback() {
  const png = await readFile(join(process.cwd(), "public", "og.png"));
  return new Response(new Uint8Array(png), { headers: { "content-type": "image/png", "cache-control": "public, max-age=3600" } });
}

const CJK = /[　-〿㐀-鿿＀-￯]/;

/** Title chunks that may break between them: words in Latin text, punctuation-ended runs in Chinese. */
function chunks(text: string, cjk: boolean) {
  return cjk ? text.split(/(?<=[，。、；：！？])/).filter(Boolean) : text.split(/\s+/).filter(Boolean);
}

function titleSize(title: string, cjk: boolean) {
  const n = title.length;
  if (cjk) return n <= 16 ? 72 : n <= 30 ? 60 : n <= 48 ? 50 : 44;
  return n <= 42 ? 76 : n <= 70 ? 62 : n <= 110 ? 52 : 44;
}

type Card = { locale: Locale; eyebrow: string; title: string; accent?: string };

export async function shareImage({ locale, eyebrow, title, accent }: Card): Promise<Response> {
  const tagline = t(ui.footerTagline, locale);
  const clipped = title.length > 140 ? `${title.slice(0, 137).trimEnd()}…` : title;
  const cjk = CJK.test(clipped);
  const cjkText = [...new Set([...`${eyebrow}${clipped}${tagline}`].filter((c) => CJK.test(c)))].join("");

  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" | "italic" }[];
  let wordmark: string;
  try {
    const [[sans, serif], mark, han] = await Promise.all([
      loadLatinFonts(),
      loadLogo(),
      cjkText ? googleFont(`${locale === "zh-hans" ? "Noto+Sans+SC" : "Noto+Sans+HK"}:wght@700`, cjkText) : Promise.resolve(null),
    ]);
    wordmark = mark;
    fonts = [
      { name: "Manrope", data: sans, weight: 700, style: "normal" },
      { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ...(han ? [{ name: "Noto Sans", data: han, weight: 700 as const, style: "normal" as const }] : []),
    ];
  } catch (error) {
    console.error(JSON.stringify({ event: "share_image_fallback", reason: String(error) }));
    return fallback();
  }

  // Split the title around the accent so its chunks can take the serif (or, in Chinese, the colour).
  const at = accent ? clipped.indexOf(accent) : -1;
  const parts = at < 0 ? [{ text: clipped, accent: false }] : [
    { text: clipped.slice(0, at), accent: false },
    { text: accent!, accent: true },
    { text: clipped.slice(at + accent!.length), accent: false },
  ];
  const size = titleSize(clipped, cjk);
  // An accent that is its own sentence starts a new line, as in the hero ("… the work. / Your people decide.").
  const ownLine = at > 0 && /[.!?。！？]\s*$/.test(clipped.slice(0, at));
  const items = parts.flatMap((part) => [
    ...(part.accent && ownLine ? [{ text: "", accent: false, lineBreak: true }] : []),
    ...chunks(part.text, cjk).map((text) => ({ text, accent: part.accent, lineBreak: false })),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0a0f26",
          backgroundImage: "radial-gradient(900px 520px at 0% 0%, rgba(229, 0, 127, 0.22), rgba(10, 15, 38, 0) 70%)",
          color: "#fff",
          fontFamily: "Manrope, Noto Sans",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img> */}
        <img src={wordmark} width={187} height={47} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: cjk ? 2 : 3.5, textTransform: "uppercase", color: "#ff7dbd" }}>{eyebrow}</div>
          <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 1000, fontSize: size, lineHeight: 1.08, letterSpacing: cjk ? 0 : -1.5 }}>
            {items.map((item, i) => item.lineBreak ? <div key={i} style={{ display: "flex", flexBasis: "100%", height: 0 }} /> : (
              <span
                key={i}
                style={
                  item.accent && !cjk
                    ? { fontFamily: "Instrument Serif", fontStyle: "italic", fontWeight: 400, fontSize: size * 1.1, color: "#ff7dbd", letterSpacing: -0.5, marginRight: size * 0.24 }
                    : { color: item.accent ? "#ff7dbd" : "#fff", marginRight: cjk ? 0 : size * 0.24 }
                }
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24, borderTop: "1px solid rgba(255, 255, 255, 0.14)", fontSize: 22, color: "rgba(255, 255, 255, 0.62)" }}>
          <span>{tagline}</span>
          <span style={{ color: "rgba(255, 255, 255, 0.82)" }}>{new URL(canonicalOrigin).host}</span>
        </div>
      </div>
    ),
    // Rendered on request, so let the CDN keep it: a day in browsers, a week at the edge (a deploy purges it).
    { ...shareImageSize, fonts, headers: { "cache-control": SHARE_CACHE } },
  );
}
