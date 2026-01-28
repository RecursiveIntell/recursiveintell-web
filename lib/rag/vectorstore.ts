import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import fs from "fs";
import path from "path";

const COLLECTION_NAME = "portfolio-content";
const STORE_PATH = path.join(process.cwd(), "data", "rag", "vectors.json");

type StoredDocument = {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, string | number | boolean>;
};

type VectorStore = {
  name: string;
  documents: StoredDocument[];
};

let embeddings: OpenAIEmbeddings | null = null;
let store: VectorStore | null = null;

function getEmbeddings(): OpenAIEmbeddings {
  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  return embeddings;
}

function loadStore(): VectorStore {
  if (store) return store;

  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      store = JSON.parse(data) as VectorStore;
    } else {
      store = { name: COLLECTION_NAME, documents: [] };
    }
  } catch {
    store = { name: COLLECTION_NAME, documents: [] };
  }

  return store;
}

function saveStore(): void {
  if (!store) return;

  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function addDocuments(documents: Document[]): Promise<void> {
  const currentStore = loadStore();
  const embed = getEmbeddings();

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const id = `${doc.metadata.type}-${doc.metadata.slug || i}`;

    // Remove existing document with same ID
    currentStore.documents = currentStore.documents.filter((d) => d.id !== id);

    const embedding = await embed.embedQuery(doc.pageContent);

    currentStore.documents.push({
      id,
      content: doc.pageContent,
      embedding,
      metadata: doc.metadata as Record<string, string | number | boolean>,
    });

    // Progress indicator
    process.stdout.write(`\rEmbedding document ${i + 1}/${documents.length}...`);
  }

  console.log(); // New line after progress
  saveStore();
  console.log(`Added ${documents.length} documents to vector store`);
}

export async function queryDocuments(
  query: string,
  options: {
    limit?: number;
    filter?: Record<string, unknown>;
  } = {}
): Promise<Document[]> {
  const { limit = 5, filter } = options;
  const currentStore = loadStore();
  const embed = getEmbeddings();

  if (currentStore.documents.length === 0) {
    return [];
  }

  const queryEmbedding = await embed.embedQuery(query);

  // Calculate similarities
  let results = currentStore.documents.map((doc) => ({
    doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Apply filter if provided
  if (filter) {
    results = results.filter(({ doc }) => {
      return Object.entries(filter).every(([key, value]) => {
        return doc.metadata[key] === value;
      });
    });
  }

  // Sort by similarity (descending) and take top N
  results.sort((a, b) => b.similarity - a.similarity);
  const topResults = results.slice(0, limit);

  return topResults.map(({ doc }) => {
    return new Document({
      pageContent: doc.content,
      metadata: doc.metadata as Record<string, unknown>,
    });
  });
}

export async function clearCollection(): Promise<void> {
  store = { name: COLLECTION_NAME, documents: [] };
  saveStore();
  console.log("Cleared vector store collection");
}

export async function getCollectionStats(): Promise<{
  count: number;
  name: string;
}> {
  const currentStore = loadStore();
  return { count: currentStore.documents.length, name: COLLECTION_NAME };
}
