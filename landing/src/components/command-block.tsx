"use client";

import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

type CommandBlockProps = {
  command: string;
  commandParts?: string[];
  className?: string;
  elevated?: boolean;
  showShellPrompt?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  /** Hero/docs bar (single line, centered). Default: panel layout for /build. */
  variant?: "bar" | "panel";
};

export function CommandBlock({
  command,
  commandParts,
  className,
  elevated,
  showShellPrompt,
  header,
  footer,
  variant = "panel",
}: CommandBlockProps) {
  if (variant === "bar") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-950/80 p-4 sm:flex-row sm:items-center sm:justify-between",
          elevated && "shadow-glow border-emerald-500/20",
          className,
        )}
      >
        <code className="min-w-0 break-all text-center font-mono text-xs text-emerald-300/90 sm:break-normal sm:text-left sm:text-sm md:text-base">
          {command}
        </code>
        <CopyButton text={command} className="shrink-0 self-center" />
      </div>
    );
  }

  const parts = commandParts?.length ? commandParts : [command];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-zinc-950/90",
        elevated
          ? "border-emerald-500/40 shadow-[0_0_28px_rgba(16,185,129,0.18),0_0_1px_rgba(16,185,129,0.4)]"
          : "border-white/10",
        className,
      )}
    >
      {header && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 px-4 py-2.5">
          {header}
        </div>
      )}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {showShellPrompt && (
            <span className="mt-0.5 shrink-0 select-none font-mono text-sm text-zinc-600" aria-hidden>
              $
            </span>
          )}
          <code className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs leading-relaxed text-emerald-200/95 sm:text-sm">
            {parts.map((part, i) => (
              <span key={`${part}-${i}`} className="whitespace-nowrap">
                {part}
              </span>
            ))}
          </code>
        </div>
        <CopyButton text={command} className="w-full shrink-0 sm:w-auto" />
      </div>
      {footer && <div className="border-t border-white/5 px-4 py-3">{footer}</div>}
    </div>
  );
}
