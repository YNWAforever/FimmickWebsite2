import { t, type Locale } from "@/lib/i18n";
import { hero } from "@/content/home";

/**
 * Homepage hero pipeline: source → AI prepares → people decide → usable result.
 * Server-rendered ordered list; a CSS-only pulse travels along the line and is
 * removed when reduced motion is requested. The review step is the visual anchor.
 */
export function HeroPipeline({ locale }: { locale: Locale }) {
  return (
    <div className="hero-pipeline-wrap">
      <span className="hero-pipeline__pulse" aria-hidden="true" />
      <ol className="hero-pipeline">
        {hero.steps.map((step, i) => (
          <li key={step.role} data-role={step.role}>
            <span className="hero-pipeline__node" aria-hidden="true">
              {step.role === "review" ? "✓" : String(i + 1).padStart(2, "0")}
            </span>
            <span className="hero-pipeline__label">{t(step.label, locale)}</span>
            <span className="hero-pipeline__caption">{t(step.caption, locale)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
