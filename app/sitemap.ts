import type { MetadataRoute } from "next";

const siteUrl = "https://recursiveintell.com";
const routes = [
  "",
  "/josh",
  "/services",
  "/work",
  "/work/ares-approval-case",
  "/contact",
  "/about",
  "/privacy",
  "/pro",
  "/mnemes",
  "/product",
  "/node",
  "/proof",
  "/platform",
  "/install",
  "/portfolio",
  "/doctrine",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-09-04"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority:
      index === 0 ? 1 : ["/josh", "/services"].includes(route) ? 0.9 : 0.8,
  }));
}
