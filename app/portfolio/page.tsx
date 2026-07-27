import type { Metadata } from "next";
import { PortfolioExplorer } from "../components/PortfolioExplorer";
import { Footer, Header, PageIntro, StatusBadge } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The complete RecursiveIntell public engineering portfolio: live GitHub repositories, crates.io releases and downloads, and a reviewed 97-package Library Atlas projection.",
};

export default function PortfolioPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="05"
        eyebrow="THE COMPLETE PORTFOLIO"
        title="The whole laboratory."
        accent="Public, counted, inspectable."
        body="Every public RecursiveIntell repository and crate is collected from GitHub and crates.io, while a reviewed, allowlisted projection of the deeper 97-package Library Atlas preserves the useful catalog without publishing private repository metadata. Search the work, sort the signal, and open the source."
      >
        <div className="intro-badges">
          <StatusBadge>live public telemetry</StatusBadge>
          <StatusBadge tone="observed">dated reviewed audit projection</StatusBadge>
        </div>
      </PageIntro>

      <section className="content-section shell portfolio-page">
        <PortfolioExplorer />
      </section>
      <Footer />
    </main>
  );
}
