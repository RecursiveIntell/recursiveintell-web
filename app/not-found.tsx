import Link from "next/link";
import { Footer, Header } from "./components";

export default function NotFound() {
  return (
    <>
      <Header current="" />
      <main id="main">
        <section className="route-hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap route-hero-grid">
            <div>
              <span className="eyebrow">404 · Route not found</span>
              <h1>This path has no <em>authoritative record.</em></h1>
              <p className="lede">Return to the system overview or inspect the complete Library Atlas.</p>
              <div className="hero-actions"><Link className="button primary" href="/">Return home →</Link><Link className="button" href="/libraries">Browse libraries →</Link></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
