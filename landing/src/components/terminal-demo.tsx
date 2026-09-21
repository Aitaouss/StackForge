"use client";

import { useEffect, useState } from "react";
import { PRIMARY_INSTALL_CMD } from "@/data/product";
import { cn } from "@/lib/utils";

type DemoLine =
  | { kind: "prompt"; label: string; value: string }
  | { kind: "info"; text: string }
  | { kind: "success"; text: string }
  | { kind: "cmd"; text: string };

const LINES: DemoLine[] = [
  { kind: "prompt", label: "Project name", value: "my-saas-app" },
  { kind: "prompt", label: "Project description", value: "A modern SaaS platform" },
  { kind: "prompt", label: "Database", value: "PostgreSQL" },
  { kind: "prompt", label: "Enable Docker support?", value: "Yes" },
  { kind: "prompt", label: "Install dependencies automatically?", value: "Yes" },
  { kind: "info", text: "Installing with pnpm..." },
  { kind: "success", text: "Project created successfully!" },
  { kind: "cmd", text: "cd my-saas-app && pnpm dev" },
];

function PromptLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="leading-relaxed">
      <span className="text-violet-400/90">?</span>{" "}
      <span className="text-zinc-500">{label}</span>{" "}
      <span className="text-zinc-600">›</span>{" "}
      <span className="text-zinc-50">{value}</span>
    </p>
  );
}

function DemoLineView({ line }: { line: DemoLine }) {
  switch (line.kind) {
    case "prompt":
      return <PromptLine label={line.label} value={line.value} />;
    case "info":
      return <p className="leading-relaxed text-zinc-400">{line.text}</p>;
    case "success":
      return (
        <p className="leading-relaxed text-emerald-400">
          <span aria-hidden>✔ </span>
          {line.text}
        </p>
      );
    case "cmd":
      return <p className="leading-relaxed text-cyan-300/90">{line.text}</p>;
  }
}

type TerminalDemoProps = {
  className?: string;
};

export function TerminalDemo({ className }: TerminalDemoProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= LINES.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 600);
    return () => clearTimeout(t);
  }, [visibleCount]);

  return (
    <div
      className={cn(
        "glass mx-auto w-full max-w-2xl overflow-hidden rounded-xl shadow-glow-sm transition hover:border-emerald-500/20",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/45" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/45" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/45" />
        </div>
        <span className="ml-1 font-mono text-xs text-zinc-500">create-stackforge-app</span>
      </div>
      <div className="space-y-2 p-4 font-mono text-sm leading-relaxed">
        <p className="text-zinc-500">
          <span className="text-emerald-400/90">$</span>{" "}
          <span className="text-emerald-300/90">{PRIMARY_INSTALL_CMD}</span>
        </p>
        {LINES.slice(0, visibleCount).map((line, i) => (
          <DemoLineView key={i} line={line} />
        ))}
        {visibleCount < LINES.length && (
          <span className="inline-block h-4 w-2 animate-pulse bg-emerald-500/80" aria-hidden />
        )}
      </div>
    </div>
  );
}
