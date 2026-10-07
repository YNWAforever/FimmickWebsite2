"use client";

import { useEffect, useState } from "react";

export type RailChapter = { id: string; num: string; label: string; dark?: boolean };

/**
 * The homepage's chapter rail (award pass 3): a slim index of the eight chapters in the left margin,
 * shown only where the margin has room (≥1400 px) and only while a chapter crosses the middle of the
 * viewport. JavaScript sets which chapter is current; the movement is CSS. The links are ordinary
 * in-page anchors, so nothing about scrolling changes.
 */
export function ChapterRail({ chapters, label }: { chapters: RailChapter[]; label: string }) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1400px)");
    let observer: IntersectionObserver | null = null;
    const start = () => {
      observer?.disconnect();
      observer = null;
      if (!wide.matches) {
        setActive(-1);
        return;
      }
      const sections = chapters.map((c) => document.querySelector(`section[aria-labelledby="${c.id}"]`));
      // A zero-height line across the middle of the viewport: the chapter crossing it is current.
      observer = new IntersectionObserver(
        (entries) => {
          const entering = entries.filter((e) => e.isIntersecting);
          for (const e of entries) if (!e.isIntersecting) setActive((a) => (sections[a] === e.target ? -1 : a));
          for (const e of entering) setActive(sections.indexOf(e.target));
        },
        { rootMargin: "-50% 0px -50% 0px" },
      );
      for (const s of sections) if (s) observer.observe(s);
    };
    start();
    wide.addEventListener("change", start);
    return () => {
      observer?.disconnect();
      wide.removeEventListener("change", start);
    };
  }, [chapters]);

  return (
    <nav className="chapter-rail" aria-label={label} data-on={active >= 0 ? "" : undefined} data-tone={chapters[active]?.dark ? "dark" : undefined}>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={i === active ? "true" : undefined}>
              <span className="chapter-rail__num">{c.num}</span>
              <span className="chapter-rail__tick" aria-hidden="true" />
              <span className="chapter-rail__label">{c.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
