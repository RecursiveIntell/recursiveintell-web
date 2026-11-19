import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "../lib/page-metadata";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, StudioCTA } from "../components/Studio";

export const metadata: Metadata = pageMetadata("/systems", {
  title: "Systems architecture",
  description: "Source-linked ownership and maturity boundaries for RecursiveIntell agent runtimes, persistent memory, verified execution and infrastructure.",
});

const layers = [
  { name: "Ares: agent host", owner: "RecursiveIntell/Ares", source: "https://github.com/RecursiveIntell/Ares", summary: "Hermes-compatible downstream workbench with Ares-owned managed releases, rollback, continuity and collaboration contracts.", boundary: "Hermes features are inherited. Separately configured integrations and an installed live session are not established by source presence." },
  { name: "Recursive Agent: execution kernel", owner: "RecursiveIntell/recursive-agent", source: "https://github.com/RecursiveIntell/recursive-agent", summary: "Rust operation admission, local daemon, execution receipts, verified run packs and recorded-evidence replay.", boundary: "Autonomous recursion, provider-backed reliability and unattended production operation remain unverified." },
  { name: "semantic-memory: canonical knowledge", owner: "RecursiveIntell/semantic-memory", source: "https://github.com/RecursiveIntell/semantic-memory", summary: "SQLite-owned facts and temporal history with hybrid retrieval, governed writes, recoverable derived indexes and search receipts.", boundary: "Receipts describe retrieval rather than factual truth; optional features require explicit activation and validation." },
  { name: "Mnemes: multi-device control plane", owner: "RecursiveIntell/mnemes", source: "https://github.com/RecursiveIntell/mnemes", summary: "Device/actor identity, scoped server shards and provenance-aware routing over local-first memory.", boundary: "The proposed continuous device-owned replica protocol is not a completed, production-admitted runtime." },
  { name: "Libraries: governance and evidence", owner: "RecursiveIntell/Libraries", source: "https://github.com/RecursiveIntell/Libraries", summary: "Source-owned crates for authority, verification, graphs, context governance, bridges, receipts and experimental compression.", boundary: "A mixed-maturity multi-workspace substrate; published types, tests and review packets are not automatic integration or production evidence." },
  { name: "MCP and host integrations", owner: "semantic-memory-mcp / agent-memory-kits", source: "https://github.com/RecursiveIntell/agent-memory-kits", summary: "Protocol servers, memory hooks and integration packages for explicitly supported agent hosts.", boundary: "Installed, registered, exposed and exercised are distinct states; host permissions and providers must be checked individually." },
] as const;

export default function SystemsPage() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro label="SYSTEMS / SOURCE OWNERSHIP" title="One stack." accent="Explicit boundaries." body="See how agent execution, memory, provenance and governance fit together without confusing implemented source with qualified deployed behavior. Source-reviewed November 2026." />
      <section className="studio-section studio-shell" aria-labelledby="system-owners-heading">
        <div className="studio-section-heading">
          <div><p className="studio-eyebrow">01 / THE OWNERS</p><h2 id="system-owners-heading">Trace the work.<br /><em>Keep the truth.</em></h2></div>
          <p>Canonical state belongs to specific components. Bridges, retrieval indexes and reports do not silently become authorities over their sources.</p>
        </div>
        <div className="ri-architecture-grid">
          {layers.map((layer) => (
            <article className="ri-architecture-card" key={layer.owner}>
              <p className="studio-eyebrow">{layer.owner}</p>
              <h3>{layer.name}</h3>
              <p>{layer.summary}</p>
              <div><strong>Evidence boundary</strong><p>{layer.boundary}</p></div>
              <a href={layer.source} className="studio-text-link" target="_blank" rel="noreferrer">Inspect source ↗</a>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-shell">
        <p className="studio-eyebrow">02 / ADMISSION STATES</p>
        <h2>Implemented does not mean production verified.</h2>
        <ol className="ri-evidence-ladder">
          <li><strong>Designed:</strong> a plan or specification exists.</li>
          <li><strong>Implemented:</strong> revision-bound code has a concrete path.</li>
          <li><strong>Tested:</strong> named tests passed on a recorded environment.</li>
          <li><strong>Exercised:</strong> a public entry point produced run-specific receipts.</li>
          <li><strong>Operationally qualified:</strong> real-workload, failure, recovery and support gates were satisfied independently.</li>
        </ol>
        <p>Unadmitted areas include continuous device-owned replica sync, unattended recursive self-improvement, some native integrations and measured compression quality gates.</p>
        <Link className="studio-text-link" href="/evidence">Inspect merged evidence ↗</Link>
        <Link className="studio-text-link" href="/changes">Review public change history ↗</Link>
        <Link className="studio-text-link" href="/portfolio">Browse the public repository index ↗</Link>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
