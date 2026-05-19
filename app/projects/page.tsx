import Link from "next/link";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

type IndexPageProps = {
  searchParams: Promise<{
    tag?: string;
    status?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: IndexPageProps) {
  const params = await searchParams;
  const allProjects = await getAllContent("projects");
  const tags = Array.from(new Set(allProjects.flatMap((project) => project.tags))).sort();
  const statuses = Array.from(
    new Set(allProjects.flatMap((project) => (project.status ? [project.status] : [])))
  ).sort();
  const projects = allProjects.filter(
    (project) =>
      (!params.tag || project.tags.includes(params.tag)) &&
      (!params.status || project.status === params.status)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Current Projects"
        description="Rust-first systems, local evidence runtimes, and ClaimLedger claim-hygiene work."
      />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs" href="/projects">
            all
          </Link>
          {statuses.map((status) => (
            <Link
              className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs"
              href={`/projects?status=${encodeURIComponent(status)}`}
              key={status}
            >
              {status}
            </Link>
          ))}
          {tags.slice(0, 14).map((tag) => (
            <Link
              className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs"
              href={`/projects?tag=${encodeURIComponent(tag)}`}
              key={tag}
            >
              #{tag}
            </Link>
          ))}
        </div>
        {projects.length === 0 ? (
          <p className="text-[color:var(--color-muted)]">
            No projects yet. Add MDX files in `content/projects` to publish.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ContentCard
                key={project.slug}
                title={project.title}
                summary={project.summary}
                date={project.date}
                tags={project.tags}
                status={project.status}
                href={contentHref("projects", project.slug)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
