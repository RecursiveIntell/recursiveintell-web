import type { Metadata } from "next";
import Link from "next/link";
import { BusinessFooter, BusinessHeader, BusinessPageIntro } from "../components/business/BusinessChrome";
import { credibilitySignal } from "../data/business";

export const metadata: Metadata = {
  title: "About Josh Stevenson + RecursiveIntell",
  description: "Josh Stevenson is a systems engineer and founder/operator of RecursiveIntell, a founder-led applied R&D studio and public engineering portfolio.",
  alternates: { canonical: "/about" },
};

const disciplines = [
  ["Local-first AI", "Durable state, private deployment options, explicit provider boundaries, recovery, and operator ownership."],
  ["Agent systems", "Graph orchestration, tools, memory, skills, effects, typed failure, human gates, and execution evidence."],
  ["Rust infrastructure", "Small composable owners for identity, memory, evidence, compression, runtime policy, and system integration."],
  ["Evidence-led delivery", "Current source first, claims bounded to proof, acceptance gates mapped before completion, and written remaining delta."],
] as const;

export default function AboutPage() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro index="03" eyebrow="THE ENGINEER + THE STUDIO" title="Built by one engineer." accent="Inspected in public." body="Josh Stevenson builds local-first AI and infrastructure systems through RecursiveIntell, combining implementation, architecture, hostile review, and evidence-led technical consulting." />
      <section className="business-section about-story">
        <div className="business-shell business-boundary-grid">
          <div><p className="business-index">JOSH STEVENSON</p><h2>Systems engineer.<br />Founder.<br /><em>Operator.</em></h2></div>
          <div>
            <p>Josh works across the full path from research question to operating artifact: requirements, source ownership, Rust and Python implementation, local model and agent integration, tests, receipts, deployment boundaries, and handoff.</p>
            <p>The differentiator is not a claim that every component is mature or universally correct. It is the ability to design and build dense systems quickly while keeping authority, failure, provenance, and proof boundaries visible.</p>
            <div className="business-text-links"><a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">GitHub portfolio <span>↗</span></a><a href="https://crates.io/users/RecursiveIntell" target="_blank" rel="noreferrer">Published Rust crates <span>↗</span></a></div>
          </div>
        </div>
      </section>
      <section className="business-section about-disciplines">
        <div className="business-shell">
          <div className="business-section-heading"><div><p className="business-index">WORKING DISCIPLINES</p><h2>Depth across<br /><em>the system boundary.</em></h2></div><p>Architecture matters most where data, models, tools, people, and durable state meet.</p></div>
          <div className="consulting-grid">{disciplines.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>
      <section className="business-section about-studio">
        <div className="business-shell business-boundary-grid">
          <div><p className="business-index">RECURSIVEINTELL</p><h2>A public engineering<br /><em>workbench.</em></h2></div>
          <div><p>RecursiveIntell is a founder-led applied R&amp;D studio and public engineering portfolio for local-first AI, agent memory, evidence infrastructure, orchestration, compression, and operator tooling.</p><p>It is not presented as a funded company, team, certified platform, enterprise deployment, or proof of customers and revenue. Public source establishes implementation scope and provides a surface for technical evaluation.</p><Link href="/work">Review selected work <span>→</span></Link></div>
        </div>
      </section>
      <section className="business-section about-recognition">
        <div className="business-shell business-recognition">
          <div><small>{credibilitySignal.date} · PUBLIC RECOGNITION</small><h3>{credibilitySignal.title}</h3></div>
          <div><p>{credibilitySignal.body}</p><p className="business-boundary-note">{credibilitySignal.boundary}</p><a href={credibilitySignal.href} target="_blank" rel="noreferrer">View the original post <span>↗</span></a></div>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}
