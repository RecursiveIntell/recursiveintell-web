import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { retrieveWithMmr, formatRetrievedContext } from "./retriever";

const SYSTEM_PROMPT = `You are a helpful assistant for JSense / RecursiveIntell's portfolio website.
You answer questions about their projects, skills, and work experience based on the provided context.

Guidelines:
- Be concise and helpful
- Only answer based on the provided context
- If the context doesn't contain relevant information, say so politely
- Reference specific projects or skills when applicable
- Use a friendly, professional tone`;

const RAG_PROMPT = PromptTemplate.fromTemplate(`${SYSTEM_PROMPT}

Context from portfolio:
{context}

Question: {question}

Answer:`);

function getOpenAILLM(): ChatOpenAI {
  return new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

function getAnthropicLLM(): ChatAnthropic {
  return new ChatAnthropic({
    model: "claude-3-5-sonnet-latest",
    temperature: 0.7,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });
}

function getLLM(): ChatOpenAI | ChatAnthropic {
  // Use Anthropic if ANTHROPIC_API_KEY is set, otherwise OpenAI
  if (process.env.ANTHROPIC_API_KEY) {
    return getAnthropicLLM();
  }
  return getOpenAILLM();
}

export async function createRagChain() {
  const llm = getLLM();
  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        const docs = await retrieveWithMmr(input.question, { topK: 5 });
        return formatRetrievedContext(docs);
      },
      question: (input: { question: string }) => input.question,
    },
    RAG_PROMPT,
    llm,
    outputParser,
  ]);

  return chain;
}

export async function answerQuestion(question: string): Promise<string> {
  try {
    const chain = await createRagChain();
    const response = await chain.invoke({ question });
    return response;
  } catch (error) {
    // If using Anthropic failed, try OpenAI as fallback
    if (process.env.ANTHROPIC_API_KEY && process.env.OPENAI_API_KEY) {
      console.error("Primary LLM failed, trying fallback:", error);
      const docs = await retrieveWithMmr(question, { topK: 5 });
      const context = formatRetrievedContext(docs);
      const fallbackLLM = getOpenAILLM();
      const prompt = await RAG_PROMPT.format({ context, question });
      const response = await fallbackLLM.invoke(prompt);
      return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    }
    throw error;
  }
}

export async function* streamAnswer(
  question: string
): AsyncGenerator<string, void, unknown> {
  const docs = await retrieveWithMmr(question, { topK: 5 });
  const context = formatRetrievedContext(docs);

  const llm = getLLM();
  const prompt = await RAG_PROMPT.format({ context, question });

  const stream = await llm.stream(prompt);

  for await (const chunk of stream) {
    const content = chunk.content;
    if (typeof content === "string") {
      yield content;
    }
  }
}

export { formatRetrievedContext };
export type { Document };
