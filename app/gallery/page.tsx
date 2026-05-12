import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { TagChip } from "@/components/TagChip";
import { getGalleryItems, getGalleryMode } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Static gallery for RecursiveIntell images and visual references.",
};

export default function GalleryPage() {
  const items = getGalleryItems();
  const mode = getGalleryMode();

  return (
    <div>
      <PageHeader
        eyebrow={mode === "static" ? "Static mode" : "Blob mode"}
        title="Gallery"
        description="Images, captions, and tags. The gallery uses a static manifest unless Blob and database env vars are configured."
      />
      <Container className="py-12">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--color-border)] p-8 text-[color:var(--color-muted)]">
            No gallery items yet. Add entries to `public/data/gallery.json`.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)]"
                key={item.id}
              >
                <div className="relative aspect-[4/3] bg-[color:var(--color-paper)]">
                  <Image
                    alt={item.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={item.src}
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm text-[color:var(--color-muted)]">{item.caption}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <TagChip key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
