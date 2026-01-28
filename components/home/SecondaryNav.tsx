import Link from "next/link";

const sections = [
  {
    title: "Lab",
    description: "Experiments, prototypes, and technical deep dives.",
    href: "/lab",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    title: "Writing",
    description: "Essays and guides on building resilient systems.",
    href: "/writing",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
  {
    title: "Vault",
    description: "Prompts, tools, and reusable downloads.",
    href: "/vault",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
  },
  {
    title: "Now",
    description: "Current focus and what's shipping next.",
    href: "/now",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export function SecondaryNav() {
  return (
    <section className="py-12">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[color:var(--color-muted)]">
          More to Explore
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group flex items-start gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white/60 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-card)]"
          >
            <div className="flex-shrink-0 text-[color:var(--color-muted)] transition-colors group-hover:text-[color:var(--color-accent)]">
              {section.icon}
            </div>
            <div>
              <h3 className="font-semibold transition-colors group-hover:text-[color:var(--color-accent)]">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
