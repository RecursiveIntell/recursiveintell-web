import type { Metadata } from "next";
import { Footer, Header, PageIntro, StatusBadge } from "../components/SiteChrome";
import { LiveRegistry } from "../components/LiveRegistry";
import { MemoryProof } from "../components/MemoryProof";

export const metadata: Metadata = {
  title: "Proof",
  description: "Inspect dense retrieval, temporal resolution, execution receipts, evidence scopes, and live public status across the Mnemes stack.",
};

const receipt = [
  ["request", "search · current · namespaces[architecture]"],
  ["candidates", "FTS5 428 · dense 612 · graph 84"],
  ["fusion", "weighted RRF · k=60 · top 48"],
  ["state", "3 superseded · 1 contradicted · 0 silently dropped"],
  ["exactness", "compressed candidates · exact f32 rerank"],
  ["result", "12 visible · source identities retained"],
  ["replay", "inputs not retained · digests retained"],
];

export default function ProofPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="02"
        eyebrow="THE PROOF"
        title="Do not trust the answer."
        accent="Inspect its path."
        body="Mnemes inherits a strict evidence vocabulary from the stack beneath it. Search receipts, route receipts, source spans, temporal state, and integrity checks can make behavior inspectable—without pretending inspection makes the answer true."
      />

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div><p className="section-mark">01 / RETRIEVAL UNDER PRESSURE</p><h2>Meaning, exact language,<br />relationships, and <em>time.</em></h2></div>
          <p>Change the archive density, choose a failure or cross-device scenario, and run the five-stage retrieval model.</p>
        </div>
        <div data-reveal><MemoryProof extended /></div>
      </section>

      <section className="content-section receipt-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div><p className="section-mark">02 / ONE RECEIPT, OPENED</p><h2>What happened<br /><em>without claiming why.</em></h2></div>
            <p>A receipt can bind backend, candidates, exactness, fallback, degradation, temporal filters, and result identity. It cannot certify factual truth or permission to act.</p>
          </div>
          <div className="receipt-inspector" data-reveal>
            <aside>
              <header><span>receipt</span><b>search-8c31…e91</b></header>
              {receipt.map((item, index) => <div key={item[0]}><span>0{index + 1}</span><b>{item[0]}</b><p>{item[1]}</p></div>)}
            </aside>
            <article>
              <div className="receipt-seal"><i /><span>R</span><i /></div>
              <StatusBadge>execution observed</StatusBadge>
              <h3>A witness for the path.<br />Not a verdict on reality.</h3>
              <p>The receipt says which path produced a named result set under a named scope. Assertion authority, action authority, and claim truth remain separate decisions.</p>
              <blockquote>receipt ≠ correctness<br />relevance ≠ authority<br />memory ≠ permission</blockquote>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div><p className="section-mark">03 / EVIDENCE SCOPES</p><h2>Every green light<br />needs a <em>noun.</em></h2></div>
          <p>A source pass, package pass, live canary, and receipt are different kinds of evidence. “Verified” without a scope is just decorative certainty.</p>
        </div>
        <div className="evidence-scopes" data-reveal>
          <article><span>SOURCE</span><h3>Current checkout</h3><p>Files, commit, features, migrations, contracts, and tests inspected at one source identity.</p></article>
          <article><span>PACKAGE</span><h3>Shipped artifact</h3><p>The crate or package contains the declared assets and survives a fresh install path.</p></article>
          <article><span>LIVE</span><h3>Observed runtime</h3><p>A named binary and configuration exercised a named behavior in a named environment.</p></article>
          <article><span>RECEIPT</span><h3>Recorded execution</h3><p>A typed artifact records what ran, what degraded, and what output identity was observed.</p></article>
        </div>
      </section>

      <section className="content-section public-proof">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div><p className="section-mark">04 / PUBLIC SYSTEM PULSE</p><h2>Source you can open.<br /><em>Freshness you can see.</em></h2></div>
            <p>Current registry and repository data is requested directly where possible. Partial failure stays partial instead of manufacturing a fully live dashboard.</p>
          </div>
          <div data-reveal><LiveRegistry /></div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="proof-boundary" data-reveal>
          <div><p className="section-mark">05 / THE PUBLIC BOUNDARY</p><h2>Source-hardened.<br /><em>Not release-certified.</em></h2></div>
          <div>
            <h3>Safe to say</h3>
            <p>Open-source Rust crates exist; canonical SQLite state, routed server shards, temporal views, provenance, bounded MCP profiles, and optional receipts are present in current source.</p>
          </div>
          <div>
            <h3>Not established here</h3>
            <p>Production readiness, security certification, universal truth, autonomous permission, competitor superiority, device-owned continuous replication, or performance outside a named benchmark receipt.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

