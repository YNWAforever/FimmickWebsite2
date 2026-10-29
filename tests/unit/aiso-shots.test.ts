import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { aisoProductShots } from "@/components/AisoProductShots";

describe("AISO product screenshots", () => {
  it("publishes the five live screens and keeps the readiness walkthrough", () => {
    const page = fs.readFileSync("app/[locale]/products/[slug]/page.tsx", "utf8");
    expect(page).toContain("<AisoReadiness");
    expect(page).toContain("<AisoProductShots");
    expect(aisoProductShots.map((shot) => shot.id)).toEqual(["home-hero", "sample-report", "scan", "site-health", "ai-visibility"]);
    for (const shot of aisoProductShots) {
      expect(shot.src.startsWith("/media/products/aiso/")).toBe(true);
      expect(fs.existsSync(`public${shot.src}`), shot.src).toBe(true);
      expect(shot.alt[0].length).toBeGreaterThan(20);
      expect(shot.alt[1].length).toBeGreaterThan(8);
      expect(shot.title[1]).not.toBe(shot.title[0]);
    }
    expect(aisoProductShots.filter((shot) => shot.lead).map((shot) => shot.id)).toEqual(["home-hero", "sample-report"]);
  });
});
