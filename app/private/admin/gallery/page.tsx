import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getGalleryItems, getGalleryMode } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery Admin",
  description: "Private gallery administration for RecursiveIntell.",
};

export default function PrivateGalleryAdminPage() {
  const mode = getGalleryMode();
  const items = getGalleryItems();

  return (
    <div>
      <PageHeader
        eyebrow="Private admin"
        title="Gallery Admin"
        description="The gallery is static-first. Without Blob and database env vars, edits stay Git-managed in public/data/gallery.json."
      />
      <Container className="py-12">
        <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Mode
          </div>
          <h2 className="mt-2 text-2xl">{mode === "dynamic" ? "Dynamic storage configured" : "Static manifest mode"}</h2>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            {mode === "dynamic"
              ? "Blob and database env vars are present. The upload UI can be connected to direct-to-blob client uploads."
              : "Add or edit entries in public/data/gallery.json, then commit them. No runtime storage is required."}
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <article
              className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5"
              key={item.id}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                {item.id}
              </div>
              <h3 className="mt-2 text-xl">{item.caption}</h3>
              <p className="mt-2 break-all text-sm text-[color:var(--color-muted)]">{item.src}</p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
