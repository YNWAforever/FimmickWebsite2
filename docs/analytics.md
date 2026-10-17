# Analytics events

The site pushes interaction events to `window.dataLayer` for Google Tag Manager (container `GTM-55RBW4F`, loaded only in production builds; see `components/analytics/Gtm.tsx`). Nothing is sent from review builds, local builds or tests.

**Privacy rule (enforced in `lib/analytics.ts`):** properties are IDs only. A string containing `@` or longer than 80 characters is dropped, so no name, email, phone number or form text can leave the page. Sample-example activity carries `sample: true` and must never be counted as a lead.

## Events

| Event | Fired when | Properties | Source |
| --- | --- | --- | --- |
| `cta_clicked` | a link to the enquiry form is clicked | `cta` (`contact`), `intent` (`demo`, `general`, `configuration`, `transformation`, … or `other`), `placement` (`header`, `footer`, `closing_band`, or the section's heading id, e.g. `start`, `cases`) | `ClickTracker.tsx` |
| `enquiry_started` | the first field of the form is edited | `intent` | `ContactForm.tsx` |
| `enquiry_failed` | a send does not go through | `intent`, `reason` (`validation`, `server_validation`, `unavailable`, `timeout`, `rate_limited`, `failed`, `network`), `status` (HTTP status, when there was one) | `ContactForm.tsx` |
| `enquiry_accepted` | the server confirms the enquiry was forwarded | `intent` | `ContactForm.tsx` |
| `enquiry_email_prepared` | the visitor chooses "Prepare email instead" | `intent` | `ContactForm.tsx` |
| `locale_switched` | the language switch is used | `from`, `to` (`en`, `zh-hant`, `zh-hans`) | `ClickTracker.tsx` |
| `outbound_clicked` | a link leaves the site | `kind` (`link`, `email`, `phone`), `host` (for links), `placement` | `ClickTracker.tsx` |
| `page_not_found` | the locale 404 renders | `path` (no query or hash, ≤ 80 characters), `referrer` (host, or `direct`) | `LocaleNotFound.tsx` |
| `example_opened` | an interactive example opens | `example`, `sample: true` | `ExampleViewer.tsx` |
| `example_exported` | a sample example is exported | `example`, `scenario`, `sample: true` | `Examples.tsx` |
| `video_started` / `video_completed` | the explainer film plays / ends | `video`, `locale` | `ExplainerPlayer.tsx` |

Tests: `tests/e2e/analytics.spec.ts` (each event, its properties and the no-personal-data rule).

## GTM setup (at cutover, by the container owner)

1. **Variables:** one Data Layer Variable per property above (`dlv - intent`, `dlv - reason`, `dlv - placement`, …).
2. **Triggers:** one Custom Event trigger per event name (or one regex trigger `^(cta_clicked|enquiry_.*|locale_switched|outbound_clicked|page_not_found|example_.*|video_.*)$`).
3. **Tags:** a GA4 Event tag per trigger, event name `{{Event}}`, parameters from the variables. Register `intent`, `reason`, `placement`, `path` and `host` as custom dimensions in GA4.
4. **Conversions:** mark `enquiry_accepted` as the key event. Do not mark `example_*` (sample data) or `cta_clicked` (intent, not a lead).
5. Publish, then check the events in GTM Preview on the production URL before announcing the launch.

## What to watch after launch

- **Enquiry health:** `enquiry_failed` with a `reason` other than `validation`. A spike of `unavailable` or `network` means the forwarder (release runbook B2) needs attention.
- **Funnel:** `cta_clicked` → `enquiry_started` → `enquiry_accepted`, by `intent` and `placement`, to see which calls to action earn their place.
- **Dead ends:** `page_not_found` by `path` and `referrer`. A path that keeps arriving from an external host is a candidate for a redirect in `next.config.ts`.
- **Language:** `locale_switched` by `from` / `to`, to see whether visitors land in the wrong language.
