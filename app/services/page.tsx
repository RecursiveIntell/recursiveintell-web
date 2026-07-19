import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { ObservatoryHero, SectionHeader } from "../proof/Observatory";
import styles from "../proof/observatory.module.css";

const ogImage = "/api/og?title=Bounded%20work.%20Inspectable%20outcomes.&kicker=SERVICES%20%2F%20FOCUSED%20ENGINEERING&detail=Memory%20integration%20%C2%B7%20architecture%20review&accent=amber";

export const metadata: Metadata = {
  title: "Agent Memory & Local-First Architecture Services — RecursiveIntell",
  description: "Three bounded engineering offers: agent-memory integration, local-first architecture review, and agent reliability audit.",
  alternates: { canonical: "/services" },
  openGraph: { title: "RecursiveIntell Engineering Services", description: "Bounded integration, architecture review, and agent reliability audit work for inspectable, local-first agent systems.", url: "/services", type: "website", images: [{ url: ogImage, width: 1200, height: 630, alt: "RecursiveIntell engineering services" }] },
  twitter: { card: "summary_large_image", title: "RecursiveIntell Services", description: "Agent-memory integration, architecture review, and agent reliability audit.", images: [ogImage] },
};

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <Header current="services" />
      <main id="main">
        <ObservatoryHero
          eyebrow="Services / focused engineering"
          title="Bounded work. Inspectable"
          accent="outcomes."
          lede="Three focused engagements for teams that need durable agent memory, clearer local-first system boundaries, or replayable evidence for a difficult agent workflow. Scope, artifacts, and exclusions are visible before the conversation begins."
          actions={<><a className={styles.primary} href="mailto:J.stevenson.cs@gmail.com?subject=RecursiveIntell%20service%20inquiry&body=Offer%3A%20%0ASystem%20or%20repository%3A%20%0AConstraint%3A%20%0ADesired%20evidence%3A%20" data-event="contact_started" data-event-label="services_general">Describe the problem <span>↗</span></a><Link className={styles.secondary} href="/work" data-event="work_opened" data-event-context="services_hero">Inspect the work <span>→</span></Link></>}
          panelLabel="Engagement / three offers"
          panelState="Fit confirmed by reply"
          panelTitle={<>Start with the <span className={styles.accent}>boundary.</span></>}
          panelCopy={<p>Send the system, the constraint, and the evidence you need at the end. Availability, timeline, exact scope, and price are confirmed only after fit is established.</p>}
          panelFoot="No public price until scope is known"
        />

        <section className={styles.section}>
          <div className={styles.wrap}>
            <SectionHeader label="01 / Productized offers" title={<>Choose the smallest useful <span className={styles.accent}>intervention.</span></>} copy="All three offers end in artifacts your team can inspect and retain. None hides discovery, implementation, and assurance inside an ambiguous consulting package." />
            <div className={styles.offerGrid}>
              <article className={styles.offer}>
                <span className={styles.cardLabel}>Offer A / hands-on integration</span>
                <h3>Agent Memory Integration Sprint</h3>
                <p>Connect one supported coding-agent host to a local memory path, ingest one agreed repository, exercise diagnostics, and demonstrate one witnessed recall path.</p>
                <div className={styles.offerScope}>
                  <div><h4>Included</h4><ul><li>One host and one repository</li><li>Install and configuration path</li><li>Ingest, doctor, and recall walkthrough</li><li>Configuration handoff and proof packet</li></ul></div>
                  <div><h4>Boundary</h4><ul><li>No managed cloud service</li><li>No claim of exhaustive repository understanding</li><li>No security or compliance attestation</li><li>No unlimited custom integration surface</li></ul></div>
                </div>
                <a className={styles.textLink} href="mailto:J.stevenson.cs@gmail.com?subject=Agent%20Memory%20Integration%20Sprint&body=Host%3A%20%0ARepository%20type%3A%20%0AOperating%20system%3A%20%0AWhat%20should%20the%20agent%20remember%3F%20" data-event="contact_started" data-event-label="memory_integration">Ask about this sprint <span>↗</span></a>
              </article>
              <article className={styles.offer}>
                <span className={styles.cardLabel}>Offer B / architecture review</span>
                <h3>Local-First Agent Architecture Review</h3>
                <p>Map the ownership and failure boundaries across memory, MCP tools, model providers, policy, receipts, and recovery—then turn the findings into an actionable design note.</p>
                <div className={styles.offerScope}>
                  <div><h4>Included</h4><ul><li>Current-state architecture map</li><li>Canonical-owner and trust-boundary review</li><li>Failure and degradation register</li><li>Prioritized design recommendations</li></ul></div>
                  <div><h4>Boundary</h4><ul><li>Review, not implementation</li><li>Not a penetration test</li><li>Not legal or compliance advice</li><li>No guarantee of model correctness</li></ul></div>
                </div>
                <a className={styles.textLink} href="mailto:J.stevenson.cs@gmail.com?subject=Local-First%20Agent%20Architecture%20Review&body=System%20surface%3A%20%0ACurrent%20architecture%3A%20%0AMost%20important%20constraint%3A%20%0ADesired%20decision%3A%20" data-event="contact_started" data-event-label="architecture_review">Ask about this review <span>↗</span></a>
              </article>
              <article className={styles.offer}>
                <span className={styles.cardLabel}>Offer C / reliability audit</span>
                <h3>Agent Reliability Audit</h3>
                <p>Inspect one difficult agent workflow and turn the observed failure surface into replayable cases, explicit evidence boundaries, and a prioritized hardening plan.</p>
                <div className={styles.offerScope}>
                  <div><h4>Included</h4><ul><li>Workflow and authority map</li><li>Representative failure corpus</li><li>Evidence and replay contract</li><li>Acceptance tests and hardening backlog</li></ul></div>
                  <div><h4>Boundary</h4><ul><li>One agreed workflow and scope</li><li>Review, not a certification</li><li>Not a penetration test or legal review</li><li>No guarantee of universal agent correctness</li></ul></div>
                </div>
                <a className={styles.textLink} href="mailto:J.stevenson.cs@gmail.com?subject=Agent%20Reliability%20Audit&body=Agent%20workflow%3A%20%0AObserved%20failure%20or%20risk%3A%20%0ASystem%20boundary%3A%20%0ADesired%20evidence%3A%20" data-event="contact_started" data-event-label="agent_reliability_audit">Ask about this audit <span>↗</span></a>
              </article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`}>
          <div className={styles.wrap}>
            <SectionHeader label="02 / Three distinct lanes" title="Adopt, engage, or explore Pro." copy="Open-source adoption, engineering services, and the commercial Pro overlay solve different problems. They should never be blurred into one vague call to action." />
            <div className={styles.laneGrid}>
              <article className={styles.lane}><span className={styles.cardLabel}>Open source</span><strong>Install free</strong><p>Use the public memory stack and installation guidance directly. No sales conversation is required.</p><Link className={styles.textLink} href="/install" data-event="install_opened" data-event-context="services_lane">Choose an install path <span>→</span></Link></article>
              <article className={styles.lane}><span className={styles.cardLabel}>Engineering service</span><strong>Apply it with Josh</strong><p>Use one of the three bounded engagements above when integration, architecture judgment, or agent reliability is the constraint.</p><a className={styles.textLink} href="mailto:J.stevenson.cs@gmail.com?subject=RecursiveIntell%20services" data-event="contact_started" data-event-label="services_lane">Open a conversation <span>↗</span></a></article>
              <article className={styles.lane}><span className={styles.cardLabel}>Commercial overlay</span><strong>Explore Pro</strong><p>For Release Gate, Verify Patch, proof packets, Forge administration, and Agent Guard posture workflows.</p><Link className={styles.textLink} href="/pro" data-event="pro_opened" data-event-context="services_lane">Review Pro scope <span>→</span></Link></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionPaper}`}>
          <div className={styles.wrap}>
            <div className={styles.principles}>
              <div className={styles.principleIntro}><span className={styles.overline}>03 / Fit protocol</span><h2>A useful first message.</h2><p>No deck or polished brief is required. Four concrete inputs are enough to decide whether a conversation is warranted.</p></div>
              <div className={styles.principleList}>
                <article className={styles.principle}><span className={styles.micro}>01</span><strong>System</strong><p>The agent host, repository type, deployment boundary, and relevant languages.</p></article>
                <article className={styles.principle}><span className={styles.micro}>02</span><strong>Constraint</strong><p>What prevents progress today: continuity, retrieval, authority, recovery, or evidence.</p></article>
                <article className={styles.principle}><span className={styles.micro}>03</span><strong>Desired evidence</strong><p>What must be observable or retained when the engagement is complete.</p></article>
                <article className={styles.principle}><span className={styles.micro}>04</span><strong>Boundaries</strong><p>Data residency, network, security, timeline, or integration constraints that cannot move.</p></article>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
