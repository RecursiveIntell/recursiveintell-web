import type { Metadata } from "next";
import { site } from "../config/site";

/** Each canonical page owns its sharing URL; root metadata is only a fallback. */
export function pageMetadata(path: string, metadata: Metadata): Metadata {
  const rawTitle =
    typeof metadata.title === "string"
      ? metadata.title
      : metadata.title && "absolute" in metadata.title
        ? metadata.title.absolute
        : site.name;
  const title = rawTitle.includes(site.name)
    ? rawTitle
    : `${rawTitle} | ${site.name}`;
  const description = metadata.description ?? site.description;
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      ...metadata.openGraph,
      title: metadata.openGraph?.title ?? title,
      description: metadata.openGraph?.description ?? description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      images: ["/opengraph-image"],
      ...metadata.twitter,
      title: metadata.twitter?.title ?? title,
      description: metadata.twitter?.description ?? description,
    },
  };
}
