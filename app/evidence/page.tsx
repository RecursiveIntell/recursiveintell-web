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
          <p>Each record identifies its source, acceptance state and remaining gap. Independent coverage, historical reviews and merged changes are deliberately distinct. A public repository description does not become evidence of customer adoption or universal correctness.</p>
        </div>
        <div className="ri-architecture-grid">
          {publicEvidence.map((item) => (
            <article className="ri-architecture-card" key={item.id} id={item.id}>
              <p className="studio-eyebrow">{item.dateLabel} / {item.category}</p>
              <h3>{item.title}</h3>
              <p><strong>State:</strong> {item.status}</p>
              <p>{item.summary}</p>
              <div><strong>Claim boundary</strong><p>{item.boundary}</p></div>
              <a className="studio-text-link" href={item.source} target="_blank" rel="noreferrer">{item.sourceLabel} ↗</a>
              {item.supportingSource && <a className="studio-text-link" href={item.supportingSource} target="_blank" rel="noreferrer">{item.supportingLabel} ↗</a>}
              {item.revision && <small>Reviewed or merged revision: <code>{item.revision.slice(0, 12)}</code></small>}
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-shell" aria-labelledby="classification-research">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">02 / OWNER-RECORDED RESEARCH</p>
            <h2 id="classification-research">Experimental records.<br /><em>Unverified outcomes.</em></h2>
          </div>
          <p>Research artifacts can demonstrate a controlled observation without becoming independently validated credentials. Original source custody and verified decisions are separate gates.</p>
        </div>
        <article className="ri-architecture-card">
          <p className="studio-eyebrow">November 21, 2026 / ADVISORY CLASSIFICATION CORPUS</p>
          <h3>8,069 hashed classification sidecars inspected</h3>
          <p>A private local experiment produced 8,069 parseable, distinct advisory/candidate-only records. A separately recorded count of 9,861 remains unreconciled; no label accuracy or agent decision improvement is established.</p>
          <p><strong>Evidence boundary:</strong> The original ZIP is not public. This source-linked aggregate inspection is not an independently reproducible benchmark, a published receipt corpus, or proof that Ares uses these decisions live.</p>
          <a className="studio-text-link" href="https://github.com/RecursiveIntell/recursiveintell-web/blob/main/docs/research/2026-11-21-classification-receipts.md" target="_blank" rel="noreferrer">Inspect the dated research methodology and limitations ↗</a>
        </article>
      </section>
      <section className="studio-section studio-shell">
        <p className="studio-eyebrow">03 / EVIDENCE RULE</p>
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
