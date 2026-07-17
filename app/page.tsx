import Link from "next/link";
import { Footer, Header, SectionHead } from "./components";
import LivePulse from "./LivePulse";
import MemoryTimeMachine from "./MemoryTimeMachine";

const planes = [
  ["01", "Memory + provenance", "Durable retrieval, temporal state, claims, and source lineage.", "7 packages", "/domains/memory-knowledge-and-provenance"],
  ["02", "Verification + authority", "Permits, decisions, attestations, settlement, and refutation.", "22 packages", "/domains/verification-governance-and-authority"],
  ["03", "Contracts + identity", "Wire-visible schemas, canonical IDs, and boundary compilation.", "5 packages", "/domains/contracts-schemas-and-identity"],
  ["04", "Agent execution", "Typed graphs, bounded plans, resumability, and tool effects.", "7 packages", "/domains/agent-orchestration-and-execution"],
  ["05", "Compression + evaluation", "Measured vector and KV codecs with explicit quality gates.", "9 packages", "/domains/compression-vector-storage-and-evaluation"],
  ["06", "Security + boundaries", "Fail-closed admission, sandboxing, policies, and typed failure.", "7 packages", "/domains/security-and-boundaries"],
] as const;

const outcomes = [
  ["01 / ADOPT", "Give an agent durable memory", "Choose your host, run a short verified path, and keep authority on your machine.", "/install", "Open the Install Cockpit"],
  ["02 / EVALUATE", "Interrogate the evidence model", "Walk through a redacted receipt, replay boundary, and the claims the system refuses to make.", "/proof", "Enter the Proofroom"],
  ["03 / INTEGRATE", "Build the right trust boundary", "Scope an agent-memory integration or evidence/release-truth audit with Josh Stevenson.", "/services", "Explore integration services"],
] as const;

const products = [
  ["NOW · HIGHEST INTEGRATION LEVERAGE", "Witnessed coding agent", "Memory, tool calls, policy decisions, and final claims share one inspectable evidence graph.", "semantic-memory · llm-tool-runtime · agent-graph · claim-ledger"],
  ["NOW · FASTEST TRUST WEDGE", "Release Truth Gate", "A release boundary that refuses stale status, unsupported claims, and unbound artifacts.", "claim-ledger · attestation-exchange · verification-policy · receipt-bench"],
  ["NEXT · STRONGEST USER WEDGE", "Operator Memory OS", "Local-first working memory that understands what changed, what was superseded, and what still needs proof.", "semantic-memory · bitemporal-runtime · living-memory · knowledge-runtime"],
] as const;

export default function Home() {
  return (
    <>
      <Header current="overview" />
      <main id="main">
        <section className="hero home-hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap hero-grid hero-grid-machine">
            <div className="hero-copy">
              <span className="eyebrow">Open-source Rust + MCP infrastructure</span>
              <h1>Install persistent memory. <em>Keep the receipt.</em></h1>
              <p>Give the coding agent you already use durable, local-first memory—then inspect what it retrieved, what changed over time, and what the evidence can actually support.</p>
              <div className="actions">
                <Link className="button primary" href="/install" data-event="primary_cta_clicked" data-event-context="hero">Install agent memory <span>→</span></Link>
                <Link className="button secondary" href="/proof" data-event="proof_opened" data-event-context="hero">See the proof model <span>→</span></Link>
              </div>
              <div className="source-rail"><span>Local-first</span><span>SQLite-authoritative</span><span>Temporal state</span><span>Receipts ≠ factual truth</span></div>
            </div>
            <MemoryTimeMachine />
          </div>
        </section>

        <section className="section pulse-section">
          <div className="wrap pulse-stage">
            <LivePulse />
            <div className="pulse-narrative">
              <span className="kicker">PUBLIC SYSTEM SIGNAL</span>
              <h2>Trust starts with visible movement—and visible limits.</h2>
              <p>Repository pushes and crate releases update from public sources. If an upstream service fails, the interface says so and falls back to a dated snapshot instead of pretending freshness.</p>
              <div className="micro-proof"><span>LIVE</span><b>Public GitHub + crates.io</b><span>DATED</span><b>Audited Library snapshot</b><span>SCOPED</span><b>No private activity counts</b></div>
              <Link href="/activity" data-event="activity_opened" data-event-context="home_pulse">Inspect the engineering timeline →</Link>
            </div>
          </div>
        </section>

        <section className="section outcome-section">
          <div className="wrap">
            <SectionHead index="01 · CHOOSE THE OUTCOME" title="Three clear ways to enter the system." body="Adopt the open-source memory plane, evaluate its evidence model, or bring the architecture into a real integration boundary." />
            <div className="outcome-grid">{outcomes.map(([index, title, body, href, action]) => <Link href={href} key={title} data-event="path_selected" data-event-label={href}><small>{index}</small><h3>{title}</h3><p>{body}</p><b>{action} →</b></Link>)}</div>
          </div>
        </section>

        <section className="section stack-section">
          <div className="wrap">
            <SectionHead index="02 · USE IT TODAY" title="One memory system. Three entry layers." body="Choose the layer that matches the job: operator kits, a protocol server, or the authoritative Rust retrieval core." />
            <div className="spine">
              <article><small>03 / USE</small><h3>Agent Memory Kits</h3><code>agent-memory-kits</code><p>Host-specific setup, lifecycle integration, doctors, ingestion, recall, compaction, and claim/evidence workflows.</p><Link href="/install">Choose a host →</Link></article>
              <article><small>02 / SERVE</small><h3>Semantic Memory MCP</h3><code>semantic-memory-mcp · 0.5.4</code><p>Bounded MCP profiles, witnessed retrieval, replay, graph access, and separate assertion/action authority decisions.</p><a href="https://github.com/RecursiveIntell/semantic-memory-mcp" target="_blank" rel="noreferrer" data-event="github_repo_opened" data-event-context="product_spine">Inspect the server ↗</a></article>
              <article><small>01 / OWN</small><h3>Semantic Memory</h3><code>semantic-memory · 0.5.11</code><p>SQLite-authoritative hybrid retrieval, weighted RRF, bitemporal views, explained ranking, and durable receipts.</p><a href="https://github.com/RecursiveIntell/semantic-memory" target="_blank" rel="noreferrer" data-event="github_repo_opened" data-event-context="product_spine">Inspect the core ↗</a></article>
            </div>
          </div>
        </section>

        <section className="section trace-section">
          <div className="wrap">
            <SectionHead index="03 · WITNESSED RETRIEVAL" title="Follow one answer all the way out." body="The retrieval path stays inspectable. Degradation in one plane cannot silently promote another." />
            <div className="trace">
              <div className="trace-query"><span>QUERY / CURRENT</span><b>“What did we decide about package truth?”</b></div>
              <div className="trace-lane">{["HOST", "CONTRACT", "FTS5 / BM25", "DENSE", "WEIGHTED RRF", "STATE", "WITNESS"].map((name, index) => <div key={name}><small>{String(index + 1).padStart(2, "0")}</small><b>{name}</b><i /></div>)}</div>
              <div className="trace-result"><code>state CURRENT · receipt mcp-witness-… · replay inputs NOT RETAINED</code><span>Receipt ≠ truth</span></div>
            </div>
            <div className="trace-actions"><Link href="/proof">Annotate a real receipt fixture →</Link><Link href="/concepts#receipts">Read the evidence vocabulary →</Link></div>
          </div>
        </section>

        <section className="section paper">
          <div className="wrap">
            <SectionHead index="04 · CAPABILITY PLANES" title="The stack separates what most systems blur." body="Six responsibilities form the trust substrate. Open a plane for its packages, dependency shape, and explicit limitations." />
            <div className="plane-grid">{planes.map(([index, title, body, count, href]) => <Link href={href} key={title}><small>{index}</small><h3>{title}</h3><p>{body}</p><b>{count} →</b></Link>)}</div>
            <div className="paper-action"><Link href="/libraries">Search all 97 audited package records →</Link><a href="/data/library-catalog.json" download>Download the public catalog JSON ↓</a></div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <SectionHead index="05 · FLAGSHIP COMPOSITIONS" title="Three products emerging from one trust substrate." body="Maturity labels describe sequencing—not blanket readiness claims." />
            <div className="product-grid">{products.map(([lane, title, body, crates]) => <article key={title}><small>{lane}</small><h3>{title}</h3><p>{body}</p><code>{crates}</code></article>)}</div>
          </div>
        </section>

        <section className="section evidence">
          <div className="wrap">
            <SectionHead index="06 · EVIDENCE" title="Inspect the scope—not just the status." body="Strong subsystem evidence exists. That does not automatically certify a release, prove correctness, or authorize an action." />
            <div className="evidence-grid"><div><small>CURRENT AUDIT POSTURE</small><strong>Source-hardened.<br />Not release-certified.</strong><p>Source, package, live, and receipt evidence remain separate scopes.</p></div><div><span>Source</span><b>Exact checkout + command scope</b><span>Package</span><b>Packed crate + clean-install parity</b><span>Live</span><b>Artifact identity + runtime canary</b><span>Receipt</span><b>Observed evidence—not correctness</b></div><Link href="/proof"><span>PROOFROOM</span><strong>Inspect receipts, replay, ownership, and typed failure →</strong></Link></div>
          </div>
        </section>

        <section className="section final-conversion">
          <div className="wrap conversion-grid">
            <div><span className="kicker">FROM INTEREST TO FIRST RECALL</span><h2>Make one agent remember—then decide how deep the boundary should go.</h2></div>
            <div><p>Start with the guided open-source path. If the integration touches release truth, governance, or evidence architecture, scope the boundary directly with Josh.</p><div className="actions"><Link className="button primary" href="/install" data-event="primary_cta_clicked" data-event-context="final_cta">Open Install Cockpit <span>→</span></Link><Link className="button secondary" href="/services" data-event="services_opened" data-event-context="final_cta">Work with Josh <span>→</span></Link></div></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
