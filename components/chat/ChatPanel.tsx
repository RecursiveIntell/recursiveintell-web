"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useChatContext } from "./ChatProvider";
import { ChatMessage } from "./ChatMessage";

type ChatPanelProps = {
  contextualQuestions?: string[];
  pageContext?: {
    type: string;
    title: string;
    slug: string;
  };
};

const DEFAULT_QUESTIONS = [
  "What projects are you working on?",
  "What technologies do you use most?",
  "Tell me about your AI projects",
  "What's RecursiveOps?",
];

export function ChatPanel({ contextualQuestions, pageContext }: ChatPanelProps) {
  const { messages, isLoading, sendMessage, clearChat, toggleChat, isConfigured, pendingQuestion, clearPendingQuestion } =
    useChatContext();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = contextualQuestions?.length
    ? contextualQuestions
    : DEFAULT_QUESTIONS;

  // Handle pending question from external clicks
  useEffect(() => {
    if (!pendingQuestion) return;

    const question = pendingQuestion;
    const id = window.setTimeout(() => {
      setInput(question);
      clearPendingQuestion();
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(id);
  }, [pendingQuestion, clearPendingQuestion]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus trap for accessibility
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
      if (e.key === "Escape") {
        toggleChat();
      }
    };

    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [toggleChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = pageContext
      ? `[Context: ${pageContext.type} - ${pageContext.title}] ${input}`
      : input;
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    const message = pageContext
      ? `[Context: ${pageContext.type} - ${pageContext.title}] ${question}`
      : question;
    sendMessage(message);
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Chat with portfolio assistant"
      aria-modal="true"
      className="flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-paper)] shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3">
        <div>
          <h3 className="font-semibold text-[color:var(--color-text)]">Chat with Portfolio</h3>
          <p className="text-xs text-[color:var(--color-muted)]">
            {pageContext
              ? `Asking about: ${pageContext.title}`
              : "Ask about projects, skills, or experience"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="rounded-full p-2 text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-border)] hover:text-[color:var(--color-text)]"
            title="Clear chat"
            aria-label="Clear chat history"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={toggleChat}
            className="rounded-full p-2 text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-border)] hover:text-[color:var(--color-text)]"
            title="Close chat"
            aria-label="Close chat panel"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {!isConfigured ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <svg
                className="h-6 w-6 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[color:var(--color-text)]">
                API Key Required
              </p>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                Configure your API key in settings to enable chat.
              </p>
            </div>
            <Link
              href="/settings"
              onClick={() => toggleChat()}
              className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-accent-2)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Go to Settings
            </Link>
          </div>
        ) : messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent)]/10">
                <svg
                  className="h-6 w-6 text-[color:var(--color-accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm text-[color:var(--color-muted)]">
                {pageContext
                  ? `Ask me anything about ${pageContext.title}!`
                  : "Ask me anything about the portfolio!"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1.5 text-xs text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-live="assertive">
                <div className="max-w-[85%] rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1" aria-hidden="true">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-muted)]" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-muted)]"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-muted)]"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-xs text-[color:var(--color-muted)]">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConfigured ? "Type a message..." : "Configure API key to chat"}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-4 py-2.5 text-sm text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-accent)] disabled:opacity-50"
            disabled={isLoading || !isConfigured}
            aria-describedby="chat-input-hint"
          />
          <span id="chat-input-hint" className="sr-only">
            Press Enter to send, Shift+Enter for new line
          </span>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !isConfigured}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-white transition-all hover:bg-[color:var(--color-accent-2)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
