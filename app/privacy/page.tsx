import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import {
  BusinessFooter,
  BusinessHeader,
  BusinessPageIntro,
} from "../components/business/BusinessChrome";

export const metadata: Metadata = pageMetadata("/privacy", {
  title: "Privacy",
  description: "Privacy boundaries for recursiveintell.com.",
  alternates: { canonical: "/privacy" },
});

export default function PrivacyPage() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro
        index="04"
        eyebrow="PRIVACY / CURRENT SITE"
        title="A small public site."
        accent="A clear boundary."
        body="This page describes the website in the current source tree. It does not make promises for third-party services, future deployments, or consulting systems with separate written scopes."
      />
      <section className="business-section">
        <div className="business-shell policy-copy">
          <article>
            <h2>What this site collects</h2>
            <p>
              The current website source does not implement an account system,
              contact database, custom tracking database, or analytics event
              collector. Standard hosting infrastructure may still process
              request metadata such as IP address, user agent, requested URL,
              timing, and error information.
            </p>
          </article>
          <article>
            <h2>Contact actions</h2>
            <p>
              Email, telephone, text, GitHub, X, crates.io, and other outbound
              links open external services. Information you send through those
              services is processed under their policies and the permissions you
              grant them.
            </p>
          </article>
          <article>
            <h2>Project inquiries</h2>
            <p>
              Do not send credentials, private datasets, regulated records, or
              confidential source material in an initial inquiry. Data handling,
              retention, access, model providers, and deletion requirements
              belong in the written scope for an actual engagement.
            </p>
          </article>
          <article>
            <h2>AI and external providers</h2>
            <p>
              “Local-first options” does not mean every optional model,
              integration, phone, email, hosting, or business-software provider
              operates offline. Each system must state its real deployment and
              data boundary.
            </p>
          </article>
          <article>
            <h2>Changes</h2>
            <p>
              This notice should change whenever the deployed site adds
              analytics, forms, accounts, storage, or another data-processing
              surface. Last source review: August 8, 2026.
            </p>
          </article>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}
