import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/activity", "/libraries", "/install", "/concepts"];
  return routes.map((route, index) => ({
    url: `https://recursiveintell.com${route || "/"}`,
    changeFrequency: route === "/activity" ? "daily" : "weekly",
    priority: index === 0 ? 1 : route === "/concepts" ? 0.7 : 0.9,
  }));
}
