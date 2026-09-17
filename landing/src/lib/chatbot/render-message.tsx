import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-zinc-100">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[0.85em] text-emerald-300"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = href.startsWith("http");
        parts.push(
          external ? (
            <a
              key={`${keyPrefix}-l-${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              {label}
            </a>
          ) : (
            <Link
              key={`${keyPrefix}-l-${i}`}
              href={href}
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              {label}
            </Link>
          ),
        );
      }
    }
    lastIndex = match.index + token.length;
    i += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
}

export function RenderBotMessage({ content }: { content: string }) {
  const segments = content.split("```");
  const nodes: ReactNode[] = [];

  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      nodes.push(
        <pre
          key={`code-${index}`}
          className="my-2 overflow-x-auto rounded-lg border border-white/10 bg-zinc-950 p-3 font-mono text-xs text-emerald-200/90"
        >
          <code>{segment.trim()}</code>
        </pre>,
      );
      return;
    }

    const lines = segment.split("\n");
    let listBuffer: string[] = [];

    const flushList = () => {
      if (!listBuffer.length) return;
      nodes.push(
        <ul key={`ul-${index}-${nodes.length}`} className="my-2 list-disc space-y-1 pl-4 text-sm">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="text-zinc-300">
              {renderInline(item, `li-${index}-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    };

    lines.forEach((line, li) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ")) {
        listBuffer.push(trimmed.slice(2));
        return;
      }
      flushList();
      if (!trimmed) return;
      nodes.push(
        <p key={`p-${index}-${li}`} className="text-sm leading-relaxed text-zinc-300">
          {renderInline(line, `p-${index}-${li}`)}
        </p>,
      );
    });
    flushList();
  });

  return <div className="space-y-1">{nodes}</div>;
}
