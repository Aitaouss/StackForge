import type { ReactNode } from "react";
import type { Database, Preset } from "@/lib/build-create-command";
import { cn } from "@/lib/utils";

type ConfigSummaryBadgesProps = {
  skipPrompts: boolean;
  preset: Preset;
  database: Database;
  docker: boolean;
  install: boolean;
  className?: string;
};

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium capitalize text-zinc-300">
      {children}
    </span>
  );
}

export function ConfigSummaryBadges({
  skipPrompts,
  preset,
  database,
  docker,
  install,
  className,
}: ConfigSummaryBadgesProps) {
  if (!skipPrompts) {
    return (
      <p className={cn("text-xs text-zinc-500", className)}>Interactive wizard — flags chosen in the terminal.</p>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <Badge>{preset}</Badge>
      <Badge>{database === "postgresql" ? "PostgreSQL" : "SQLite"}</Badge>
      <Badge>{docker ? "Docker included" : "No Docker files"}</Badge>
      <Badge>{install ? "Dependencies installed" : "Skip install"}</Badge>
    </div>
  );
}
