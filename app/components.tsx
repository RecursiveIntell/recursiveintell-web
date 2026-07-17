import Link from "next/link";

const routes = [
  ["Overview", "/", "overview"],
  ["Install", "/install", "install"],
  ["Libraries", "/libraries", "libraries"],
  ["Proof", "/proof", "proof"],
  ["Activity", "/activity", "activity"],
  ["About", "/about", "about"],
] as const;

const mobileExtras = [
  ["Stack composer", "/compose"],
  ["Services", "/services"],
  ["Pro", "/pro"],
  ["Field manual", "/concepts"],
  ["Benchmarks", "/benchmarks"],
  ["Changelog", "/changelog"],
] as const;

export function Mark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>;
}

export function Header({ current }: { current: string }) {
  return (
    <><a className="skip" href="#main">Skip to content</a><header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label="RecursiveIntell home"><Mark /><span>recursive<b>intell</b></span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {routes.map(([label, href, key]) => <Link key={key} href={href} aria-current={current === key ? "page" : undefined}>{label}</Link>)}
        </nav>
        <a className="header-source" href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer" data-event="github_repo_opened" data-event-context="header">GitHub ↗</a>
        <Link className="header-cta" href="/services" data-event="services_opened" data-event-context="header">Work with me →</Link>
        <details className="mobile-nav"><summary>Menu</summary><nav>{routes.map(([label, href, key]) => <Link key={key} href={href} aria-current={current === key ? "page" : undefined}>{label}</Link>)}{mobileExtras.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer" data-event="github_repo_opened" data-event-context="mobile_nav">GitHub ↗</a></nav></details>
      </div>
    </header></>
  );
}

export function Footer() {
  return (
    <footer className="site-footer"><div className="wrap footer-grid">
      <div><strong>RecursiveIntell</strong><p>Local-first memory and trust infrastructure for AI agents—built by Josh Stevenson.</p><a href="mailto:J.stevenson.cs@gmail.com" data-event="contact_started" data-event-context="footer">J.stevenson.cs@gmail.com ↗</a></div>
      <div><strong>Use the stack</strong><p><Link href="/install">Install agent memory</Link><br /><Link href="/libraries">Library Atlas</Link><br /><Link href="/compose">Stack Composer</Link><br /><Link href="/proof">Evidence Proofroom</Link><br /><Link href="/activity">Engineering activity</Link></p></div>
      <div><strong>Work together</strong><p><Link href="/services">Integration services</Link><br /><Link href="/pro">RecursiveIntell Pro</Link><br /><Link href="/work">Engineering work</Link><br /><Link href="/about">About Josh</Link></p></div>
      <div className="footer-mark"><span>Receipts record scoped execution evidence—not factual truth, correctness, security, authorization, or task success.</span><Mark /></div>
    </div><div className="wrap footer-base"><span>© {new Date().getUTCFullYear()} RecursiveIntell</span><nav aria-label="Secondary navigation"><Link href="/concepts">Field manual</Link><Link href="/benchmarks">Benchmarks</Link><Link href="/changelog">Changelog</Link><Link href="/privacy">Privacy</Link><a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div></footer>
  );
}

export function SectionHead({ index, title, body }: { index: string; title: string; body: string }) {
  return <div className="section-head"><div><span className="kicker">{index}</span><h2>{title}</h2></div><p>{body}</p></div>;
}
