import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

export type ContentStatus = "active" | "shipping" | "paused" | "archived" | "prototype";

export type ContentType =
  | "projects"
  | "lab"
  | "writing"
  | "vault-prompts"
  | "vault-tools"
  | "vault-downloads";

const contentDirMap: Record<ContentType, string> = {
  projects: "projects",
  lab: "lab",
  writing: "writing",
  "vault-prompts": "vault/prompts",
  "vault-tools": "vault/tools",
  "vault-downloads": "vault/downloads",
};

const statusSchema = z.enum(["active", "shipping", "paused", "archived", "prototype"]);

const baseFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Date must be ISO parseable",
    }),
  summary: z.string().min(1, "Summary is required"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  slug: z.string().optional(),
  featured: z.boolean().optional(),
  links: z.record(z.string(), z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: statusSchema.optional(),
});

const projectLabSchema = baseFrontmatterSchema.extend({
  status: statusSchema,
  // Case study fields (optional)
  problem: z.string().optional(),
  solution: z.string().optional(),
  results: z.array(z.string()).optional(),
  role: z.string().optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
});

export type ContentFrontmatter = z.infer<typeof baseFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof projectLabSchema>;

export type ContentItem = ContentFrontmatter & {
  slug: string;
  type: ContentType;
};

export type ContentDetail = ContentItem & {
  content: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function schemaForType(type: ContentType) {
  if (type === "projects" || type === "lab") {
    return projectLabSchema;
  }
  return baseFrontmatterSchema;
}

function slugFromPath(filePath: string) {
  return path.basename(filePath, path.extname(filePath));
}

async function getMdxFiles(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMdxFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(entryPath);
    }
  }

  return files;
}

async function readContentFile(filePath: string, type: ContentType) {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = schemaForType(type).parse(data);
  const slug = parsed.slug ?? slugFromPath(filePath);

  const frontmatter: ContentItem = {
    ...parsed,
    slug,
    type,
  };

  return { frontmatter, content };
}

export async function getAllContent(type: ContentType): Promise<ContentItem[]> {
  const dir = path.join(CONTENT_ROOT, contentDirMap[type]);
  const files = await getMdxFiles(dir);
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const { frontmatter } = await readContentFile(filePath, type);
      return frontmatter;
    })
  );

  return entries.sort((a, b) =>
    Date.parse(b.date) === Date.parse(a.date)
      ? a.title.localeCompare(b.title)
      : Date.parse(b.date) - Date.parse(a.date)
  );
}

export async function getContentSlugs(type: ContentType) {
  const entries = await getAllContent(type);
  return entries.map((entry) => entry.slug);
}

export async function getContentBySlug(
  type: ContentType,
  slug: string
): Promise<ContentDetail | null> {
  const dir = path.join(CONTENT_ROOT, contentDirMap[type]);
  const files = await getMdxFiles(dir);

  for (const filePath of files) {
    const { frontmatter, content } = await readContentFile(filePath, type);
    if (frontmatter.slug === slug) {
      return { ...frontmatter, content };
    }
  }

  return null;
}

export async function getContentPage(type: ContentType, slug: string) {
  const entry = await getContentBySlug(type, slug);
  if (!entry) {
    return null;
  }

  const { content, ...frontmatter } = entry;
  const { compileMDX } = await import("next-mdx-remote/rsc");
  const compiled = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
    },
  });

  return {
    frontmatter,
    content: compiled.content,
  };
}

export function contentHref(type: ContentType, slug: string) {
  switch (type) {
    case "projects":
      return `/projects/${slug}`;
    case "lab":
      return `/lab/${slug}`;
    case "writing":
      return `/writing/${slug}`;
    case "vault-prompts":
      return `/vault/prompts/${slug}`;
    case "vault-tools":
      return `/vault/tools/${slug}`;
    case "vault-downloads":
      return `/vault/downloads#${slug}`;
    default:
      return `/`;
  }
}
