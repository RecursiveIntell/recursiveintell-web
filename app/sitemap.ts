import type { MetadataRoute } from "next";

const siteUrl = "https://recursiveintell.com";
const routes = ["", "/product", "/node", "/proof", "/platform", "/install", "/portfolio", "/doctrine", "/about", "/josh"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(route === "/josh" ? "2026-08-01" : "2026-07-27"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
