import type { Metadata } from "next";
import { MnemesHome } from "../components/mnemes/MnemesHome";

export const metadata: Metadata = {
  title: { absolute: "Mnemes — Memory, With a Witness" },
  description:
    "A personal, self-hosted agent memory server with device identity, routed search, temporal state, provenance, and receipts.",
  alternates: { canonical: "/mnemes" },
  openGraph: {
    title: "Mnemes — Memory, With a Witness",
    description: "Self-hosted agent memory for one device or every device you authorize.",
    url: "/mnemes",
    siteName: "Mnemes",
    type: "website",
    images: [{ url: "/mnemes-social.webp", width: 1200, height: 630, alt: "Mnemes local-first agent memory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mnemes — Memory, With a Witness",
    description: "Self-hosted agent memory with temporal state, provenance, and receipts.",
    images: ["/mnemes-social.webp"],
  },
};

export default function MnemesPage() {
  return <MnemesHome />;
}

