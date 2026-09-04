import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import { PortfolioExplorer } from "../components/PortfolioExplorer";
import {
  Footer,
  Header,
  PageIntro,
  StatusBadge,
} from "../components/SiteChrome";

export const metadata: Metadata = pageMetadata("/portfolio", {
  alternates: { canonical: "/portfolio" },
  title: "Portfolio",
  description:
    "Explore RecursiveIntell repositories, published crates, and a reviewed package catalog, with source status visible.",
});

export default function PortfolioPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="05"
        eyebrow="THE REPOSITORY LIBRARY"
        title="The whole laboratory."
        accent="One place to explore."
        body="Search the public repositories, published crates, and reviewed package catalog. Source status distinguishes live results, partial inventories, and dated snapshots. Open any project to inspect the underlying work."
      >
        <div className="intro-badges">
          <StatusBadge>live public telemetry</StatusBadge>
          <StatusBadge tone="observed">
            dated reviewed audit projection
          </StatusBadge>
        </div>
      </PageIntro>

      <section className="content-section shell portfolio-page">
        <PortfolioExplorer />
      </section>
      <Footer />
    </main>
  );
}
