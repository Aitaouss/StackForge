"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  /** Full label shown in a tooltip on hover/focus. */
  tooltip?: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  wrapLabels?: boolean;
};

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  size = "md",
  wrapLabels = false,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className={cn("min-w-0 space-y-1.5", className)}>
      <legend className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </legend>
      <div
        className={cn(
          "grid w-full min-w-0 gap-1 rounded-lg border border-white/10 bg-zinc-950/80 p-1",
          size === "sm" && "p-0.5",
        )}
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        role="group"
        aria-label={label}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          const button = (
            <button
              type="button"
              aria-pressed={selected}
              aria-label={opt.tooltip ?? opt.label}
              onClick={() => onChange(opt.value)}
              className={cn(
                "min-w-0 w-full rounded-md px-1.5 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-400",
                size === "sm"
                  ? "py-1.5 text-[11px] leading-tight sm:text-xs"
                  : "py-2 text-xs leading-tight sm:text-sm",
                selected
                  ? "border border-emerald-400/70 bg-emerald-500/25 text-emerald-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-200",
              )}
            >
              <span
                className={cn(
                  "block",
                  wrapLabels ? "whitespace-normal break-words leading-snug" : "truncate",
                )}
              >
                {opt.label}
              </span>
            </button>
          );

          if (!opt.tooltip) {
            return <div key={opt.value}>{button}</div>;
          }

          return (
            <Tooltip key={opt.value}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="top">{opt.tooltip}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </fieldset>
  );
}
