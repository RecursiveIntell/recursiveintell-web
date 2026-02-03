import { Document } from "@langchain/core/documents";
import { queryDocuments } from "./vectorstore";

export type RetrievalOptions = {
  topK?: number;
  filterByType?: string;
  filterByTags?: string[];
  useMmr?: boolean;
};

export type RetrievedDocument = Document & {
  citationIndex?: number;
  href?: string;
};

export async function retrieve(
  query: string,
  options: RetrievalOptions = {}
): Promise<Document[]> {
  const { topK = 5, filterByType, filterByTags } = options;

  const filter: Record<string, unknown> = {};

  if (filterByType) {
    filter.type = filterByType;
  }

  if (filterByTags && filterByTags.length > 0) {
    filter.tags = { $in: filterByTags };
  }

  const documents = await queryDocuments(query, {
    limit: topK,
    filter: Object.keys(filter).length > 0 ? filter : undefined,
  });

  return documents;
}

export async function retrieveWithMmr(
  query: string,
  options: RetrievalOptions = {}
): Promise<RetrievedDocument[]> {
  const { topK = 5 } = options;

  // Fetch more documents for MMR reranking
  const candidates = await retrieve(query, { ...options, topK: topK * 2 });

  if (candidates.length <= topK) {
    return addCitationMetadata(candidates);
  }

  // Simple MMR: diversify by penalizing documents similar to already selected ones
  const selected: Document[] = [];
  const remaining = [...candidates];

  // Always include the most relevant document first
  if (remaining.length > 0) {
    selected.push(remaining.shift()!);
  }

  while (selected.length < topK && remaining.length > 0) {
    let bestIdx = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const doc = remaining[i];
      // Simple diversity: prefer documents with different types
      const diversityBonus = selected.every(
        (s) => s.metadata.type !== doc.metadata.type
      )
        ? 0.2
        : 0;

      // Prefer documents with different tags
      const selectedTags = new Set(
        selected.flatMap((s) => (s.metadata.tags as string[]) || [])
      );
      const docTags = (doc.metadata.tags as string[]) || [];
      const newTags = docTags.filter((t) => !selectedTags.has(t));
      const tagDiversityBonus = newTags.length * 0.05;

      const score = 1 - i / remaining.length + diversityBonus + tagDiversityBonus;

      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    selected.push(remaining.splice(bestIdx, 1)[0]);
  }

  return addCitationMetadata(selected);
}

function addCitationMetadata(documents: Document[]): RetrievedDocument[] {
  return documents.map((doc, idx) => {
    const type = doc.metadata.type as string;
    const slug = doc.metadata.slug as string;

    // Generate href based on content type
    let href = "/";
    switch (type) {
      case "projects":
        href = `/projects/${slug}`;
        break;
      case "lab":
        href = `/lab/${slug}`;
        break;
      case "writing":
        href = `/writing/${slug}`;
        break;
      case "vault-prompts":
        href = `/vault/prompts/${slug}`;
        break;
      case "vault-tools":
        href = `/vault/tools/${slug}`;
        break;
      default:
        href = `/`;
    }

    return {
      ...doc,
      citationIndex: idx + 1,
      href,
    };
  });
}

export function formatRetrievedContext(documents: RetrievedDocument[]): string {
  if (documents.length === 0) {
    return "No relevant context found.";
  }

  return documents
    .map((doc) => {
      const title = doc.metadata.title || "Untitled";
      const type = doc.metadata.type || "unknown";
      const tags = (doc.metadata.tags as string[])?.join(", ") || "";
      const idx = doc.citationIndex || 1;
      const href = doc.href || "/";

      return `[${idx}] ${title} (${type})
URL: ${href}
Tags: ${tags}
${doc.pageContent.slice(0, 500)}${doc.pageContent.length > 500 ? "..." : ""}`;
    })
    .join("\n\n---\n\n");
}

export function formatCitationFooter(documents: RetrievedDocument[]): string {
  if (documents.length === 0) {
    return "";
  }

  const citations = documents
    .map((doc) => {
      const title = doc.metadata.title || "Untitled";
      const idx = doc.citationIndex || 1;
      const href = doc.href || "/";
      return `[${idx}] [${title}](${href})`;
    })
    .join("\n");

  return `\n\n**Sources:**\n${citations}`;
}
