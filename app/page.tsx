import Link from "next/link";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <div className="py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
              JSense / RecursiveIntell
            </p>
            <h1 className="text-4xl leading-tight sm:text-5xl">
              A living portfolio, lab notebook, and vault for building in
              public.
            </h1>
            <p className="max-w-xl text-lg text-[color:var(--color-muted)]">
              This site is the daily workbench: projects in motion, experiments
              in the lab, writing on systems and strategy, plus a curated vault
              of prompts, tools, and downloads.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]"
                href="/projects"
              >
                Explore projects
              </Link>
              <Link
                className="rounded-full border border-transparent bg-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white"
                href="/lab"
              >
                Visit the lab
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Projects",
                description: "Shipping work, roadmap notes, and live demos.",
                href: "/projects",
              },
              {
                title: "Lab",
                description: "Experiments, prototypes, and technical deep dives.",
                href: "/lab",
              },
              {
                title: "Writing",
                description: "Essays and guides on building resilient systems.",
                href: "/writing",
              },
              {
                title: "Vault",
                description: "Prompts, tools, and reusable downloads.",
                href: "/vault",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
              >
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm text-[color:var(--color-muted)]">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                  Open
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16 grid gap-6 rounded-3xl border border-[color:var(--color-border)] bg-white/60 p-8 backdrop-blur sm:grid-cols-2">
          <div>
            <h3 className="text-2xl">Now</h3>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              Current focus, active systems, and what is shipping next.
            </p>
            <Link className="mt-4 inline-flex text-sm font-semibold" href="/now">
              View now page
            </Link>
          </div>
          <div>
            <h3 className="text-2xl">About</h3>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              The operating philosophy, tooling, and values behind the work.
            </p>
            <Link className="mt-4 inline-flex text-sm font-semibold" href="/about">
              Meet JSense
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
