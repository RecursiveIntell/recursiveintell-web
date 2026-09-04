"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact, businessNavigation } from "../config/site";

const systemLinks = [
  ["/mnemes", "Overview"],
  ["/product", "Memory server"],
  ["/node", "Node R1"],
  ["/proof", "Evidence"],
  ["/platform", "Architecture"],
  ["/install", "Installation"],
] as const;

export function StudioHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const isSystem = systemLinks.some(([href]) => href === path);
  return (
    <>
      <a className="studio-skip" href="#main-content">
        Skip to content
      </a>
      <header className="studio-header">
        <div className="studio-shell studio-header-row">
          <Link
            className="studio-brand"
            href="/"
            aria-label="RecursiveIntell home"
          >
            <span className="studio-mark" aria-hidden="true">
              r<span>i</span>
            </span>
            <span>
              Recursive<span>Intell</span>
              <small>INDEPENDENT SYSTEMS ENGINEERING</small>
            </span>
          </Link>
          <button
            ref={button}
            className="studio-menu"
            aria-controls="studio-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            type="button"
          >
            {open ? "Close −" : "Menu +"}
          </button>
          <nav
            ref={nav}
            id="studio-navigation"
            className={open ? "is-open" : ""}
            aria-label="Primary navigation"
          >
            {businessNavigation.map((item) => {
              const active =
                path === item.href ||
                (item.href === "/work" && path.startsWith("/work/")) ||
                (item.href === "/mnemes" && isSystem) ||
                (item.href === "/about" && path === "/josh");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    path === item.href ? "page" : active ? "true" : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="studio-nav-contact"
              onClick={() => setOpen(false)}
            >
              Let’s talk <span>↗</span>
            </Link>
          </nav>
        </div>
      </header>
      {isSystem && (
        <nav className="studio-system-nav" aria-label="Mnemes navigation">
          <div className="studio-shell">
            <span>
              Mnemes <small>A RecursiveIntell system</small>
            </span>
            {systemLinks.map(([href, label]) => (
              <Link
                href={href}
                key={href}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
      <div id="main-content" tabIndex={-1} />
    </>
  );
}

export function StudioFooter() {
  return (
    <footer className="studio-footer">
      <div className="studio-shell">
        <div className="studio-footer-top">
          <p>
            Have a hard problem?
            <br />
            <strong>Let’s make it concrete.</strong>
          </p>
          <Link
            href="/contact"
            className="studio-round-link"
            aria-label="Contact Josh"
          >
            ↗
          </Link>
        </div>
        <div className="studio-footer-grid">
          <div>
            <Link className="studio-footer-brand" href="/">
              RecursiveIntell
            </Link>
            <p>
              Independent AI systems engineering
              <br />
              by Josh Stevenson. Albertville, Alabama.
            </p>
            <span className="studio-availability">
              <i /> Open to engineering conversations
            </span>
          </div>
          <div>
            <small>EXPLORE</small>
            <Link href="/work">Selected work</Link>
            <Link href="/portfolio">Repository library</Link>
            <Link href="/mnemes">Mnemes</Link>
            <Link href="/doctrine">Engineering approach</Link>
          </div>
          <div>
            <small>WORK TOGETHER</small>
            <Link href="/josh">Meet Josh</Link>
            <Link href="/services">Services + consulting</Link>
            <a href={contact.careerHref}>Engineering roles</a>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <small>ELSEWHERE</small>
            <a
              href="https://github.com/RecursiveIntell"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://crates.io/users/RecursiveIntell"
              target="_blank"
              rel="noreferrer"
            >
              crates.io ↗
            </a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          </div>
        </div>
        <div className="studio-footer-bottom">
          <span>© 2026 RecursiveIntell</span>
          <span>Built in the open. Evidence linked to the work.</span>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
