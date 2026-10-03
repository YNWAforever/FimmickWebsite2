import type { ReactNode } from "react";

type Props = {
  text: string;
  /** Phrase inside `text` set in the editorial accent face. Ignored when not found. */
  accent?: string;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  /** Wrap words in masks for the staggered line entrance (hero only). */
  split?: boolean;
};

/**
 * Display headline with one accented phrase.
 * The accessible name is the plain sentence: masks are presentational spans,
 * and the accent is an <em>, so screen readers and tests read the same text.
 */
export function Headline({ text, accent, as: Tag = "h2", id, className, split = false }: Props) {
  const at = accent ? text.indexOf(accent) : -1;
  const parts: { text: string; accent: boolean }[] =
    at < 0 || !accent
      ? [{ text, accent: false }]
      : [
          { text: text.slice(0, at), accent: false },
          { text: accent, accent: true },
          { text: text.slice(at + accent.length), accent: false },
        ].filter((p) => p.text);

  let index = 0;
  const render = (chunk: string): ReactNode => {
    if (!split) return chunk;
    // Latin text splits on spaces; CJK text (no spaces) stays one mask per part.
    return chunk.split(/(\s+)/).map((word, i) => {
      if (!word) return null;
      if (/^\s+$/.test(word)) return " ";
      const n = index++;
      return (
        <span key={i} className="w" style={{ ["--i" as string]: n }}>
          <span>{word}</span>
        </span>
      );
    });
  };

  return (
    <Tag id={id} className={className}>
      {parts.map((p, i) =>
        p.accent ? (
          <em key={i} className="accent">
            {render(p.text)}
          </em>
        ) : (
          <span key={i}>{render(p.text)}</span>
        ),
      )}
    </Tag>
  );
}
