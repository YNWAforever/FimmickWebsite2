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

/** landscape 3:2, portrait 4:5 and wide 21:8 (page-hero bands), built by scripts/build-photography.mjs. */
export type PhotoCrop = "landscape" | "portrait" | "wide";
/** Delivered files per width, named <id>-<crop>-<width>.<hash8>.<ext> (immutable, content-hashed). */
export type PhotoFiles = Record<string, { avif: string; webp: string }>;

export type PhotoRecord = {
  id: PhotoId;
  alt: L;
  width: number;
  height: number;
  portrait: { width: number; height: number };
  wide: { width: number; height: number };
  color: string;
  /** The scene’s focus point (0–1) within each crop: the CSS object-position, so a crop never cuts it. */
  focus: Record<PhotoCrop, [number, number]>;
  files: Record<PhotoCrop, PhotoFiles>;
};

const generated = built as unknown as Record<string, Omit<PhotoRecord, "id" | "alt">>;

export const photos: Partial<Record<PhotoId, PhotoRecord>> = Object.fromEntries(
  scenes.scenes.filter((s) => generated[s.id]).map((s) => [s.id, { id: s.id as PhotoId, alt: s.alt as L, ...generated[s.id] }]),
);

export const photoBase = "/media/photography";

/** Pill on photographs a viewer could take for real people or premises (the heroes). */
export const illustrativeLabel: L = { en: "Illustrative photograph", zh: "示意相片" };
/**
 * One line under a chapter of photographs, and the footer’s site-wide note (award pass 2, 6.5).
 * zh drafted, for native review.
 */
export const photoCaption: L = { en: "Photographs are generated illustrations.", zh: "相片均為生成的示意圖。" };

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
