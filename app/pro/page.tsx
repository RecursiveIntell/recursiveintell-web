import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { ObservatoryHero, SectionHeader } from "../proof/Observatory";
import styles from "../proof/observatory.module.css";

const ogImage = "/api/og?title=Release%20evidence%20as%20an%20operating%20surface.&kicker=RECURSIVEINTELL%20PRO%20%2F%20PILOT&detail=Release%20Gate%20%C2%B7%20Verify%20Patch%20%C2%B7%20proof%20packets&accent=amber";

export const metadata: Metadata = {
  title: "RecursiveIntell Pro — Pilot Interest",
  description: "Explore the RecursiveIntell Pro overlay for release gates, patch verification, proof packets, Forge administration, and Agent Guard posture reporting.",
  alternates: { canonical: "/pro" },
  openGraph: { title: "RecursiveIntell Pro — Pilot Interest", description: "Commercial release and proof workflows on top of the open RecursiveIntell stack.", url: "/pro", type: "website", images: [{ url: ogImage, width: 1200, height: 630, alt: "RecursiveIntell Pro release evidence workflows" }] },
  twitter: { card: "summary_large_image", title: "RecursiveIntell Pro", description: "Release Gate, Verify Patch, proof packets, and administrative evidence workflows.", images: [ogImage] },
};

const capabilities = [
  ["Release Gate", "A commercial workflow surface for evaluating release readiness and retaining the evidence behind the decision."],
  ["Verify Patch", "A focused patch-verification workflow that keeps inputs, checks, result state, and proof artifacts legible."],
  ["Proof packets", "License-gated packaging of release and verification evidence for handoff, review, and retained inspection."],
  ["Forge admin MCP", "Administrative MCP workflows for the Forge repair and verification surface, kept separate from ordinary agent authority."],
  ["Agent Guard posture", "Posture reporting around the Agent Guard control-plane surface; reporting is evidence, not a security guarantee."],
] as const;

export default function ProPage() {
  return (
    <div className={styles.page}>
      <Header current="pro" />
      <main id="main">
        <ObservatoryHero
          eyebrow="RecursiveIntell Pro / pilot interest"
          title="Turn release evidence into an"
          accent="operating surface."
          lede="RecursiveIntell Pro is the commercial overlay described in the public agent-memory-kits project: release gates, patch verification, proof packets, Forge administration, and Agent Guard posture workflows."
          actions={<><a className={styles.primary} href="mailto:J.stevenson.cs@gmail.com?subject=RecursiveIntell%20Pro%20pilot&body=Team%20or%20project%3A%20%0ARelease%20workflow%3A%20%0AEvidence%20needed%3A%20%0ADeployment%20boundary%3A%20" data-event="pro_interest" data-event-context="pro_hero">Request pilot fit <span>↗</span></a><a className={styles.secondary} href="https://github.com/RecursiveIntell/agent-memory-kits" target="_blank" rel="noreferrer" data-event="pro_source_opened">Public scope source <span>↗</span></a></>}
          panelLabel="Commercial / interest path"
          panelState="Not self-serve checkout"
          panelTitle={<>Proof that can move with the <span className={styles.accent}>release.</span></>}
          panelCopy={<p>Pilot scope, license terms, deployment boundary, availability, and pricing are confirmed directly. This page does not represent an instant purchase or a generally available hosted service.</p>}
          panelFoot="Published scope / terms confirmed directly"
        />

        <section className={styles.section}>
          <div className={styles.wrap}>
            <SectionHeader label="01 / Published Pro scope" title={<>Five commercial <span className={styles.accent}>surfaces.</span></>} copy="The capability names below are grounded in the public agent-memory-kits Pro description. Details are intentionally bounded until deployment and license requirements are known." />
            <div className={styles.proofGrid}>
              {capabilities.map(([title, copy], index) => (
                <article className={styles.proofCard} key={title}>
                  <span className={styles.cardLabel}>PRO / 0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <span className={styles.textLink}>Pilot-scoped <span>·</span></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`}>
          <div className={styles.wrap}>
            <SectionHeader label="02 / Separate the lanes" title="Open foundation. Commercial workflow." copy="Pro does not put basic adoption behind a lead form. The public memory stack remains a direct install path; the commercial layer addresses release and administrative workflows." />
            <div className={styles.scopeTableWrap} tabIndex={0} aria-label="Open-source and Pro scope comparison">
              <table className={styles.scopeTable}>
                <thead><tr><th>Surface</th><th>Open-source adoption</th><th>RecursiveIntell Pro interest</th></tr></thead>
                <tbody>
                  <tr><td>Agent memory</td><td>Public crates, host installation guidance, MCP adapters, and project documentation.</td><td>Uses the same public foundation; Pro is not required to begin installing memory.</td></tr>
                  <tr><td>Release decision</td><td>Public primitives can be composed by the operator.</td><td>Release Gate workflow and retained decision evidence.</td></tr>
                  <tr><td>Patch verification</td><td>Project-specific checks and public verification primitives.</td><td>Verify Patch workflow with a defined proof-packet boundary.</td></tr>
                  <tr><td>Administration</td><td>Public project interfaces and documentation.</td><td>Forge admin MCP and Agent Guard posture-reporting workflows.</td></tr>
                  <tr><td>Commercial terms</td><td>Governed by each public artifact’s declared license.</td><td>Pilot and license terms supplied directly after fit review.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionPaper}`}>
          <div className={styles.wrap}>
            <div className={styles.principles}>
              <div className={styles.principleIntro}><span className={styles.overline}>03 / Claim boundary</span><h2>A proof packet is not a verdict.</h2><p>Commercial packaging can make evidence easier to retain, review, and transfer. It cannot make an underlying result true by presentation alone.</p></div>
              <div className={styles.principleList}>
                <article className={styles.principle}><span className={styles.micro}>EVIDENCE</span><strong>What ran</strong><p>Inputs, checks, state view, result, degradations, and retained artifacts can be made inspectable.</p></article>
                <article className={styles.principle}><span className={styles.micro}>NOT PROVEN</span><strong>Total correctness</strong><p>A successful workflow does not prove the absence of bugs or establish factual truth beyond its scope.</p></article>
                <article className={styles.principle}><span className={styles.micro}>POSTURE</span><strong>Observed controls</strong><p>Posture reporting describes observed configuration and signals; it is not a penetration test or certification.</p></article>
                <article className={styles.principle}><span className={styles.micro}>AUTHORITY</span><strong>Operator-owned</strong><p>Release and administrative authority remains with the operator and the explicitly configured policy boundary.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.callout}>
              <div><span className={styles.overline}>Pilot fit</span><h2>Start with one release path.</h2></div>
              <div><p>Describe the current release workflow, the evidence reviewers need, and the deployment boundary. A reply will confirm whether a Pro pilot or a services engagement is the better lane.</p><div className={styles.actions}><a className={styles.primary} href="mailto:J.stevenson.cs@gmail.com?subject=RecursiveIntell%20Pro%20pilot" data-event="pro_interest" data-event-context="pro_bottom">Request pilot fit <span>↗</span></a><Link className={styles.secondary} href="/services" data-event="services_opened" data-event-context="pro_bottom">Compare services <span>→</span></Link></div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
