import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

const vaultSections = [
  {
    title: "Prompts",
    description: "Reusable prompt templates and workflows.",
    href: "/vault/prompts",
  },
  {
    title: "Tools",
    description: "CLI utilities, scripts, and internal tools.",
    href: "/vault/tools",
  },
  {
    title: "Downloads",
    description: "Files, checklists, and assets ready to ship.",
    href: "/vault/downloads",
  },
];

export default function VaultPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Vault"
        description="The reusable building blocks behind the workbench."
      />
      <Container className="py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {vaultSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm text-[color:var(--color-muted)]">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
