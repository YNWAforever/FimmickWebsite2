import type { L } from "@/lib/i18n";
import scenes from "@/assets-src/photography/scenes.json";
import built from "./photography.generated.json";

/**
 * Editorial photography registry.
 *
 * Every photograph is an ILLUSTRATIVE generated image (see
 * docs/redesign/cinematic/photography-provenance.md): generated people are not
 * FIMMICK staff, generated places are not client premises, and no photograph
 * shows a real product interface. Product evidence uses the site’s own working
 * examples and the explainer film instead.
 */
export type PhotoId =
  | "review-desk"
  | "workshop-wall"
  | "specialist-studio"
  | "specialist-desk"
  | "property-gallery"
  | "retail-counter"
  | "hotel-desk"
  | "proposal-table"
  | "community-event"
  | "night-table";

export type PhotoRecord = {
  id: PhotoId;
  alt: L;
  width: number;
  height: number;
  portrait: { width: number; height: number };
  color: string;
  /** Focus point (0–1) used for portrait crops and as the CSS object-position. */
  focus: [number, number];
};

const sizes = built as Record<string, Omit<PhotoRecord, "id" | "alt" | "focus">>;

export const photos: Partial<Record<PhotoId, PhotoRecord>> = Object.fromEntries(
  scenes.scenes
    .filter((s) => sizes[s.id])
    .map((s) => [s.id, { id: s.id as PhotoId, alt: s.alt as L, focus: s.focus as [number, number], ...sizes[s.id] }]),
);

export const photoBase = "/media/photography";
export const landscapeWidths = [1536, 1024, 640] as const;
export const portraitWidths = [800, 480] as const;

/** Label shown on every photograph so it is never mistaken for a record of real people or premises. */
export const illustrativeLabel: L = { en: "Illustrative photograph", zh: "示意相片" };

/** Which photograph illustrates each page family (pages without an entry show no photograph). */
export const solutionPhotos: Record<string, PhotoId> = {
  "market-intelligence": "proposal-table",
  "content-production": "specialist-studio",
  "customer-engagement": "hotel-desk",
  "website-operations": "retail-counter",
};
export const industryPhotos: Record<string, PhotoId> = {
  "property-real-estate": "property-gallery",
  "retail-ecommerce": "retail-counter",
  "b2b-professional-services": "proposal-table",
  "hospitality-travel": "hotel-desk",
};
export const casePhotos: Record<string, PhotoId> = {
  "real-estate-sales-follow-up": "property-gallery",
  "hotel-guest-experience-recovery": "hotel-desk",
  "omni-channel-retail-intelligence": "retail-counter",
};
