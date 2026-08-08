import type { MetadataRoute } from "next";

const siteUrl = "https://recursiveintell.com";
const routes = ["", "/josh", "/services", "/work", "/about", "/privacy", "/pro", "/mnemes", "/product", "/node", "/proof", "/platform", "/install", "/portfolio", "/doctrine"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(["", "/josh", "/services", "/work", "/about", "/privacy", "/pro", "/mnemes"].includes(route) ? "2026-08-08" : "2026-07-27"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : ["/josh", "/services"].includes(route) ? 0.9 : 0.8,
  }));
}
