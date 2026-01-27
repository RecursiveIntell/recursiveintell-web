import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="JSense / RecursiveIntell"
        description="Building AI systems that work autonomously, learn from use, and scale gracefully."
      />
      <Container className="py-12">
        <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="prose">
            <p className="text-lg">
              I'm an AI systems engineer focused on building autonomous agents
              and the infrastructure that powers them. My work spans from
              low-level systems programming to high-level agent orchestration—
              wherever the interesting problems are.
            </p>

            <p>
              Currently, I'm building agentic systems that can control entire
              computers from browser to terminal (Linux-first), along with the
              observability and inference infrastructure needed to run them
              reliably at scale. I believe the best systems are the ones you
              forget exist—they just work.
            </p>

            <h2>What I Build</h2>
            <p>
              My projects cluster around a few themes: making AI systems more
              autonomous, making infrastructure more observable, and making
              developer tools more humane.
            </p>
            <ul>
              <li>
                <strong>Autonomous Agents</strong> — Systems that perceive,
                reason, and act with minimal human intervention. Currently
                focused on computer-use agents and self-improving feedback
                loops.
              </li>
              <li>
                <strong>ML Infrastructure</strong> — Inference orchestration,
                distributed training pipelines, and the observability layers
                that make them debuggable.
              </li>
              <li>
                <strong>Developer Tools</strong> — CLI utilities, code review
                automation, and anything that removes friction from the build
                cycle.
              </li>
            </ul>

            <h2>Principles</h2>
            <p>
              These are the ideas I keep coming back to when making technical
              decisions:
            </p>
            <ul>
              <li>
                <strong>Ship in reliable chunks.</strong> Momentum beats
                perfection. Small, working increments compound faster than big
                bets.
              </li>
              <li>
                <strong>Build for the 3 AM version of yourself.</strong> Systems
                should be debuggable under pressure. Clear error messages,
                obvious failure modes, fast recovery paths.
              </li>
              <li>
                <strong>Prefer systems that learn.</strong> Static rules don't
                scale. When possible, build systems that improve from use rather
                than requiring constant tuning.
              </li>
              <li>
                <strong>Documentation is interface design.</strong> If it's hard
                to explain, it's probably hard to use. Write the README first.
              </li>
              <li>
                <strong>Delete more than you add.</strong> Simplicity is a
                feature. Every line of code is a liability. Subtract before you
                add.
              </li>
            </ul>

            <h2>Background</h2>
            <p>
              I've worked across the stack—from embedded systems and
              performance-critical backends to ML pipelines and frontend
              applications. This breadth helps me make better tradeoffs: knowing
              what's happening at the hardware level informs how I think about
              distributed systems, and understanding user needs shapes how I
              design APIs.
            </p>
            <p>
              I'm particularly drawn to problems at the intersection of systems
              engineering and machine learning—where you need both low-level
              performance intuition and high-level ML understanding to build
              something that works.
            </p>

            <h2>This Site</h2>
            <p>
              This is my public workbench. The{" "}
              <Link href="/projects">projects</Link> section shows what I'm
              shipping. The <Link href="/lab">lab</Link> is for experiments that
              might not work. <Link href="/writing">Writing</Link> captures
              thinking about systems and engineering culture. The{" "}
              <Link href="/vault">vault</Link> contains tools and prompts I use
              daily.
            </p>
            <p>
              Everything here is built in public. If something's useful, take
              it.
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
              <h3 className="text-lg font-semibold">Languages</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Python",
                  "TypeScript",
                  "Rust",
                  "C++",
                  "Java",
                  "Go",
                  "SQL",
                ].map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
              <h3 className="text-lg font-semibold">Domains</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "AI/ML",
                  "Agents",
                  "Distributed Systems",
                  "Observability",
                  "Developer Tools",
                  "Infrastructure",
                ].map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-sm"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
              <h3 className="text-lg font-semibold">Tools & Frameworks</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "PyTorch",
                  "Next.js",
                  "Kubernetes",
                  "PostgreSQL",
                  "Redis",
                  "Kafka",
                  "ClickHouse",
                ].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
              <h3 className="text-lg font-semibold">Links</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="https://github.com/recursiveintell"
                    className="flex items-center gap-2 text-sm hover:text-[color:var(--color-accent)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>GitHub</span>
                    <span className="text-[color:var(--color-muted)]">→</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/recursiveintell"
                    className="flex items-center gap-2 text-sm hover:text-[color:var(--color-accent)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Twitter/X</span>
                    <span className="text-[color:var(--color-muted)]">→</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/recursiveintell"
                    className="flex items-center gap-2 text-sm hover:text-[color:var(--color-accent)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>LinkedIn</span>
                    <span className="text-[color:var(--color-muted)]">→</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
