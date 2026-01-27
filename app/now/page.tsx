import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getAllContent } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export default async function NowPage() {
  const [projects, lab] = await Promise.all([
    getAllContent("projects"),
    getAllContent("lab"),
  ]);

  const activeProjects = projects.filter((p) => p.status === "active");
  const shippingProjects = projects.filter((p) => p.status === "shipping");
  const activeLab = lab.filter((l) => l.status === "active");

  return (
    <div>
      <PageHeader
        eyebrow="Now"
        title="Current Focus"
        description="What I'm building, learning, and shipping right now. Updated regularly."
      />
      <Container className="py-12">
        <div className="prose mb-12">
          <p className="text-lg">
            <strong>Last updated:</strong> January 2025
          </p>
          <p>
            This season I'm focused on autonomous agents and the infrastructure
            that makes them reliable. The goal is systems that improve from use
            rather than requiring constant tuning.
          </p>
        </div>

        {/* Primary Focus */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold">Primary Focus</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)]"></span>
                <span className="text-sm font-medium text-[color:var(--color-accent)]">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-semibold">Agentic Desktop</h3>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                Building an autonomous agent that controls a full Linux desktop
                through vision and action. Currently working on improving
                robustness to UI variations and reducing interaction counts.
              </p>
              <Link
                href="/projects/agentic-desktop"
                className="mt-4 inline-flex text-sm font-medium text-[color:var(--color-accent)] hover:underline"
              >
                View project →
              </Link>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)]"></span>
                <span className="text-sm font-medium text-[color:var(--color-accent)]">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-semibold">Memory Graph</h3>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                Experimenting with persistent, structured memory for AI
                assistants. Building the UI for memory inspection and editing—
                transparency is key to making this feel helpful rather than
                creepy.
              </p>
              <Link
                href="/lab/memory-graph"
                className="mt-4 inline-flex text-sm font-medium text-[color:var(--color-accent)] hover:underline"
              >
                View experiment →
              </Link>
            </div>
          </div>
        </div>

        {/* Active Tracks */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold">Active Tracks</h2>
          <div className="prose">
            <ul>
              <li>
                <strong>Inference infrastructure</strong> — Refining the routing
                layer for Inference Mesh. Current focus is on semantic caching
                and better latency prediction under varying load.
              </li>
              <li>
                <strong>Prompt compilation</strong> — Testing whether
                compilation artifacts can transfer across similar tasks. If this
                works, it dramatically reduces cold-start cost for new prompts.
              </li>
              <li>
                <strong>Writing</strong> — Drafting an essay on feedback loops
                in AI systems. How do you build agents that genuinely improve
                from deployment rather than just logging failures?
              </li>
              <li>
                <strong>Tooling</strong> — Polishing Context Dump and PR
                Describe for public release. Small tools that save minutes per
                day compound.
              </li>
            </ul>
          </div>
        </div>

        {/* Recently Shipped */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold">Recently Shipped</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-[color:var(--color-border)] bg-white/60 p-4 backdrop-blur">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Semantic Diff v1.0</p>
                <p className="text-sm text-[color:var(--color-muted)]">
                  Code review tool that explains changes in plain English.
                  GitHub Action now available.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-[color:var(--color-border)] bg-white/60 p-4 backdrop-blur">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Context Weaver RAG pipeline</p>
                <p className="text-sm text-[color:var(--color-muted)]">
                  Hierarchical retrieval for codebases. Accuracy improved from
                  73% to 89% vs standard RAG.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-[color:var(--color-border)] bg-white/60 p-4 backdrop-blur">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">This site</p>
                <p className="text-sm text-[color:var(--color-muted)]">
                  Full redesign with MDX content pipeline, build-time indexing,
                  and improved navigation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects Grid */}
        {activeProjects.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Active Projects</h2>
              <Link
                href="/projects"
                className="text-sm font-medium text-[color:var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeProjects.slice(0, 6).map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 transition hover:border-[color:var(--color-accent)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <StatusBadge status={project.status!} />
                  </div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-muted)]">
                    {project.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Learning */}
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/60 p-8 backdrop-blur">
          <h2 className="mb-4 text-xl font-semibold">Currently Learning</h2>
          <div className="prose">
            <ul>
              <li>
                <strong>Reinforcement learning from human feedback</strong> —
                Digging deeper into RLHF techniques for agent alignment. Focus
                is on practical implementation rather than theory.
              </li>
              <li>
                <strong>Distributed training at scale</strong> — Understanding
                the systems challenges of training large models across many
                nodes. Reading through Megatron-LM and DeepSpeed internals.
              </li>
              <li>
                <strong>Formal verification</strong> — Exploring whether
                property-based testing and formal methods can improve AI system
                reliability. Early experiments with TLA+ for distributed agent
                coordination.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-[color:var(--color-muted)]">
          <p>
            Want more detail? Browse the <Link href="/lab">Lab</Link> for
            experiments or <Link href="/writing">Writing</Link> for longer-form
            thinking.
          </p>
        </div>
      </Container>
    </div>
  );
}
