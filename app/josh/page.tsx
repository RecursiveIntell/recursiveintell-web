import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { SelectedProjects } from "../components/Studio";
import { contact } from "../config/site";
export const metadata: Metadata = pageMetadata("/josh", {
  title: { absolute: "Josh Stevenson | RecursiveIntell" },
  description:
    "Independent AI systems engineer working across Rust, Python, TypeScript, agent runtimes, local memory, and recovery-oriented infrastructure. Albertville, Alabama. Remote U.S.",
  alternates: { canonical: "/josh" },
  openGraph: {
    title: "Josh Stevenson | RecursiveIntell",
    url: "/josh",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
});
export default function Josh() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <section className="studio-profile studio-shell">
        <div>
          <p className="studio-eyebrow">THE ENGINEER BEHIND RECURSIVEINTELL</p>
          <h1>
            Josh
            <br />
            <em>Stevenson.</em>
          </h1>
          <p className="studio-lede">
            I build agent runtimes, persistent memory, and the infrastructure
            that connects execution to inspectable outcomes.
          </p>
          <p>
            My current work spans Rust, Python, and TypeScript across Ares,
            Recursive Agent, semantic-memory, proveKV, and recovery-oriented
            workstation tooling. I’m interested in engineering roles where
            agent reliability, developer infrastructure, local-first systems,
            and explicit failure semantics matter.
          </p>
          <div className="studio-actions">
            <a className="studio-button primary" href={contact.careerHref}>
              Discuss an engineering role <span>↗</span>
            </a>
            <a href="#proof" className="studio-text-link">
              See the work ↓
            </a>
          </div>
        </div>
        <aside className="studio-profile-card">
          <span className="studio-monogram" aria-hidden="true">
            JS<span>_</span>
          </span>
          <p>
            AI SYSTEMS ENGINEER
            <br />
            FOUNDER / RECURSIVEINTELL
          </p>
          <dl>
            <div>
              <dt>Location</dt>
              <dd>Albertville, Alabama</dd>
            </div>
            <div>
              <dt>Work</dt>
              <dd>Remote U.S.</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Agents · memory · infrastructure</dd>
            </div>
          </dl>
          <a href={`mailto:${contact.email}`}>{contact.email} ↗</a>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <a href={contact.textHref}>Send a text ↗</a>
        </aside>
      </section>
      <section className="studio-section studio-shell" id="proof">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">A SHORT INSPECTION PATH</p>
            <h2>
              Start with
              <br />
              <em>the runtime.</em>
            </h2>
          </div>
          <p>
            The current Ares + Recursive Agent case is the best place to inspect
            how I separate context materialization, policy, physical admission,
            provider egress, receipts, and rollback without moving those owners
            into one monolith.
          </p>
        </div>
        <SelectedProjects all />
        <div className="studio-section-tail">
          <Link className="studio-text-link" href="/work/ares-approval-case">
            Historical permit-to-outcome case ↗
          </Link>
        </div>
      </section>
      <section className="studio-note studio-shell">
        <span className="studio-eyebrow">A RUST WALKTHROUGH</span>
        <h2>Memory with a history.</h2>
        <p>
          The semantic-memory fixture exercises supersession, historical
          reconstruction, replay, namespace isolation, and integrity rebuild. It
          demonstrates declared local scenarios; it does not establish factual
          truth, production fitness, or model-level prompt-injection resistance.
        </p>
        <div className="studio-actions">
          <a
            className="studio-text-link"
            href="https://github.com/RecursiveIntell/semantic-memory/blob/530b70e816030a4114346b8af60118d41d6ed8dd/examples/hostile_memory_integrity.rs"
            target="_blank"
            rel="noreferrer"
          >
            Read the executable fixture ↗
          </a>
          <a
            className="studio-text-link"
            href="https://github.com/RecursiveIntell/semantic-memory/blob/530b70e816030a4114346b8af60118d41d6ed8dd/docs/benchmarks/hostile-memory-integrity-receipt.json"
            target="_blank"
            rel="noreferrer"
          >
            Inspect the recorded receipt ↗
          </a>
        </div>
      </section>
      <section className="studio-section studio-shell" id="consulting">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">WORKING TOGETHER</p>
            <h2>
              Bring a role.
              <br />
              <em>Or a hard problem.</em>
            </h2>
          </div>
          <div>
            <p>
              I’m open to engineering conversations and focused consulting
              engagements. A useful first conversation names the system, the
              constraint, and what you need to change.
            </p>
            <Link href="/services" className="studio-text-link">
              Explore consulting →
            </Link>
          </div>
        </div>
      </section>
      <StudioFooter />
    </main>
  );
}
