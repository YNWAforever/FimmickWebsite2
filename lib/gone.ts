import { href, isLocale, localeMeta, zh, type Locale } from "./i18n";

/**
 * 410 Gone for a page that was retired rather than moved (award pass 2, 8.1.5): a minimal, noindexed
 * page in the visitor's language with one link to where the content lived.
 */
export async function gone(params: Promise<{ locale: string }>, to: { path: string; label: { en: string; zh: string } }) {
  const raw = (await params).locale;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const en = locale === "en";
  const message = en ? "This page has been removed." : zh("此頁面已移除。", locale);
  const label = en ? to.label.en : zh(to.label.zh, locale);
  const body = `<!doctype html><html lang="${localeMeta[locale].htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>410 | FIMMICK</title></head><body><p>${message} <a href="${href(locale, to.path)}">${label}</a></p></body></html>`;
  return new Response(body, { status: 410, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
