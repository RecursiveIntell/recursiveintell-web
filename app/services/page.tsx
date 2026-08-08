import type { Metadata } from "next";
import Link from "next/link";
import { BusinessFooter, BusinessHeader, BusinessPageIntro } from "../components/business/BusinessChrome";
import { contact } from "../config/site";
import { consultingAreas, serviceOffers } from "../data/services";

export const metadata: Metadata = {
  title: "AI Systems Services + Consulting",
  description: "Bounded AI workflow mapping, custom agent pilots, business knowledge systems, Hermes integration, architecture consulting, and ongoing care.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro
        index="01"
        eyebrow="SERVICES + CONSULTING"
        title="Choose the smallest"
        accent="useful intervention."
        body="Start with a fixed, inspectable scope. Every offer names the required inputs, retained artifact, explicit boundary, acceptance test, and next decision before implementation expands."
      />

      <section className="business-section">
        <div className="business-shell service-offer-list">
          {serviceOffers.map((offer) => (
            <article key={offer.number} className="service-offer">
              <div className="service-offer-title"><span>{offer.number}</span><small>{offer.kind}</small><h2>{offer.name}</h2></div>
              <dl>
                <div><dt>Best fit</dt><dd>{offer.bestFit}</dd></div>
                <div><dt>Inputs</dt><dd>{offer.inputs}</dd></div>
                <div><dt>Deliverable</dt><dd>{offer.deliverable}</dd></div>
                <div><dt>Explicit boundary</dt><dd>{offer.boundary}</dd></div>
                <div><dt>Acceptance test</dt><dd>{offer.acceptance}</dd></div>
              </dl>
              <a href={`mailto:${contact.email}?subject=${encodeURIComponent(offer.subject)}&body=${encodeURIComponent("The system or workflow:\nWho uses it:\nCurrent constraint:\nEvidence needed at the end:\n")}`}>Ask about this offer <span>→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="business-section consulting-section">
        <div className="business-shell">
          <div className="business-section-heading">
            <div><p className="business-index">FOCUSED TECHNICAL CONSULTING</p><h2>Use the depth<br /><em>without buying a platform.</em></h2></div>
            <p>Consulting can end in a decision, architecture, audit, implementation plan, proof harness, or bounded source change. The useful output is an artifact your team can evaluate and retain.</p>
          </div>
          <div className="consulting-grid">
            {consultingAreas.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="business-section engagement-boundaries">
        <div className="business-shell business-boundary-grid">
          <div><p className="business-index">ENGAGEMENT CONTRACT</p><h2>Clear before<br /><em>the first build.</em></h2></div>
          <div>
            <p><strong>Pricing:</strong> Fixed scope confirmed after fit review. No project begins from a vague estimate disguised as a commitment.</p>
            <p><strong>External costs:</strong> Model/API, hosting, phone, email, and other third-party service fees stay visible and are assigned in the written scope.</p>
            <p><strong>Ownership:</strong> Source, credentials, operational responsibilities, support period, and handoff artifacts are named before implementation.</p>
            <p><strong>Claims:</strong> No guarantee of savings, accuracy, revenue, security, compliance, or universal automation fitness.</p>
          </div>
        </div>
      </section>

      <section className="business-closing">
        <div className="business-shell business-closing-grid">
          <div><p className="business-index">FIT REVIEW</p><h2>Send the system,<br />constraint, and<br /><em>desired evidence.</em></h2></div>
          <div><p>You do not need a polished brief. Four concrete lines are enough to decide whether a useful engagement exists.</p><div className="business-actions"><a className="business-button business-button-primary" href={contact.introHref}>Describe the work <span>→</span></a><Link className="business-button business-button-light" href="/work">Inspect public work</Link></div></div>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}

