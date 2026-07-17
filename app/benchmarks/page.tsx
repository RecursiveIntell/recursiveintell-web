import type { Metadata } from "next";
import Link from "next/link";
import crateData from "../data/published-crates.json";
import { Footer, Header } from "../components";
import { ObservatoryHero, SectionHeader } from "../proof/Observatory";
import styles from "../proof/observatory.module.css";

const ogImage = "/api/og?title=No%20metric%20without%20its%20receipt.&kicker=BENCHMARK%20LAB%20%2F%20METHOD%20FIRST&detail=Corpus%20%C2%B7%20revision%20%C2%B7%20machine%20%C2%B7%20raw%20evidence&accent=violet";

export const metadata: Metadata = {
  title: "Benchmark Lab & Publication Contract — RecursiveIntell",
  description: "The methodology and evidence contract for future RecursiveIntell memory, retrieval, and compression benchmark results.",
  alternates: { canonical: "/benchmarks" },
  openGraph: { title: "RecursiveIntell Benchmark Lab", description: "Methodology before metrics: the publication gate for reproducible benchmark evidence.", url: "/benchmarks", type: "website", images: [{ url: ogImage, width: 1200, height: 630, alt: "RecursiveIntell benchmark publication contract" }] },
  twitter: { card: "summary_large_image", title: "RecursiveIntell Benchmark Lab", description: "No leaderboard without reproducible inputs, scope, and receipts.", images: [ogImage] },
};

const gates = [
  ["Corpus", "Name, license, source, content characteristics, preprocessing, and a stable digest."],
  ["Split", "Exact query, train, validation, and test boundaries with leakage controls where relevant."],
  ["Revision", "Repository commit, crate versions, features, compiler, lockfile, and benchmark harness revision."],
  ["Machine", "CPU, memory, accelerator, operating system, power mode, and relevant runtime configuration."],
  ["Protocol", "Warmup, repetitions, concurrency, cache state, timeout, and failure-handling rules."],
  ["Statistic", "Aggregation, variability or uncertainty, exclusions, and the complete denominator."],
  ["Raw evidence", "Machine-readable observations, logs, errors, and receipt identifiers—not only a chart image."],
  ["Claim boundary", "What the measurement supports, what it does not support, and the exact fallback path."],
] as const;

export default function BenchmarksPage() {
  const receiptBench = crateData.crates.find((item) => item.name === "receipt-bench");
  const observed = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }).format(new Date(crateData.observed_at));

  return (
    <div className={styles.page}>
      <Header current="benchmarks" />
      <main id="main">
        <ObservatoryHero
          eyebrow="Benchmark lab / methodology first"
          title="No metric without its"
          accent="receipt."
          lede="This lab publishes the evidence contract before the leaderboard. Results stay withheld until corpus, revision, machine, protocol, uncertainty, raw observations, and claim boundary can travel with every point."
          actions={<><a className={styles.primary} href="#publication-gate" data-event="benchmark_method_opened">Inspect the publication gate <span>↓</span></a>{receiptBench ? <a className={styles.secondary} href={receiptBench.crates_io_url} target="_blank" rel="noreferrer" data-event="crate_opened" data-event-label="receipt-bench">receipt-bench v{receiptBench.version} <span>↗</span></a> : null}</>}
          panelLabel="Lab / publication state"
          panelState="Results withheld"
          panelTitle={<>Credibility compounds before <span className={styles.accent}>rankings.</span></>}
          panelCopy={<p>The available registry snapshot confirms a replayable benchmark substrate named receipt-bench. It does not supply normalized result datasets suitable for a public comparison.</p>}
          panelFoot={`Registry snapshot / ${observed} UTC`}
        />

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.holdback}>
              <div className={styles.holdbackTitle}><span className={styles.cardLabel}>CURRENT RESULT STATE</span><strong>NO LEADERBOARD YET</strong><span className={styles.snapshot}>Method contract published first</span></div>
              <div className={styles.holdbackCopy}><h3>Why the empty chart is intentional</h3><p>A beautiful chart without stable inputs and downloadable evidence creates confidence faster than it creates knowledge. The public snapshot identifies the benchmark substrate, but not a normalized cross-system dataset.</p><ul className={styles.checklist}><li>No invented latency, quality, memory, or cost numbers</li><li>No comparison across unmatched hardware or corpus</li><li>No default that hides a weaker supported path</li><li>No headline claim without raw observations and a receipt</li></ul></div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`} id="publication-gate">
          <div className={styles.wrap}>
            <SectionHeader label="01 / Eight-gate contract" title={<>A result ships only when its <span className={styles.accent}>scope ships.</span></>} copy="Each gate is part of the result, not supplementary fine print. Missing information blocks publication or appears as an explicit, visible limitation." />
            <div className={styles.contract}>{gates.map(([title, copy]) => <article className={styles.gate} key={title}><strong>{title}</strong><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <SectionHeader label="02 / Candidate suites" title="Three measurement surfaces." copy="These suites follow the public receipt-bench scope—semantic search, compression, and memory operations. They describe what the lab intends to measure, not completed performance claims." />
            <div className={styles.methodGrid}>
              <article className={styles.methodCard}><span className={styles.cardLabel}>SUITE / RETRIEVAL</span><h3>Find the right state</h3><p>Exact, lexical, vector, hybrid, and temporal-state paths evaluated against a disclosed corpus and query set.</p><ul><li>Recall and ranking quality</li><li>Latency distribution, not one best run</li><li>Strict and degraded-path separation</li><li>Index and canonical-store boundaries</li></ul></article>
              <article className={styles.methodCard}><span className={styles.cardLabel}>SUITE / COMPRESSION</span><h3>Trade space, time, and quality</h3><p>Experimental codecs measured with wire format, profile, quality budget, resource ceiling, and exact/raw fallback in view.</p><ul><li>Distortion and task-relevant quality</li><li>Encode/decode cost</li><li>Memory and artifact size</li><li>Unsupported and fallback paths</li></ul></article>
              <article className={styles.methodCard}><span className={styles.cardLabel}>SUITE / MEMORY OPS</span><h3>Operate the lifecycle</h3><p>Ingest, retrieve, supersede, forget, reconcile, and replay behavior evaluated as operations—not collapsed into a single speed score.</p><ul><li>Cold and warm state</li><li>Integrity and reconciliation</li><li>Retention and replay boundary</li><li>Typed failure completeness</li></ul></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionPaper}`}>
          <div className={styles.wrap}>
            <div className={styles.principles}>
              <div className={styles.principleIntro}><span className={styles.overline}>03 / Visual contract</span><h2>Charts must reveal, not persuade.</h2><p>When normalized data is ready, visual polish will serve inspection: filters, uncertainty, accessible tables, and downloadable data—not ornamental certainty.</p></div>
              <div className={styles.principleList}>
                <article className={styles.principle}><span className={styles.micro}>AXES</span><strong>Comparable scales</strong><p>No dual axes, truncated context, or units that shift between series without warning.</p></article>
                <article className={styles.principle}><span className={styles.micro}>DEFAULTS</span><strong>Representative first</strong><p>Defaults are declared and defensible, with weaker or failed paths still discoverable.</p></article>
                <article className={styles.principle}><span className={styles.micro}>ACCESS</span><strong>Table parity</strong><p>Every chart has a readable data table and does not require color perception to decode.</p></article>
                <article className={styles.principle}><span className={styles.micro}>EXPORT</span><strong>Data travels</strong><p>CSV or JSON, configuration, raw observations, and receipt references ship beside the graphic.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.callout}>
              <div><span className={styles.overline}>Evidence trail</span><h2>Inspect what exists now.</h2></div>
              <div><p>The Proofroom demonstrates receipt anatomy with a deterministic fixture. The changelog reports public registry updates from a named snapshot. Neither is a substitute for normalized benchmark results.</p><div className={styles.actions}><Link className={styles.primary} href="/proof" data-event="proof_opened" data-event-context="benchmarks_bottom">Open the Proofroom <span>→</span></Link><Link className={styles.secondary} href="/changelog" data-event="changelog_opened" data-event-context="benchmarks_bottom">Read public updates <span>→</span></Link></div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
