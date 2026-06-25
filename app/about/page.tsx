import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

const skills = {
  languages: ["Rust", "TypeScript"],
  runtimes: ["Tauri 2", "Tokio", "SQLite", "IPC", "D-Bus", "systemd"],
  evidence: ["Receipts", "Source spans", "Bitemporal truth", "Review queues", "Testimony exports"],
  local_ai: ["Ollama", "ComfyUI", "Local embeddings", "Hybrid retrieval", "Generation receipts", "MCP", "Autonomous agents", "Knowledge graphs"],
  specializations: ["Local-first systems", "Evidence runtimes", "Verification control", "Operator safety boundaries"],
};

const achievements = [
  {
    title: "Magna Cum Laude",
    description: "Graduated with high academic distinction",
    icon: "academic",
  },
  {
    title: "Phi Theta Kappa",
    description: "International honor society for academic excellence",
    icon: "honor",
  },
  {
    title: "Sigma Kappa Delta",
    description: "National English honor society",
    icon: "honor",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="Josh Stevenson"
        description="Rust-focused systems engineer building local-first evidence, memory, and operator-control runtimes."
      />
      <Container className="py-12">
        {/* Hero section with photo and intro */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Profile photo */}
          <div className="shrink-0">
            <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-[color:var(--color-border)] shadow-lg md:h-64 md:w-64">
              <Image
                src="/images/ai_pic.png"
                alt="Josh Stevenson"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Availability badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Available for hire
              </span>
            </div>
          </div>

          {/* Intro text */}
          <div className="flex-1">
            <div className="prose prose-lg">
              <p>
                I&apos;m Josh, a systems engineer focused on Rust-first local runtimes,
                evidence-aware memory, verification boundaries, and operator-control
                software that can explain what it did.
              </p>
              <p>
                This site is the public surface for RecursiveIntell: Recall, Gloss,
                Palisade, VisionForge, Sortarr, projmind, AiDENs, the Rust Libraries workspace,
                and ClaimLedger.
              </p>
              <p>
                My approach: keep authority explicit, make material operations
                receipt-backed, separate canonical crates from satellite utilities,
                and avoid public claims the code cannot support.
              </p>
              <p>
                Published crates on crates.io: semantic-memory, semantic-memory-mcp,
                turbo-quant, claim-ledger, and stack-ids. semantic-memory-claude-kit v0.5.2
                is available on GitHub. The 9-month journey from &ldquo;can you help me
                learn Python?&rdquo; in June 2025 to published Rust crates in March 2026.
              </p>
              <p>
                You can find me on GitHub at{" "}
                <a
                  href="https://github.com/RecursiveIntell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-accent)] hover:underline"
                >
                  @RecursiveIntell
                </a>{" "}
                and on X/Twitter at{" "}
                <a
                  href="https://x.com/RecursiveIntell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-accent)] hover:underline"
                >
                  @RecursiveIntell
                </a>
                .
              </p>
            </div>

            {/* Contact CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:josh@recursiveintell.com"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[color:var(--color-accent-2)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get in Touch
              </a>
              <a
                href="https://github.com/RecursiveIntell"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Achievements section */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-[color:var(--color-text)]">Achievements</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition-all hover:border-[color:var(--color-accent)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-accent)]/10">
                  {achievement.icon === "academic" ? (
                    <svg className="h-5 w-5 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-[color:var(--color-text)]">{achievement.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills section */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-[color:var(--color-text)]">Technical Focus</h2>
          <div className="mt-6 space-y-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                  {category.replace(/_/g, " & ")}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Stats section */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-[color:var(--color-text)]">GitHub Activity</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="https://github.com/RecursiveIntell"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] transition-all hover:border-[color:var(--color-accent)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github-readme-stats.vercel.app/api?username=RecursiveIntell&show_icons=true&theme=transparent&hide_border=true&title_color=1d6d75&icon_color=1d6d75&text_color=6b7280"
                alt="GitHub Stats"
                className="w-full"
                loading="lazy"
              />
            </a>
            <a
              href="https://github.com/RecursiveIntell"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] transition-all hover:border-[color:var(--color-accent)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=RecursiveIntell&layout=compact&theme=transparent&hide_border=true&title_color=1d6d75&text_color=6b7280"
                alt="Top Languages"
                className="w-full"
                loading="lazy"
              />
            </a>
          </div>
          <p className="mt-4 text-sm text-[color:var(--color-muted)]">
            View my full profile and repositories on{" "}
            <a
              href="https://github.com/RecursiveIntell"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[color:var(--color-accent)] hover:underline"
            >
              GitHub
            </a>
          </p>
        </section>

        {/* Principles section */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-[color:var(--color-text)]">Operating Principles</h2>
          <div className="prose mt-6">
            <ul>
              <li><strong>Keep authority explicit</strong> &mdash; Apps, daemons, CLIs, and compilers need clear write boundaries.</li>
              <li><strong>Make claims reviewable</strong> &mdash; Evidence, support, contradiction, and quarantine state should be visible artifacts.</li>
              <li><strong>Prefer local-first control</strong> &mdash; User data, models, and system operations should stay local unless deliberately exported.</li>
              <li><strong>Separate support tiers</strong> &mdash; Canonical crates, satellite utilities, and research prototypes should not make the same claims.</li>
            </ul>
          </div>
        </section>

        {/* Contact CTA at bottom */}
        <section className="mt-16 rounded-2xl border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-card)] to-transparent p-8 text-center">
          <h2 className="text-2xl font-semibold text-[color:var(--color-text)]">Let&apos;s Build Something</h2>
          <p className="mx-auto mt-3 max-w-lg text-[color:var(--color-muted)]">
            I&apos;m currently available for full-time roles, contract work, and interesting AI projects.
            If you&apos;re building something ambitious, let&apos;s talk.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:josh@recursiveintell.com"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[color:var(--color-accent-2)]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              josh@recursiveintell.com
            </a>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
            >
              View My Work
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
