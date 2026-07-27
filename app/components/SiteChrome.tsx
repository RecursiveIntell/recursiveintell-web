"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { coreLinks } from "../content";

const navigation = [
  ["/product", "Product"],
  ["/node", "Node R1"],
  ["/proof", "Proof"],
  ["/platform", "Platform"],
  ["/install", "Install"],
  ["/portfolio", "Portfolio"],
  ["/doctrine", "Doctrine"],
  ["/about", "Person"],
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label="Mnemes home">
          <span className="wordmark-mark"><i />Μ</span>
          <span>MNEMES<small>MEMORY, WITH A WITNESS</small></span>
        </Link>
        <button
          className="menu-button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <i /><i />
        </button>
        <nav className={open ? "open" : ""} aria-label="Primary navigation">
          {navigation.map(([href, label]) => (
            <Link
              key={href}
              className={pathname === href ? "active" : ""}
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a className="nav-github" href={coreLinks.mnemesGithub} target="_blank" rel="noreferrer">
            Source <span>↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="wordmark" href="/">
            <span className="wordmark-mark"><i />Μ</span>
            <span>MNEMES<small>MEMORY, WITH A WITNESS</small></span>
          </Link>
          <p>
            A personal, self-hosted agent memory server. Run Mnemes on your hardware or choose the optional ready-to-go Node R1.
          </p>
        </div>
        <div>
          <small>EXPLORE</small>
          <Link href="/product">Mnemes product</Link>
          <Link href="/node">Mnemes Node R1</Link>
          <Link href="/proof">Proof model</Link>
          <Link href="/platform">Three-crate stack</Link>
          <Link href="/install">Install cockpit</Link>
          <Link href="/portfolio">Complete portfolio</Link>
        </div>
        <div>
          <small>SOURCE</small>
          <a href={coreLinks.mnemesGithub} target="_blank" rel="noreferrer">Mnemes on GitHub ↗</a>
          <a href={coreLinks.mnemesCrate} target="_blank" rel="noreferrer">Mnemes on crates.io ↗</a>
          <a href={coreLinks.mnemesDocs} target="_blank" rel="noreferrer">Mnemes docs.rs ↗</a>
          <a href={coreLinks.recursiveIntell} target="_blank" rel="noreferrer">RecursiveIntell ↗</a>
        </div>
        <div>
          <small>CONNECT</small>
          <Link href="/about">About Josh</Link>
          <a href={coreLinks.email}>J.stevenson.cs@gmail.com ↗</a>
          <a href={coreLinks.recursiveGithub} target="_blank" rel="noreferrer">GitHub portfolio ↗</a>
          <a href={coreLinks.recursiveCrates} target="_blank" rel="noreferrer">crates.io portfolio ↗</a>
        </div>
      </div>
      <div className="shell footer-floor">
        <span>© 2026 RECURSIVEINTELL</span>
        <span>SOURCE-HARDENED · NOT RELEASE-CERTIFIED</span>
        <span>RECEIPTS ≠ FACTUAL TRUTH</span>
      </div>
    </footer>
  );
}

export function PageIntro({
  index,
  eyebrow,
  title,
  accent,
  body,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="page-intro-orbit"><i /><i /><i /></div>
      <div className="shell page-intro-grid">
        <div>
          <p className="eyebrow"><span>{index}</span>{eyebrow}</p>
          <h1>{title}<br /><em>{accent}</em></h1>
        </div>
        <div className="page-intro-copy">
          <p>{body}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

export function StatusBadge({ children, tone = "released" }: { children: React.ReactNode; tone?: "released" | "development" | "observed" | "proposed" }) {
  return <span className={`status-badge status-${tone}`}><i />{children}</span>;
}
