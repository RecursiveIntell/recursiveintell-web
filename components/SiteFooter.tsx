import Link from "next/link";
import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 py-10 text-sm text-[color:var(--color-muted)]">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-[color:var(--color-text)]">
            JSense / RecursiveIntell
          </p>
          <p className="mt-2">Built for daily use. Published to share the work.</p>
        </div>
        <div className="flex flex-wrap gap-4 font-semibold uppercase tracking-[0.2em]">
          <Link className="hover:text-[color:var(--color-accent)]" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-[color:var(--color-accent)]" href="/lab">
            Lab
          </Link>
          <Link className="hover:text-[color:var(--color-accent)]" href="/writing">
            Writing
          </Link>
        </div>
      </Container>
    </footer>
  );
}
