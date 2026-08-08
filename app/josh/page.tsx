import type { Metadata } from "next";
import Link from "next/link";
import { BusinessFooter, BusinessHeader } from "../components/business/BusinessChrome";
import { CircuitTrace } from "../components/business/CircuitTrace";
import { contact } from "../config/site";
import { credibilitySignal, serviceCategories } from "../data/business";

export const metadata: Metadata = {
  title: { absolute: "Josh Stevenson | RecursiveIntell" },
  description:
    "AI systems, workflow automation, business knowledge, integrations, and technical consulting built around how your business already works.",
  alternates: { canonical: "/josh" },
  openGraph: {
    title: "Josh Stevenson | RecursiveIntell",
    description: "AI systems built around your business.",
    url: "/josh",
    siteName: "RecursiveIntell",
    type: "website",
    images: [{ url: "/josh-social.png", width: 1200, height: 630, alt: "RecursiveIntell business systems by Josh Stevenson" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Stevenson | RecursiveIntell",
    description: "AI systems built around your business.",
    images: ["/josh-social.png"],
  },
};

export default function JoshPage() {
  return (
    <main className="business-page card-page">
      <BusinessHeader />

      <section className="card-hero">
        <CircuitTrace />
        <div className="business-shell card-hero-grid">
          <div>
            <p className="business-kicker"><span>JOSH STEVENSON</span> FOUNDER / AI SYSTEMS ENGINEER</p>
            <h1>AI systems built<br />around <em>your business.</em></h1>
            <p>I build practical agents, automation, knowledge systems, integrations, and provide focused technical consulting around the work your business already does.</p>
            <div className="business-actions">
              <a className="business-button business-button-primary" href={contact.introHref}>Describe a repeated task <span>→</span></a>
              <a className="business-button business-button-secondary" href={contact.phoneHref}>Call Josh</a>
            </div>
            <div className="business-proof-rail"><span>Local-first options</span><span>Human approvals</span><span>Traceable execution</span></div>
          </div>
          <aside className="card-contact-card">
            <span className="card-contact-rail" aria-hidden="true" />
            <small>DIRECT CONTACT</small>
            <strong>{contact.name}</strong>
            <span>{contact.role}</span>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </aside>
        </div>
      </section>

      <section className="business-section">
        <div className="business-shell">
          <div className="business-section-heading compact">
            <div><p className="business-index">WHAT I CAN BUILD</p><h2>Start with one<br /><em>useful change.</em></h2></div>
            <p>You do not need a perfect software stack or a large first project. The best starting point is often one repeated task with a clear owner.</p>
          </div>
          <div className="business-service-grid">
            {serviceCategories.map((service) => <article key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="business-section business-card-first-project">
        <div className="business-shell business-card-project-grid">
          <div><p className="business-index">A PRACTICAL FIRST PROJECT</p><h2>Bring the task that<br /><em>keeps repeating.</em></h2></div>
          <div>
            <p>Examples include missed inquiry follow-up, repeated reports, scattered operational knowledge, document intake, or data that must move carefully between tools.</p>
            <ol>
              <li><span>01</span><div><strong>Show me the current work.</strong><p>A rough description, example, or screen share is enough.</p></div></li>
              <li><span>02</span><div><strong>Choose the smallest useful boundary.</strong><p>We name what the system handles, what stays human, and what it must refuse.</p></div></li>
              <li><span>03</span><div><strong>Confirm the proof gate.</strong><p>You know the deliverable, acceptance test, dependencies, and limits before a build starts.</p></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="business-section business-card-proof">
        <div className="business-shell business-card-proof-grid">
          <div><p className="business-index">PUBLIC WORK</p><h2>Technical depth<br /><em>you can inspect.</em></h2></div>
          <div>
            <p>My public work spans local AI memory, agent graphs, claim and execution evidence, Rust infrastructure, compression research, and a customized Hermes Agent path.</p>
            <div className="business-inline-recognition"><span>HERMES / PUBLIC SIGNAL</span><strong>Teknium highlighted Josh’s RecursiveIntell-enhanced Hermes demonstration.</strong></div>
            <p>{credibilitySignal.body}</p>
            <p className="business-boundary-note">{credibilitySignal.boundary}</p>
            <div className="business-text-links"><Link href="/work">See selected work <span>→</span></Link><a href={credibilitySignal.href} target="_blank" rel="noreferrer">View Teknium’s post <span>↗</span></a><a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">Open GitHub <span>↗</span></a></div>
          </div>
        </div>
      </section>

      <section className="business-closing card-closing">
        <div className="business-shell business-closing-grid">
          <div><p className="business-index">START HERE</p><h2>Tell me what<br /><em>keeps repeating.</em></h2></div>
          <div>
            <p>I’ll help you decide whether it needs a workflow map, a small pilot, a knowledge system, or technical consulting.</p>
            <div className="business-actions"><a className="business-button business-button-primary" href={contact.introHref}>Email the task <span>→</span></a><a className="business-button business-button-light" href={contact.phoneHref}>Call {contact.phoneDisplay}</a></div>
          </div>
        </div>
      </section>

      <nav className="card-mobile-actions" aria-label="Contact Josh">
        <a href={contact.phoneHref}>Call</a><a href={contact.textHref}>Text</a><a href={`mailto:${contact.email}`}>Email</a>
      </nav>
      <BusinessFooter />
    </main>
  );
}
