"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { businessNavigation, contact } from "../../config/site";
import { CircuitTrace } from "./CircuitTrace";

export function BusinessHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstNavRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="business-header">
      <span className="business-brand-rail" aria-hidden="true" />
      <div className="business-shell business-header-inner">
        <Link className="business-wordmark" href="/" aria-label="RecursiveIntell home">
          <span>RECURSIVE</span><strong>INTELL</strong>
        </Link>
        <button
          ref={menuButtonRef}
          className="business-menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="business-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <i /><i />
        </button>
        <nav id="business-navigation" className={open ? "open" : ""} aria-label="Business navigation">
          {businessNavigation.map((item, index) => (
            <Link
              ref={index === 0 ? firstNavRef : undefined}
              key={item.href}
              className={pathname === item.href ? "active" : ""}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a className="business-nav-cta" href={contact.introHref}>Describe a repeated task</a>
        </nav>
      </div>
    </header>
  );
}

export function BusinessFooter() {
  return (
    <footer className="business-footer">
      <div className="business-shell business-footer-grid">
        <div>
          <Link className="business-wordmark" href="/"><span>RECURSIVE</span><strong>INTELL</strong></Link>
          <p>Founder-led AI systems engineering and consulting by Josh Stevenson.</p>
        </div>
        <div>
          <small>WORK TOGETHER</small>
          <Link href="/services">Services + consulting</Link>
          <Link href="/work">Selected engineering work</Link>
          <a href={contact.introHref}>Project inquiry</a>
        </div>
        <div>
          <small>PUBLIC PROOF</small>
          <Link href="/mnemes">Mnemes</Link>
          <Link href="/portfolio">Portfolio</Link>
          <a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
        <div>
          <small>CONTACT</small>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
      <div className="business-shell business-footer-floor">
        <span>© 2026 RECURSIVEINTELL</span>
        <span>PUBLIC SOURCE SHOWS SCOPE, NOT CUSTOMER OUTCOMES</span>
      </div>
    </footer>
  );
}

export function BusinessPageIntro({
  index,
  eyebrow,
  title,
  accent,
  body,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
}) {
  return (
    <section className="business-page-intro">
      <CircuitTrace />
      <div className="business-shell business-page-intro-grid">
        <div>
          <p className="business-kicker"><span>{index}</span>{eyebrow}</p>
          <h1>{title}<br /><em>{accent}</em></h1>
        </div>
        <p>{body}</p>
      </div>
    </section>
  );
}
