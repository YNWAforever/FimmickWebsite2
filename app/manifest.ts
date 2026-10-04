import type { MetadataRoute } from "next";

/** Web app manifest: name, colours and the icon set (app/icon.svg, app/apple-icon.png). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FIMMICK — Agentic AI Platform & Business Solutions",
    short_name: "FIMMICK",
    start_url: "/en",
    display: "browser",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
