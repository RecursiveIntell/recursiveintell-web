import type { Metadata } from "next";
import { Footer, Header, PageIntro, StatusBadge } from "../components/SiteChrome";
import { LiveRegistry } from "../components/LiveRegistry";
import { coreLinks, hosts } from "../content";

export const metadata: Metadata = {
  title: "Platform",
  description: "The memory stack from one-device Agent Memory Kits and semantic-memory-mcp to the self-hosted Mnemes multi-device server.",
};

const engineFeatures = [
  ["Canonical store", "SQLite content, raw f32 embeddings, temporal fields, lineage, authority records, and durable receipts."],
  ["Hybrid retrieval", "FTS5/BM25 plus dense candidates, weighted reciprocal-rank fusion, deduplication, diversity, and explicit state visibility."],
  ["Temporal truth", "Current, historical, and superseded fact views with valid time separated from recorded time."],
  ["Knowledge graph", "Semantic, temporal, causal, and entity relationships with invalidation instead of silent deletion."],
  ["Governed operations", "Capability-gated append, supersession, redaction, forgetting, export, replay, and origin revocation."],
  ["Recovery", "Integrity checks and reconciliation rebuild derived state from canonical SQLite authority."],
];

export default function PlatformPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="03"
        eyebrow="THE PLATFORM"
        title="Three layers."
        accent="One contract vocabulary."
        body="You can stop at the layer you need. semantic-memory owns memory quality. semantic-memory-mcp exposes it to one local agent. Mnemes adds the self-hosted server, multi-device identity, routing, and synchronization metadata."
      />

      <section className="content-section shell">
        <div className="platform-layers" data-reveal>
          <article>
            <span>03</span><div><StatusBadge>Mnemes</StatusBadge><h2>Personal memory server</h2><p>Self-hosted devices, actors, operation envelopes, provenance edges, routed shard selection, synchronization receipts, revocation, and quarantine.</p></div>
            <footer><a href={coreLinks.mnemesGithub} target="_blank" rel="noreferrer">GitHub ↗</a><a href={coreLinks.mnemesCrate} target="_blank" rel="noreferrer">crates.io ↗</a><a href={coreLinks.mnemesDocs} target="_blank" rel="noreferrer">docs.rs ↗</a></footer>
          </article>
          <i />
          <article>
            <span>02</span><div><StatusBadge>semantic-memory-mcp</StatusBadge><h2>Protocol server</h2><p>Stdio and loopback HTTP, runtime-discovered tools, bounded profiles, witnessed search, replay, graph traversal, authority decisions, and maintenance boundaries.</p></div>
            <footer><a href={coreLinks.mcpGithub} target="_blank" rel="noreferrer">GitHub ↗</a><a href={coreLinks.mcpCrate} target="_blank" rel="noreferrer">crates.io ↗</a></footer>
          </article>
          <i />
          <article>
            <span>01</span><div><StatusBadge>semantic-memory</StatusBadge><h2>Memory engine</h2><p>SQLite authority, hybrid retrieval, embeddings, graph, bitemporal state, provenance, receipts, replay privacy, integrity, and reconciliation.</p></div>
            <footer><a href={coreLinks.memoryGithub} target="_blank" rel="noreferrer">GitHub ↗</a><a href={coreLinks.memoryCrate} target="_blank" rel="noreferrer">crates.io ↗</a><a href={coreLinks.memoryDocs} target="_blank" rel="noreferrer">docs.rs ↗</a></footer>
          </article>
        </div>
      </section>

      <section className="content-section engine-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div><p className="section-mark">01 / THE ENGINE</p><h2>More than vector search.<br /><em>Less than an oracle.</em></h2></div>
            <p>The memory engine owns durable storage and retrieval mechanics. It does not own claim truth, action permission, MCP transport policy, or automatic activation of every research feature.</p>
          </div>
          <div className="feature-atlas" data-reveal>
            {engineFeatures.map((item, index) => <article key={item[0]}><span>0{index + 1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}
          </div>
          <div className="retrieval-flow" data-reveal>
            {["query", "FTS5 / BM25", "dense candidates", "weighted RRF", "exact f32 rerank", "state filter", "witness"].map((item, index) => <div key={item}><span>0{index + 1}</span><b>{item}</b>{index < 6 && <i>→</i>}</div>)}
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div><p className="section-mark">02 / THE PROTOCOL</p><h2>Tools are capabilities.<br /><em>Profiles are boundaries.</em></h2></div>
          <p>The running server&apos;s tools/list response remains the source of truth. Build features and runtime profile both affect what a client can actually call.</p>
        </div>
        <div className="tool-profiles" data-reveal>
          <article><span>LEAN / STANDARD</span><strong>governed read surface</strong><p>Witnessed recall, replay, and separate assertion/action authority decisions. Designed for the narrowest autonomous surface.</p></article>
          <article><span>AGENT</span><strong>bounded daily work</strong><p>Search, fact reads, graph paths, conversations, namespaces, receipts, and stats without device administration.</p></article>
          <article><span>FULL / OPERATOR</span><strong>compiled operational surface</strong><p>Mutation, imports, lifecycle, maintenance, administration, and experimental tools. Treat discovery as runtime evidence, not README promise.</p></article>
        </div>
        <div className="transport-band" data-reveal><span>stdio JSON-RPC</span><i /> <span>loopback HTTP</span><i /> <span>Candle local embedding</span><em>or</em><span>Ollama HTTP</span><i /> <span>SQLite authority</span></div>
      </section>

      <section className="content-section host-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div><p className="section-mark">03 / NINE AGENT HOSTS</p><h2>Use the agent you have.<br /><em>Keep the memory you built.</em></h2></div>
            <p>Agent Memory Kits are a complete single-device starting point, not a reduced demo. They distribute semantic-memory-mcp into hook-tier and context-tier hosts; Mnemes is added only when a server and cross-device memory boundary are wanted.</p>
          </div>
          <div className="host-grid" data-reveal>
            {hosts.map((host, index) => <article key={host[0]}><span>0{index + 1}</span><StatusBadge tone={host[1] === "Hook tier" ? "released" : "observed"}>{host[1]}</StatusBadge><h3>{host[0]}</h3><p>{host[2]}</p></article>)}
          </div>
          <div className="source-actions" data-reveal><a className="button button-primary" href={coreLinks.kitsGithub} target="_blank" rel="noreferrer">Open Agent Memory Kits <span>↗</span></a></div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div><p className="section-mark">04 / COMPRESSION WITH AN ESCAPE HATCH</p><h2>Approximate to find.<br /><em>Exact to decide.</em></h2></div>
          <p>Canonical memory stays exact. Compressed tiers make candidate retrieval smaller and more efficient. Approximate scores find candidates; authoritative f32 scoring decides the final order.</p>
        </div>
        <div className="compression-map" data-reveal>
          <article><span>CANONICAL</span><h3>SQLite + raw f32</h3><p>Durable content and exact vectors remain the authority.</p></article>
          <i>→</i>
          <article><span>CANDIDATES</span><h3>TurboQuant / compressed pools</h3><p>Derived artifacts narrow the working set under explicit policy.</p></article>
          <i>→</i>
          <article><span>DECISION</span><h3>Exact f32 rerank</h3><p>Final ranking returns to authoritative vectors before visibility filters.</p></article>
        </div>
      </section>

      <section className="content-section public-proof">
        <div className="shell"><LiveRegistry /></div>
      </section>
      <Footer />
    </main>
  );
}
