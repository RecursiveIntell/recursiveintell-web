import { pageMetadata } from "./lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioHeader, StudioFooter } from "./components/StudioChrome";
import {
  SelectedProjects,
  StudioCTA,
  ApertureArtwork,
} from "./components/Studio";
import { contact, site } from "./config/site";
import { Achievements } from "./components/Achievements";
import { nvidiaContribution } from "./data/achievements";
import { serviceOffers } from "./data/services";

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
    <main className="studio-page studio-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(identity) }}
      />
      <StudioHeader />
      <div className="studio-hero-stage">
        <section className="studio-hero studio-shell">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">
              <span className="studio-dot" /> JOSH STEVENSON / AI SYSTEMS
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
              I build agent runtimes, durable memory, and local AI
              infrastructure. Open source. Clear boundaries. Evidence you can
              inspect.
            </p>
            <div className="studio-actions">
              <Link className="studio-button primary" href="/work">
                Explore the work <span>↗</span>
              </Link>
              <Link className="studio-text-link" href="/contact">
                Work with me <span>→</span>
              </Link>
            </div>
            <a
              className="studio-contributor"
              href={nvidiaContribution.pullRequest}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">↗</span> NVIDIA PAIR contributor{" "}
              <span className="contributor-detail">
                Merged upstream · September 2026
              </span>
            </a>
          </div>
          <ApertureArtwork />
          <div className="studio-hero-bottom">
            <span>RUST / PYTHON / TYPESCRIPT</span>
            <span>ALBERTVILLE, AL · REMOTE U.S.</span>
            <a href="#selected-work">SCROLL TO EXPLORE ↓</a>
          </div>
        </section>
      </div>
      <Achievements />
      <section className="studio-section studio-shell" id="selected-work">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">01 / SELECTED ENGINEERING</p>
            <h2>
              The systems
              <br />
              <em>behind the work.</em>
            </h2>
          </div>
          <p>
            Three connected areas of work: agent execution, persistent memory,
            and evidence. Every project links to source and names its current
            scope.
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
            <p className="studio-eyebrow">03 / WORK WITH ME</p>
            <h2>
              A practical start.
              <br />
              <em>A clear result.</em>
            </h2>
          </div>
          <p>
            Bring a repeated workflow, a knowledge problem, or an agent system
            that needs a more reliable foundation. We’ll define a focused
            engagement.
          </p>
        </div>
        <div className="studio-services-preview">
          {serviceOffers.map((offer) => (
            <Link key={offer.number} href={`/services#offer-${offer.number}`}>
              <span className="studio-eyebrow">
                {offer.number} / {offer.kind}
              </span>
              <h3>
                {offer.name}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>{offer.bestFit}</p>
            </Link>
          ))}
        </div>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
