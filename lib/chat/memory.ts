import type { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type Session = {
  id: string;
  messages: Message[];
  createdAt: number;
  lastActiveAt: number;
};

const sessions = new Map<string, Session>();
const MAX_MESSAGES_PER_SESSION = 10;
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getSession(sessionId: string): Session {
  let session = sessions.get(sessionId);

  if (!session) {
    session = {
      id: sessionId,
      messages: [],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    };
    sessions.set(sessionId, session);
  }

  session.lastActiveAt = Date.now();
  return session;
}

export function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): void {
  const session = getSession(sessionId);

  session.messages.push({
    role,
    content,
    timestamp: Date.now(),
  });

  // Keep only the last N messages
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION);
  }
}

export function getMessages(sessionId: string): Message[] {
  const session = getSession(sessionId);
  return session.messages;
}

export function formatMessagesForContext(sessionId: string): string {
  const messages = getMessages(sessionId);

  if (messages.length === 0) {
    return "";
  }

  return messages
    .map((msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`)
    .join("\n\n");
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function cleanupExpiredSessions(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActiveAt > SESSION_TTL_MS) {
      sessions.delete(id);
      cleaned++;
    }
  }

  return cleaned;
}

export function getSessionStats(): {
  totalSessions: number;
  totalMessages: number;
} {
  let totalMessages = 0;

  for (const session of sessions.values()) {
    totalMessages += session.messages.length;
  }

  return {
    totalSessions: sessions.size,
    totalMessages,
  };
}

// Generate a simple session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
