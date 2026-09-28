import { t, type Locale } from "@/lib/i18n";
import { illustrativeLabel, landscapeWidths, photoBase, photos, portraitWidths, type PhotoId } from "@/content/photography";

type Crop = "landscape" | "portrait" | "art";

const srcset = (id: PhotoId, ext: "avif" | "webp", portrait: boolean) =>
  (portrait ? portraitWidths : landscapeWidths).map((w) => `${photoBase}/${id}-${portrait ? "p-" : ""}${w}.${ext} ${w}w`).join(", ");

/**
 * Art-directed editorial photograph.
 * - `landscape` (3:2) and `portrait` (4:5, cropped around the scene's focus)
 *   crops; `art` uses the portrait crop below 700 px and landscape above.
 * - AVIF with WebP fallback, intrinsic size set to avoid layout shift, the
 *   dominant colour as the loading placeholder, lazy unless `priority`.
 * - Carries a visible "Illustrative photograph" label unless `label={false}`
 *   (only where an adjacent caption already says so).
 */
export function Photo({
  id,
  locale,
  crop = "landscape",
  sizes = "100vw",
  priority = false,
  className,
  label = true,
  decorative = false,
}: {
  id: PhotoId;
  locale: Locale;
  crop?: Crop;
  sizes?: string;
  priority?: boolean;
  className?: string;
  label?: boolean;
  decorative?: boolean;
}) {
  const photo = photos[id];
  if (!photo) return null;
  const portrait = crop === "portrait";
  const dims = portrait ? photo.portrait : photo;
  const fallbackWidth = portrait ? portraitWidths[0] : landscapeWidths[1];
  return (
    <figure className={["photo", className].filter(Boolean).join(" ")} style={{ ["--photo-color" as string]: photo.color }}>
      <picture>
        {crop === "art" ? (
          <>
            <source media="(max-width: 699px)" type="image/avif" srcSet={srcset(id, "avif", true)} sizes={sizes} />
            <source media="(max-width: 699px)" type="image/webp" srcSet={srcset(id, "webp", true)} sizes={sizes} />
          </>
        ) : null}
        <source type="image/avif" srcSet={srcset(id, "avif", portrait)} sizes={sizes} />
        <source type="image/webp" srcSet={srcset(id, "webp", portrait)} sizes={sizes} />
        <img
          src={`${photoBase}/${id}-${portrait ? "p-" : ""}${fallbackWidth}.webp`}
          width={dims.width}
          height={dims.height}
          alt={decorative ? "" : t(photo.alt, locale)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          style={portrait ? undefined : { objectPosition: `${photo.focus[0] * 100}% ${photo.focus[1] * 100}%` }}
        />
      </picture>
      {label ? <span className="photo__label">{t(illustrativeLabel, locale)}</span> : null}
    </figure>
  );
}
