/**
 * Meaningful interaction events. Properties are IDs only — never names,
 * emails, phone numbers or free text. Sample-example activity is marked as
 * such so it is never counted as a lead.
 */
export type AnalyticsEvent =
  | "solution_selected"
  | "example_opened"
  | "example_exported"
  | "video_started"
  | "video_completed"
  | "enquiry_started"
  | "enquiry_accepted"
  | "enquiry_email_prepared"
  // Post-launch measurement (docs/analytics.md): why a send did not go through, which call to action
  // led to the form and from where, language changes, links that leave the site, dead ends.
  | "enquiry_failed"
  | "cta_clicked"
  | "locale_switched"
  | "outbound_clicked"
  | "page_not_found";

type Props = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  const clean: Props = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    if (typeof value === "string" && (value.includes("@") || value.length > 80)) continue;
    clean[key] = value;
  }
  w.dataLayer?.push({ event, ...clean });
}
