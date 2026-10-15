import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/bridge", "/api/bridge"],
    },
    sitemap: "https://recursiveintell.com/sitemap.xml",
  };
}
