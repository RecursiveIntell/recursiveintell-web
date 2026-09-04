import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro } from "../components/Studio";
import { contact } from "../config/site";
export const metadata: Metadata = pageMetadata("/contact", {
  title: "Contact Josh",
  description:
    "Discuss an engineering role, a consulting project, or a technical collaboration with Josh Stevenson.",
  alternates: { canonical: "/contact" },
});
export default function Contact() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro
        label="CONTACT / JOSH STEVENSON"
        title="What are you"
        accent="working on?"
        body="A role, a project, or a difficult engineering question. A short description is enough to start a useful conversation."
      />
      <section className="studio-shell studio-contact-grid">
        <a className="studio-contact-option" href={contact.careerHref}>
          <span>01 / HIRING</span>
          <h2>
            An engineering
            <br />
            role.
          </h2>
          <p>
            Agent infrastructure, developer tooling, Python, TypeScript, or
            Rust. Tell me about the team and the problem.
          </p>
          <strong>Discuss a role ↗</strong>
        </a>
        <a className="studio-contact-option" href={contact.introHref}>
          <span>02 / CONSULTING</span>
          <h2>
            A system
            <br />
            to improve.
          </h2>
          <p>
            Share the current workflow, its constraints, and what a useful
            outcome would look like.
          </p>
          <strong>Discuss a project ↗</strong>
        </a>
        <a
          className="studio-contact-option"
          href={`mailto:${contact.email}?subject=Technical%20collaboration`}
        >
          <span>03 / COLLABORATION</span>
          <h2>
            A question
            <br />
            worth exploring.
          </h2>
          <p>
            Research, open-source work, or a specific implementation idea. A
            source link helps.
          </p>
          <strong>Start a conversation ↗</strong>
        </a>
      </section>
      <section className="studio-shell studio-contact-direct">
        <div>
          <p className="studio-eyebrow">DIRECT CONTACT</p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <p>Albertville, Alabama · U.S. Central time</p>
          <small>
            These links open your email or phone app. Nothing is submitted
            through this website.
          </small>
        </div>
      </section>
      <StudioFooter />
    </main>
  );
}
