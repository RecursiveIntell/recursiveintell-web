import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Document } from "@langchain/core/documents";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const contentTypeMap = {
  projects: "projects",
  lab: "lab",
  writing: "writing",
  "vault-prompts": "vault/prompts",
  "vault-tools": "vault/tools",
  "vault-downloads": "vault/downloads",
} as const;

type ContentType = keyof typeof contentTypeMap;

async function getMdxFiles(dir: string): Promise<string[]> {
  try {
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
  } catch {
    return [];
  }
}

function slugFromPath(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

async function readContentFile(
  filePath: string,
  type: ContentType
): Promise<Document | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = (data.slug as string) ?? slugFromPath(filePath);

    const pageContent = `# ${data.title}\n\n${data.summary}\n\n${content}`;

    return new Document({
      pageContent,
      metadata: {
        source: filePath,
        type,
        slug,
        title: data.title,
        summary: data.summary,
        tags: data.tags || [],
        date: data.date,
        featured: data.featured || false,
        status: data.status,
      },
    });
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

export async function indexContentType(type: ContentType): Promise<Document[]> {
  const dir = path.join(CONTENT_ROOT, contentTypeMap[type]);
  const files = await getMdxFiles(dir);
  const documents: Document[] = [];

  for (const filePath of files) {
    const doc = await readContentFile(filePath, type);
    if (doc) {
      documents.push(doc);
    }
  }

  return documents;
}

export async function indexAllContent(): Promise<Document[]> {
  const allDocuments: Document[] = [];

  for (const type of Object.keys(contentTypeMap) as ContentType[]) {
    const docs = await indexContentType(type);
    allDocuments.push(...docs);
    console.log(`Indexed ${docs.length} documents from ${type}`);
  }

  return allDocuments;
}

export async function indexReadmeFiles(codingDir: string): Promise<Document[]> {
  const documents: Document[] = [];

  try {
    const entries = await fs.readdir(codingDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const readmePath = path.join(codingDir, entry.name, "README.md");
        try {
          const content = await fs.readFile(readmePath, "utf8");
          documents.push(
            new Document({
              pageContent: content,
              metadata: {
                source: readmePath,
                type: "readme",
                projectName: entry.name,
              },
            })
          );
        } catch {
          // README doesn't exist, skip
        }
      }
    }

    console.log(`Indexed ${documents.length} README files from ${codingDir}`);
  } catch (error) {
    console.error(`Error indexing README files:`, error);
  }

  return documents;
}

export async function getAllDocuments(
  includeCodingDir = false
): Promise<Document[]> {
  const contentDocs = await indexAllContent();

  if (includeCodingDir) {
    const codingDir = path.join(process.env.HOME || "", "Coding");
    const readmeDocs = await indexReadmeFiles(codingDir);
    return [...contentDocs, ...readmeDocs];
  }

  return contentDocs;
}
