import type { Metadata } from "next";
import Link from "next/link";
import { href, isLocale, t, type Locale, zh } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/routes";
import { hero, homeFaqs, sections, startOptions } from "@/content/home";
import { solutions } from "@/content/solutions";
import { productById } from "@/content/products";
import { cases, caseKindLabel } from "@/content/cases";
import { objectives, services } from "@/content/services";
import { guides, explainerVideo } from "@/content/resources";
import { ui } from "@/content/ui";
import { HeroPipeline } from "@/components/diagrams/HeroPipeline";
import { ExampleTabs, EcosystemMapBlock, HeatmapTable, IndustryMapBlock, PlatformLayersBlock, workstreamCardsData } from "@/components/blocks";
import { CtaBand, Faq, LinkButton, SectionHead, TextLink } from "@/components/ui";
import { ExplainerPlayer } from "@/components/media/ExplainerPlayer";
import { explainerMedia } from "@/content/media";
import { articleIndex } from "@/lib/resources";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...pageMetadata({
      locale,
      path: "/",
      title: locale === "en" ? "FIMMICK — Agentic AI Platform & Business Solutions" : zh("FIMMICK — 企業 AI 智能體平台與業務解決方案", locale),
      description: t(hero.body, locale),
    }),
    title: { absolute: locale === "en" ? "FIMMICK — Agentic AI Platform & Business Solutions" : zh("FIMMICK — 企業 AI 智能體平台與業務解決方案", locale) },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const en = locale === "en";
  const internal = cases.find((c) => c.kind === "internal-application")!;
  const clientCases = ["real-estate-sales-follow-up", "hotel-guest-experience-recovery", "omni-channel-retail-intelligence"].map((s) => cases.find((c) => c.slug === s)!);
  const latestArticle = articleIndex.find((a) => a.locales[locale]) ?? articleIndex[0];
  const articleMeta = latestArticle.locales[locale] ?? latestArticle.locales.en!;

  return (
    <>
      {/* 1. Hero */}
      <section className="home-hero section--night">
        <div className="container">
          <div className="home-hero__copy">
            <p className="eyebrow">{t(hero.eyebrow, locale)}</p>
            <h1 className="home-hero__title">
              {t(hero.titleLead, locale)} <span className="home-hero__accent">{t(hero.titleAccent, locale)}</span>
            </h1>
            <p className="lead">{t(hero.body, locale)}</p>
            <p className="home-hero__support">{t(hero.support, locale)}</p>
            <div className="btn-row">
              <LinkButton to={href(locale, "/solutions")} variant="light">{t(ui.exploreSolutions, locale)}</LinkButton>
              <LinkButton to={href(locale, "/contact?intent=demo")} variant="ghost">
                {t(ui.requestDemo, locale)}
              </LinkButton>
            </div>
            <p className="micro home-hero__line">{en ? "FIMMICK AIP — Agentic AI Platform · AI for Real Business Impact." : zh("FIMMICK AIP — 企業 AI 智能體平台 · AI for Real Business Impact.", locale)}</p>
          </div>
          <HeroPipeline locale={locale} />
        </div>
      </section>

      {/* 2. Choose the work */}
      <section className="section" aria-labelledby="choose-work">
        <div className="container">
          <SectionHead eyebrow={t(sections.chooseWork.eyebrow, locale)} title={<span id="choose-work">{t(sections.chooseWork.title, locale)}</span>} action={<TextLink to={href(locale, "/solutions")}>{en ? "Compare all four" : zh("比較四項工作", locale)}</TextLink>} />
          <div className="job-grid">
            {solutions.map((s, index) => (
              <Link key={s.id} href={href(locale, paths.solution(s.id))} className="job-card reveal" style={{ ["--delay" as string]: `${index * 80}ms` }}>
                <span className="number-tag">{s.number}</span>
                <h3>{t(s.name, locale)}</h3>
                <p className="muted">{t(s.job, locale)}</p>
                <div className="job-card__deliverable">
                  <span>{en ? "You receive" : zh("你會得到", locale)}</span>
                  <p>{t(s.deliverable, locale)}</p>
                </div>
                <ul className="chips">
                  {s.products.map((p) => (
                    <li key={p}>
                      <span className="chip chip--magenta">{productById(p).name}</span>
                    </li>
                  ))}
                </ul>
                <span className="card-foot">
                  {en ? "See the workflow" : zh("查看流程", locale)} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Inspect an example */}
      <section className="section section--surface" aria-labelledby="inspect">
        <div className="container">
          <SectionHead eyebrow={t(sections.inspect.eyebrow, locale)} title={<span id="inspect">{t(sections.inspect.title, locale)}</span>} lead={en ? "Four working examples with fixed sample data. Change the inputs and the prepared work, review state and output change with them." : zh("四個以固定示例資料運作的示例。改變輸入，準備好的工作、審閱狀態及輸出都會一同改變。", locale)} />
          <ExampleTabs locale={locale} initial="content" />
        </div>
      </section>

      {/* 4. Case studies */}
      <section className="section" aria-labelledby="cases">
        <div className="container">
          <SectionHead eyebrow={t(sections.cases.eyebrow, locale)} title={<span id="cases">{t(sections.cases.title, locale)}</span>} action={<LinkButton to={href(locale, "/case-studies")} variant="ghost" small>{en ? "Case library" : zh("案例庫", locale)}</LinkButton>} />
          <div className="cases-feature">
            <Link className="case-hero reveal" href={href(locale, paths.case(internal.slug))}>
              <span className="chip chip--lime">{t(caseKindLabel[internal.kind], locale)}</span>
              <h3>{t(internal.title, locale)}</h3>
              <p>{t(internal.problem, locale)}</p>
              <ul className="case-hero__flow">
                {t(internal.workflowAfter, locale).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <span className="card-foot">
                {en ? "Read how we did it" : zh("了解我們的做法", locale)} <span aria-hidden="true">→</span>
              </span>
            </Link>
            <div className="cases-list">
              {clientCases.map((c, index) => (
                <Link key={c.slug} className="case-row reveal" style={{ ["--delay" as string]: `${index * 80}ms` }} href={href(locale, paths.case(c.slug))}>
                  <span className="card-meta">
                    <span className="chip chip--sky">{t(caseKindLabel[c.kind], locale)}</span>
                    {t(c.sector, locale)} · {t(c.market, locale)}
                  </span>
                  <strong>{t(c.title, locale)}</strong>
                  <span className="small muted">{t(c.humanDecisions, locale)}</span>
                </Link>
              ))}
              <p className="micro muted">
                {en
                  ? "Client cases are anonymised summaries; figures from the previous site are withheld until their scope and dates are documented. Product examples on this site are labelled separately as samples."
                  : zh("客戶案例為匿名摘要；舊網站的數字在記錄範圍及日期前暫不引用。本網站的產品示例另行標示為示例。", locale)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Platform */}
      <section className="section section--night" aria-labelledby="platform">
        <div className="container">
          <SectionHead
            eyebrow={t(sections.platform.eyebrow, locale)}
            title={<span id="platform">{t(sections.platform.title, locale)}</span>}
            lead={en ? "FIMMICK AIP — Agentic AI Platform coordinates configured work: the data it may use, the tasks it prepares, where people decide and what gets recorded." : zh("FIMMICK AIP — 企業 AI 智能體平台協調已配置的工作：可用的資料、準備的任務、由人決定的環節，以及需要記錄的內容。", locale)}
            action={<LinkButton to={href(locale, "/platform")} variant="ghost" small>{en ? "Full platform story" : zh("完整平台介紹", locale)}</LinkButton>}
          />
          <PlatformLayersBlock locale={locale} />
        </div>
      </section>

      {/* 6. AI Transformation & Services */}
      <section className="section" aria-labelledby="change">
        <div className="container">
          <SectionHead eyebrow={t(sections.change.eyebrow, locale)} title={<span id="change">{t(sections.change.title, locale)}</span>} />
          <div className="gateways">
            <div className="gateway reveal">
              <p className="eyebrow">{en ? "AI Transformation" : zh("AI 轉型", locale)}</p>
              <h3>{en ? "For leaders planning the change" : zh("為規劃轉變的管理層而設", locale)}</h3>
              <p className="muted">{en ? "Readiness, roadmap, workflow design and governance — the decisions behind a responsible AI programme." : zh("準備度、路線圖、流程設計及管治——負責任 AI 計劃背後的決策。", locale)}</p>
              <ul className="gateway-list">
                {workstreamCardsData(locale).map((w) => (
                  <li key={w.id}>
                    <Link href={w.href}>
                      <span>{w.code}</span> {w.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="micro muted" style={{ fontWeight: 750, marginTop: 18 }}>{en ? "Example deliverable" : zh("成果示例", locale)}</p>
              <HeatmapTable locale={locale} />
              <div className="btn-row" style={{ marginTop: 20 }}>
                <LinkButton to={href(locale, "/ai-transformation")}>{en ? "AI Transformation" : zh("AI 轉型", locale)}</LinkButton>
                <TextLink to={href(locale, paths.contact({ intent: "transformation" }))}>{en ? "Discuss a transformation scope" : zh("討論轉型範圍", locale)}</TextLink>
              </div>
            </div>
            <div className="gateway gateway--services reveal" style={{ ["--delay" as string]: "100ms" }}>
              <p className="eyebrow">{en ? "Services" : zh("專業服務", locale)}</p>
              <h3>{en ? "For teams that need specialists" : zh("為需要專家的團隊而設", locale)}</h3>
              <p className="muted">{en ? "Sixteen services with defined deliverables. Commission a service on its own — no AIP subscription required." : zh("十六項服務，每項都有明確交付成果；可單獨委託，無須訂閱 AIP。", locale)}</p>
              <div className="objective-grid">
                {objectives.map((o) => (
                  <div key={o.id}>
                    <p className="objective-name">{t(o.name, locale)}</p>
                    <ul>
                      {services
                        .filter((s) => s.objective === o.id)
                        .map((s) => (
                          <li key={s.id}>
                            <Link href={href(locale, paths.service(s.id))}>{t(s.name, locale)}</Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="btn-row" style={{ marginTop: 20 }}>
                <LinkButton to={href(locale, "/services")}>{en ? "All services" : zh("全部服務", locale)}</LinkButton>
                <TextLink to={href(locale, paths.contact({ intent: "service" }))}>{en ? "Discuss a service" : zh("討論服務", locale)}</TextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Industry application */}
      <section className="section section--surface" aria-labelledby="industries">
        <div className="container">
          <SectionHead
            eyebrow={t(sections.industries.eyebrow, locale)}
            title={<span id="industries">{t(sections.industries.title, locale)}</span>}
            action={<TextLink to={href(locale, "/industries")}>{en ? "All eight industries" : zh("全部八個行業", locale)}</TextLink>}
          />
          <IndustryMapBlock locale={locale} ids={["property-real-estate", "retail-ecommerce", "b2b-professional-services", "hospitality-travel"]} />
        </div>
      </section>

      {/* 8. Built by FIMMICK */}
      <section className="section section--eco" aria-labelledby="ecosystem">
        <div className="container">
          <SectionHead
            eyebrow={t(sections.ecosystem.eyebrow, locale)}
            title={<span id="ecosystem">{t(sections.ecosystem.title, locale)}</span>}
            lead={en ? "Beyond client work, FIMMICK builds and runs its own platforms, communities and ventures — practical experience in technology, creators, communities, commerce and culture." : zh("除客戶項目外，FIMMICK 亦建立及營運自家平台、社群及項目——在技術、創作者、社群、商業及文化方面累積實戰經驗。", locale)}
            action={
              <div className="btn-row">
                <LinkButton to={href(locale, "/fimmick-ecosystem")} variant="ghost" small>{en ? "Ecosystem overview" : zh("生態系統概覽", locale)}</LinkButton>
                <TextLink to={href(locale, "/about/our-story")}>{en ? "Our story" : zh("我們的故事", locale)}</TextLink>
              </div>
            }
          />
          <EcosystemMapBlock locale={locale} />
        </div>
      </section>

      {/* 9. Resources */}
      <section className="section section--surface" aria-labelledby="resources">
        <div className="container">
          <SectionHead eyebrow={t(sections.resources.eyebrow, locale)} title={<span id="resources">{t(sections.resources.title, locale)}</span>} action={<LinkButton to={href(locale, "/resources")} variant="ghost" small>{en ? "Resource Centre" : zh("資源中心", locale)}</LinkButton>} />
          <div className="resource-feature">
            <div className="resource-video">
              <ExplainerPlayer locale={locale} media={explainerMedia} title={t(explainerVideo.title, locale)} compact />
              <p className="micro muted" style={{ marginTop: 10 }}>
                <span className="chip">{en ? "Video" : zh("影片", locale)}</span> {t(explainerVideo.mode, locale)}{" "}
                <Link href={href(locale, "/resources/videos")}>{en ? "Transcript and captions" : zh("文字稿及字幕", locale)}</Link>
              </p>
            </div>
            <div className="resource-stack">
              <Link className="card card--link" href={href(locale, "/resources/guides")}>
                <span className="card-meta">
                  <span className="chip chip--lime">{en ? "Guide · PDF" : zh("指南・PDF", locale)}</span>
                </span>
                <h3>{t(guides[0].title, locale)}</h3>
                <p className="small muted">{t(guides[0].summary, locale)}</p>
              </Link>
              <Link className="card card--link" href={href(locale, paths.article(latestArticle.slug))}>
                <span className="card-meta">
                  <span className="chip">{en ? "Article" : zh("文章", locale)}</span>
                  {latestArticle.published}
                </span>
                <h3>{articleMeta.title}</h3>
              </Link>
              <Link className="card card--link" href={href(locale, "/workshop")}>
                <span className="card-meta">
                  <span className="chip chip--magenta">{en ? "Workshop · on request" : zh("工作坊・按需安排", locale)}</span>
                </span>
                <h3>{en ? "AI Transformation Workshop for leadership teams" : zh("管理團隊 AI 轉型工作坊", locale)}</h3>
                <p className="small muted">{en ? "Past events are in the Events archive; new dates are announced there when confirmed." : zh("過往活動見活動檔案；新活動日期確認後會於該處公布。", locale)}</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. How to start */}
      <section className="section" aria-labelledby="start">
        <div className="container">
          <SectionHead eyebrow={t(sections.start.eyebrow, locale)} title={<span id="start">{t(sections.start.title, locale)}</span>} action={<TextLink to={href(locale, "/how-to-start")}>{en ? "Compare options" : zh("比較選項", locale)}</TextLink>} />
          <div className="start-grid">
            {startOptions.map((o, index) => (
              <div key={o.id} className="start-card reveal" style={{ ["--delay" as string]: `${index * 80}ms` }}>
                <span className="number-tag">0{index + 1}</span>
                <h3>{t(o.title, locale)}</h3>
                <p className="muted">{t(o.forWho, locale)}</p>
                <ul className="check-list small">
                  {t(o.includes, locale).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <Link className="text-link" href={href(locale, paths.contact({ intent: o.intent as never }))}>
                  {t(o.cta, locale)} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
          <p className="partner-line">
            {en ? "Brand, community or venture partner? " : zh("品牌、社群或項目合作夥伴？", locale)}
            <Link href={href(locale, paths.contact({ intent: "partnership" }))}>{en ? "Explore an ecosystem partnership →" : zh("探討生態系統合作 →", locale)}</Link>
          </p>
        </div>
      </section>

      {/* 11. FAQs and enquiry */}
      <section className="section section--surface" aria-labelledby="faq">
        <div className="container split">
          <div>
            <SectionHead eyebrow={t(sections.faq.eyebrow, locale)} title={<span id="faq">{t(sections.faq.title, locale)}</span>} />
          </div>
          <Faq items={homeFaqs} locale={locale} />
        </div>
        <div className="container" style={{ marginTop: 56 }}>
          <CtaBand
            title={en ? "Tell us which work you want to improve." : zh("告訴我們你想改善哪項工作。", locale)}
            body={en ? "We reply by email to arrange a conversation. Sending a request does not book a meeting until we confirm a time with you." : zh("我們會以電郵回覆安排傾談。在與你確認時間前，提交要求並不代表已預約會面。", locale)}
            actions={
              <>
                <LinkButton to={href(locale, "/contact?intent=demo")} variant="accent">
                  {t(ui.requestDemo, locale)}
                </LinkButton>
                <LinkButton to={href(locale, "/how-to-start")} variant="light">
                  {en ? "How to start" : zh("如何開始", locale)}
                </LinkButton>
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
