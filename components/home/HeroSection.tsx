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
          <Link
            className="rounded-full border border-transparent bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[color:var(--color-accent-2)]"
            href="/projects"
          >
            Explore Projects
          </Link>
          <Link
            className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
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
