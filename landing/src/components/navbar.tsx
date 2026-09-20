import { Anvil, ExternalLink, Github, Star } from "lucide-react";
import Link from "next/link";
import { NpmDownloadsBadge } from "./npm-downloads-badge";
import { TrackedGitHubLink } from "./tracked-github-link";
import { TrackedNpmLink } from "./tracked-npm-link";
import { CLI_VERSION } from "@/data/product";

const NAV = [
  { href: "/#stack", label: "Stack" },
  { href: "/#features", label: "Features" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#cli", label: "CLI Flags" },
  { href: "/docs", label: "Docs" },
] as const;

type NavbarProps = {
  weeklyDownloads?: number | null;
};

export function Navbar({ weeklyDownloads }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Anvil className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-semibold tracking-tight text-zinc-50">StackForge</span>
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" />
            v{CLI_VERSION}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {weeklyDownloads != null && (
            <NpmDownloadsBadge downloads={weeklyDownloads} compact className="hidden lg:inline-flex" />
          )}
          <TrackedGitHubLink
            source="navbar"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/10"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            <Star className="h-3 w-3 text-amber-400" aria-hidden />
            <span className="hidden sm:inline">GitHub</span>
          </TrackedGitHubLink>
          <TrackedNpmLink
            source="navbar"
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:border-red-500/50 hover:bg-red-500/20"
          >
            npm
            <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
          </TrackedNpmLink>
        </div>
      </div>
    </header>
  );
}
