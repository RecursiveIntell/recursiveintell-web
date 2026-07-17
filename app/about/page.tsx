import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { ObservatoryHero, SectionHeader } from "../proof/Observatory";
import styles from "../proof/observatory.module.css";

const ogImage = "/api/og?title=Josh%20Stevenson%20%2F%20RecursiveIntell&kicker=ABOUT%20%2F%20PERSON%20BEHIND%20THE%20SYSTEM&detail=Local-first%20systems%20%C2%B7%20public%20evidence&accent=cyan";

export const metadata: Metadata = {
  title: "About Josh Stevenson & RecursiveIntell",
  description: "Meet Josh Stevenson, the builder behind RecursiveIntell's local-first agent memory, evidence, and systems infrastructure.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Josh Stevenson & RecursiveIntell",
    description: "The person, principles, and public engineering evidence behind RecursiveIntell.",
    url: "/about",
    type: "profile",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Josh Stevenson and RecursiveIntell" }],
  },
  twitter: { card: "summary_large_image", title: "About RecursiveIntell", description: "The person and principles behind the stack.", images: [ogImage] },
};

const principles = [
  ["Local before remote", "Keep durable context near the work, expose network and authority boundaries, and avoid turning a hosted service into an invisible dependency."],
  ["Receipts, not theatre", "Record what ran, which state was used, what degraded, and what was retained. Evidence improves inspection; it never guarantees correctness."],
  ["Typed failure", "Interruption, refusal, degradation, and failure should remain distinguishable instead of collapsing into a successful-looking response."],
  ["Canonical owners", "Durable facts, derived indexes, evidence records, and policy decisions need clear owners so recovery and trust stay tractable."],
] as const;

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Josh Stevenson",
    url: "https://recursiveintell.com/about",
    email: "mailto:J.stevenson.cs@gmail.com",
    sameAs: ["https://github.com/RecursiveIntell"],
    knowsAbout: ["local-first software", "AI agent memory", "Rust", "Model Context Protocol", "evidence receipts"],
  };

  return (
    <div className={styles.page}>
      <Header current="about" />
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
        <ObservatoryHero
          eyebrow="About / person behind the system"
          title="Build the memory. Preserve the"
          accent="boundary."
          lede="Josh Stevenson is the builder behind RecursiveIntell—an independent engineering project focused on local-first agent memory, typed execution boundaries, temporal state, and inspectable evidence."
          actions={<><Link className={styles.primary} href="/work" data-event="work_opened" data-event-context="about_hero">Inspect selected work <span>→</span></Link><a className={styles.secondary} href="mailto:J.stevenson.cs@gmail.com?subject=RecursiveIntell%20inquiry" data-event="contact_started" data-event-context="about_hero">Start a conversation <span>↗</span></a></>}
          panelLabel="Identity / public"
          panelTitle={<>Josh Stevenson<br /><span className={styles.accent}>RecursiveIntell</span></>}
          panelCopy={<p>Systems engineering for agents that need to remember, recover, explain their execution path, and keep authority separate from recall.</p>}
          panelFoot="Public profile / public engineering artifacts"
        />

        <section className={styles.section}>
          <div className={styles.wrap}>
            <SectionHeader label="01 / Working thesis" title={<>Intelligence needs <span className={styles.accent}>infrastructure.</span></>} copy="The work begins where a convincing demo usually ends: persistence, recovery, refusal, provenance, upgrades, and the exact limits of what a system can prove." />
            <div className={styles.stats}>
              <article className={styles.stat}><span className={styles.cardLabel}>Catalog records</span><strong>97</strong><span>audited package records in the July 16, 2026 site snapshot</span></article>
              <article className={styles.stat}><span className={styles.cardLabel}>Architecture</span><strong>13</strong><span>domains from memory and retrieval through governance and repair</span></article>
              <article className={styles.stat}><span className={styles.cardLabel}>Registry footprint</span><strong>111</strong><span>owned crates observed in the point-in-time crates.io inventory</span></article>
              <article className={styles.stat}><span className={styles.cardLabel}>Public repositories</span><strong>42</strong><span>observed in the public GitHub profile snapshot—not a live counter</span></article>
            </div>
            <p className={styles.boundaryNote}>These counts describe public and audited snapshots observed on July 16, 2026. They are evidence of scope and activity, not claims about adoption, quality, or business outcomes.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionPaper}`}>
          <div className={styles.wrap}>
            <div className={styles.principles}>
              <div className={styles.principleIntro}><span className={styles.overline}>02 / Operating principles</span><h2>Trust is a composition.</h2><p>No model, memory store, policy, benchmark, or receipt carries the whole claim. The boundaries between them are part of the product.</p></div>
              <div className={styles.principleList}>{principles.map(([title, copy], index) => <article className={styles.principle} key={title}><span className={styles.micro}>0{index + 1}</span><strong>{title}</strong><p>{copy}</p></article>)}</div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`}>
          <div className={styles.wrap}>
            <SectionHeader label="03 / Public evidence" title="Follow the artifacts." copy="The strongest biography for technical work is inspectable output. These paths expose the code, release activity, catalog evidence, and the explicit limits around each claim." />
            <div className={styles.cards}>
              <article className={styles.card}><span className={styles.cardLabel}>Public source</span><h3>GitHub organization</h3><p>Repositories, release history, issues, and project-level documentation under the public RecursiveIntell profile.</p><a className={styles.textLink} href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer" data-event="github_opened" data-event-context="about">Open GitHub <span>↗</span></a></article>
              <article className={styles.card}><span className={styles.cardLabel}>System atlas</span><h3>Library catalog</h3><p>Ninety-seven package records with capabilities, maturity evidence, dependencies, publication status, and known limitations.</p><Link className={styles.textLink} href="/libraries" data-event="catalog_opened" data-event-context="about">Inspect the atlas <span>→</span></Link></article>
              <article className={styles.card}><span className={styles.cardLabel}>Shipping signal</span><h3>Activity & changes</h3><p>Scoped public GitHub and crates.io observations, with snapshot times kept separate from live state.</p><Link className={styles.textLink} href="/changelog" data-event="changelog_opened" data-event-context="about">Read the change log <span>→</span></Link></article>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.callout}>
              <div><span className={styles.overline}>Open channel</span><h2>Bring a bounded problem.</h2></div>
              <div><p>For an agent-memory integration or a local-first architecture review, send the system, constraint, and desired evidence. Josh will confirm fit and availability by reply.</p><div className={styles.actions}><Link className={styles.primary} href="/services" data-event="services_opened" data-event-context="about_bottom">Review services <span>→</span></Link><a className={styles.secondary} href="mailto:J.stevenson.cs@gmail.com?subject=RecursiveIntell%20project%20inquiry" data-event="contact_started" data-event-context="about_bottom">Email Josh <span>↗</span></a></div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
