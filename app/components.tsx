import Link from "next/link";

const routes = [
  ["Overview", "/", "overview"],
  ["Activity", "/activity", "activity"],
  ["Libraries", "/libraries", "libraries"],
  ["Install", "/install", "install"],
  ["Concepts", "/concepts", "concepts"],
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
        <a className="header-source" href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">GitHub ↗</a>
        <Link className="header-cta" href="/install">Install memory →</Link>
        <details className="mobile-nav"><summary>Menu</summary><nav>{routes.map(([label, href, key]) => <Link key={key} href={href} aria-current={current === key ? "page" : undefined}>{label}</Link>)}<a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">GitHub ↗</a></nav></details>
      </div>
    </header></>
  );
}

export function Footer() {
  return (
    <footer className="site-footer"><div className="wrap footer-grid"><div><strong>RecursiveIntell</strong><p>Local-first memory and trust infrastructure for AI agents.</p></div><div><strong>Navigate</strong><p><Link href="/libraries">Library Atlas</Link><br /><Link href="/activity">Engineering activity</Link><br /><Link href="/install">Install agent memory</Link></p></div><div className="footer-mark"><span>Receipts record evidence—not total correctness.</span><Mark /></div></div></footer>
  );
}

export function SectionHead({ index, title, body }: { index: string; title: string; body: string }) {
  return <div className="section-head"><div><span className="kicker">{index}</span><h2>{title}</h2></div><p>{body}</p></div>;
}
