import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllContent } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export default async function Home() {
  const [projects, writing] = await Promise.all([
    getAllContent("projects"),
    getAllContent("writing"),
  ]);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);
  const featuredWriting = writing.filter((w) => w.featured).slice(0, 2);

  return (
    <div className="py-16">
      <Container>
        {/* Hero Section */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
              JSense / RecursiveIntell
            </p>
            <h1 className="text-4xl leading-tight sm:text-5xl">
              Building intelligent systems that work autonomously and scale
              gracefully.
            </h1>
            <p className="max-w-xl text-lg text-[color:var(--color-muted)]">
              I design and build AI agents, ML infrastructure, and developer
              tools. This site is my public workbench—shipping notes, lab
              experiments, and a curated vault of prompts and utilities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-ink)]"
                href="/projects"
              >
                View Projects
              </Link>
              <Link
                className="rounded-full border border-transparent bg-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[color:var(--color-ink)]"
                href="/about"
              >
                About Me
              </Link>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Projects",
                description:
                  "Production systems, open source work, and technical deep-dives.",
                href: "/projects",
                count: projects.length,
              },
              {
                title: "Lab",
                description:
                  "Experiments and prototypes exploring new ideas and techniques.",
                href: "/lab",
              },
              {
                title: "Writing",
                description:
                  "Essays on systems design, engineering culture, and AI.",
                href: "/writing",
                count: writing.length,
              },
              {
                title: "Vault",
                description:
                  "Reusable prompts, CLI tools, and templates I use daily.",
                href: "/vault",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  {item.count && (
                    <span className="rounded-full bg-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]">
                      {item.count}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-[color:var(--color-muted)]">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)] transition group-hover:translate-x-1">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Featured Projects</h2>
              <Link
                href="/projects"
                className="text-sm font-medium text-[color:var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-8 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {project.status && <StatusBadge status={project.status} />}
                    <span className="text-xs text-[color:var(--color-muted)]">
                      {formatDate(project.date)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Writing Section */}
        {featuredWriting.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Writing</h2>
              <Link
                href="/writing"
                className="text-sm font-medium text-[color:var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredWriting.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className="group rounded-2xl border border-[color:var(--color-border)] bg-white/60 p-6 backdrop-blur transition hover:border-[color:var(--color-accent)]"
                >
                  <span className="text-xs text-[color:var(--color-muted)]">
                    {formatDate(post.date)}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold group-hover:text-[color:var(--color-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                    {post.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Now & About Section */}
        <div className="mt-16 grid gap-6 rounded-3xl border border-[color:var(--color-border)] bg-white/60 p-8 backdrop-blur sm:grid-cols-2">
          <div>
            <h3 className="text-2xl">Now</h3>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              Current focus: building autonomous agents and refining ML
              infrastructure. Shipping weekly.
            </p>
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
              href="/now"
            >
              See what I'm working on →
            </Link>
          </div>
          <div>
            <h3 className="text-2xl">About</h3>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              AI systems builder with a focus on agents that learn from use and
              infrastructure that scales.
            </p>
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
              href="/about"
            >
              Learn more about me →
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
