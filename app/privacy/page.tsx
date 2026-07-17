import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";

export const metadata: Metadata = {
  title: "Privacy & Measurement — RecursiveIntell",
  description: "How RecursiveIntell measures site performance and interactions without collecting form content or private engineering activity.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header current="privacy" />
      <main id="main">
        <section className="route-hero"><div className="grid-bg" aria-hidden="true" /><div className="wrap route-hero-grid"><div><span className="eyebrow">Measurement with boundaries</span><h1>Useful signals. <em>No shadow memory.</em></h1><p className="lede">The public site measures aggregate use and field performance so the installation and evidence experience can improve. It does not turn visitor behavior into an identity graph.</p></div><aside className="route-card"><small>POLICY / PUBLIC SITE</small><strong>Minimal by design.</strong><p>Analytics events use bounded labels such as route, host, and surface. Commands, search text, email content, and private repository activity are not event properties.</p></aside></div></section>
        <section className="section paper"><div className="wrap method-grid"><div><span className="kicker">01 · WHAT IS MEASURED</span><h2>Pages, performance, and deliberate actions.</h2><p>RecursiveIntell uses Vercel Web Analytics and Speed Insights to understand page visits, traffic sources, browser-level performance, and selected actions such as opening an install path or copying a command. Availability and retention are governed by the hosting account&apos;s Vercel configuration.</p></div><ul><li>No analytics cookies are added by the site implementation.</li><li>Custom event properties are allow-listed in the client code.</li><li>Typed search terms, terminal commands, and contact content are not sent as event properties.</li><li>Public GitHub and crates.io telemetry is fetched from those services and labeled by source.</li><li>The downloadable Library catalog is a dated public metadata artifact; it does not expose private implementation bodies.</li></ul></div></section>
        <section className="section"><div className="wrap"><div className="section-head"><div><span className="kicker">02 · YOUR CHOICES</span><h2>Browser controls still apply.</h2></div><p>You can use tracking-protection or content-blocking features in your browser. Core documentation, catalog pages, and install instructions remain available without analytics.</p></div><div className="route-grid three"><a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer"><small>PROCESSOR</small><h3>Vercel privacy</h3><p>Read the provider&apos;s current Web Analytics privacy information.</p><b>Open documentation ↗</b></a><Link href="/proof"><small>EVIDENCE</small><h3>Claim boundaries</h3><p>See how evidence language is scoped across the site.</p><b>Enter the Proofroom →</b></Link><a href="mailto:J.stevenson.cs@gmail.com"><small>CONTACT</small><h3>Ask a question</h3><p>Contact Josh Stevenson about this site or its measurement.</p><b>Email Josh ↗</b></a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
