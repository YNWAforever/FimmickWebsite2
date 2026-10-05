import { href, t, type L, type Locale, zh } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { cinema, hero, startOptions } from "@/content/home";
import { solutions } from "@/content/solutions";
import { productById } from "@/content/products";
import { cases, caseKindLabel } from "@/content/cases";
import { objectives, serviceById, services } from "@/content/services";
import { industryById } from "@/content/industries";
import { members, ecosystemBoundary } from "@/content/ecosystem";
import { heatmapColumns, sampleHeatmap } from "@/content/transformation";
import { guides, explainerVideo, workshopResource } from "@/content/resources";
import { explainerMedia } from "@/content/media";
import * as ex from "@/content/examples";
import { ui } from "@/content/ui";
import type { IndustryId, SolutionId } from "@/content/types";
import { casePhotos, industryPhotos, photoCaption } from "@/content/photography";
import { articleIndex, hasEnglish } from "@/lib/resources";
import { Photo } from "@/components/media/Photo";
import { ExplainerPlayer } from "@/components/media/ExplainerPlayer";
import { LinkButton, TextLink } from "@/components/ui";
// The homepage’s link lists (tiles, case photos, pathway rows, industries, ecosystem, shelf) prefetch
// on intent; a full scroll used to fetch some 40 pages (8.2.2). Section buttons still prefetch on sight.
import { HoverPrefetchLink as Link } from "@/components/shell/HoverPrefetchLink";

/**
 * The Chinese sample’s language tag and short label (8.3): on /zh-hans the sample is converted to
 * Simplified, so it is tagged zh-Hans and labelled 简中; elsewhere it is the Traditional original.
 */
const zhSample = (locale: Locale) => (locale === "zh-hans" ? { lang: "zh-Hans", label: zh("簡中", locale) } : { lang: "zh-Hant-HK", label: "繁中" });
import { workstreamCardsData } from "@/components/blocks";
import { SignatureStage } from "./SignatureStage";
import { HeroCard } from "./HeroCard";
import { Headline } from "@/components/motion/Headline";

/** One accented phrase per display headline (Traditional copy is converted for Simplified). */
const accents: Record<string, L> = {
  outputs: { en: "what you get", zh: "再講做法" },
  cases: { en: "how we run our own.", zh: "我們自己也在用" },
  signature: { en: "People decide.", zh: "由人決定" },
  change: { en: "specialists.", zh: "或直接找專家" },
  industries: { en: "Your sector’s rules.", zh: "按你行業的規矩" },
  ecosystem: { en: "we also run.", zh: "我們也在營運" },
  resources: { en: "you can use today.", zh: "今天就用得上" },
  start: { en: "how much", zh: "承擔多少工作" },
  closing: { en: "improve.", zh: "告訴我們" },
};
const accent = (key: string, locale: Locale) => t(accents[key], locale);

type P = { locale: Locale };

/* ------------------------------------------------------------------ 1. hero */

export function CinematicHero({ locale }: P) {
  const card = cinema.heroCard;
  return (
    <section className="cine-hero" aria-labelledby="home-title">
      <div className="cine-hero__copy">
        <p className="eyebrow">{t(hero.eyebrow, locale)}</p>
        <Headline as="h1" id="home-title" className="cine-hero__title" text={`${t(hero.titleLead, locale)}${locale === "en" ? " " : ""}${t(hero.titleAccent, locale)}`} accent={t(hero.titleAccent, locale)} split />
        <p className="cine-hero__body">{t(cinema.heroBody, locale)}</p>
        <div className="btn-row">
          <LinkButton to={href(locale, "/solutions")}>{t(ui.exploreSolutions, locale)}</LinkButton>
          <LinkButton to={href(locale, "/contact?intent=demo")} variant="ghost">
            {t(ui.requestDemo, locale)}
          </LinkButton>
        </div>
        <span className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue__line" />
          {locale === "en" ? "Scroll" : zh("向下捲動", locale)}
        </span>
      </div>
      <div className="cine-hero__media">
        <Photo id="review-desk" locale={locale} priority sizes="(min-width: 1100px) 60vw, 100vw" className="cine-hero__photo" />
        <HeroCard
          label={t(card.label, locale)}
          factsLabel={t(card.facts, locale)}
          facts={ex.heroSample.facts.map((f) => ({ id: f.id, label: t(f.label, locale) }))}
          captions={[
            { lang: "en", runs: ex.captionRuns(ex.heroSample.caption.en, ex.heroSample.facts.map((f) => [f.id, f.phrase.en])) },
            {
              lang: zhSample(locale).lang,
              runs: ex.captionRuns(zh(ex.heroSample.caption.zh, locale), ex.heroSample.facts.map((f) => [f.id, zh(f.phrase.zh, locale)])),
            },
          ]}
          approved={t(card.approved, locale)}
          approve={t(card.approve, locale)}
          ledgerLabel={locale === "en" ? "Workflow stages" : zh("流程階段", locale)}
          ledger={card.ledger.map((step) => ({ role: step.role, label: t(step.label, locale) }))}
          record={{ label: t(card.record, locale), id: ex.heroSample.record }}
          notice={t(card.notice, locale)}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------ 2. business outputs */

function BriefArtifact({ locale }: P) {
  const evidence = ex.intelEvidence.filter((e) => e.topic === "lids").slice(0, 2);
  const check = ex.aisoChecks[0];
  const sourceLabel = (id: string) => t(ex.intelSources.find((s) => s.id === id)!.label, locale);
  return (
    <div className="artifact artifact--doc">
      <p className="artifact__head">
        <span>{locale === "en" ? "Insight brief · sample brand" : zh("洞察簡報·示例品牌", locale)}</span>
        <span>2026-09</span>
      </p>
      <p className="artifact__headline">{t(cinema.brief.headline, locale)}</p>
      <ul className="evidence-list">
        {evidence.map((e) => (
          <li key={e.id} data-tone={e.tone}>
            <q>{t(e.text, locale).replace(/^[“「]|[”」]$/g, "")}</q>
            <span className="evidence-list__src">
              {sourceLabel(e.source)} · {e.date.slice(5)}
            </span>
          </li>
        ))}
      </ul>
      <p className="artifact__row artifact__row--warn">
        <span>{t(cinema.brief.aiso, locale)}</span>
        <strong>{t(cinema.brief.notMentioned, locale)}</strong>
      </p>
      <p className="artifact__priority">{t(cinema.brief.action, locale)}</p>
      <span className="sr-only">{check.assistant}</span>
    </div>
  );
}

function ContentArtifact({ locale }: P) {
  const draft = ex.contentScenarios[0].formats[0].draft;
  return (
    <div className="artifact artifact--captions">
      <div className="caption-card">
        <p className="caption-card__meta">Instagram · EN</p>
        <p lang="en">{draft.en}</p>
      </div>
      <div className="caption-card">
        <p className="caption-card__meta">Instagram · {zhSample(locale).label}</p>
        <p lang={zhSample(locale).lang}>{zh(draft.zh, locale)}</p>
      </div>
      <p className="artifact__check">
        <span aria-hidden="true">✓</span> {t(cinema.content.check, locale)}
      </p>
      <p className="artifact__check artifact__check--human">
        <span aria-hidden="true">✓</span> {t(cinema.content.reviewer, locale)}
      </p>
    </div>
  );
}

function EnquiryArtifact({ locale }: P) {
  const e = ex.enquiries[0];
  const owner = ex.owners.find((o) => o.id === e.suggestedOwner)!;
  return (
    <div className="artifact artifact--enquiry">
      <p className="artifact__head">
        <span>{e.id}</span>
        <span>{t(cinema.enquiry.received, locale)}</span>
      </p>
      <p className="bubble">{t(e.message, locale)}</p>
      <dl className="artifact__grid">
        <div>
          <dt>{locale === "en" ? "Intent" : zh("意圖", locale)}</dt>
          <dd>{t(e.intent, locale)}</dd>
        </div>
        <div>
          <dt>{locale === "en" ? "Priority" : zh("優先次序", locale)}</dt>
          <dd>{t(e.priority, locale)}</dd>
        </div>
        <div>
          <dt>{t(cinema.enquiry.routed, locale)}</dt>
          <dd>{t(owner.label, locale)}</dd>
        </div>
      </dl>
      <p className="artifact__status">{t(cinema.enquiry.waiting, locale)}</p>
    </div>
  );
}

function RecordArtifact({ locale }: P) {
  const change = ex.recordChanges[0];
  const care = change.fields.find((f) => f.changed)!;
  return (
    <div className="artifact artifact--record">
      <p className="artifact__head">
        <span>{change.record}</span>
        <span>{t(change.label, locale)}</span>
      </p>
      <p className="artifact__title">{t(change.preview.title, locale)}</p>
      <div className="diff">
        <p className="diff__field">{t(cinema.record.field, locale)}</p>
        <p className="diff__before">
          <del>{t(care.before, locale)}</del>
        </p>
        <p className="diff__after">
          <ins>{t(care.after, locale)}</ins>
        </p>
      </div>
      <p className="artifact__check">
        <span aria-hidden="true">✓</span> {t(cinema.record.valid, locale)}
      </p>
      <p className="artifact__status">{t(cinema.record.publish, locale)}</p>
    </div>
  );
}

const artifacts: Record<SolutionId, (props: P) => React.ReactElement> = {
  "market-intelligence": BriefArtifact,
  "content-production": ContentArtifact,
  "customer-engagement": EnquiryArtifact,
  "website-operations": RecordArtifact,
};

export function BusinessOutputs({ locale }: P) {
  return (
    <section className="section cine-outputs" aria-labelledby="outputs">
      <div className="container">
        <div className="cine-head reveal">
          <p className="eyebrow" data-chapter="01">{t(cinema.outputs.eyebrow, locale)}</p>
          <Headline id="outputs" text={t(cinema.outputs.title, locale)} accent={accent("outputs", locale)} />
        </div>
        <div className="output-grid">
          {solutions.map((s) => {
            const Artifact = artifacts[s.id];
            const featured = s.id === "content-production";
            return (
              <article key={s.id} className={`output-tile reveal${featured ? " output-tile--featured" : ""}`} data-solution={s.id}>
                <div className="output-tile__stage">
                  {featured ? <Photo id="specialist-studio" locale={locale} crop="portrait" sizes="(min-width: 1100px) 22vw, (min-width: 700px) 40vw, 90vw" label="caption" className="output-tile__photo" /> : null}
                  <div className="output-tile__paper">
                    <span className="sample-tag">{t(cinema.outputs.sample, locale)}</span>
                    <Artifact locale={locale} />
                  </div>
                </div>
                <div className="output-tile__meta">
                  <span className="number-tag">{s.number}</span>
                  <div>
                    <h3>
                      <Link href={href(locale, paths.solution(s.id))}>{t(cinema.outputs.names[s.id], locale)}</Link>
                    </h3>
                    <p className="output-tile__solution">{t(s.name, locale)}</p>
                    <p className="output-tile__products">{s.products.map((p) => productById(p).name).join(" · ")}</p>
                  </div>
                  <span className="output-tile__go" aria-hidden="true">
                    →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
        <p className="cine-foot">
          <TextLink to={href(locale, "/solutions")}>{locale === "en" ? "Compare all four solutions" : zh("比較四項解決方案", locale)}</TextLink>
          <TextLink to={href(locale, "/cases-and-demos")}>{locale === "en" ? "Try the working examples" : zh("試用互動示例", locale)}</TextLink>
        </p>
        <p className="micro muted photo-caption">{t(photoCaption, locale)}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- 3. case evidence */

export function CaseEvidence({ locale }: P) {
  const internal = cases.find((c) => c.kind === "internal-application")!;
  const clientCases = Object.keys(casePhotos).map((slug) => cases.find((c) => c.slug === slug)!);
  const before = t(internal.workflowBefore, locale);
  const after = t(internal.workflowAfter, locale);
  return (
    <section className="section section--surface cine-evidence" aria-labelledby="cases">
      <div className="container">
        <div className="cine-head cine-head--row reveal">
          <div>
            <p className="eyebrow" data-chapter="02">{t(cinema.evidence.eyebrow, locale)}</p>
            <Headline id="cases" text={t(cinema.evidence.title, locale)} accent={accent("cases", locale)} />
          </div>
          <LinkButton to={href(locale, "/case-studies")} variant="ghost" small>
            {locale === "en" ? "Case library" : zh("案例庫", locale)}
          </LinkButton>
        </div>
        <Link className="shift reveal" href={href(locale, paths.case(internal.slug))}>
          <div className="shift__intro">
            <span className="chip chip--lime">{t(caseKindLabel[internal.kind], locale)}</span>
            <h3>{t(internal.title, locale)}</h3>
            <span className="card-foot">
              {t(cinema.evidence.read, locale)} <span aria-hidden="true">→</span>
            </span>
          </div>
          <div className="shift__cols">
            <div className="shift__col shift__col--before">
              <p className="shift__tag">{t(cinema.evidence.before, locale)}</p>
              <ul>
                {before.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <span className="shift__arrow" aria-hidden="true">
              →
            </span>
            <div className="shift__col shift__col--after">
              <p className="shift__tag">{t(cinema.evidence.after, locale)}</p>
              <ul>
                {after.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </Link>
        <div className="case-photos">
          {clientCases.map((c, i) => (
            <Link key={c.slug} data-cursor={t(cinema.evidence.read, locale)} className="case-photo reveal" style={{ ["--delay" as string]: `${i * 80}ms` }} href={href(locale, paths.case(c.slug))}>
              <Photo id={casePhotos[c.slug]} locale={locale} sizes="(min-width: 900px) 30vw, 90vw" label="caption" className="case-photo__img" />
              <div className="case-photo__body">
                <p className="card-meta">
                  <span className="chip chip--sky">{t(caseKindLabel[c.kind], locale)}</span>
                  {t(c.sector, locale)} · {t(c.market, locale)}
                </p>
                <h3>{t(c.title, locale)}</h3>
                <p className="case-photo__outcome">{t(c.outcome, locale)}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="micro muted cine-note">{t(cinema.evidence.note, locale)}</p>
        <p className="micro muted photo-caption">{t(photoCaption, locale)}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------ 4. signature workflow */

export function SignatureWorkflow({ locale }: P) {
  const s = cinema.signature;
  const launch = ex.contentScenarios[0];
  const draft = launch.formats[0].draft;
  const firstSentence = (text: string) => text.split(/(?<=[.。])\s*/)[0];
  const facts = t(ex.contentFacts, locale);
  const frames = [
    <div key="source" className="frame frame--facts">
      <p className="frame__brief">{t(s.brief, locale)}</p>
      <ul className="fact-list">
        {facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>,
    <div key="work" className="frame frame--drafts">
      <div className="caption-card caption-card--night">
        <p className="caption-card__meta">EN</p>
        <p lang="en">{firstSentence(draft.en)} …</p>
      </div>
      <div className="caption-card caption-card--night">
        <p className="caption-card__meta">{zhSample(locale).label}</p>
        <p lang={zhSample(locale).lang}>{zh(firstSentence(draft.zh), locale)} …</p>
      </div>
      <p className="frame__check">
        <span aria-hidden="true">✓</span> {t(s.linked, locale)} · {t(cinema.content.check, locale)}
      </p>
    </div>,
    <div key="review" className="frame frame--review">
      <p className="frame__decision frame__decision--ok">
        <span aria-hidden="true">✓</span> {t(s.captionOk, locale)} <span className="frame__pill">{t(s.edit, locale)}</span>
      </p>
      <p className="frame__decision frame__decision--back">
        <span aria-hidden="true">↩</span> {t(s.visualBack, locale)}
      </p>
      <p className="frame__who">{t(s.reviewer, locale)}</p>
    </div>,
    <div key="result" className="frame frame--export">
      <ul className="file-list">
        {s.files.map((f) => (
          <li key={f.en}>{t(f, locale)}</li>
        ))}
      </ul>
      <p className="frame__check">
        <span aria-hidden="true">↻</span> {t(s.reuse, locale)}
      </p>
    </div>,
  ];
  return (
    <section className="section chapter-night" aria-labelledby="signature">
      {/* Decorative: the four moments repeat as a band that slides while the chapter rises into
          view, then rests with the review moment centred (data-rest; offset set by Motion.tsx).
          The stage below carries the content. The hairlines sit outside the edge mask. */}
      <div className="marquee-band" aria-hidden="true">
        <div className="marquee">
          <div className="marquee__track">
            {[0, 1].map((copy) => (
              <span key={copy} className="marquee__run">
                {s.steps.map((st) => (
                  <span key={st.id} className="marquee__item" data-role={st.id} data-rest={copy === 0 && st.id === "review" ? "" : undefined}>
                    {t(st.title, locale)}
                    <span className="marquee__dot" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="cine-head reveal">
          <p className="eyebrow" data-chapter="03">{t(s.eyebrow, locale)}</p>
          <Headline id="signature" text={t(s.title, locale)} accent={accent("signature", locale)} />
          <p className="lead">{t(s.lead, locale)}</p>
        </div>
        <SignatureStage
          steps={s.steps.map((st) => ({ id: st.id, label: t(st.label, locale), title: t(st.title, locale) }))}
          frames={frames}
          labels={{
            play: t(s.play, locale),
            pause: t(s.pause, locale),
            replay: locale === "en" ? "Replay" : zh("重播", locale),
            showAll: t(s.showAll, locale),
            showOne: t(s.showOne, locale),
            step: locale === "en" ? "Step" : zh("步驟", locale),
          }}
        />
        <p className="cine-foot">
          <TextLink to={href(locale, "/platform")}>{t(s.platformLink, locale)}</TextLink>
          <TextLink to={href(locale, "/resources/videos")}>{t(s.filmLink, locale)}</TextLink>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------- 5. transformation and services */

function MiniHeatmap({ locale }: P) {
  const en = locale === "en";
  return (
    <figure className="mini-heat">
      <table>
        <caption className="sr-only">{t(cinema.pathways.transformation.deliverable, locale)}</caption>
        <thead>
          <tr>
            <td />
            {heatmapColumns.map((c) => (
              <th key={c.en} scope="col">
                {t(c, locale)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleHeatmap.map((row) => (
            <tr key={row.area.en}>
              <th scope="row">{t(row.area, locale)}</th>
              {row.ratings.map((r, i) => (
                <td key={i} className={`r${r}`}>
                  {r}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption>
        {t(cinema.pathways.transformation.deliverable, locale)} · {en ? "Sample scores" : zh("示例分數", locale)}
      </figcaption>
    </figure>
  );
}

function ServiceSample({ locale }: P) {
  const service = serviceById("seo-aeo");
  return (
    <figure className="svc-sample">
      <dl>
        {t(service.sample.rows, locale).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <figcaption>
        {t(cinema.pathways.services.deliverable, locale)} · <Link href={href(locale, paths.service(service.id))}>{t(service.name, locale)}</Link>
      </figcaption>
    </figure>
  );
}

export function Pathways({ locale }: P) {
  const p = cinema.pathways;
  return (
    <section className="section cine-paths" aria-labelledby="change">
      <div className="container">
        <div className="cine-head reveal">
          <p className="eyebrow" data-chapter="04">{t(p.eyebrow, locale)}</p>
          <Headline id="change" text={t(p.title, locale)} accent={accent("change", locale)} />
        </div>
        <div className="doors">
          <article className="door reveal">
            <Photo id="workshop-wall" locale={locale} sizes="(min-width: 900px) 45vw, 92vw" label="caption" className="door__photo" />
            <div className="door__body">
              <p className="door__label">{t(p.transformation.label, locale)}</p>
              <h3>{t(p.transformation.title, locale)}</h3>
              <ol className="door__list">
                {workstreamCardsData(locale).map((w) => (
                  <li key={w.id}>
                    <Link href={w.href}>
                      <span>{w.code}</span> {w.name}
                    </Link>
                  </li>
                ))}
              </ol>
              <MiniHeatmap locale={locale} />
              <div className="btn-row">
                <LinkButton to={href(locale, "/ai-transformation")}>{t(p.transformation.label, locale)}</LinkButton>
                <TextLink to={href(locale, paths.contact({ intent: "transformation" }))}>{t(p.transformation.cta, locale)}</TextLink>
              </div>
            </div>
          </article>
          <article className="door door--services reveal" style={{ ["--delay" as string]: "100ms" }}>
            <Photo id="specialist-desk" locale={locale} sizes="(min-width: 900px) 45vw, 92vw" label="caption" className="door__photo" />
            <div className="door__body">
              <p className="door__label">{t(p.services.label, locale)}</p>
              <h3>{t(p.services.title, locale)}</h3>
              <p className="muted">{t(p.services.body, locale)}</p>
              <ul className="objective-pills">
                {objectives.map((o) => (
                  <li key={o.id}>
                    <Link href={`${href(locale, "/services")}?objective=${o.id}`}>
                      <strong>{t(o.name, locale)}</strong>
                      <span>
                        {services.filter((s) => s.objective === o.id).length} {t(p.services.count, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ServiceSample locale={locale} />
              <div className="btn-row">
                <LinkButton to={href(locale, "/services")}>{locale === "en" ? "All services" : zh("全部服務", locale)}</LinkButton>
                <TextLink to={href(locale, paths.contact({ intent: "service" }))}>{t(p.services.cta, locale)}</TextLink>
              </div>
            </div>
          </article>
        </div>
        <p className="micro muted photo-caption">{t(photoCaption, locale)}</p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- 6. industries */

export function IndustryPhotos({ locale }: P) {
  const ids = Object.keys(industryPhotos) as IndustryId[];
  return (
    <section className="section section--surface cine-industries" aria-labelledby="industries">
      <div className="container">
        <div className="cine-head cine-head--row reveal">
          <div>
            <p className="eyebrow" data-chapter="05">{t(cinema.industries.eyebrow, locale)}</p>
            <Headline id="industries" text={t(cinema.industries.title, locale)} accent={accent("industries", locale)} />
          </div>
          <TextLink to={href(locale, "/industries")}>{t(cinema.industries.all, locale)}</TextLink>
        </div>
        <ul className="industry-reel">
          {ids.map((id, i) => {
            const ind = industryById(id);
            return (
              <li key={id} className="reveal" style={{ ["--delay" as string]: `${i * 70}ms` }}>
                <Link className="industry-shot" data-cursor={locale === "en" ? "Explore" : zh("探索", locale)} href={href(locale, paths.industry(id))}>
                  <Photo id={industryPhotos[id]} locale={locale} crop="portrait" sizes="(min-width: 1000px) 24vw, (min-width: 600px) 45vw, 80vw" label="caption" className="industry-shot__img" />
                  <span className="industry-shot__text">
                    <strong>{t(ind.name, locale)}</strong>
                    <span>{t(ind.output, locale)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="micro muted photo-caption">{t(photoCaption, locale)}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 7. ecosystem */

export function EcosystemTiles({ locale }: P) {
  return (
    <section className="section cine-eco" aria-labelledby="ecosystem">
      <div className="container cine-eco__grid">
        <div className="cine-eco__visual">
          <Photo id="community-event" locale={locale} crop="art" sizes="(min-width: 1000px) 40vw, 92vw" label="caption" className="cine-eco__photo" />
        </div>
        <div>
          <div className="cine-head reveal">
            <p className="eyebrow" data-chapter="06">{t(cinema.ecosystem.eyebrow, locale)}</p>
            <Headline id="ecosystem" text={t(cinema.ecosystem.title, locale)} accent={accent("ecosystem", locale)} />
          </div>
          <ul className="brand-tiles">
            {members.map((m) => (
              <li key={m.id} data-group={m.group}>
                <Link href={href(locale, paths.member(m.id))}>
                  <strong>{m.name}</strong>
                  <span className="brand-tiles__role">{t(m.role, locale)}</span>
                  <span className="brand-tiles__rel">{t(cinema.ecosystem.tags[m.id], locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="micro muted cine-note">{t(ecosystemBoundary, locale)}</p>
          <p className="micro muted photo-caption">{t(photoCaption, locale)}</p>
          <p className="cine-foot">
            <TextLink to={href(locale, "/fimmick-ecosystem")}>{locale === "en" ? "Ecosystem overview" : zh("生態系統概覽", locale)}</TextLink>
            <TextLink to={href(locale, "/about/our-story")}>{locale === "en" ? "Our story" : zh("我們的故事", locale)}</TextLink>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 8. resources */

export function ResourcePreviews({ locale }: P) {
  const r = cinema.resources;
  const guide = guides[0];
  const file = locale === "en" ? "en" : "zh-hant";
  const latest = articleIndex.find((a) => (locale === "en" ? hasEnglish(a) : a.locales[locale])) ?? articleIndex[0];
  const meta = latest.locales[locale] ?? latest.locales.en!;
  return (
    <section className="section section--surface cine-resources" aria-labelledby="resources">
      <div className="container">
        <div className="cine-head cine-head--row reveal">
          <div>
            <p className="eyebrow" data-chapter="07">{t(r.eyebrow, locale)}</p>
            <Headline id="resources" text={t(r.title, locale)} accent={accent("resources", locale)} />
          </div>
          <LinkButton to={href(locale, "/resources")} variant="ghost" small>
            {locale === "en" ? "Resource Centre" : zh("資源中心", locale)}
          </LinkButton>
        </div>
        <div className="shelf">
          <div className="shelf__film">
            <ExplainerPlayer locale={locale} media={explainerMedia} title={t(explainerVideo.title, locale)} compact />
            <p className="micro muted">
              <span className="chip">{locale === "en" ? "Video · 42 s" : zh("影片·42 秒", locale)}</span> {t(explainerVideo.mode, locale)}{" "}
              <Link href={href(locale, "/resources/videos")}>{locale === "en" ? "Transcript and captions" : zh("文字稿及字幕", locale)}</Link>
            </p>
          </div>
          <Link className="shelf__item shelf__item--guide" href={href(locale, "/resources/guides")}>
            <span className="guide-sheet">
              {/* eslint-disable-next-line @next/next/no-img-element -- static preview rendered from the guide source */}
              <img src={`/media/guides/${guide.slug}-${file}.webp`} alt={`${t(r.guidePreview, locale)}: ${t(guide.title, locale)}`} width={480} height={452} loading="lazy" decoding="async" />
            </span>
            <span className="chip chip--lime">{t(r.guide, locale)}</span>
            <strong>{t(guide.title, locale)}</strong>
          </Link>
          <div className="shelf__stack">
            <Link className="shelf__item shelf__item--article" href={href(locale, paths.article(latest.slug))}>
              <span className="card-meta">
                <span className="chip">{t(r.article, locale)}</span> {latest.published}
              </span>
              <strong>{meta.title}</strong>
            </Link>
            <Link className="shelf__item shelf__item--workshop" href={href(locale, "/workshop")}>
              <Photo id="workshop-wall" locale={locale} sizes="320px" label="none" decorative className="shelf__thumb" />
              <span>
                <span className="chip chip--magenta">{t(r.workshop, locale)}</span>
                <strong>{t(workshopResource.title, locale)}</strong>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/* --------------------------------------------------- 9. start and closing */

const shares: Record<string, number> = { product: 70, deployment: 50, managed: 25 };

export function StartDecision({ locale }: P) {
  const en = locale === "en";
  return (
    <section className="section cine-start" aria-labelledby="start">
      <div className="container">
        <div className="cine-head cine-head--row reveal">
          <div>
            <p className="eyebrow" data-chapter="08">{en ? "How to start" : zh("如何開始", locale)}</p>
            <Headline id="start" text={en ? "Choose how much you want FIMMICK to do." : zh("選擇由 FIMMICK 承擔多少工作。", locale)} accent={accent("start", locale)} />
          </div>
          <TextLink to={href(locale, "/how-to-start")}>{en ? "Compare options" : zh("比較選項", locale)}</TextLink>
        </div>
        <ol className="decision">
          {startOptions.map((o, i) => (
            <li key={o.id} className="decision__opt reveal" style={{ ["--delay" as string]: `${i * 80}ms` }}>
              <span className="decision__scale" aria-hidden="true" style={{ ["--you" as string]: `${shares[o.id]}%` }}>
                <span className="decision__you">{t(cinema.start.you, locale)}</span>
                <span className="decision__us">{t(cinema.start.us, locale)}</span>
              </span>
              <h3>
                <span className="decision__n">0{i + 1}</span> {t(o.title, locale)}
              </h3>
              <p className="muted">{t(o.forWho, locale)}</p>
              <Link className="text-link" href={href(locale, paths.contact({ intent: o.intent as never }))}>
                {t(o.cta, locale)} <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="partner-line">
          {en ? "Brand, community or venture partner? " : zh("品牌、社群或項目合作夥伴？", locale)}
          <Link href={href(locale, paths.contact({ intent: "partnership" }))}>{en ? "Explore an ecosystem partnership →" : zh("探討生態系統合作 →", locale)}</Link>
        </p>
      </div>
    </section>
  );
}

export function ClosingChapter({ locale }: P) {
  // The stage paints the white seen past the sheet’s rounded corners while it scales in.
  return (
    <div className="closing-stage">
      <section className="closing" aria-labelledby="closing">
        <Photo id="night-table" locale={locale} crop="art" sizes="100vw" label="none" decorative className="closing__photo" />
        <div className="container closing__inner">
          <Headline id="closing" text={t(cinema.closing.title, locale)} accent={accent("closing", locale)} />
          <p>{t(cinema.closing.body, locale)}</p>
          <div className="btn-row">
            <LinkButton to={href(locale, "/contact?intent=demo")} variant="accent">
              {t(ui.requestDemo, locale)}
            </LinkButton>
            <LinkButton to={href(locale, "/how-to-start")} variant="light">
              {locale === "en" ? "How to start" : zh("如何開始", locale)}
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
