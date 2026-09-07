import type { MetadataRoute } from "next";

const siteUrl = "https://recursiveintell.com";
const routes = [
  "",
  "/josh",
  "/services",
  "/work",
  "/work/ares-runtime-case",
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
    lastModified: new Date("2026-09-06"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority:
      index === 0
        ? 1
        : ["/josh", "/services", "/work/ares-runtime-case"].includes(route)
          ? 0.9
          : 0.8,
  }));
}
