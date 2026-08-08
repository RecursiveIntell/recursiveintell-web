import type { Metadata } from "next";
import Link from "next/link";
import { BusinessFooter, BusinessHeader } from "./components/business/BusinessChrome";
import { CircuitTrace } from "./components/business/CircuitTrace";
import { WorkflowSelector } from "./components/business/WorkflowSelector";
import { contact, site } from "./config/site";
import { credibilitySignal, processSteps, serviceCategories } from "./data/business";
import { consultingAreas } from "./data/services";
import { workCases } from "./data/work";

export const metadata: Metadata = {
  title: { absolute: "RecursiveIntell | AI Systems Built Around Your Business" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI systems built around your business.",
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    images: [{ url: "/josh-social.png", width: 1200, height: 630, alt: "RecursiveIntell AI systems by Josh Stevenson" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI systems built around your business.",
    description: site.description,
    images: ["/josh-social.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
    },
    {
      "@type": "Person",
      name: contact.name,
      jobTitle: "Founder / AI Systems Engineer",
      url: `${site.url}/about`,
      email: contact.email,
      sameAs: ["https://github.com/RecursiveIntell", "https://x.com/RecursiveIntell"],
    },
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      founder: { "@type": "Person", name: contact.name },
      description: "A founder-led applied R&D studio and public engineering portfolio for local-first AI and infrastructure systems.",
    },
  ],
};

export default function BusinessHome() {
  return (
    <main className="business-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <BusinessHeader />

      <section className="business-hero">
        <CircuitTrace />
        <div className="business-shell business-hero-grid">
          <div className="business-hero-copy">
            <p className="business-kicker"><span>01</span> CUSTOM AI SYSTEMS / RECURSIVEINTELL</p>
            <h1>AI systems built<br />around <em>your business.</em></h1>
            <p className="business-hero-lede">
              I design and build custom agents, workflow automation, business knowledge systems, and tool integrations around the work your business already does. Local-first options, human approvals, and traceable execution stay explicit.
            </p>
            <div className="business-actions">
              <a className="business-button business-button-primary" href={contact.introHref}>Describe a repeated task <span>→</span></a>
              <Link className="business-button business-button-secondary" href="/work">See working systems <span>↗</span></Link>
            </div>
            <div className="business-proof-rail">
              <span>Local-first options</span><span>Human approvals</span><span>Traceable execution</span>
            </div>
          </div>
          <aside className="business-card-mirror" aria-label="RecursiveIntell services and approach">
            <span className="business-card-mirror-rail" aria-hidden="true" />
            <span className="business-card-mirror-lines" aria-hidden="true" />
            <div className="business-card-mirror-wordmark"><b>RECURSIVE</b> <strong>INTELL</strong></div>
            <p>PUT AI TO WORK</p>
            <div className="business-card-mirror-title">WHERE IT<br />MATTERS.</div>
            <small>CONSULTING + IMPLEMENTATION</small>
            <ol>
              {serviceCategories.map((service) => <li key={service.number}><span>{service.number}</span>{service.title}</li>)}
            </ol>
            <footer>START WITH ONE REPEATED TASK</footer>
          </aside>
        </div>
      </section>

      <section className="business-section business-services-preview">
        <div className="business-shell">
          <div className="business-section-heading">
            <div><p className="business-index">02 / WHAT I BUILD</p><h2>Useful systems.<br /><em>Clear boundaries.</em></h2></div>
            <p>Start with a business problem, not a generic bot. Every system names its source data, tools, decision points, human owner, and failure behavior.</p>
          </div>
          <div className="business-service-grid">
            {serviceCategories.map((service) => (
              <article key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.body}</p></article>
            ))}
          </div>
          <div className="business-section-link"><Link href="/services">Explore services + consulting <span>→</span></Link></div>
        </div>
      </section>

      <section className="business-section business-consulting-home">
        <div className="business-shell business-consulting-layout">
          <div className="business-consulting-lead">
            <p className="business-index">03 / FOCUSED CONSULTING</p>
            <h2>Judgment first.<br /><em>Then the build.</em></h2>
            <p>Not every useful engagement needs a new product. I can map the workflow, review an agent architecture, pressure-test a local-first design, or define the evidence gate your team needs before committing to implementation.</p>
            <Link className="business-button business-button-primary" href="/services">See consulting engagements <span>→</span></Link>
          </div>
          <div className="business-consulting-list">
            {consultingAreas.map(([title, body], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="business-section business-workflow-section">
        <div className="business-shell">
          <div className="business-section-heading">
            <div><p className="business-index">04 / SEE THE SHAPE</p><h2>From input to action.<br /><em>Nothing hidden.</em></h2></div>
            <p>Choose a common workflow to see where evidence, approval, action, and failure should remain visible.</p>
          </div>
          <WorkflowSelector />
        </div>
      </section>

      <section className="business-section business-process-section">
        <div className="business-shell">
          <div className="business-section-heading">
            <div><p className="business-index">05 / HOW WE WORK</p><h2>Map. Build.<br /><em>Verify. Operate.</em></h2></div>
            <p>Consulting and implementation use the same discipline: current evidence first, one canonical owner per concept, mapped acceptance gates, and a written remaining delta.</p>
          </div>
          <ol className="business-process-grid">
            {processSteps.map(([number, title, body]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="business-section business-boundary-section">
        <div className="business-shell business-boundary-grid">
          <div><p className="business-index">06 / CONTROL STAYS EXPLICIT</p><h2>Local when useful.<br />Connected when required.<br /><em>Never blurred.</em></h2></div>
          <div>
            <p>Local-first options can keep durable knowledge and sensitive workflows close to the business. Optional hosted models, APIs, email, phone, and business software remain external services when a design uses them.</p>
            <p>Human approvals can sit before consequential actions. Execution records can show what ran and what the system observed. Neither feature guarantees correctness, authorization, security, or business success.</p>
          </div>
        </div>
      </section>

      <section className="business-section business-proof-section">
        <div className="business-shell">
          <div className="business-section-heading">
            <div><p className="business-index">07 / PUBLIC ENGINEERING PROOF</p><h2>Inspect the work<br /><em>behind the offer.</em></h2></div>
            <p>Selected public systems demonstrate implementation scope across agent memory, orchestration, evidence, compression, and local-first infrastructure.</p>
          </div>
          <div className="business-case-preview">
            {workCases.slice(0, 3).map((item) => (
              <article key={item.number}><span>CASE / {item.number}</span><h3>{item.title}</h3><p>{item.built}</p><a href={item.source} target="_blank" rel="noreferrer">{item.sourceLabel} <span>↗</span></a></article>
            ))}
          </div>
          <div className="business-recognition">
            <div className="business-recognition-mark" aria-hidden="true"><span>H</span><i>↗</i></div>
            <div><small>{credibilitySignal.date} · HERMES COMMUNITY</small><h3>Teknium highlighted<br />Josh’s Hermes work.</h3></div>
            <div><p>{credibilitySignal.body}</p><p className="business-boundary-note">{credibilitySignal.boundary}</p><a href={credibilitySignal.href} target="_blank" rel="noreferrer">See the public interaction <span>↗</span></a></div>
          </div>
        </div>
      </section>

      <section className="business-section business-founder-section">
        <div className="business-shell business-founder-grid">
          <div><p className="business-index">08 / FOUNDER + ENGINEER</p><h2>One accountable<br /><em>technical owner.</em></h2></div>
          <div>
            <p>Josh Stevenson is a systems engineer and founder/operator of RecursiveIntell. He builds local-first AI, agent infrastructure, memory systems, Rust libraries, and operator-grade workflows in public.</p>
            <p>RecursiveIntell is a founder-led applied R&amp;D studio and public engineering portfolio. Public source shows breadth and implementation effort; it does not imply a team, customers, funding, compliance, or production suitability.</p>
            <Link href="/about">About Josh + RecursiveIntell <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="business-closing">
        <CircuitTrace tone="dark" />
        <div className="business-shell business-closing-grid">
          <div><p className="business-index">YOUR FIRST MOVE</p><h2>Tell me what your<br />business keeps<br /><em>doing by hand.</em></h2></div>
          <div>
            <p>A sentence is enough to start. I’ll help determine whether the right next move is a workflow map, a pilot, a knowledge build, or focused technical consulting.</p>
            <div className="business-actions">
              <a className="business-button business-button-primary" href={contact.introHref}>Start the conversation <span>→</span></a>
              <a className="business-button business-button-light" href={contact.phoneHref}>Call {contact.phoneDisplay}</a>
            </div>
            <div className="business-direct-contact"><a href={contact.textHref}>Text Josh</a><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </main>
  );
}
