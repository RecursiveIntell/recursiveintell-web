import Link from "next/link";
import { Footer, Header, SectionHead } from "./components";
import LivePulse from "./LivePulse";

const planes = [
  ["01", "Memory + provenance", "Durable retrieval, temporal state, claims, and source lineage.", "7 packages", "/libraries?domain=Memory%2C+knowledge%2C+and+provenance"],
  ["02", "Verification + authority", "Permits, decisions, attestations, settlement, and refutation.", "22 packages", "/libraries?domain=Verification%2C+governance%2C+and+authority"],
  ["03", "Contracts + identity", "Wire-visible schemas, canonical IDs, and boundary compilation.", "5 packages", "/libraries?domain=Contracts%2C+schemas%2C+and+identity"],
  ["04", "Agent execution", "Typed graphs, bounded plans, resumability, and tool effects.", "7 packages", "/libraries?domain=Agent+orchestration+and+execution"],
  ["05", "Compression + evaluation", "Measured vector and KV codecs with explicit quality gates.", "9 packages", "/libraries?domain=Compression%2C+vector+storage%2C+and+evaluation"],
  ["06", "Security + boundaries", "Fail-closed admission, sandboxing, policies, and typed failure.", "7 packages", "/libraries?domain=Security+and+boundaries"],
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
        <section className="hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Open-source Rust + MCP infrastructure</span>
              <h1>Agent memory <em>that can show its work.</em></h1>
              <p>Start with persistent memory for the coding agent you already use. Underneath it is a programmable trust substrate for typed boundaries, temporal truth, receipts, replay, and measured compression.</p>
              <div className="actions"><Link className="button primary" href="/install">Install agent memory <span>→</span></Link><Link className="button secondary" href="/libraries">Explore the library system <span>→</span></Link></div>
              <div className="source-rail"><span>Local-first</span><span>SQLite-authoritative</span><span>Apache-2.0 product repos</span><span>Receipts ≠ factual truth</span></div>
            </div>
            <LivePulse />
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <SectionHead index="01 · USE IT TODAY" title="One memory system. Three entry layers." body="Choose the layer that matches the job: operator kits, a protocol server, or the authoritative Rust retrieval core." />
            <div className="spine">
              <article><small>03 / USE</small><h3>Agent Memory Kits</h3><code>agent-memory-kits</code><p>Host-specific setup, lifecycle integration, doctors, ingestion, recall, compaction, and claim/evidence workflows.</p><Link href="/install">Choose a host →</Link></article>
              <article><small>02 / SERVE</small><h3>Semantic Memory MCP</h3><code>semantic-memory-mcp · 0.5.4</code><p>Bounded MCP profiles, witnessed retrieval, replay, graph access, and separate assertion/action authority decisions.</p><a href="https://github.com/RecursiveIntell/semantic-memory-mcp" target="_blank" rel="noreferrer">Inspect the server ↗</a></article>
              <article><small>01 / OWN</small><h3>Semantic Memory</h3><code>semantic-memory · 0.5.11</code><p>SQLite-authoritative hybrid retrieval, weighted RRF, bitemporal views, explained ranking, and durable receipts.</p><a href="https://github.com/RecursiveIntell/semantic-memory" target="_blank" rel="noreferrer">Inspect the core ↗</a></article>
            </div>
          </div>
        </section>

        <section className="section trace-section">
          <div className="wrap">
            <SectionHead index="02 · WITNESSED RETRIEVAL" title="Follow one answer all the way out." body="The retrieval path stays inspectable. Degradation in one plane cannot silently promote another." />
            <div className="trace">
              <div className="trace-query"><span>QUERY / CURRENT</span><b>“What did we decide about package truth?”</b></div>
              <div className="trace-lane">{["HOST", "CONTRACT", "FTS5 / BM25", "DENSE", "WEIGHTED RRF", "STATE", "WITNESS"].map((name, index) => <div key={name}><small>{String(index + 1).padStart(2, "0")}</small><b>{name}</b><i /></div>)}</div>
              <div className="trace-result"><code>state CURRENT · receipt mcp-witness-… · replay inputs NOT RETAINED</code><span>Receipt ≠ truth</span></div>
            </div>
          </div>
        </section>

        <section className="section paper">
          <div className="wrap">
            <SectionHead index="03 · CAPABILITY PLANES" title="The stack separates what most systems blur." body="Six responsibilities form the trust substrate. Open any plane in the exhaustive Library Atlas." />
            <div className="plane-grid">{planes.map(([index, title, body, count, href]) => <Link href={href} key={title}><small>{index}</small><h3>{title}</h3><p>{body}</p><b>{count} →</b></Link>)}</div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <SectionHead index="04 · FLAGSHIP COMPOSITIONS" title="Three products emerging from one trust substrate." body="Maturity labels describe sequencing—not blanket readiness claims." />
            <div className="product-grid">{products.map(([lane, title, body, crates]) => <article key={title}><small>{lane}</small><h3>{title}</h3><p>{body}</p><code>{crates}</code></article>)}</div>
          </div>
        </section>

        <section className="section evidence">
          <div className="wrap">
            <SectionHead index="05 · EVIDENCE" title="Inspect the scope—not just the status." body="Strong subsystem evidence exists. That does not automatically certify a release, prove correctness, or authorize an action." />
            <div className="evidence-grid"><div><small>CURRENT AUDIT POSTURE</small><strong>Source-hardened.<br />Not release-certified.</strong><p>Source, package, live, and receipt evidence remain separate scopes.</p></div><div><span>Source</span><b>Exact checkout + command scope</b><span>Package</span><b>Packed crate + clean-install parity</b><span>Live</span><b>Artifact identity + runtime canary</b><span>Receipt</span><b>Observed evidence—not correctness</b></div><Link href="/concepts#receipts"><span>FIELD MANUAL</span><strong>Receipts, replay, ownership, and typed failure →</strong></Link></div>
          </div>
        </section>

        <section className="section route-section">
          <div className="wrap">
            <SectionHead index="06 · CHOOSE YOUR RESOLUTION" title="One system. Five ways in." body="The overview carries the thesis. The other routes carry the depth." />
            <div className="route-grid"><Link href="/activity"><small>LIVE</small><h3>Activity</h3><p>Public repository and crate changes.</p><b>Open the pulse →</b></Link><Link href="/libraries"><small>97 RECORDS</small><h3>Libraries</h3><p>Every audited package and limit.</p><b>Search the atlas →</b></Link><Link href="/install"><small>6 PATHS</small><h3>Install</h3><p>Host, MCP, and Rust recipes.</p><b>Get memory working →</b></Link><Link href="/concepts"><small>8 CHAPTERS</small><h3>Concepts</h3><p>Time, authority, receipts, replay.</p><b>Read the manual →</b></Link></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
