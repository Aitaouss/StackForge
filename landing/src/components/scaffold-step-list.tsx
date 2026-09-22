"use client";

import type { ScaffoldStep } from "@/lib/build-scaffold-steps";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

type ScaffoldStepListProps = {
  steps: ScaffoldStep[];
  className?: string;
};

export function ScaffoldStepList({ steps, className }: ScaffoldStepListProps) {
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, index) => (
        <li
          key={`${step.command}-${index}`}
          className="group flex gap-3 border-b border-white/5 py-3.5 last:border-b-0"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-300"
            aria-hidden
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-400">{step.label}</p>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/5 bg-zinc-900/80 px-2.5 py-2">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-emerald-300/95 sm:break-normal sm:text-sm">
                {step.command}
              </code>
              <CopyButton text={step.command} label="Copy step" className="shrink-0" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
