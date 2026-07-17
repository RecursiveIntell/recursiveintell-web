import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RecursiveIntell",
    short_name: "RecursiveIntell",
    description: "Local-first agent memory and evidence infrastructure that can show its work.",
    start_url: "/",
    display: "standalone",
    background_color: "#020b14",
    theme_color: "#020b14",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
