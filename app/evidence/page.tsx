import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "../lib/page-metadata";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, StudioCTA } from "../components/Studio";
import { publicEvidence } from "../data/public-evidence";

export const metadata: Metadata = pageMetadata("/evidence", {
  title: "Engineering evidence",
  description: "Source-linked public technical evidence, merge identities, current scope and explicit limitations for selected RecursiveIntell systems and external contributions.",
});

export default function EvidencePage() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro label="EVIDENCE / PUBLIC SOURCE" title="Show the source." accent="Keep the boundary." body="Selected, independently inspectable public records. A merged PR, a test result, a demonstration, and an installed production system are different kinds of evidence. This page does not execute a live agent." />
      <section className="studio-section studio-shell" aria-labelledby="evidence-records">
        <div className="studio-section-heading">
          <div><p className="studio-eyebrow">01 / VERIFIED REFERENCES</p><h2 id="evidence-records">What changed.<br /><em>What it proves.</em></h2></div>
          <p>Each record identifies its external source, admitted scope and remaining gap. A public repository description does not become evidence of customer adoption or universal correctness.</p>
        </div>
        <div className="ri-architecture-grid">
          {publicEvidence.map((item) => (
            <article className="ri-architecture-card" key={item.id}>
              <p className="studio-eyebrow">{item.dateLabel} / {item.category}</p>
              <h3>{item.title}</h3>
              <p><strong>State:</strong> {item.status}</p>
              <p>{item.summary}</p>
              <div><strong>Claim boundary</strong><p>{item.boundary}</p></div>
              <a className="studio-text-link" href={item.source} target="_blank" rel="noreferrer">{item.sourceLabel} ↗</a>
              {item.supportingSource && <a className="studio-text-link" href={item.supportingSource} target="_blank" rel="noreferrer">{item.supportingLabel} ↗</a>}
              <small>Revision: <code>{item.revision.slice(0, 12)}</code></small>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-shell">
        <p className="studio-eyebrow">02 / EVIDENCE RULE</p>
        <h2>A receipt is evidence of an observation, not proof of every claim.</h2>
        <p>Implementation, tests, runtime activation, security and commercial fitness have distinct acceptance gates. The source-linked status of one area does not promote a related experimental subsystem.</p>
        <Link className="studio-text-link" href="/changes">See dated engineering changes ↗</Link>
        <Link className="studio-text-link" href="/systems">Explore component ownership ↗</Link>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
