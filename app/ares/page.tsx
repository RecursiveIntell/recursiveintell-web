import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "../lib/page-metadata";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, StudioCTA } from "../components/Studio";

export const metadata: Metadata = pageMetadata("/ares", {
  title: "Ares agent workbench",
  description: "Source-reviewed capabilities of the RecursiveIntell Ares downstream Hermes distribution: runtime custody, bounded context, collaboration, governed integrations and current limitations.",
});

const capabilities = [
  { name: "Interactive chat, provider routing, TUI and desktop", category: "HERITAGE / HERMES", state: "Inherited compatibility", detail: "The Hermes-compatible process provides these user-facing surfaces; Ares retains their contracts while selecting an isolated runtime home.", source: "https://github.com/NousResearch/hermes-agent" },
  { name: "Stable releases, doctor, status and rollback", category: "ARES-OWNED", state: "Source implemented", detail: "Ares selects and seals managed releases separately from the development checkout, maintains current/previous pointers and has typed recovery paths.", source: "https://github.com/RecursiveIntell/Ares/blob/main/ares_runtime/local_runtime.py" },
  { name: "Bounded collaboration and specialist panels", category: "ARES-OWNED", state: "Source implemented; activation conditional", detail: "Specialist descriptors, role and mission contracts, immutable handoffs, panel proposal artifacts and relevance gating form an explicit collaboration boundary.", source: "https://github.com/RecursiveIntell/Ares/blob/main/ares_runtime/collaboration.py" },
  { name: "Automatic context continuity", category: "ARES-OWNED", state: "Source implemented; runtime checks required", detail: "Turn-start context rebase operates after durable input but before admitted provider/tool dispatch, and distinguishes prepared context from execution authority.", source: "https://github.com/RecursiveIntell/Ares/blob/main/ares_runtime/continuity/runtime.py" },
  { name: "Context Governor and local memory", category: "EXTERNAL / GATED", state: "Configured components, not universal active state", detail: "Installed or configured Rust packages and local-memory stores require qualifying the build, permissions, source identity and active runtime paths.", source: "https://github.com/RecursiveIntell/Libraries" },
  { name: "Recursive Agent native execution", category: "EXTERNAL / GATED", state: "Separate daemon admission", detail: "The Ares installer can place a plugin payload, but a local authenticated daemon, operator permissions and per-run receipt verification remain separate preconditions.", source: "https://github.com/RecursiveIntell/Ares/blob/main/docs/ares-recursive-agent.md" },
  { name: "Bounded recursive improvement research", category: "EXPERIMENTAL / NOT ACTIVE", state: "Open qualification gates", detail: "Inference budget, authority, evaluator custody and recovery mechanics have bounded slices. End-to-end free-route physical-send enforcement and unattended adoption are not established.", source: "https://github.com/RecursiveIntell/Libraries/blob/main/docs/rsi-runs/rsi-remaining-20261112/RSI_REMAINING_STATUS_BLOCKED.md" },
] as const;

export default function AresPage() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro label="ARES / HERMES-COMPATIBLE AGENT" title="An agent workbench." accent="With accountable execution." body="Ares is an independent RecursiveIntell downstream distribution of Hermes Agent, not an official Nous Research product. Its contribution is the operator-owned control plane and source-linked contracts around familiar agent capabilities. Source reviewed November 16, 2026; installed behavior requires separate evidence." />
      <section className="studio-section studio-shell" aria-labelledby="ares-capabilities-heading">
        <div className="studio-section-heading">
          <div><p className="studio-eyebrow">01 / CAPABILITY OWNERSHIP</p><h2 id="ares-capabilities-heading">Inherited, owned,<br /><em>and gated.</em></h2></div>
          <p>A feature in the source tree is not automatically active in every Ares installation. The status and provenance of each layer matter.</p>
        </div>
        <div className="ri-architecture-grid">
          {capabilities.map((item) => (
            <article className="ri-architecture-card" key={item.name}>
              <p className="studio-eyebrow">{item.category}</p>
              <h3>{item.name}</h3>
              <p><strong>{item.state}</strong></p>
              <p>{item.detail}</p>
              <a href={item.source} className="studio-text-link" target="_blank" rel="noreferrer">Inspect source ↗</a>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-shell">
        <p className="studio-eyebrow">02 / RECENT SOURCE CHANGES</p>
        <h2>Change history is not a feature certification.</h2>
        <p>The following specific 2026 changes were verified through merged GitHub records; each has a separate admission boundary.</p>
        <ul className="ri-evidence-ladder">
          <li><a href="https://github.com/RecursiveIntell/Ares/pull/263" target="_blank" rel="noreferrer">November 16 · Ares #263</a> — recovery-marker test reliability repair; does not by itself validate unattended continuity.</li>
          <li><a href="https://github.com/RecursiveIntell/Libraries/pull/95" target="_blank" rel="noreferrer">November 15 · Libraries #95</a> — bounded RSI substrate fixes; activation remains off.</li>
          <li><a href="https://github.com/RecursiveIntell/recursive-agent/pull/36" target="_blank" rel="noreferrer">November 15 · Recursive Agent #36</a> — conservative inference-budget primitive; no physical-send authority.</li>
          <li><a href="https://github.com/RecursiveIntell/recursive-agent/pull/37" target="_blank" rel="noreferrer">Unmerged · Recursive Agent #37</a> — larger conflicting composition candidate, not a shipped runtime.</li>
        </ul>
        <p>Installed/registered/exposed/exercised are different states. None of the above establish an autonomous production RSI system.</p>
        <Link href="/install" className="studio-text-link">Inspect installation options and caveats ↗</Link>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
