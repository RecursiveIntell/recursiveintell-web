import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { StatusBadge } from "@/components/StatusBadge";
import { TagChip } from "@/components/TagChip";
import { AskAboutButton } from "@/components/chat/AskAboutButton";
import { formatDate } from "@/lib/format";
import { getContentPage, getContentSlugs, getContentBySlug, getAllContent, contentHref } from "@/lib/content";
import type { ProjectFrontmatter } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("projects");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContentBySlug("projects", slug);

  if (!entry) {
    return {
      title: "Project Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recursiveintell.com";

  return {
    title: entry.title,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: "article",
      url: `${siteUrl}/projects/${slug}`,
      images: entry.images?.[0]
        ? [{ url: entry.images[0], alt: entry.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.summary,
    },
    alternates: {
      canonical: `${siteUrl}/projects/${slug}`,
    },
  };
}

// Get related projects based on shared tags
async function getRelatedProjects(currentSlug: string, currentTags: string[], limit = 3) {
  const allProjects = await getAllContent("projects");

  const scoredProjects = allProjects
    .filter((p) => p.slug !== currentSlug)
    .map((project) => {
      const sharedTags = project.tags.filter((tag) => currentTags.includes(tag));
      return { project, score: sharedTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredProjects.map((item) => item.project);
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getContentPage("projects", slug);

  if (!entry) {
    notFound();
  }

  const { frontmatter, content } = entry;
  const fm = frontmatter as ProjectFrontmatter & { slug: string; type: string };

  // Get related projects
  const relatedProjects = await getRelatedProjects(slug, fm.tags);

  // Generate contextual questions for this project
  const contextualQuestions = [
    `What is ${fm.title}?`,
    `What technologies does ${fm.title} use?`,
    `How does ${fm.title} work?`,
    `What problems does ${fm.title} solve?`,
  ];

  // Check if this project has case study data
  const hasCaseStudy = fm.problem || fm.solution || fm.results || fm.metrics;

  return (
    <article className="py-12">
      <Container>
        <Link
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-accent)]"
          href="/projects"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>

        {/* Header section */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {fm.status ? <StatusBadge status={fm.status} /> : null}
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {formatDate(fm.date)}
          </span>
          {fm.role && (
            <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-accent)]">
              {fm.role}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-4xl text-[color:var(--color-text)] sm:text-5xl">
          {fm.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[color:var(--color-muted)]">
          {fm.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {fm.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          {fm.links &&
            Object.entries(fm.links).map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)] transition-all hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-card)] hover:scale-105"
              >
                {label.toLowerCase() === "github" && (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                )}
                {label.toLowerCase() === "demo" && (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                )}
                {label}
              </a>
            ))}

          {/* Ask AI button */}
          <AskAboutButton
            title={fm.title}
            type="project"
            slug={slug}
          />
        </div>

        {/* Results/Metrics section - shown first if available (case study best practice) */}
        {fm.metrics && fm.metrics.length > 0 && (
          <section className="mt-10 rounded-xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/5 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[color:var(--color-text)]">
              <svg className="h-5 w-5 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Key Results
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fm.metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-[color:var(--color-accent)]">{metric.value}</div>
                  <div className="mt-1 text-sm text-[color:var(--color-muted)]">{metric.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Case Study sections */}
        {hasCaseStudy && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {fm.problem && (
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[color:var(--color-text)]">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  The Problem
                </h2>
                <p className="mt-3 text-[color:var(--color-muted)]">{fm.problem}</p>
              </div>
            )}

            {fm.solution && (
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[color:var(--color-text)]">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  The Solution
                </h2>
                <p className="mt-3 text-[color:var(--color-muted)]">{fm.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Results list */}
        {fm.results && fm.results.length > 0 && (
          <section className="mt-6 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[color:var(--color-text)]">
              <svg className="h-5 w-5 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Outcomes
            </h2>
            <ul className="mt-3 space-y-2">
              {fm.results.map((result, index) => (
                <li key={index} className="flex items-start gap-2 text-[color:var(--color-muted)]">
                  <svg className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {result}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Main content */}
        <div className="prose mt-10">{content}</div>

        {/* Contextual chat prompt */}
        <div className="mt-12 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
          <h3 className="flex items-center gap-2 font-semibold text-[color:var(--color-text)]">
            <svg
              className="h-5 w-5 text-[color:var(--color-accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Have questions about {fm.title}?
          </h3>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            Try asking the AI assistant! Here are some ideas:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {contextualQuestions.map((question) => (
              <button
                key={question}
                type="button"
                className="chat-question-btn rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-1 text-xs text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] hover:scale-105"
                data-question={question}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-[color:var(--color-text)]">Related Projects</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={contentHref("projects", project.slug)}
                  className="group rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 transition-all hover:border-[color:var(--color-accent)] hover:shadow-md"
                >
                  <h4 className="font-semibold text-[color:var(--color-text)] group-hover:text-[color:var(--color-accent)]">
                    {project.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-sm text-[color:var(--color-muted)]">
                    {project.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[color:var(--color-paper)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
