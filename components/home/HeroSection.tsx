import Link from "next/link";
import { FeaturedCarousel } from "./FeaturedCarousel";
import type { ContentStatus } from "@/components/StatusBadge";

type FeaturedProject = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
  status?: ContentStatus;
};

type HeroSectionProps = {
  featuredProjects: FeaturedProject[];
};

export function HeroSection({ featuredProjects }: HeroSectionProps) {
  return (
    <section className="py-12">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            JSense / RecursiveIntell
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Building intelligent systems
            <br />
            <span className="text-[color:var(--color-accent)]">in the open.</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[color:var(--color-accent-2)] hover:scale-105"
            href="mailto:josh@recursiveintell.com"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Hire Me
          </a>
          <Link
            className="rounded-full border border-transparent bg-[color:var(--color-accent-2)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:opacity-90 hover:scale-105"
            href="/projects"
          >
            Explore Projects
          </Link>
          <Link
            className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] hover:scale-105"
            href="/about"
          >
            About
          </Link>
        </div>
      </div>

      {featuredProjects.length > 0 && (
        <FeaturedCarousel projects={featuredProjects} />
      )}
    </section>
  );
}
