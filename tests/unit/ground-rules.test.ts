import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Award pass 2 ground rules that a reviewer would otherwise check by eye (Phase 9, the PR template's
 * last items). A deliberate change to one of them updates this file in the same PR.
 */

const read = (file: string) => fs.readFileSync(file, "utf8");
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(dir, e.name)] : []));
const sources = [...walk("app"), ...walk("components")].map((f) => f.split(path.sep).join("/"));
const importers = (sheet: string) => sources.filter((f) => new RegExp(`import\\s+["'][^"']*/${sheet}["']`).test(read(f)));

describe("ground rules", () => {
  it("runtime dependencies stay next, react and react-dom", () => {
    expect(Object.keys(JSON.parse(read("package.json")).dependencies).sort()).toEqual(["next", "react", "react-dom"]);
  });

  it("fonts are self-hosted (app/fonts.ts uses next/font/local, never next/font/google)", () => {
    const fonts = read("app/fonts.ts");
    expect(fonts).toContain("next/font/local");
    expect(fonts).not.toContain("next/font/google");
  });

  it("award.css loads from the locale layout only; the homepage loads cinematic.css, then award-home.css", () => {
    expect(importers("award.css")).toEqual(["app/[locale]/layout.tsx"]);
    expect(importers("cinematic.css")).toEqual(["app/[locale]/page.tsx"]);
    expect(importers("award-home.css")).toEqual(["app/[locale]/page.tsx"]);
    const home = read("app/[locale]/page.tsx");
    const at = (sheet: string) => home.search(new RegExp(`import\\s+["'][^"']*/${sheet}["']`));
    expect(at("award-home.css")).toBeGreaterThan(at("cinematic.css"));
  });

  it("content/legal.ts is untouched", () => {
    expect(createHash("sha256").update(fs.readFileSync("content/legal.ts")).digest("hex")).toBe("9a101fc89e595bd0446b6f64c840e162695c622cb7898a6653c732811836a8ec");
  });
});
