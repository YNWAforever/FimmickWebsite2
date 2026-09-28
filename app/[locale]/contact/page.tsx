import type { Metadata } from "next";
import { t, type Locale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { contextKeys, intentLabels, intents, parseContext, type ContextKey } from "@/lib/intent";
import { solutionById } from "@/content/solutions";
import { productById } from "@/content/products";
import { serviceById } from "@/content/services";
import { industryById } from "@/content/industries";
import { workstreamById } from "@/content/transformation";
import { memberById } from "@/content/ecosystem";
import { caseBySlug } from "@/content/cases";
import { exampleMeta } from "@/content/examples";
import { guides, explainerVideo, workshopResource } from "@/content/resources";
import { company, offices } from "@/content/company";
import { PageHero } from "@/components/ui";
import { ContactForm, type ContactStrings, type ContextItem } from "@/components/forms/ContactForm";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const copy = {
  title: { en: "Contact FIMMICK", zh: "聯絡 FIMMICK" },
  lead: { en: "Tell us about the work you want to improve. A FIMMICK team member reviews every request and replies by email.", zh: "告訴我們你想改善的工作。FIMMICK 同事會審閱每個要求，並以電郵回覆。" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/contact", title: t(copy.title, locale), description: t(copy.lead, locale) });
}

function label(key: ContextKey, value: string, locale: Locale): { kind: string; label: string } {
  const en = locale === "en";
  switch (key) {
    case "solution": return { kind: en ? "Solution" : "解決方案", label: t(solutionById(value as never).name, locale) };
    case "product": return { kind: en ? "Product" : "產品", label: productById(value as never).name };
    case "service": return { kind: en ? "Service" : "服務", label: t(serviceById(value as never).name, locale) };
    case "industry": return { kind: en ? "Industry" : "行業", label: t(industryById(value as never).name, locale) };
    case "workstream": return { kind: en ? "Transformation" : "轉型", label: t(workstreamById(value as never).name, locale) };
    case "member": return { kind: en ? "Ecosystem" : "生態系統", label: memberById(value as never).name };
    case "case": return { kind: en ? "Case" : "案例", label: t(caseBySlug(value)!.title, locale) };
    case "example": return { kind: en ? "Example" : "示例", label: t(exampleMeta[value as keyof typeof exampleMeta].title, locale) };
    default: {
      const guide = guides.find((g) => g.slug === value);
      const name = guide ? t(guide.title, locale) : value === "fimmick-aip-explainer" ? t(explainerVideo.title, locale) : t(workshopResource.title, locale);
      return { kind: en ? "Resource" : "資源", label: name };
    }
  }
}

export default async function ContactPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const en = locale === "en";
  const context = parseContext(await searchParams);
  const items: ContextItem[] = contextKeys.filter((k) => context[k]).map((k) => ({ key: k, value: context[k]!, ...label(k, context[k]!, locale) }));
  const s: ContactStrings = en
    ? {
        legend: "About you and the work", name: "Name", email: "Work email", company: "Company", work: "What work do you want to improve?", workHint: "One or two sentences is enough — e.g. “Product launch content takes too many rounds of approval.”", optional: "optional", more: "Add more detail (optional)", phone: "Phone", website: "Website", tools: "Current tools", message: "Anything else", intent: "Enquiry type", context: "Context from the page you came from", contextHint: "remove anything that doesn't apply.", remove: "Remove", submit: "Send request", submitting: "Sending…", required: "Please fill this in.", invalidEmail: "Please enter a valid email address.", tooLong: "This is too long.", invalidPhone: "Please check the phone number.",
        accepted: "Thank you — your request has been sent to the FIMMICK team.", acceptedNext: "We reply by email, usually to arrange a conversation. This is a request, not a booked meeting; we will confirm a time with you.", unavailable: "Online submission isn't available right now. Please use the email option below — your details are prepared for you.", failed: "We couldn't confirm that your request was received. Nothing was lost on your side — please try again or use the email option below.", timeout: "The request took too long and we couldn't confirm it was received. You can retry safely — it won't create a duplicate.", retry: "Retry sending", rateLimited: "Too many attempts in a short time. Please wait a minute and try again.", prepareEmail: "Prepare email instead", openEmail: "Open email app", copyEmail: "Copy text", copied: "Copied", emailNote: "Prepare email → open email app. Your email app opens with this text; the enquiry is only sent when you press send there.", emailSubject: "Website enquiry", privacy: "We use these details only to reply to your enquiry. See our Privacy policy. Nothing you type is saved in your browser or added to the page address.",
      }
    : {
        legend: "你及你的工作", name: "姓名", email: "工作電郵", company: "公司", work: "你想改善哪項工作？", workHint: "一兩句即可，例如：「新品內容需要太多輪批核。」", optional: "選填", more: "補充更多資料（選填）", phone: "電話", website: "網站", tools: "現有工具", message: "其他補充", intent: "查詢類別", context: "來自你瀏覽頁面的背景", contextHint: "如不適用，可以移除。", remove: "移除", submit: "提交要求", submitting: "正在提交…", required: "請填寫此欄。", invalidEmail: "請輸入有效的電郵地址。", tooLong: "內容過長。", invalidPhone: "請檢查電話號碼。",
        accepted: "多謝你——你的要求已送交 FIMMICK 團隊。", acceptedNext: "我們會以電郵回覆，一般會安排傾談。這只是一個要求，並非已預約的會面；我們會與你確認時間。", unavailable: "目前未能在網上提交。請使用下方的電郵選項——內容已為你準備好。", failed: "我們未能確認已收到你的要求；你輸入的內容仍在——請再試一次，或使用下方的電郵選項。", timeout: "要求處理時間過長，未能確認是否已收到。你可以放心重試，系統不會重複建立查詢。", retry: "重新提交", rateLimited: "短時間內嘗試次數過多，請稍候一分鐘再試。", prepareEmail: "改用電郵", openEmail: "開啟電郵程式", copyEmail: "複製內容", copied: "已複製", emailNote: "整理電郵內容 → 開啟電郵程式。電郵程式會以此內容開啟；你需要在電郵程式中按下發送，查詢才會送出。", emailSubject: "網站查詢", privacy: "我們只會使用這些資料回覆你的查詢，詳情見私隱政策。你輸入的內容不會儲存在瀏覽器，亦不會加入網址。",
      };
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t(copy.title, locale) }]} eyebrow={en ? "Contact" : "聯絡我們"} title={en ? "Let's talk about the work." : "談談你的工作。"} lead={t(copy.lead, locale)} />
      <section className="section">
        <div className="container contact-grid">
          <ContactForm lang={locale} intents={intents.map((i) => ({ id: i, label: t(intentLabels[i], locale) }))} initialIntent={context.intent} initialContext={items} email={company.email} s={s} />
          <aside className="stack" style={{ ["--stack" as string]: "16px" }}>
            <div className="io-card">
              <h2 style={{ fontSize: "1.05rem", marginBottom: 10 }}>{en ? "What happens next" : "接下來會怎樣"}</h2>
              <ol className="dot-list small">
                <li>{en ? "A team member reviews your request." : "同事會審閱你的要求。"}</li>
                <li>{en ? "We reply by email to arrange a conversation." : "我們以電郵回覆安排傾談。"}</li>
                <li>{en ? "A meeting is confirmed only when we agree a time." : "只有在議定時間後，會面才算確認。"}</li>
              </ol>
              <p className="small" style={{ marginTop: 12 }}>
                {en ? "Prefer to pick a slot yourself? " : "想自行選擇時段？"}
                <a href="https://calendly.com/fimmick/30min" rel="noopener noreferrer" target="_blank">{en ? "FIMMICK's Calendly page ↗" : "FIMMICK 的 Calendly 頁面 ↗"}</a>
                {en ? " — bookings there are confirmed by Calendly." : "——在該處的預約由 Calendly 確認。"}
              </p>
            </div>
            <div className="office-list">
              {offices.map((o) => (
                <div key={o.email} className="office">
                  <strong>{t(o.name, locale)}</strong>
                  {o.address ? <span>{t(o.address, locale)}</span> : null}
                  <br />
                  {o.phone ? <><a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a> · </> : null}
                  <a href={`mailto:${o.email}`}>{o.email}</a>
                </div>
              ))}
            </div>
            <p className="micro muted">{en ? "A published phone number does not mean the number supports WhatsApp." : "公開的電話號碼並不代表支援 WhatsApp。"}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
