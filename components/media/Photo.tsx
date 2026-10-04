import { t, type Locale } from "@/lib/i18n";
import { illustrativeLabel, photoBase, photos, type PhotoFiles, type PhotoId } from "@/content/photography";

type Crop = "landscape" | "portrait" | "art" | "wide";

/** Every delivered width of one crop, widest first, as a srcset. */
const srcset = (files: PhotoFiles, ext: "avif" | "webp") =>
  Object.entries(files)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([w, f]) => `${photoBase}/${f[ext]} ${w}w`)
    .join(", ");

/** The delivered width closest to `target` (the plain <img> fallback for browsers without <source>). */
const nearest = (files: PhotoFiles, target: number) =>
  Object.entries(files).sort(([a], [b]) => Math.abs(Number(a) - target) - Math.abs(Number(b) - target))[0][1];

const pos = ([x, y]: [number, number]) => `${Math.round(x * 1000) / 10}% ${Math.round(y * 1000) / 10}%`;

/**
 * Art-directed editorial photograph.
 * - Crops: `landscape` (3:2), `portrait` (4:5), `art` (portrait below 700 px, landscape above) and
 *   `wide` (21:8 from 800 px, landscape below; the page-hero band). File names come from the build
 *   manifest (content-hashed); the object-position is the scene’s focus within whichever crop is shown.
 * - AVIF with WebP fallback, intrinsic size set to avoid layout shift, the dominant colour as the
 *   loading placeholder, lazy unless `priority`.
 * - Provenance (award pass 2, 6.5): every non-decorative photograph carries it in its title; `pill`
 *   also shows the "Illustrative photograph" label (heroes, where a viewer could take the scene for
 *   real people or premises); `caption` means the chapter prints one caption line instead; `none` is
 *   for decorative images.
 */
export function Photo({
  id,
  locale,
  crop = "landscape",
  sizes = "100vw",
  priority = false,
  className,
  label = "pill",
  decorative = false,
}: {
  id: PhotoId;
  locale: Locale;
  crop?: Crop;
  sizes?: string;
  priority?: boolean;
  className?: string;
  label?: "pill" | "caption" | "none";
  decorative?: boolean;
}) {
  const photo = photos[id];
  if (!photo) return null;
  const main = crop === "portrait" ? photo.files.portrait : photo.files.landscape;
  const dims = crop === "portrait" ? photo.portrait : photo;
  const media = crop === "art" ? { query: "(max-width: 699px)", files: photo.files.portrait } : crop === "wide" ? { query: "(min-width: 800px)", files: photo.files.wide } : null;
  const fallback = nearest(main, crop === "portrait" ? 800 : 1024);
  const provenance = t(illustrativeLabel, locale);
  return (
    <figure
      className={["photo", `photo--${crop}`, className].filter(Boolean).join(" ")}
      style={{
        ["--photo-color" as string]: photo.color,
        ["--pos-l" as string]: pos(photo.focus.landscape),
        ["--pos-p" as string]: pos(photo.focus.portrait),
        ["--pos-w" as string]: pos(photo.focus.wide),
      }}
    >
      <picture>
        {media ? (
          <>
            <source media={media.query} type="image/avif" srcSet={srcset(media.files, "avif")} sizes={sizes} />
            <source media={media.query} type="image/webp" srcSet={srcset(media.files, "webp")} sizes={sizes} />
          </>
        ) : null}
        <source type="image/avif" srcSet={srcset(main, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcset(main, "webp")} sizes={sizes} />
        <img
          src={`${photoBase}/${fallback.webp}`}
          width={dims.width}
          height={dims.height}
          alt={decorative ? "" : t(photo.alt, locale)}
          title={decorative ? undefined : provenance}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
        />
      </picture>
      {label === "pill" ? <span className="photo__label">{provenance}</span> : null}
    </figure>
  );
}
