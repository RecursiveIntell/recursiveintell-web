import { LargeProjectCard } from "@/components/projects/LargeProjectCard";
import type { ContentStatus } from "@/components/StatusBadge";

type Project = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
  status?: ContentStatus;
  featured?: boolean;
  links?: Record<string, string>;
};

type ProjectShowcaseProps = {
  projects: Project[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold">All Projects</h2>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
          {projects.length} projects
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <LargeProjectCard
            key={project.href}
            title={project.title}
            summary={project.summary}
            date={project.date}
            href={project.href}
            tags={project.tags}
            status={project.status}
            featured={project.featured}
            links={project.links}
          />
        ))}
      </div>
    </section>
  );
}
