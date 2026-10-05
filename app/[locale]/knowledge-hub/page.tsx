import type { Metadata } from "next";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { KnowledgeHubView, knowledgeHubMetadata } from "./hub";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return knowledgeHubMetadata(await resolveLocale(params), 1);
}

/** Static: later pages are `/knowledge-hub/page/<n>`; old `?page=` links redirect there (next.config.ts). */
export default async function KnowledgeHubPage({ params }: LocaleParams) {
  return <KnowledgeHubView locale={await resolveLocale(params)} page={1} />;
}
