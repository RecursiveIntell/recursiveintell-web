import galleryData from "@/public/data/gallery.json";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tags: string[];
  date: string;
};

export function getGalleryItems() {
  return (galleryData as GalleryItem[]).slice().sort((a, b) =>
    Date.parse(b.date) === Date.parse(a.date)
      ? a.caption.localeCompare(b.caption)
      : Date.parse(b.date) - Date.parse(a.date)
  );
}

export function getGalleryMode() {
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const hasDatabase = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
  return hasBlob && hasDatabase ? "dynamic" : "static";
}
