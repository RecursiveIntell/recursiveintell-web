"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="system-state" id="main">
      <div className="grid-bg" aria-hidden="true" />
      <section>
        <span className="eyebrow">Typed failure / recoverable</span>
        <h1>This route returned an interruption.</h1>
        <p>The interface did not convert the error into a successful-looking state. Retry the render or return to a known boundary.</p>
        <div className="actions"><button className="button primary" type="button" onClick={reset}>Retry route <span>↻</span></button><Link className="button secondary" href="/">Return to overview <span>→</span></Link></div>
      </section>
    </main>
  );
}
