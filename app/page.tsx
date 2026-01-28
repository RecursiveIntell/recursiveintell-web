import { Container } from "@/components/Container";
import { ExcerptTicker } from "@/components/excerpts/ExcerptTicker";
import { HeroSection } from "@/components/home/HeroSection";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { TechStackCloud } from "@/components/home/TechStackCloud";
import { SecondaryNav } from "@/components/home/SecondaryNav";
import { getAllContent, contentHref } from "@/lib/content";
import excerptsData from "@/data/rag/excerpts.json";

type Excerpt = {
  text: string;
  category: "skill" | "project" | "achievement";
};

const excerpts = excerptsData as Excerpt[];
import tagMap from "@/public/data/tag-map.json";

export default async function Home() {
  const projects = await getAllContent("projects");

  const featuredProjects = projects
    .filter((p) => p.featured)
    .map((p) => ({
      title: p.title,
      summary: p.summary,
      date: p.date,
      href: contentHref("projects", p.slug),
      tags: p.tags,
      status: p.status,
    }));

  const allProjects = projects.map((p) => ({
    title: p.title,
    summary: p.summary,
    date: p.date,
    href: contentHref("projects", p.slug),
    tags: p.tags,
    status: p.status,
    featured: p.featured,
    links: p.links,
  }));

  return (
    <>
      <ExcerptTicker excerpts={excerpts} />
      <div className="py-8">
        <Container>
          <HeroSection featuredProjects={featuredProjects} />
          <ProjectShowcase projects={allProjects} />
          <TechStackCloud tagMap={tagMap} />
          <SecondaryNav />

          {/* AI Chat Feature Callout */}
          <section className="mt-16 rounded-2xl border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-card)] to-white p-8">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)]/10">
                <svg
                  className="h-8 w-8 text-[color:var(--color-accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[color:var(--color-ink)]">
                  Ask Me Anything
                </h3>
                <p className="mt-2 text-[color:var(--color-muted)]">
                  Have questions? Click the chat button in the{" "}
                  <span className="font-medium text-[color:var(--color-accent)]">
                    bottom-right corner
                  </span>{" "}
                  to talk with an AI assistant about my projects, tech stack, experience, or anything else on this site.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-accent)]">
                    Projects & Tech
                  </span>
                  <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-accent)]">
                    Skills & Experience
                  </span>
                  <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-accent)]">
                    Recommendations
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
