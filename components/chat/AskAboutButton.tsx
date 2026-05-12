"use client";

import { useChatContext } from "./ChatProvider";

type AskAboutButtonProps = {
  title: string;
  type: string;
  slug: string;
  className?: string;
};

export function AskAboutButton({ title, className = "" }: AskAboutButtonProps) {
  const { toggleChat, isOpen, sendMessage } = useChatContext();

  const handleClick = () => {
    if (!isOpen) {
      toggleChat();
    }
    // Send a contextual question
    sendMessage(`Tell me more about ${title}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10 px-4 py-2 text-sm font-medium text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)] hover:text-white ${className}`}
      aria-label={`Ask the AI assistant about ${title}`}
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      Ask AI about this
    </button>
  );
}
