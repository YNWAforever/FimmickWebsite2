import { Fragment, type ReactNode } from "react";

type Props = {
  text: string;
  /** Phrase inside `text` set in the editorial accent face. Ignored when not found. */
  accent?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** Wrap words in masks for the staggered line entrance (hero only). */
  split?: boolean;
};

const CJK = /[㐀-鿿]/;
/**
 * Chinese headings use word-break: keep-all (editorial.css), which only breaks at punctuation and
 * spaces; a <wbr> after 與 / 及 gives long compound names a natural break between their parts.
 */
export function zhBreaks(text: string): ReactNode {
  if (!CJK.test(text) || !/[與与及]/.test(text)) return text;
  return text.split(/(?<=[與与及])/).map((part, i, all) => (
    <Fragment key={i}>
      {part}
      {i < all.length - 1 ? <wbr /> : null}
    </Fragment>
  ));
}

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
    if (!split) return zhBreaks(chunk);
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
