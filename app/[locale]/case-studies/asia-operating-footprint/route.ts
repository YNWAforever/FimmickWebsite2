import { gone } from "@/lib/gone";

/** A retired reference case (lib/redirects.ts marks it gone): 410, with a link to the case library. */
export function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  return gone(params, { path: "/case-studies", label: { en: "Case studies", zh: "客戶案例" } });
}
