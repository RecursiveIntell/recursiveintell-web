import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { logoutPrivate } from "./login/actions";

export const metadata: Metadata = {
  title: "Private Workbench",
  description: "Protected RecursiveIntell workbench routes.",
};

export default function PrivatePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Protected"
        title="Private Workbench"
        description="Protected routes for personal administration and future private tools."
      />
      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 transition hover:border-[color:var(--color-accent)]"
            href="/private/admin/gallery"
          >
            <h2 className="text-2xl">Gallery Admin</h2>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              Review gallery mode and static manifest entries.
            </p>
          </Link>
        </div>
        <form action={logoutPrivate} className="mt-8">
          <button
            className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm"
            type="submit"
          >
            Log out
          </button>
        </form>
      </Container>
    </div>
  );
}
