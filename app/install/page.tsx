import type { Metadata } from "next";
import { Footer, Header } from "../components";
import { InstallCockpit } from "./InstallCockpit";
import { INSTALL_GUIDES } from "./data";

export const metadata: Metadata = {
  title: "Install Agent Memory — RecursiveIntell",
  description:
    "A guided, source-bounded installation cockpit for Claude Code, Codex, Hermes, Cursor, generic MCP clients, and Rust applications.",
  alternates: { canonical: "/install" },
  openGraph: {
    title: "Install RecursiveIntell Agent Memory",
    description:
      "Choose your host, install the published integration, verify the live runtime, and understand its support boundary.",
    url: "/install",
    type: "website",
    images: [{ url: "/api/og?title=Install%20agent%20memory.&kicker=GUIDED%20INSTALL%20COCKPIT&detail=Choose%20host%20%C2%B7%20connect%20%C2%B7%20prove%20%C2%B7%20operate&accent=cyan", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Install RecursiveIntell Agent Memory",
    description: "Six source-bounded paths from installation to witnessed recall.",
    images: ["/api/og?title=Install%20agent%20memory.&kicker=GUIDED%20INSTALL%20COCKPIT&detail=Choose%20host%20%C2%B7%20connect%20%C2%B7%20prove%20%C2%B7%20operate&accent=cyan"],
  },
};

export default function InstallPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RecursiveIntell agent memory installation guides",
    itemListElement: INSTALL_GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${guide.name} installation guide`,
      url: `https://recursiveintell.com/install/${guide.slug}`,
    })),
  };

  return (
    <>
      <Header current="install" />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replaceAll("<", "\\u003c") }}
        />
        <InstallCockpit />
      </main>
      <Footer />
    </>
  );
}
