#!/usr/bin/env node
/**
 * Converts the production Knowledge Hub inventory (prerendered article HTML
 * captured from www.fimmick.com sitemaps on 2026-09-28) into structured,
 * version-controlled content records.
 *
 * Usage: node scripts/migration/convert-legacy-articles.mjs <pages.json>
 *
 * The input is a local capture (not committed). Output:
 *   content/legacy/article-index.json   metadata used by listings and search
 *   content/legacy/articles-<locale>.json  block bodies, loaded server-side only
 *
 * Bodies are reduced to headings, paragraphs and lists with a tiny inline
 * markup (**bold** and [label](href)); no source HTML is rendered.
 */
import fs from "node:fs";
import path from "node:path";
import { decodeEntities } from "./entities.mjs";

const [, , input] = process.argv;
if (!input) {
  console.error("usage: convert-legacy-articles.mjs <pages.json>");
  process.exit(64);
}
const pages = JSON.parse(fs.readFileSync(input, "utf8"));
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const outDir = path.join(root, "content", "legacy");
fs.mkdirSync(outDir, { recursive: true });

const LOCALES = ["en", "zh-hant", "zh-hans"];

// Legacy "articleSection" values → resource topic IDs used across the site.
const TOPIC_BY_SECTION = [
  [/^(AI|Technology|MarTech|Web3)/i, "ai-transformation"],
  [/^(SEO)/i, "search-visibility"],
  [/^(CRM|Marketing Automation)/i, "customer-crm"],
  [/^(Data|Insights)/i, "data-intelligence"],
  [/^(Ecommerce)/i, "commerce"],
  [/^(Influencer Marketing|Community Marketing)/i, "creators-community"],
  [/^(Content Marketing|Online Ads|Video|Facebook|Instagram|Google)/i, "marketing-channels"],
  [/^(Learning & Culture|Career Tips|Recruitment Marketing|News|Events)/i, "company-news"],
];

// Decodes to a fixed point: the capture double-escaped some titles ("&amp;amp;").
const decode = decodeEntities;

function inline(html) {
  let s = html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => `[${label.replace(/<[^>]+>/g, "")}](${href})`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${t.replace(/<[^>]+>/g, "")}**`)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "");
  s = decode(s).replace(/\s+/g, " ").trim();
  // Collapse bold that wraps the whole line (legacy emphasis on summaries).
  return s;
}

const cjk = (s) => (s.match(/[㐀-鿿]/g) || []).length;
const looksLikeHeading = (text) => {
  const plain = text.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  if (!plain || plain.length > 90) return false;
  if (/[.!?。！？：:；;,，)）]$/.test(plain)) return false;
  if (/^\[/.test(text)) return false;
  return true;
};

function toBlocks(body) {
  const tokens = [...body.matchAll(/<(h1|h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({ tag: m[1].toLowerCase(), text: inline(m[2]) }));
  const blocks = [];
  let lead = null;
  let readTime = null;
  for (let i = 0; i < tokens.length; i++) {
    const { tag, text } = tokens[i];
    if (!text) continue;
    if (tag === "h1") continue;
    if (lead === null && tag === "p" && /^\*\*[\s\S]+\*\*$/.test(text)) {
      lead = text.replace(/^\*\*|\*\*$/g, "");
      continue;
    }
    const rt = text.match(/^(Reading Time|預計閱讀時間|预计阅读时间)[:：︰]\s*(.+)$/);
    if (rt) {
      readTime = rt[2];
      continue;
    }
    if (tag === "li") {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.t === "ul") prev.items.push(text);
      else blocks.push({ t: "ul", items: [text] });
      continue;
    }
    if (tag === "h2" || tag === "h3") {
      blocks.push({ t: "h", x: text.replace(/\*\*/g, "") });
      continue;
    }
    const next = tokens[i + 1];
    if (looksLikeHeading(text) && next && next.tag !== "h2") {
      blocks.push({ t: "h", x: text.replace(/\*\*/g, "") });
    } else {
      blocks.push({ t: "p", x: text });
    }
  }
  return { lead, readTime, blocks };
}

const index = {};
const bodies = Object.fromEntries(LOCALES.map((l) => [l, {}]));
const categories = Object.fromEntries(LOCALES.map((l) => [l, new Set()]));

for (const [url, page] of Object.entries(pages)) {
  const m = url.match(/^\/(en|zh-hant|zh-hans)\/knowledge-hub\/([^/]+)$/);
  if (!m || !page.body) continue;
  const [, locale, slug] = m;
  const { lead, readTime, blocks } = toBlocks(page.body);
  const text = blocks.map((b) => (b.t === "ul" ? b.items.join(" ") : b.x)).join(" ");
  // An "en" page whose title, summary and body are more than 30 % CJK is Chinese (award pass 2, 8.1.1);
  // after a run, scripts/migration/fix-article-languages.mjs gives such articles a zh-hant record.
  const compact = `${page.title || ""} ${page.description || ""} ${text}`.replace(/\s/g, "");
  const contentLanguage = locale === "en" ? (cjk(compact) > compact.length * 0.3 ? "zh-hant" : "en") : cjk(text) > text.length * 0.1 ? locale : "en";
  const title = decode((page.title || "").replace(/\s*\|\s*FIMMICK\s*$/i, ""));
  const section = page.section ? decode(page.section) : null;
  const topic = section ? (TOPIC_BY_SECTION.find(([re]) => re.test(section)) || [, "marketing-channels"])[1] : "marketing-channels";
  if (section) categories[locale].add(section);
  index[slug] ??= { slug, topic, published: page.datePublished, modified: page.dateModified, locales: {} };
  if (locale === "en") {
    index[slug].topic = topic;
    index[slug].published = page.datePublished || index[slug].published;
    index[slug].modified = page.dateModified || index[slug].modified;
  }
  index[slug].locales[locale] = {
    title,
    summary: lead || decode(page.description || ""),
    section,
    readTime: readTime || page.readTime || null,
    author: page.author || "FIMMICK",
    contentLanguage,
  };
  bodies[locale][slug] = blocks;
}

const sorted = Object.values(index).sort((a, b) => String(b.published).localeCompare(String(a.published)));
fs.writeFileSync(path.join(outDir, "article-index.json"), JSON.stringify(sorted));
for (const l of LOCALES) fs.writeFileSync(path.join(outDir, `articles-${l}.json`), JSON.stringify(bodies[l]));
fs.writeFileSync(
  path.join(outDir, "article-categories.json"),
  JSON.stringify(Object.fromEntries(LOCALES.map((l) => [l, [...categories[l]].sort()])), null, 1),
);
console.log(
  `articles: ${sorted.length}; per locale:`,
  Object.fromEntries(LOCALES.map((l) => [l, Object.keys(bodies[l]).length])),
);
