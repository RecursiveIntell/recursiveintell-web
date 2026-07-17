import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import ReceiptLab from "./ReceiptLab";
import { ObservatoryHero, SectionHeader } from "./Observatory";
import styles from "./observatory.module.css";

const ogImage = "/api/og?title=See%20the%20path.%20Keep%20the%20limits.&kicker=PROOFROOM%20%2F%20RECEIPT%20INSPECTOR&detail=Deterministic%20fixture%20%C2%B7%20replay%20diff&accent=cyan";

export const metadata: Metadata = {
  title: "Release Proofroom & Receipt Inspector — RecursiveIntell",
  description: "Inspect a deterministic receipt fixture, compare replay states, and learn the evidence boundaries behind RecursiveIntell systems.",
  alternates: { canonical: "/proof" },
  openGraph: { title: "RecursiveIntell Proofroom", description: "An interactive, deterministic receipt anatomy and replay-diff demonstration.", url: "/proof", type: "website", images: [{ url: ogImage, width: 1200, height: 630, alt: "RecursiveIntell receipt inspector and replay diff" }] },
  twitter: { card: "summary_large_image", title: "RecursiveIntell Proofroom", description: "See what a receipt can show—and what it cannot prove.", images: [ogImage] },
};

export default function ProofPage() {
  return (
    <div className={styles.page}>
      <Header current="proof" />
      <main id="main">
        <ObservatoryHero
          eyebrow="Proofroom / deterministic fixture"
          title="See the path. Keep the"
          accent="limits."
          lede="Receipts can bind an execution to its state view, candidate path, degradations, result, and replay boundary. They make the path inspectable; they do not turn the result into truth."
          actions={<><a className={styles.primary} href="#inspector" data-event="demo_started" data-event-label="receipt_anatomy">Open the inspector <span>↓</span></a><Link className={styles.secondary} href="/benchmarks" data-event="benchmarks_opened" data-event-context="proof_hero">Read benchmark method <span>→</span></Link></>}
          panelLabel="Proof / fixture state"
          panelState="Deterministic · redacted"
          panelTitle={<>Evidence is useful when its <span className={styles.accent}>scope survives.</span></>}
          panelCopy={<p>The interactive object below uses two precomputed teaching runs. It makes no network request, executes no model, and never represents a visitor’s local system.</p>}
          panelFoot="Receipt ≠ correctness · replay ≠ authority"
        />

        <section className={styles.section} id="inspector">
          <div className={styles.wrap}>
            <SectionHeader label="01 / Receipt inspector" title={<>Anatomy, then <span className={styles.accent}>difference.</span></>} copy="Select a field to understand its role. Then compare Run A and Run B to see how retained state changes an answer without erasing the boundary around that answer." />
            <ReceiptLab />
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`}>
          <div className={styles.wrap}>
            <SectionHeader label="02 / Evidence scopes" title="One word. Four boundaries." copy="“Proof” becomes dangerous when source evidence, package declarations, live observations, and execution receipts are blended into a single confidence claim." />
            <div className={styles.proofGrid}>
              <article className={styles.proofCard}><span className={styles.cardLabel}>SOURCE</span><h3>What a source declares</h3><p>README, manifest, code, schema, or repository history. It can establish what was written at a revision—not whether every runtime path behaves accordingly.</p></article>
              <article className={styles.proofCard}><span className={styles.cardLabel}>PACKAGE</span><h3>What an artifact contains</h3><p>Published version, features, dependencies, ownership, and declared metadata. Publication alone is not evidence of production suitability.</p></article>
              <article className={styles.proofCard}><span className={styles.cardLabel}>LIVE / SNAPSHOT</span><h3>What a service reported</h3><p>Repository or registry state observed at a named time. Cached observations must not pose as current live telemetry.</p></article>
              <article className={styles.proofCard}><span className={styles.cardLabel}>RECEIPT</span><h3>What this execution recorded</h3><p>Inputs, state view, backend, degradations, result, and retained replay material within a bounded run.</p></article>
              <article className={styles.proofCard}><span className={styles.cardLabel}>NOT PROVEN</span><h3>Total correctness</h3><p>No receipt, benchmark, or release event proves factual truth, security, authorization, or the absence of unobserved failure.</p></article>
              <article className={styles.proofCard}><span className={styles.cardLabel}>NEXT INSPECTION</span><h3>Follow the artifact</h3><p>Open the source, registry record, change event, or benchmark contract attached to the specific claim.</p><Link className={styles.textLink} href="/changelog" data-event="changelog_opened" data-event-context="proof_scope">Open release evidence <span>→</span></Link></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionPaper}`}>
          <div className={styles.wrap}>
            <div className={styles.principles}>
              <div className={styles.principleIntro}><span className={styles.overline}>03 / Replay contract</span><h2>Reproduction requires retention.</h2><p>A receipt can identify an execution without carrying enough material to reproduce it. Retention is a deliberate privacy, storage, and authority decision.</p></div>
              <div className={styles.principleList}>
                <article className={styles.principle}><span className={styles.micro}>IDENTITY</span><strong>Receipt only</strong><p>Correlate a past execution and its declared result without claiming it can be rerun.</p></article>
                <article className={styles.principle}><span className={styles.micro}>MATERIAL</span><strong>Replayable</strong><p>Required fixture, prompt, state, configuration, and artifact versions were deliberately retained.</p></article>
                <article className={styles.principle}><span className={styles.micro}>LOSS</span><strong>Degraded replay</strong><p>Some required source is missing or no longer available, and that gap remains visible.</p></article>
                <article className={styles.principle}><span className={styles.micro}>AUTHORITY</span><strong>Inspection only</strong><p>Reproducing an execution does not grant permission to repeat its effects in the world.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.callout}>
              <div><span className={styles.overline}>From fixture to system</span><h2>Install the open path.</h2></div>
              <div><p>The Proofroom is a teaching surface. The install guide connects a supported host to the public agent-memory stack; the Pro path addresses commercial release and proof workflows.</p><div className={styles.actions}><Link className={styles.primary} href="/install" data-event="install_opened" data-event-context="proof_bottom">Install agent memory <span>→</span></Link><Link className={styles.secondary} href="/pro" data-event="pro_opened" data-event-context="proof_bottom">Explore Pro <span>→</span></Link></div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
