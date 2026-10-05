import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { createConverter, toHans } from "@/lib/hans";
import { explainerMedia } from "@/content/media";

/** Award pass 2, Phase 8.3: Simplified Chinese (fix plan 20). */

describe("zh-Hans glossary", () => {
  const glossary: [string, string][] = [
    ["質素", "质量"], ["搜尋", "搜索"], ["預設", "默认"], ["介面", "界面"], ["程式", "程序"], ["影片", "视频"],
    ["檔案", "文件"], ["存取", "访问"], ["登入", "登录"], ["電郵", "邮件"], ["資訊", "信息"], ["軟件", "软件"],
  ];
  it.each(glossary)("%s → %s", (hk, cn) => {
    expect(toHans(hk)).toBe(cn);
  });

  it("uses the mainland word inside sentences", () => {
    expect(toHans("工作電郵")).toBe("工作邮件");
    expect(toHans("產品示範影片")).toBe("产品示范视频");
    expect(toHans("搜尋標題及摘要")).toBe("搜索标题及摘要");
  });

  it("keeps 著 in 著稱 and 卓著, and simplifies it elsewhere", () => {
    expect(toHans("著稱")).toBe("著称");
    expect(toHans("卓著")).toBe("卓著");
    expect(toHans("著名")).toBe("著名");
  });

  it("masks adjacent phrases independently", () => {
    expect(toHans("請回覆電郵")).toBe("请回复邮件");
    expect(toHans("影片檔案")).toBe("视频文件");
    expect(toHans("回覆回覆")).toBe("回复回复");
  });
});

describe("the converter", () => {
  it("matches phrases literally (the pattern is escaped)", () => {
    const convert = createConverter("", [["甲.乙", "丙"]]);
    expect(convert("甲.乙，甲丁乙")).toBe("丙，甲丁乙");
  });

  it("works with no phrases at all", () => {
    expect(createConverter("電电", [])("電郵")).toBe("电郵");
  });
});

describe("explainer captions", () => {
  const dir = "public/media/explainer";

  it("has a Simplified track generated from the Traditional one", () => {
    const hant = fs.readFileSync(`${dir}/captions-zh-hant.vtt`, "utf8");
    expect(fs.readFileSync(`${dir}/captions-zh-hans.vtt`, "utf8")).toBe(toHans(hant));
    expect(explainerMedia.captions.find((c) => c.locale === "zh-hans")).toMatchObject({ srclang: "zh-Hans", src: "/media/explainer/captions-zh-hans.vtt" });
  });
});

describe("checks are wired", () => {
  it("npm test runs the table check, and CI checks the rendered zh-Hans pages", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
    expect(pkg.scripts.test).toContain("build-hans-table.mjs --check");
    expect(fs.readFileSync(".github/workflows/ci.yml", "utf8")).toContain("scripts/i18n/check-hans.mjs");
  });
});
