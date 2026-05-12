"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type ChatContextType = {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;
  unreadCount: number;
  isConfigured: boolean;
  pendingQuestion: string | null;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  openChatWithQuestion: (question: string) => void;
  clearPendingQuestion: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

type ChatProviderProps = {
  children: ReactNode;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  // Chat is always configured since API key is server-side
  const isConfigured = true;

  // Generate session ID on mount
  useEffect(() => {
    const id = window.setTimeout(() => {
      const storedSessionId = sessionStorage.getItem("chat-session-id");
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem("chat-session-id", newSessionId);
        setSessionId(newSessionId);
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  // Clear unread count when chat is opened
  useEffect(() => {
    if (!isOpen) return;

    const id = window.setTimeout(() => {
      setUnreadCount(0);
    }, 0);

    return () => window.clearTimeout(id);
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !sessionId) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            sessionId,
            stream: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send message");
        }

        // Create a placeholder message for streaming
        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Read the streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "chunk") {
                  accumulatedContent += data.content;
                  // Update the message content as we receive chunks
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                } else if (data.type === "error") {
                  throw new Error(data.message);
                }
              } catch {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }

        // Increment unread if chat is closed
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Failed to send message:", error);

        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content:
            "I'm sorry, I encountered an error. Please try again in a moment.",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId, isOpen]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem("chat-session-id", newSessionId);
    setSessionId(newSessionId);
  }, []);

  const openChatWithQuestion = useCallback((question: string) => {
    setPendingQuestion(question);
    setIsOpen(true);
  }, []);

  const clearPendingQuestion = useCallback(() => {
    setPendingQuestion(null);
  }, []);

  // Listen for clicks on question buttons throughout the page
  useEffect(() => {
    const handleQuestionClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const button = target.closest('.chat-question-btn');
      if (button) {
        const question = button.getAttribute('data-question');
        if (question) {
          openChatWithQuestion(question);
        }
      }
    };

    document.addEventListener('click', handleQuestionClick);
    return () => document.removeEventListener('click', handleQuestionClick);
  }, [openChatWithQuestion]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        sessionId,
        unreadCount,
        isConfigured,
        pendingQuestion,
        toggleChat,
        sendMessage,
        clearChat,
        openChatWithQuestion,
        clearPendingQuestion,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
