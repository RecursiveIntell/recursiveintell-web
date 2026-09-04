import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, SelectedProjects, StudioCTA } from "../components/Studio";
export const metadata: Metadata = pageMetadata("/work", {
  title: "Selected Work",
  description:
    "Agent runtime, local memory, and Rust infrastructure work by Josh Stevenson, with source and evidence attached.",
  alternates: { canonical: "/work" },
});
export default function Work() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro
        label="THE ENGINEERING PORTFOLIO"
        title="Follow the idea."
        accent="Inspect the work."
        body="A selected path through agent runtimes, local memory, evidence infrastructure, and constrained-compute research. Each project explains what was built and where the evidence stops."
      />
      <section className="studio-shell studio-work-section">
        <div className="studio-work-index">
          <span>SELECTED PROJECTS / 01–05</span>
          <Link href="/portfolio">
            Looking for a specific repository? Explore the library ↗
          </Link>
        </div>
        <SelectedProjects all />
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
