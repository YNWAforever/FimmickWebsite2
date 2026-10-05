"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/motion/Reveal";

export type StageStep = { id: string; label: string; title: string };

/**
 * The homepage’s one signature motion sequence: input → prepared work →
 * human review → usable output.
 *
 * - Server markup is the static storyboard (all four frames visible), which is
 *   also what no-JS and reduced-motion visitors keep.
 * - With motion allowed, it becomes a stage that plays once, 5 s per step,
 *   when at least 40% of it is on screen, and pauses when it leaves the
 *   screen or the tab is hidden. It never loops and never scroll-jacks.
 * - Play/pause, direct step buttons and "show all four" are always available.
 */
export function SignatureStage({
  steps,
  frames,
  labels,
}: {
  steps: StageStep[];
  frames: ReactNode[];
  labels: { play: string; pause: string; replay: string; showAll: string; showOne: string; step: string };
}) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"all" | "stage">("all");
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  /** The active step’s progress has begun: its bar keeps its place while paused (Phase 9). */
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(true);
  const autoStarted = useRef(false);

  usePrefersReducedMotion(
    useCallback((value: boolean) => {
      setReduced(value);
      if (value) {
        setPlaying(false);
        setMode("all");
      } else if (!autoStarted.current) {
        setMode("stage");
      }
    }, []),
  );

  // Start once when the stage is substantially visible; pause when it leaves.
  useEffect(() => {
    const node = root.current;
    if (!node || reduced || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoStarted.current) {
          autoStarted.current = true;
          setPlaying(true);
          setStarted(true);
        }
        if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  const advance = () => {
    if (active < steps.length - 1) setActive(active + 1);
    else {
      setPlaying(false);
      setFinished(true);
    }
  };

  const togglePlay = () => {
    autoStarted.current = true;
    if (mode === "all") setMode("stage");
    if (finished) {
      setActive(0);
      setFinished(false);
      setPlaying(true);
      setStarted(true);
      return;
    }
    setPlaying((p) => !p);
    setStarted(true);
  };

  const choose = (index: number) => {
    autoStarted.current = true;
    setMode("stage");
    setPlaying(false);
    setStarted(false);
    setFinished(index === steps.length - 1);
    setActive(index);
  };

  const staged = mode === "stage";
  const playLabel = playing ? labels.pause : finished ? labels.replay : labels.play;

  return (
    <div ref={root} className={`sig ${staged ? "sig--stage" : "sig--all"}${playing ? " is-playing" : ""}`}>
      <div className="sig__controls">
        <ol className="sig__steps">
          {steps.map((s, i) => {
            const done = staged && (i < active || (i === active && finished));
            // Once a step has started, its bar keeps the animation and pausing only stops it, so a pause
            // holds the progress and playing again resumes from there (it used to reset the step).
            const running = staged && i === active && started && !finished;
            return (
              <li key={s.id} data-role={s.id}>
                <button type="button" className="sig__step" aria-current={staged && i === active ? "step" : undefined} onClick={() => choose(i)}>
                  <span className="sig__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="sig__label">
                    <span className="sr-only">{`${labels.step} ${i + 1}: `}</span>
                    {s.label}
                  </span>
                  <span className="sig__bar" aria-hidden="true">
                    <span
                      key={active}
                      className={`sig__fill${done ? " is-done" : ""}${running ? " is-running" : ""}`}
                      style={running ? { animationPlayState: playing ? "running" : "paused" } : undefined}
                      onAnimationEnd={running ? advance : undefined}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="sig__buttons">
          <button type="button" className="sig__btn" onClick={togglePlay} aria-pressed={playing}>
            <span aria-hidden="true" className="sig__icon">
              {playing ? "❚❚" : finished ? "↺" : "▶"}
            </span>
            {playLabel}
          </button>
          <button
            type="button"
            className="sig__btn sig__btn--quiet"
            onClick={() => {
              autoStarted.current = true;
              setPlaying(false);
              setMode(staged ? "all" : "stage");
            }}
          >
            {staged ? labels.showAll : labels.showOne}
          </button>
        </div>
      </div>
      <ol className="sig__frames">
        {frames.map((frame, i) => (
          <li key={steps[i].id} className={`sig__frame${staged && i === active ? " is-active" : ""}`} data-role={steps[i].id} hidden={staged && i !== active ? true : undefined}>
            <p className="sig__frame-label">
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span> {steps[i].label}
            </p>
            <h3 className="sig__frame-title">{steps[i].title}</h3>
            <div className="sig__artifact">{frame}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
