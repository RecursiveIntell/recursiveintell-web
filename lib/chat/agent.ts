import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage, AIMessage, type BaseMessage } from "@langchain/core/messages";
import { retrieveWithMmr, formatRetrievedContext } from "../rag/retriever";
import { addMessage, getMessages, formatMessagesForContext } from "./memory";

export type ChatOptions = {
  provider?: "openai" | "anthropic";
  model?: string;
  apiKey?: string;
};

const StateAnnotation = Annotation.Root({
  sessionId: Annotation<string>,
  userMessage: Annotation<string>,
  needsRetrieval: Annotation<boolean>,
  context: Annotation<string>,
  response: Annotation<string>,
  conversationHistory: Annotation<string>,
  chatOptions: Annotation<ChatOptions>,
});

type AgentState = typeof StateAnnotation.State;

const SYSTEM_PROMPT = `You are a helpful assistant for JSense / RecursiveIntell's portfolio website.
You help visitors learn about projects, skills, technologies, and work experience.

Guidelines:
- Be concise, friendly, and professional
- Answer based on the provided context when available
- If you don't have specific information, say so politely
- Reference specific projects by name when relevant
- For technical questions, provide accurate details from the context

Current conversation context will be provided along with any retrieved information.`;

const CLASSIFIER_PROMPT = `Determine if this user message requires retrieving context from the portfolio to answer properly.

Messages that NEED retrieval:
- Questions about specific projects (e.g., "What is RecursiveOps?")
- Questions about technologies or skills
- Questions about work or experience
- Requests for project recommendations

Messages that DON'T need retrieval:
- Greetings ("Hi", "Hello", "Hey")
- Thanks ("Thank you", "Thanks!")
- Farewells ("Bye", "Goodbye")
- Simple clarifications of previous responses
- General chat

User message: "{message}"

Respond with only "RETRIEVE" or "NO_RETRIEVE".`;

function getLLM(options: ChatOptions, isClassifier = false): ChatOpenAI | ChatAnthropic {
  const { provider = "openai", model, apiKey } = options;

  if (provider === "anthropic") {
    return new ChatAnthropic({
      model: model || "claude-3-5-sonnet-latest",
      temperature: isClassifier ? 0 : 0.7,
      maxTokens: isClassifier ? 10 : undefined,
      anthropicApiKey: apiKey,
    });
  }

  return new ChatOpenAI({
    model: model || "gpt-4o-mini",
    temperature: isClassifier ? 0 : 0.7,
    maxTokens: isClassifier ? 10 : undefined,
    openAIApiKey: apiKey,
  });
}

async function classifyNode(state: AgentState): Promise<Partial<AgentState>> {
  const llm = getLLM(state.chatOptions || {}, true);
  const prompt = CLASSIFIER_PROMPT.replace("{message}", state.userMessage);

  const response = await llm.invoke([new HumanMessage(prompt)]);
  const decision =
    typeof response.content === "string"
      ? response.content.trim().toUpperCase()
      : "RETRIEVE";

  const needsRetrieval = decision.includes("RETRIEVE") && !decision.includes("NO_RETRIEVE");

  return { needsRetrieval };
}

async function retrieveNode(state: AgentState): Promise<Partial<AgentState>> {
  if (!state.needsRetrieval) {
    return { context: "" };
  }

  const docs = await retrieveWithMmr(state.userMessage, { topK: 5 });
  const context = formatRetrievedContext(docs);

  return { context };
}

async function generateNode(state: AgentState): Promise<Partial<AgentState>> {
  const llm = getLLM(state.chatOptions || {}, false);

  const conversationHistory = formatMessagesForContext(state.sessionId);

  let userPrompt = state.userMessage;
  if (state.context) {
    userPrompt = `Context from portfolio:\n${state.context}\n\nUser question: ${state.userMessage}`;
  }

  const messages: BaseMessage[] = [
    new SystemMessage(SYSTEM_PROMPT),
  ];

  // Add conversation history if available
  const previousMessages = getMessages(state.sessionId);
  for (const msg of previousMessages.slice(-6)) { // Last 6 messages for context
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    } else {
      messages.push(new AIMessage(msg.content));
    }
  }

  messages.push(new HumanMessage(userPrompt));

  const response = await llm.invoke(messages);
  const responseText =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  return {
    response: responseText,
    conversationHistory,
  };
}

function shouldRetrieve(state: AgentState): "retrieve" | "skip_retrieve" {
  return state.needsRetrieval ? "retrieve" : "skip_retrieve";
}

export function createChatAgent() {
  const workflow = new StateGraph(StateAnnotation)
    .addNode("classify", classifyNode)
    .addNode("retrieve", retrieveNode)
    .addNode("generate", generateNode)
    .addEdge("__start__", "classify")
    .addConditionalEdges("classify", shouldRetrieve, {
      retrieve: "retrieve",
      skip_retrieve: "generate",
    })
    .addEdge("retrieve", "generate")
    .addEdge("generate", "__end__");

  return workflow.compile();
}

export async function chat(
  sessionId: string,
  message: string,
  options: ChatOptions = {}
): Promise<string> {
  const agent = createChatAgent();

  // Record user message
  addMessage(sessionId, "user", message);

  const result = await agent.invoke({
    sessionId,
    userMessage: message,
    needsRetrieval: false,
    context: "",
    response: "",
    conversationHistory: "",
    chatOptions: options,
  });

  // Record assistant response
  addMessage(sessionId, "assistant", result.response);

  return result.response;
}

export async function* streamChat(
  sessionId: string,
  message: string,
  options: ChatOptions = {}
): AsyncGenerator<string, void, unknown> {
  const agent = createChatAgent();

  // Record user message
  addMessage(sessionId, "user", message);

  // For streaming, we need to run the agent and stream the generation
  const stream = await agent.stream({
    sessionId,
    userMessage: message,
    needsRetrieval: false,
    context: "",
    response: "",
    conversationHistory: "",
    chatOptions: options,
  });

  let fullResponse = "";

  for await (const event of stream) {
    if ("generate" in event && event.generate?.response) {
      const chunk = event.generate.response;
      fullResponse = chunk; // LangGraph streams full state updates
      yield chunk;
    }
  }

  // Record the full response
  if (fullResponse) {
    addMessage(sessionId, "assistant", fullResponse);
  }
}
