import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BusinessFooter,
  BusinessHeader,
  BusinessPageIntro,
} from "../components/business/BusinessChrome";

export const metadata: Metadata = pageMetadata("/pro", {
  title: "RecursiveIntell Pro Status",
  description:
    "Transparent status for the proposed RecursiveIntell Pro commercial overlay.",
  alternates: { canonical: "/pro" },
});

export default function ProPage() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro
        index="05"
        eyebrow="PRO / STATUS"
        title="A commercial overlay."
        accent="Not a live product claim."
        body="Current public source does not establish an active, generally available RecursiveIntell Pro product. This route preserves the idea without advertising unsupported availability."
      />
      <section className="business-section">
        <div className="business-shell pro-status-grid">
          <article>
            <span>STATUS</span>
            <h2>Proposed</h2>
            <p>
              Potential commercial surfaces include managed release gates, proof
              packets, workflow verification, administration, and ongoing
              operational support.
            </p>
          </article>
          <article>
            <span>AVAILABLE NOW</span>
            <h2>Bounded services</h2>
            <p>
              Technical consulting, workflow mapping, custom agent pilots,
              business knowledge systems, integration, and scoped ongoing care
              can be discussed now.
            </p>
            <Link href="/services">
              Review services + consulting <span>→</span>
            </Link>
          </article>
          <article>
            <span>RELEASE GATE</span>
            <h2>Evidence before availability</h2>
            <p>
              A live offer would need exact scope, pricing, support boundaries,
              privacy terms, deployment truth, acceptance tests, and operating
              ownership.
            </p>
          </article>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}
