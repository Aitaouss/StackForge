"use client";

import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

type CommandBlockProps = {
  command: string;
  className?: string;
  elevated?: boolean;
};

export function CommandBlock({ command, className, elevated }: CommandBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-950/80 p-4 sm:flex-row sm:items-center sm:justify-between",
        elevated && "shadow-glow border-emerald-500/20",
        className,
      )}
    >
      <code className="font-mono text-sm text-emerald-300/90 sm:text-base">{command}</code>
      <CopyButton text={command} />
    </div>
  );
}
