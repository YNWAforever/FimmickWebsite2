"use client";

import { zh, type Locale } from "@/lib/i18n";
import { useRef, useState } from "react";
import type { ExplainerMedia } from "@/content/media";
import { track } from "@/lib/analytics";

/**
 * Click-to-play explainer.
 * - Only the poster loads initially; no video bytes before the visitor asks.
 * - One <video> with MP4 then WebM sources: the browser fetches one encoding.
 * - Native controls, captions on by default in the page language, no audio.
 * - If playback fails, the poster returns with a message and transcript link.
 */
export function ExplainerPlayer({ locale, media, title, compact = false, transcriptHref }: { locale: Locale; media: ExplainerMedia; title: string; compact?: boolean; transcriptHref?: string }) {
  const [state, setState] = useState<"poster" | "playing" | "error">("poster");
  const started = useRef(false);
  const en = locale === "en";
  // The film and captions exist in English and Traditional Chinese; Simplified pages use the Chinese film.
  const film = locale === "en" ? "en" : "zh-hant";
  const src = media.sources[film];
  return (
    <div className={compact ? "player player--compact" : "player"} style={{ aspectRatio: `${media.width} / ${media.height}` }}>
      {state === "playing" ? (
        <video
          className="player__video"
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={media.poster}
          width={media.width}
          height={media.height}
          aria-label={title}
          onPlay={() => {
            if (!started.current) {
              started.current = true;
              track("video_started", { video: "explainer", locale });
            }
          }}
          onEnded={() => track("video_completed", { video: "explainer", locale })}
          onError={() => setState("error")}
        >
          <source src={src.mp4} type="video/mp4" />
          {/* Errors on the last source mean no playable source was found. */}
          <source src={src.webm} type="video/webm" onError={() => setState("error")} />
          {media.captions.map((c) => (
            <track key={c.srclang} kind="captions" src={c.src} srcLang={c.srclang} label={c.label} default={c.locale === film} />
          ))}
        </video>
      ) : (
        <button type="button" className="player__poster" onClick={() => setState("playing")} aria-label={`${en ? "Play video" : zh("播放影片", locale)}: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- poster must render without the image optimiser */}
          <img src={media.poster} alt="" width={media.width} height={media.height} loading="lazy" decoding="async" />
          <span className="player__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="player__meta">
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
