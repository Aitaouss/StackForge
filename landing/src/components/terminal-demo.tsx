"use client";

import { useEffect, useState } from "react";

const LINES = [
  { type: "prompt" as const, text: "? Project name › my-saas-app" },
  { type: "prompt" as const, text: "? Project description › A modern SaaS platform" },
  { type: "prompt" as const, text: "? Database › PostgreSQL" },
  { type: "prompt" as const, text: "? Enable Docker support? › Yes" },
  { type: "prompt" as const, text: "? Install dependencies automatically? › Yes" },
  { type: "info" as const, text: "Installing with pnpm..." },
  { type: "success" as const, text: "✔ Project created successfully!" },
  { type: "cmd" as const, text: "cd my-saas-app && pnpm dev" },
];

export function TerminalDemo() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= LINES.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 600);
    return () => clearTimeout(t);
  }, [visibleCount]);

  return (
    <div className="glass mx-auto max-w-2xl overflow-hidden rounded-xl shadow-glow-sm transition hover:border-emerald-500/20">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 font-mono text-xs text-zinc-500">create-stackforge-app</span>
      </div>
      <div className="space-y-1.5 p-4 font-mono text-sm">
        <p className="text-zinc-500">
          <span className="text-emerald-400">$</span> npx create-stackforge-app@latest
        </p>
        {LINES.slice(0, visibleCount).map((line, i) => (
          <p
            key={i}
            className={
              line.type === "success"
                ? "text-emerald-400"
                : line.type === "cmd"
                  ? "text-cyan-300"
                  : line.type === "info"
                    ? "text-zinc-400"
                    : "text-zinc-300"
            }
          >
            {line.text}
          </p>
        ))}
        {visibleCount < LINES.length && (
          <span className="inline-block h-4 w-2 animate-pulse bg-emerald-500/80" aria-hidden />
        )}
      </div>
    </div>
  );
}
