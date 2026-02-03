"use client";

import { useChatContext } from "./ChatProvider";
import { ChatPanel } from "./ChatPanel";

type ChatWidgetProps = {
  contextualQuestions?: string[];
  pageContext?: {
    type: string;
    title: string;
    slug: string;
  };
};

export function ChatWidget({ contextualQuestions, pageContext }: ChatWidgetProps) {
  const { isOpen, toggleChat, unreadCount } = useChatContext();

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300">
          <ChatPanel
            contextualQuestions={contextualQuestions}
            pageContext={pageContext}
          />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all motion-safe:duration-300 motion-safe:hover:scale-105 ${
          isOpen
            ? "bg-[color:var(--color-muted)] hover:bg-[color:var(--color-text)]"
            : "bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-2)]"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6 text-white"
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
        ) : (
          <svg
            className="h-6 w-6 text-white"
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
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--color-accent-2)] px-1.5 text-xs font-semibold text-white"
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
