import { pageMetadata } from "./lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioHeader, StudioFooter } from "./components/StudioChrome";
import {
  SelectedProjects,
  StudioCTA,
  SystemGraphic,
} from "./components/Studio";
import { contact, site } from "./config/site";
import { credibilitySignal } from "./data/business";

export const metadata: Metadata = pageMetadata("/", {
  title: { absolute: "RecursiveIntell | Independent AI Systems Engineering" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI systems. Built to be understood.",
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RecursiveIntell independent AI systems engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecursiveIntell | AI Systems Engineering",
    description: site.description,
    images: ["/opengraph-image"],
  },
});
const identity = {
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
      jobTitle: contact.role,
      url: site.url + "/josh",
      email: contact.email,
      sameAs: [
        "https://github.com/RecursiveIntell",
        "https://x.com/RecursiveIntell",
      ],
    },
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      founder: { "@type": "Person", name: contact.name },
      description:
        "Founder-led applied R&D studio and public engineering portfolio.",
    },
  ],
};

export default function Home() {
  return (
    <main className="studio-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(identity) }}
      />
      <StudioHeader />
      <section className="studio-hero studio-shell">
        <div className="studio-hero-copy">
          <p className="studio-eyebrow">
            <span className="studio-dot" /> JOSH STEVENSON / INDEPENDENT
            ENGINEER
          </p>
          <h1>
            AI systems.
            <br />
            Built to be
            <br />
            <em>understood.</em>
          </h1>
          <p className="studio-lede">
            Agents that act. Memory that persists. Infrastructure you can
            inspect. I build the systems underneath useful AI.
          </p>
          <div className="studio-actions">
            <Link className="studio-button primary" href="/work">
              Explore the work <span>↗</span>
            </Link>
            <Link className="studio-text-link" href="/josh">
              Meet the engineer <span>→</span>
            </Link>
          </div>
        </div>
        <SystemGraphic />
        <div className="studio-hero-bottom">
          <span>RUST / PYTHON / TYPESCRIPT</span>
          <span>ALBERTVILLE, AL · REMOTE U.S.</span>
          <a href="#selected-work">SCROLL TO EXPLORE ↓</a>
        </div>
      </section>
      <section className="studio-intent">
        <div className="studio-shell">
          <p>
            I work where{" "}
            <strong>
              agent behavior, persistent memory, and real software
            </strong>{" "}
            meet.
          </p>
          <span>
            Independent applied R&D.
            <br />
            Public source. Explicit scope.
          </span>
        </div>
      </section>
      <section className="studio-section studio-shell" id="selected-work">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">01 / SELECTED ENGINEERING</p>
            <h2>
              Ideas, carried
              <br />
              <em>into code.</em>
            </h2>
          </div>
          <p>
            A focused path through the work. Start with a concrete runtime
            change, then explore the memory and infrastructure behind it.
          </p>
        </div>
        <SelectedProjects />
        <div className="studio-section-tail">
          <Link className="studio-text-link" href="/work">
            All selected work <span>↗</span>
          </Link>
          <Link className="studio-text-link" href="/portfolio">
            Explore the repository library <span>↗</span>
          </Link>
        </div>
      </section>
      <section className="studio-feature">
        <div className="studio-shell studio-feature-grid">
          <div>
            <p className="studio-eyebrow">02 / THE MEMORY SYSTEM</p>
            <h2>
              Meet
              <br />
              <em>Mnemes.</em>
            </h2>
            <p>
              A personal, self-hosted agent memory server. Keep durable context,
              source history, and device ownership close to the system that uses
              them.
            </p>
            <Link className="studio-button light" href="/mnemes">
              Explore Mnemes <span>↗</span>
            </Link>
            <p className="studio-fine">
              Public software and research. Hardware deployment and production
              fitness have their own evidence requirements.
            </p>
          </div>
          <div
            className="memory-art"
            aria-label="Mnemes concepts: capture, retain, retrieve"
          >
            <div>
              <span>01 / CAPTURE</span>
              <strong>A conversation.</strong>
              <small>Keep the source.</small>
            </div>
            <div>
              <span>02 / RETAIN</span>
              <strong>A memory.</strong>
              <small>Preserve the history.</small>
            </div>
            <div>
              <span>03 / RETRIEVE</span>
              <strong>Useful context.</strong>
              <small>Return to the evidence.</small>
            </div>
          </div>
        </div>
      </section>
      <section className="studio-section studio-shell">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">03 / HOW I WORK</p>
            <h2>
              Make the difficult
              <br />
              <em>parts visible.</em>
            </h2>
          </div>
          <p>
            The work is more useful when another engineer can understand the
            decision, reproduce the result, and see what still needs testing.
          </p>
        </div>
        <div className="studio-principles">
          {[
            [
              "01",
              "Start with the failure.",
              "Trace the actual behavior before adding another layer. Name the owner of state, decisions, and effects.",
            ],
            [
              "02",
              "Build a focused change.",
              "Keep the useful boundary small enough to explain, test, review, and hand off.",
            ],
            [
              "03",
              "Show what happened.",
              "Link the source and the result. Keep test evidence, deployment evidence, and open questions distinct.",
            ],
          ].map(([n, t, p]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-recognition studio-shell">
        <span className="studio-eyebrow">IN THE OPEN</span>
        <div>
          <p>
            Teknium, creator of Hermes Agent, highlighted my
            RecursiveIntell-enhanced Hermes demonstration.
          </p>
          <a
            className="studio-text-link"
            href={credibilitySignal.href}
            target="_blank"
            rel="noreferrer"
          >
            View the original interaction ↗
          </a>
          <small>{credibilitySignal.boundary}</small>
        </div>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
