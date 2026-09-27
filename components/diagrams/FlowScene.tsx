import { t, type Locale } from "@/lib/i18n";
import { contentFacts, contentScenarios, sampleNotice } from "@/content/examples";

/**
 * Signature visual: source → prepared work → human decision → usable result.
 * Static, server-rendered and fully readable without motion. CSS stages a
 * brief arrival only when reduced motion is not requested.
 */
export function FlowScene({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const facts = t(contentFacts, locale).slice(0, 4);
  const draft = t(contentScenarios[0].formats[0].draft, locale);
  return (
    <figure className="flow-scene" aria-labelledby="flow-scene-caption">
      <div className="flow-scene__bar">
        <span>
          <strong>{en ? "Workflow" : "流程"}</strong> · {en ? "Product launch content" : "新品推出內容"}
        </span>
        <span className="notice">{t(sampleNotice, locale)}</span>
      </div>
      <ol className="flow-rail">
        <li className="flow-step" data-role="source">
          <span className="flow-node" aria-hidden="true">01</span>
          <div className="flow-card">
            <p className="flow-card__label">
              <span>{en ? "Source" : "來源"}</span>
              <em>{en ? "Approved facts" : "已確認資料"}</em>
            </p>
            <ul>
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </li>
        <li className="flow-step" data-role="work">
          <span className="flow-node" aria-hidden="true">02</span>
          <div className="flow-card">
            <p className="flow-card__label">
              <span>{en ? "Prepared work" : "準備好的工作"}</span>
              <em>{en ? "Instagram caption · draft" : "Instagram 文案・草稿"}</em>
            </p>
            <blockquote>{draft}</blockquote>
          </div>
        </li>
        <li className="flow-step" data-role="review">
          <span className="flow-node" aria-hidden="true">03</span>
          <div className="flow-card">
            <p className="flow-card__label">
              <span>{en ? "Human decision" : "人手決定"}</span>
              <em>{en ? "Brand manager (sample)" : "品牌經理（示例）"}</em>
            </p>
            <p>{en ? "Checked against the facts. Tone softened, no price mentioned." : "已按資料核對；語氣調整得更親切，沒有提及價錢。"}</p>
            <div className="decision" aria-label={en ? "Decision" : "決定"}>
              <span data-on="true">{en ? "Approved with edits" : "修改後批准"}</span>
              <span>{en ? "Return" : "退回"}</span>
            </div>
          </div>
        </li>
        <li className="flow-step" data-role="result">
          <span className="flow-node" aria-hidden="true">04</span>
          <div className="flow-card">
            <p className="flow-card__label">
              <span>{en ? "Usable result" : "可用成果"}</span>
              <em>{en ? "Export + record" : "匯出＋記錄"}</em>
            </p>
            <span className="file">launch-pack_sample.txt</span>
            <p style={{ marginTop: 8 }}>{en ? "Record REC-0412 · sources, edits and reviewer notes attached" : "紀錄 REC-0412・附來源、修改及審閱意見"}</p>
          </div>
        </li>
      </ol>
      <figcaption id="flow-scene-caption" className="sr-only">
        {en
          ? "Illustrative sample workflow: approved brand facts are used to prepare a draft caption, a brand manager edits and approves it, and the selected content is exported with a record."
          : "示例流程：以已確認的品牌資料準備文案草稿，由品牌經理修改及批准，再把選定內容連同記錄一併匯出。"}
      </figcaption>
    </figure>
  );
}
