import Link from "next/link";

export function RecallHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[color:var(--color-accent)]/30 bg-gradient-to-br from-[color:var(--color-card)] via-[color:var(--color-card)] to-[color:var(--color-accent)]/5">
      {/* Decorative grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Accent glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[color:var(--color-accent-2)]/8 blur-3xl" />

      <div className="relative px-8 py-12 md:px-12 md:py-16">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[color:var(--color-accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Flagship Product
          </span>
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            Now Shipping
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
          <span className="text-[color:var(--color-text)]">Recall</span>
        </h2>
        <p className="mt-2 text-xl font-medium text-[color:var(--color-accent)] sm:text-2xl">
          Your sovereign knowledge workstation.
        </p>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--color-muted)]">
          A local-first desktop app that turns conversations into durable, structured memory.
          Think with your own data using any LLM provider — Ollama, OpenAI, Anthropic, or OpenRouter.
          Every read, write, tool call, and governance decision comes with a receipt. Nothing is hidden.
        </p>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { icon: ShieldIcon, label: "Constitutional Governance" },
            { icon: DatabaseIcon, label: "Hybrid Retrieval (FTS5 + HNSW + RRF)" },
            { icon: ToolIcon, label: "37 Typed Tools" },
            { icon: LockIcon, label: "100% Local-First" },
            { icon: LayersIcon, label: "7 Rust Crates" },
            { icon: ZapIcon, label: "Zero Production Panics" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-paper)]/50 px-4 py-2 text-sm font-medium text-[color:var(--color-text)]"
            >
              <Icon className="h-4 w-4 text-[color:var(--color-accent)]" />
              {label}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { value: "37", label: "Tools" },
            { value: "7", label: "Rust Crates" },
            { value: "4+", label: "LLM Providers" },
            { value: "3", label: "Retrieval Modes" },
            { value: "0", label: "Panics in Prod" },
            { value: "384d", label: "Embeddings" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-[color:var(--color-accent)]">
                {value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--color-muted)]">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://github.com/RecursiveIntell/Recall/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[color:var(--color-accent)] px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[color:var(--color-accent-2)] hover:scale-105 hover:shadow-lg hover:shadow-[color:var(--color-accent)]/25"
          >
            <DownloadIcon className="h-5 w-5" />
            Download Recall
          </a>
          <Link
            href="/projects/recall"
            className="inline-flex items-center gap-3 rounded-full border border-[color:var(--color-accent)] bg-transparent px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-[color:var(--color-accent)] transition-all hover:bg-[color:var(--color-accent)]/10 hover:scale-105"
          >
            Learn More
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <a
            href="https://github.com/RecursiveIntell/Recall"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-[color:var(--color-text)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] hover:scale-105"
          >
            <GithubIcon className="h-5 w-5" />
            Source Code
          </a>
        </div>

        {/* Tech stack ribbon */}
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[color:var(--color-border)]/50 pt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Built with
          </span>
          {["Rust", "Tauri 2", "React 18", "TypeScript", "SQLite", "Tokio", "FastEmbed", "Tailwind CSS"].map(
            (tech) => (
              <span
                key={tech}
                className="rounded-md bg-[color:var(--color-accent)]/8 px-2.5 py-1 text-xs font-semibold text-[color:var(--color-accent)]"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Inline SVG icons ---------- */

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
      />
    </svg>
  );
}

function ToolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.42 15.17l-5.66 5.66a2.12 2.12 0 01-3-3l5.66-5.66m0 0L4.93 8.69a2.12 2.12 0 010-3l.88-.88a2.12 2.12 0 013 0l3.49 3.49m-1.88 1.87l3.49 3.49a2.12 2.12 0 003 0l.88-.88a2.12 2.12 0 000-3l-3.49-3.49m1.87-1.88L19.07 2.93a2.12 2.12 0 013 3l-2.49 2.49"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25"
      />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
