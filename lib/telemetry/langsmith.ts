import { Client } from "langsmith";
import { traceable } from "langsmith/traceable";

let langsmithClient: Client | null = null;

export function getLangSmithClient(): Client | null {
  if (langsmithClient) return langsmithClient;

  const apiKey = process.env.LANGCHAIN_API_KEY;
  if (!apiKey) {
    console.warn("LangSmith disabled: LANGCHAIN_API_KEY not configured");
    return null;
  }

  langsmithClient = new Client({
    apiKey,
  });

  return langsmithClient;
}

export function isLangSmithEnabled(): boolean {
  return (
    !!process.env.LANGCHAIN_API_KEY &&
    process.env.LANGCHAIN_TRACING_V2 === "true"
  );
}

export function getProjectName(): string {
  return process.env.LANGCHAIN_PROJECT || "portfolio-chatbot";
}

// Re-export traceable for convenience
export { traceable };

// Wrapper to create traceable functions with project metadata
export function createTraceable<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(
  fn: T,
  options: {
    name: string;
    runType?: "llm" | "chain" | "tool" | "retriever";
    metadata?: Record<string, unknown>;
  }
): T {
  if (!isLangSmithEnabled()) {
    return fn;
  }

  return traceable(fn, {
    name: options.name,
    run_type: options.runType,
    project_name: getProjectName(),
    metadata: {
      ...options.metadata,
      component: "portfolio-chatbot",
    },
  }) as T;
}

// Log a run feedback (for rating responses)
export async function logFeedback(
  runId: string,
  score: number,
  comment?: string
): Promise<void> {
  const client = getLangSmithClient();
  if (!client) return;

  try {
    await client.createFeedback(runId, "user_rating", {
      score,
      comment,
    });
  } catch (error) {
    console.error("Failed to log feedback to LangSmith:", error);
  }
}

// Get run URL for debugging
export function getRunUrl(runId: string): string {
  const project = getProjectName();
  return `https://smith.langchain.com/o/default/projects/p/${project}/${runId}`;
}
