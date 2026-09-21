"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CommandBlock } from "./command-block";
import { TrackedNpmLink } from "./tracked-npm-link";
import { NpmDownloadsBadge } from "./npm-downloads-badge";
import { TerminalDemo } from "./terminal-demo";
import { HeroFade } from "./motion/reveal";
import { CLI_VERSION, STACKFORGE_TAGLINE } from "@/data/product";

const PRIMARY_CMD = "npx create-stackforge-app@latest";

type HeroProps = {
  weeklyDownloads?: number | null;
};

export function Hero({ weeklyDownloads }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-0 grid-pattern opacity-40"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -18, 0],
                scale: [1, 1.04, 1],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 14, 0],
                y: [0, -10, 0],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <HeroFade delay={0.05}>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 shadow-glow-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Version {CLI_VERSION} · {STACKFORGE_TAGLINE}
              </p>
              {weeklyDownloads != null && <NpmDownloadsBadge downloads={weeklyDownloads} />}
            </div>
          </HeroFade>
          <HeroFade delay={0.15}>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Ship full-stack apps in seconds, not weekends
            </h1>
          </HeroFade>
          <HeroFade delay={0.25}>
            <p className="mt-6 text-pretty text-lg text-zinc-400 sm:text-xl">
              The opinionated CLI that scaffolds typed, end-to-end architectures. Next.js App
              Router, NestJS API, Prisma migrations, shadcn/ui, JWT auth, health checks, tests,
              Docker Compose, and generated GitHub Actions CI—out of the box.
            </p>
          </HeroFade>
        </div>

        <HeroFade delay={0.35} className="mx-auto mt-10 max-w-2xl">
          <CommandBlock command={PRIMARY_CMD} elevated />
        </HeroFade>

        <HeroFade delay={0.45}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <TrackedNpmLink
              source="hero"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02] hover:bg-emerald-400"
            >
              View on npm
              <ArrowRight className="h-4 w-4" aria-hidden />
            </TrackedNpmLink>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            >
              Read documentation
            </Link>
          </div>
        </HeroFade>

        <HeroFade delay={0.55} className="mt-16">
          <TerminalDemo />
        </HeroFade>
      </div>
    </section>
  );
}
