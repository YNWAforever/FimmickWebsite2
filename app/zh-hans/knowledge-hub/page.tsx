import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Crumbs } from "@/components/ui";
import { ArticleList } from "@/components/ArticleView";

type Props = { searchParams: Promise<{ page?: string }> };

export const metadata: Metadata = pageMetadata({
  locale: "zh-hans",
  path: "/knowledge-hub",
  title: "知识库（简体中文存档）",
  description: "FIMMICK 知识库简体中文文章存档，保留原有网址、日期及内容。",
  alternates: ["en", "zh-hant", "zh-hans"],
});

export default async function SimplifiedHubPage({ searchParams }: Props) {
  const page = Number.parseInt((await searchParams).page || "1", 10) || 1;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs locale="zh-hant" items={[{ label: "知识库" }]} />
          <p className="eyebrow">简体中文存档</p>
          <h1>知识库</h1>
          <p className="lead" style={{ marginTop: 20 }}>FIMMICK 文章存档（简体中文），保留原有网址、日期及语言。网站其他页面以繁体中文及英文提供。</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ArticleList locale="zh-hans" shellLocale="zh-hant" page={page} basePath="/zh-hans/knowledge-hub" />
        </div>
      </section>
    </>
  );
}
