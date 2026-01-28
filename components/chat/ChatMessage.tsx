"use client";

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

    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        className="font-medium text-[color:var(--color-accent)] underline underline-offset-2 hover:text-[color:var(--color-accent-2)]"
        target={match[2].startsWith("http") ? "_blank" : undefined}
        rel={match[2].startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {match[1]}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
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
          className="my-2 overflow-x-auto rounded bg-neutral-100 p-2 font-mono text-sm"
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
          return parseMarkdownLinks(part);
        });
      } else {
        processed = parseMarkdownLinks(paragraph);
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

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[color:var(--color-accent)] text-white"
            : "border border-[color:var(--color-border)] bg-white"
        }`}
      >
        <div className={`text-sm ${isUser ? "" : "text-[color:var(--color-ink)]"}`}>
          {isUser ? content : formatContent(content)}
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
