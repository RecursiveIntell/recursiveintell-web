import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

export default async function ProjectsPage() {
  const projects = await getAllContent("projects");

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        description="Shipping work, active roadmaps, and the systems that power them."
      />
      <Container className="py-12">
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
