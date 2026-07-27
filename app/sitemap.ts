import type { MetadataRoute } from "next";

const routes = ["", "/product", "/node", "/proof", "/platform", "/install", "/portfolio", "/doctrine", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-27");
  return routes.map((route, index) => ({
    url: `https://mneme-memory.sik-mindz.chatgpt.site${route}`,
    lastModified: updated,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
