"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  {
    label: "Projects",
    href: "/projects",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )
  },
  {
    label: "Lab",
    href: "/lab",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    label: "Writing",
    href: "/writing",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    label: "Vault",
    href: "/vault",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  },
  {
    label: "Now",
    href: "/now",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: "Audit",
    href: "/audit",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

function SearchButton() {
  const handleClick = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleClick}
      className="group flex h-11 min-w-[280px] items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/50 px-4 text-sm text-[color:var(--color-muted)] shadow-sm transition-all duration-200 hover:border-[color:var(--color-accent)]/50 hover:bg-[color:var(--color-card)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
      aria-label="Search (⌘K)"
    >
      <svg
        className="h-4 w-4 shrink-0 transition-colors group-hover:text-[color:var(--color-accent)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span className="flex-1 text-left">Search projects, writing...</span>
      <kbd className="ml-auto hidden items-center gap-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-muted)] shadow-sm sm:flex">
        <span className="text-sm">⌘</span>K
      </kbd>
    </button>
  );
}

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
};

function NavLink({ href, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-all duration-200 ${
        isActive
          ? "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]"
          : "text-[color:var(--color-text)]/80 hover:bg-[color:var(--color-card)] hover:text-[color:var(--color-text)]"
      }`}
    >
      <span className={`transition-colors duration-200 ${
        isActive
          ? "text-[color:var(--color-accent)]"
          : "text-[color:var(--color-muted)] group-hover:text-[color:var(--color-accent)]"
      }`}>
        {icon}
      </span>
      <span>{label}</span>
      {/* Active indicator dot */}
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[color:var(--color-accent)]" />
      )}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)]/50 bg-[color:var(--color-paper)]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[color:var(--color-paper)]/70">
      <Container className="flex items-center justify-between gap-6 py-3">
        {/* Logo */}
        <Link
          className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[color:var(--color-card)]"
          href="/"
        >
          {/* Logo icon/mark */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] shadow-md shadow-[color:var(--color-accent)]/20">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[color:var(--color-text)]">
              RecursiveIntell
            </span>
            <span className="text-xs text-[color:var(--color-muted)]">
              AI Engineer Portfolio
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav
          className="hidden items-center gap-1 rounded-2xl border border-[color:var(--color-border)]/50 bg-[color:var(--color-card)]/30 p-1.5 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>

        {/* Search, Contact, and Theme Toggle */}
        <div className="flex items-center gap-3">
          <SearchButton />
          <div className="hidden h-8 w-px bg-[color:var(--color-border)]/50 sm:block" />
          <a
            href="mailto:josh@recursiveintell.com"
            className="hidden items-center gap-2 rounded-xl bg-[color:var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[color:var(--color-accent-2)] hover:scale-105 sm:flex"
            title="Get in touch"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden lg:inline">Hire Me</span>
          </a>
          <div className="h-8 w-px bg-[color:var(--color-border)]/50" />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
