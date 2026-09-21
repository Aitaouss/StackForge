"use client";

import { Anvil, ExternalLink, Github, Star } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md"
      initial={reduceMotion ? false : { y: -16, opacity: 0 }}
      animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Anvil className="h-4 w-4" aria-hidden />
          </span>
          <span className="truncate font-semibold tracking-tight text-zinc-50">StackForge</span>
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

        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/50 p-1">
          {weeklyDownloads != null && (
            <NpmDownloadsBadge downloads={weeklyDownloads} compact className="hidden sm:inline-flex" />
          )}
          <TrackedGitHubLink
            source="navbar"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-zinc-300 transition hover:bg-white/5 hover:text-zinc-100 sm:px-2.5"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            <Star className="h-3 w-3 text-amber-400" aria-hidden />
            <span className="hidden sm:inline">GitHub</span>
          </TrackedGitHubLink>
          <TrackedNpmLink
            source="navbar"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 text-xs font-medium text-red-200 transition hover:border-red-500/35 hover:bg-red-500/15 sm:px-2.5"
          >
            npm
            <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
          </TrackedNpmLink>
        </div>
      </div>

      <nav
        className="myscroll flex gap-4 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden"
        aria-label="Main mobile"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 whitespace-nowrap text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
