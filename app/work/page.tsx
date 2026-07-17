import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { ObservatoryHero, SectionHeader } from "../proof/Observatory";
import styles from "../proof/observatory.module.css";

const ogImage = "/api/og?title=Case%20studies%20without%20theatre.&kicker=SELECTED%20WORK%20%2F%20PUBLIC%20ARTIFACTS&detail=Memory%20%C2%B7%20proof%20%C2%B7%20compression%20%C2%B7%20local-first&accent=violet";

export const metadata: Metadata = {
  title: "Selected Engineering Work — RecursiveIntell",
  description: "Public engineering case studies across agent memory, evidence infrastructure, compression, and local-first AI products.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Selected Engineering Work — RecursiveIntell", description: "Case studies grounded in public artifacts—not fabricated outcomes.", url: "/work", type: "website", images: [{ url: ogImage, width: 1200, height: 630, alt: "RecursiveIntell selected engineering work" }] },
  twitter: { card: "summary_large_image", title: "RecursiveIntell Engineering Work", description: "Inspectable systems work across memory, proof, and local-first AI.", images: [ogImage] },
};

const cases = [
  {
    number: "CASE / 01",
    state: "PUBLIC · RELEASED",
    title: "A local-first memory spine for coding agents",
    problem: "Agent context is easy to demonstrate and hard to operate: it must persist across sessions, retrieve the right prior state, expose contradictions, and remain useful when optional acceleration fails.",
    approach: ["SQLite-backed canonical memory with lexical and vector retrieval", "Bitemporal state and explicit supersession", "Typed search receipts, degradation paths, and MCP adapters"],
    artifacts: ["semantic-memory", "semantic-memory-mcp", "agent-memory-kits"],
    href: "https://github.com/RecursiveIntell/semantic-memory",
    label: "Inspect semantic-memory",
  },
  {
    number: "CASE / 02",
    state: "PUBLIC · COMPOSABLE",
    title: "Evidence and identity primitives that do less—precisely",
    problem: "Receipts become meaningless when identity, scope, canonicalization, and claim history are implicit or owned by whichever layer happens to emit JSON.",
    approach: ["Shared identifiers and digests kept separate from policy", "Canonical JSON boundaries with duplicate-key rejection", "Hash-chained claim and evidence events with explicit non-authority"],
    artifacts: ["stack-ids", "boundary-compiler", "claim-ledger"],
    href: "https://crates.io/crates/claim-ledger",
    label: "Inspect claim-ledger",
  },
  {
    number: "CASE / 03",
    state: "PUBLIC · EXPERIMENTAL",
    title: "Measured compression with exact escape hatches",
    problem: "Vector and context compression can reduce resource cost, but only if formats, quality budgets, decode paths, and fallback behavior stay inspectable.",
    approach: ["Experimental hot and cold codec paths", "Policy-driven selection kept separate from codec truth", "Benchmark receipts and exact/raw fallback contracts"],
    artifacts: ["turbo-quant", "fib-quant", "poly-kv"],
    href: "https://github.com/RecursiveIntell/turbo-quant",
    label: "Inspect turbo-quant",
  },
  {
    number: "CASE / 04",
    state: "PUBLIC · APPLICATION",
    title: "A private research workspace for local models",
    problem: "Document-grounded exploration often sends source material through a hosted pipeline. Gloss explores a desktop-local alternative for notebooks and models.",
    approach: ["Tauri desktop shell with a React interface", "Rust application core", "Local Ollama model path and privacy-preserving product direction"],
    artifacts: ["Gloss", "Tauri", "React", "Rust", "Ollama"],
    href: "https://github.com/RecursiveIntell/Gloss",
    label: "Inspect Gloss",
  },
] as const;

export default function WorkPage() {
  return (
    <div className={styles.page}>
      <Header current="work" />
      <main id="main">
        <ObservatoryHero
          eyebrow="Selected work / public artifacts"
          title="Case studies without"
          accent="theatre."
          lede="A portfolio of systems problems, design responses, and inspectable artifacts. These are engineering case studies—not client testimonials, adoption claims, or invented business outcomes."
          actions={<><Link className={styles.primary} href="/proof" data-event="proof_opened" data-event-context="work_hero">Enter the Proofroom <span>→</span></Link><a className={styles.secondary} href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer" data-event="github_opened" data-event-context="work_hero">Public source <span>↗</span></a></>}
          panelLabel="Portfolio / evidence-bound"
          panelState="No invented outcomes"
          panelTitle={<>The artifact is the <span className={styles.accent}>case.</span></>}
          panelCopy={<p>Each study names the problem, architecture, status, and public inspection path. Repository and registry records establish what exists; they do not establish production suitability.</p>}
          panelFoot="Problem → design → public evidence"
        />

        <section className={styles.section}>
          <div className={styles.wrap}>
            <SectionHeader label="01 / Systems portfolio" title={<>Four surfaces. <span className={styles.accent}>One thesis.</span></>} copy="Local ownership, typed boundaries, deliberate degradation, and inspectable evidence recur across the stack—even when the product surface changes." />
            <div className={styles.caseGrid}>
              {cases.map((item) => (
                <article className={styles.case} key={item.number}>
                  <div className={styles.caseNumber}><span>{item.number}</span><b>{item.state}</b></div>
                  <h3>{item.title}</h3>
                  <p>{item.problem}</p>
                  <ul>{item.approach.map((point) => <li key={point}>{point}</li>)}</ul>
                  <div className={styles.caseArtifacts}>{item.artifacts.map((artifact) => <span key={artifact}>{artifact}</span>)}</div>
                  <a className={styles.textLink} href={item.href} target="_blank" rel="noreferrer" data-event="case_source_opened" data-event-label={item.number}>{item.label} <span>↗</span></a>
                </article>
              ))}
            </div>
            <p className={styles.boundaryNote}>Evidence boundary: repository pages, registry versions, and the July 16, 2026 catalog snapshot confirm public artifacts and stated scopes. They do not prove deployment scale, customer results, security, correctness, or fitness for a particular system.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`}>
          <div className={styles.wrap}>
            <SectionHeader label="02 / How work is evaluated" title="Every claim needs a witness." copy="The standard is not whether a diagram is compelling. It is whether another engineer can locate the owner, inspect the boundary, reproduce the path, and see what happens when it fails." />
            <div className={styles.cards}>
              <article className={styles.card}><span className={styles.cardLabel}>Ownership</span><h3>What owns truth?</h3><p>Canonical durable state is named. Indexes, caches, summaries, and receipts are not allowed to silently become competing sources of truth.</p></article>
              <article className={styles.card}><span className={styles.cardLabel}>Failure</span><h3>What happens when it breaks?</h3><p>Fallback, refusal, partial completion, and degradation remain explicit—and an optional subsystem cannot manufacture success.</p></article>
              <article className={styles.card}><span className={styles.cardLabel}>Evidence</span><h3>What can be inspected?</h3><p>Versions, source scope, state views, inputs retained for replay, and known limitations stay attached to the claim they qualify.</p></article>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.callout}>
              <div><span className={styles.overline}>Apply the pattern</span><h2>Move from case study to system.</h2></div>
              <div><p>RecursiveIntell offers two bounded ways to apply this work: a hands-on agent-memory integration and an architecture review focused on local-first boundaries.</p><div className={styles.actions}><Link className={styles.primary} href="/services" data-event="services_opened" data-event-context="work_bottom">Review services <span>→</span></Link><Link className={styles.secondary} href="/libraries" data-event="catalog_opened" data-event-context="work_bottom">Explore all libraries <span>→</span></Link></div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
