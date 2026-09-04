import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, StudioCTA, SystemGraphic } from "../components/Studio";
export const metadata: Metadata = pageMetadata("/about", {
  title: "About the Studio",
  description:
    "RecursiveIntell is Josh Stevenson's independent applied R&D studio for agents, local memory, and systems infrastructure.",
  alternates: { canonical: "/about" },
});
export default function About() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro
        label="THE STUDIO / THE APPROACH"
        title="Independent thinking."
        accent="Inspectable systems."
        body="RecursiveIntell is a founder-led applied R&D studio and public engineering portfolio. Josh Stevenson builds the underlying pieces of useful AI, from agent execution to local memory."
      />
      <section className="studio-about-grid studio-shell">
        <SystemGraphic compact />
        <div>
          <p className="studio-eyebrow">ONE CONNECTED BODY OF WORK</p>
          <h2>
            The pieces matter.
            <br />
            <em>So do the seams.</em>
          </h2>
          <p>
            An agent runtime needs to know what it can do. A memory system needs
            to preserve where its knowledge came from. A tool needs to report
            what happened when a call failed.
          </p>
          <p>
            The projects here investigate those questions through source code,
            focused tests, and public documentation. They range from active
            software to experimental components; each work page names the scope
            of its evidence.
          </p>
          <Link href="/josh" className="studio-text-link">
            Meet Josh Stevenson ↗
          </Link>
        </div>
      </section>
      <section className="studio-section studio-shell">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">ENGINEERING PRINCIPLES</p>
            <h2>
              Less mystery.
              <br />
              <em>More understanding.</em>
            </h2>
          </div>
          <p>
            Useful systems make their state, ownership, and failure behavior
            understandable to the person who has to operate them.
          </p>
        </div>
        <div className="studio-principles">
          {[
            [
              "01",
              "Keep ownership clear.",
              "Choose the source of truth. Treat indexes and summaries as views that can be rebuilt.",
            ],
            [
              "02",
              "Preserve the boundary.",
              "A local system and an external provider have different responsibilities. Make that visible.",
            ],
            [
              "03",
              "Let evidence travel.",
              "Attach the source, test result, and limitations to the work so another engineer can assess it.",
            ],
          ].map(([n, t, p]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
