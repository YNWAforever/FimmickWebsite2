import { notFound } from "next/navigation";

/**
 * Catch-all for unknown paths inside a locale (including unknown slugs, which the slug routes'
 * `dynamicParams = false` hands on): it renders `[locale]/not-found.tsx`, so a stale Chinese link
 * gets a Chinese 404 inside the site shell instead of the bare global page. The locale itself is
 * validated by the layout, which 404s anything that is not en, zh-hant or zh-hans.
 */
export const dynamicParams = true;

export default function LocaleCatchAll(): never {
  notFound();
}
