"use client";

import { zh, type Locale } from "@/lib/i18n";
import { useRef, useState } from "react";
import type { ExplainerMedia } from "@/content/media";
import { track } from "@/lib/analytics";

/**
 * Click-to-play explainer.
 * - The <video> is in the server HTML (so the page’s VideoObject has an element) with
 *   preload="none": only the posters load before the visitor asks, no video bytes.
 * - The poster button covers it until pressed; pressing plays the same element (a user gesture).
 * - One <video> with MP4 then WebM sources: the browser fetches one encoding.
 * - Native controls, captions on by default in the page language, no audio.
 * - If playback fails, the poster returns with a message and transcript link.
 */
export function ExplainerPlayer({ locale, media, title, compact = false, transcriptHref }: { locale: Locale; media: ExplainerMedia; title: string; compact?: boolean; transcriptHref?: string }) {
  const [state, setState] = useState<"poster" | "playing" | "error">("poster");
  const started = useRef(false);
  const video = useRef<HTMLVideoElement>(null);
  const en = locale === "en";
  // The film and captions exist in English and Traditional Chinese; Simplified pages use the Chinese film.
  const film = locale === "en" ? "en" : "zh-hant";
  const src = media.sources[film];
  const playing = state === "playing";
  return (
    <div className={compact ? "player player--compact" : "player"} style={{ aspectRatio: `${media.width} / ${media.height}` }}>
      <video
        ref={video}
        className="player__video"
        controls={playing}
        playsInline
        preload="none"
        poster={media.posterSmall}
        width={media.width}
        height={media.height}
        aria-label={title}
        aria-hidden={playing ? undefined : true}
        tabIndex={playing ? undefined : -1}
        onPlay={() => {
          if (!started.current) {
            started.current = true;
            track("video_started", { video: "explainer", locale });
          }
        }}
        onEnded={() => track("video_completed", { video: "explainer", locale })}
        // A failing <source> fires its own error, which bubbles here; only the element’s own error
        // means playback failed. Otherwise a browser without H.264 never reaches the WebM.
        onError={(e) => {
          if (e.target !== e.currentTarget) return;
          setState("error");
        }}
      >
        <source src={src.mp4} type="video/mp4" />
        {/* Errors on the last source mean no playable source was found. */}
        <source src={src.webm} type="video/webm" onError={() => setState("error")} />
        {media.captions.map((c) => (
          <track key={c.srclang} kind="captions" src={c.src} srcLang={c.srclang} label={c.label} default={c.locale === film} />
        ))}
      </video>
      {playing ? null : (
        <button
          type="button"
          className="player__poster"
          onClick={() => {
            setState("playing");
            video.current?.play().catch(() => {
              // A rejected play() (no playable source, autoplay policy) leaves the error to onError.
            });
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- poster must render without the image optimiser */}
          <img src={media.poster} srcSet={`${media.posterSmall} 640w, ${media.poster} ${media.width}w`} sizes="(min-width: 1000px) 760px, 100vw" alt="" width={media.width} height={media.height} loading="lazy" decoding="async" />
          <span className="player__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="player__meta">
            {/* Accessible name = "Play video: <visible text>", so it contains what sighted users see. */}
            <span className="sr-only">{en ? "Play video" : zh("播放影片", locale)}: </span>
            {title} · {media.durationSeconds}s · {en ? "captions" : zh("字幕", locale)}
          </span>
        </button>
      )}
      {state === "error" ? (
        <p className="player__error" role="status">
          {en ? "The video could not be played in this browser." : zh("此瀏覽器未能播放影片。", locale)}{" "}
          {transcriptHref ? <a href={transcriptHref}>{en ? "Read the transcript" : zh("閱讀文字稿", locale)}</a> : null}
        </p>
      ) : null}
    </div>
  );
}
