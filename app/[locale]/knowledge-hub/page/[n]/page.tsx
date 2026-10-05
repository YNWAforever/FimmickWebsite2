import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { knowledgePageCount } from "@/lib/resources";
import { KnowledgeHubView, knowledgeHubMetadata } from "../../hub";

type Props = { params: Promise<{ locale: string; n: string }> };

/** Pages 2…last of each locale’s list; page 1 is the hub (next.config.ts redirects /page/1 there). */
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => Array.from({ length: knowledgePageCount(locale) - 1 }, (_, i) => ({ locale, n: String(i + 2) })));
}

async function resolve(params: Props["params"]) {
  const locale = await resolveLocale(params);
  const n = Number((await params).n);
  if (!Number.isInteger(n) || n < 2 || n > knowledgePageCount(locale)) notFound();
  return { locale, n };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, n } = await resolve(params);
  return knowledgeHubMetadata(locale, n);
}

export default async function KnowledgeHubPageN({ params }: Props) {
  const { locale, n } = await resolve(params);
  return <KnowledgeHubView locale={locale} page={n} />;
}
