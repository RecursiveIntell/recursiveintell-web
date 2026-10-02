import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, SelectedProjects, StudioCTA } from "../components/Studio";
import { careerWorkCases } from "../data/work";
export const metadata: Metadata = pageMetadata("/work", {
  title: "Selected Work",
  description:
    "Agent runtime, local memory, recovery-oriented infrastructure, and Rust systems work by Josh Stevenson, with source and evidence attached.",
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
        body="An accepted NVIDIA PAIR contribution, the current Hermes integration path in Ares, persistent memory, and the supporting Rust systems. Each project explains what was built and where the evidence stops."
      />
      <section className="studio-shell studio-work-section">
        <div className="studio-work-index">
          <span>
            SELECTED PROJECTS / 01–
            {String(careerWorkCases.length).padStart(2, "0")}
          </span>
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
