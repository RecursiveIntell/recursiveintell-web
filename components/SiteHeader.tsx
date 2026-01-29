import Link from "next/link";
import { Container } from "@/components/Container";

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Lab", href: "/lab" },
  { label: "Writing", href: "/writing" },
  { label: "Vault", href: "/vault" },
  { label: "Now", href: "/now" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--color-border)] bg-white/70 backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
        <Link className="text-lg font-semibold tracking-tight" href="/">
          JSense / RecursiveIntell
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="transition hover:text-[color:var(--color-accent)]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
