"use client";

import Link from "next/link";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
};

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseMarkdownLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const href = match[2];
    const isInternal = href.startsWith("/");

    // Add the link
    if (isInternal) {
      parts.push(
        <Link
          key={match.index}
          href={href}
          className="font-medium text-[color:var(--color-accent)] underline underline-offset-2 hover:text-[color:var(--color-accent-2)]"
        >
          {match[1]}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={href}
          className="font-medium text-[color:var(--color-accent)] underline underline-offset-2 hover:text-[color:var(--color-accent-2)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function parseCitations(text: string): React.ReactNode[] {
  // Parse citation patterns like [1], [2], etc. and link them
  const parts: React.ReactNode[] = [];
  const citationRegex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <span
        key={match.index}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-accent)]/20 text-xs font-medium text-[color:var(--color-accent)]"
        title={`Source ${match[1]}`}
      >
        {match[1]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function formatContent(content: string): React.ReactNode[] {
  // Split by paragraphs
  const paragraphs = content.split(/\n\n+/);

  return paragraphs.map((paragraph, pIdx) => {
    // Handle bullet points
    if (paragraph.trim().startsWith("- ") || paragraph.trim().startsWith("* ")) {
      const items = paragraph.split(/\n/).filter((line) => line.trim());
      return (
        <ul key={pIdx} className="my-2 list-disc space-y-1 pl-4">
          {items.map((item, iIdx) => (
            <li key={iIdx}>{parseMarkdownLinks(item.replace(/^[-*]\s*/, ""))}</li>
          ))}
        </ul>
      );
    }

    // Handle numbered lists
    if (/^\d+\.\s/.test(paragraph.trim())) {
      const items = paragraph.split(/\n/).filter((line) => line.trim());
      return (
        <ol key={pIdx} className="my-2 list-decimal space-y-1 pl-4">
          {items.map((item, iIdx) => (
            <li key={iIdx}>
              {parseMarkdownLinks(item.replace(/^\d+\.\s*/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    // Handle code blocks
    if (paragraph.startsWith("```")) {
      const codeContent = paragraph.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      return (
        <pre
          key={pIdx}
          className="my-2 overflow-x-auto rounded bg-[color:var(--color-border)]/30 p-2 font-mono text-sm"
        >
          <code>{codeContent}</code>
        </pre>
      );
    }

    // Handle inline code and bold
    let processed: React.ReactNode = paragraph;

    // Replace **bold** with styled spans
    if (typeof processed === "string") {
      const boldParts = processed.split(/(\*\*[^*]+\*\*)/g);
      if (boldParts.length > 1) {
        processed = boldParts.map((part, idx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={idx} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Parse citations and links in non-bold parts
          const withLinks = parseMarkdownLinks(part);
          return withLinks.map((node) => {
            if (typeof node === "string") {
              return parseCitations(node);
            }
            return node;
          });
        });
      } else {
        const withLinks = parseMarkdownLinks(paragraph);
        processed = withLinks.map((node) => {
          if (typeof node === "string") {
            return parseCitations(node);
          }
          return node;
        });
      }
    }

    return (
      <p key={pIdx} className="my-1">
        {processed}
      </p>
    );
  });
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  // Strip context prefix from displayed content
  const displayContent = content.replace(/^\[Context: [^\]]+\]\s*/, "");

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      role="article"
      aria-label={`${isUser ? "You" : "Assistant"} said`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[color:var(--color-accent)] text-white"
            : "border border-[color:var(--color-border)] bg-[color:var(--color-card)]"
        }`}
      >
        <div className={`text-sm ${isUser ? "" : "text-[color:var(--color-text)]"}`}>
          {isUser ? displayContent : formatContent(displayContent)}
        </div>
        {timestamp && (
          <div
            className={`mt-1 text-xs ${
              isUser ? "text-white/70" : "text-[color:var(--color-muted)]"
            }`}
          >
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
}
