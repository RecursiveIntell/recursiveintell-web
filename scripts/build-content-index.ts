import { mkdir, writeFile } from "fs/promises";
import path from "path";
import {
  contentHref,
  getAllContent,
  type ContentType,
} from "../lib/content";

type SearchEntry = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  type: ContentType;
  href: string;
};

type TagMapEntry = {
  count: number;
  types: ContentType[];
};

const contentTypes: ContentType[] = [
  "projects",
  "lab",
  "writing",
  "vault-prompts",
  "vault-tools",
  "vault-downloads",
];

async function buildIndex() {
  const searchIndex: SearchEntry[] = [];
  const tagMap = new Map<string, { count: number; types: Set<ContentType> }>();

  for (const type of contentTypes) {
    const items = await getAllContent(type);
    for (const item of items) {
      const id = `${type}:${item.slug}`;
      searchIndex.push({
        id,
        title: item.title,
        summary: item.summary,
        tags: item.tags,
        date: item.date,
        type,
        href: contentHref(type, item.slug),
      });

      for (const tag of item.tags) {
        const existing = tagMap.get(tag) ?? { count: 0, types: new Set() };
        existing.count += 1;
        existing.types.add(type);
        tagMap.set(tag, existing);
      }
    }
  }

  const outputDir = path.join(process.cwd(), "public", "data");
  await mkdir(outputDir, { recursive: true });

  const tagMapOutput: Record<string, TagMapEntry> = {};
  for (const [tag, entry] of tagMap.entries()) {
    tagMapOutput[tag] = {
      count: entry.count,
      types: Array.from(entry.types),
    };
  }

  await writeFile(
    path.join(outputDir, "search-index.json"),
    JSON.stringify(searchIndex, null, 2),
    "utf8"
  );

  await writeFile(
    path.join(outputDir, "tag-map.json"),
    JSON.stringify(tagMapOutput, null, 2),
    "utf8"
  );
}

buildIndex().catch((error) => {
  console.error("Failed to build content index", error);
  process.exit(1);
});
