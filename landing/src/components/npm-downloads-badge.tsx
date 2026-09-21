import { Download } from "lucide-react";
import { formatWeeklyDownloads } from "@/lib/npm-downloads";
import { cn } from "@/lib/utils";

type NpmDownloadsBadgeProps = {
  downloads: number;
  className?: string;
  compact?: boolean;
};

export function NpmDownloadsBadge({
  downloads,
  className,
  compact = false,
}: NpmDownloadsBadgeProps) {
  const formatted = formatWeeklyDownloads(downloads);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 font-medium text-red-200/90",
        compact ? "h-7 rounded-md px-2 text-[10px]" : "px-3 py-1 text-xs",
        className,
      )}
      title="npm downloads in the last 7 days (api.npmjs.org)"
    >
      <Download className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")} aria-hidden />
      {compact ? (
        <span>{formatted}/wk</span>
      ) : (
        <span>
          <span className="text-red-100">{formatted}</span> npm downloads last week
        </span>
      )}
    </span>
  );
}
