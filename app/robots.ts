import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://mneme-memory.sik-mindz.chatgpt.site/sitemap.xml",
  };
}
