import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { CommandBlock } from "./command-block";
import { NpmDownloadsBadge } from "./npm-downloads-badge";
import { TerminalDemo } from "./terminal-demo";

const PRIMARY_CMD = "npx create-stackforge-app@latest";
const NPM_URL = "https://www.npmjs.com/package/create-stackforge-app";

type HeroProps = {
  weeklyDownloads?: number | null;
};

export function Hero({ weeklyDownloads }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-0 grid-pattern opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 shadow-glow-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Version 1.0.8 · Production-ready fullstack scaffolding
            </p>
            {weeklyDownloads != null && <NpmDownloadsBadge downloads={weeklyDownloads} />}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Ship full-stack apps in seconds, not weekends
          </h1>
          <p className="mt-6 text-pretty text-lg text-zinc-400 sm:text-xl">
            The opinionated CLI that scaffolds typed, end-to-end architectures. Next.js App
            Router, NestJS API, Prisma ORM, shadcn/ui, JWT auth, Docker, and pnpm workspaces—out
            of the box.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <CommandBlock command={PRIMARY_CMD} elevated />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02] hover:bg-emerald-400"
          >
            View on npm
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="#usage"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Read documentation
          </a>
        </div>

        <div className="mt-16">
          <TerminalDemo />
        </div>
      </div>
    </section>
  );
}
