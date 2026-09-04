import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, StudioCTA } from "../components/Studio";
import { serviceOffers, consultingAreas } from "../data/services";
import { contact } from "../config/site";
export const metadata: Metadata = pageMetadata("/services", {
  title: "Services & Consulting",
  description:
    "Focused AI systems consulting, workflow mapping, agent pilots, and source-aware knowledge systems by Josh Stevenson.",
  alternates: { canonical: "/services" },
});
export default function Services() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro
        label="CONSULTING / DESIGN / IMPLEMENTATION"
        title="A focused scope."
        accent="A useful result."
        body="Bring the system or workflow that needs to work better. We’ll identify the right intervention, define the outcome, and build toward something your team can inspect and retain."
      />
      <section className="studio-shell studio-services">
        <div className="studio-work-index">
          <span>FOUR WAYS TO START</span>
          <span>Fixed scope confirmed after fit review</span>
        </div>
        <div className="studio-offer-grid">
          {serviceOffers.map((offer) => (
            <article key={offer.number}>
              <span className="studio-eyebrow">
                {offer.number} / {offer.kind}
              </span>
              <h2>{offer.name}</h2>
              <p>{offer.bestFit}</p>
              <div className="studio-deliverable">
                <strong>WHAT YOU TAKE AWAY</strong>
                <p>{offer.deliverable}</p>
              </div>
              <details>
                <summary>
                  Scope, inputs & acceptance <span>+</span>
                </summary>
                <dl>
                  <div>
                    <dt>Inputs</dt>
                    <dd>{offer.inputs}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{offer.boundary}</dd>
                  </div>
                  <div>
                    <dt>Acceptance</dt>
                    <dd>{offer.acceptance}</dd>
                  </div>
                </dl>
              </details>
              <a
                className="studio-text-link"
                href={`mailto:${contact.email}?subject=${encodeURIComponent(offer.subject)}&body=${encodeURIComponent("The system or workflow:\nWho uses it:\nCurrent constraint:\nWhat a useful result looks like:\n")}`}
              >
                Discuss this engagement ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-shell">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">WHERE I CAN HELP</p>
            <h2>
              Depth where
              <br />
              <em>it matters.</em>
            </h2>
          </div>
          <p>
            Architecture and implementation can be separate engagements. Start
            with the decision that would change what you build next.
          </p>
        </div>
        <div className="studio-consulting-list">
          {consultingAreas.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-note studio-shell">
        <p className="studio-eyebrow">BEFORE WORK STARTS</p>
        <h2>Clear scope. Clear ownership.</h2>
        <p>
          The written scope names deliverables, acceptance checks, source
          ownership, credentials, support responsibilities, and external service
          costs. Estimates become commitments only after the scope is agreed.
          Consulting is not a certification or a guarantee of business outcomes.
        </p>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
