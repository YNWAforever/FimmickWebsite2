import { isLocale, locales } from "@/lib/i18n";
import { resourceRows } from "../rows";

/**
 * Every Resource Centre entry for a locale, prerendered at build. The static listing page renders the
 * first, unfiltered page itself; the filter island fetches this once a visitor filters, searches or
 * pages (award pass 2, 8.2.1).
 */
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  return Response.json(resourceRows(locale), { headers: { "X-Robots-Tag": "noindex" } });
}
