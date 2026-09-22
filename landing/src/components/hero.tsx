"use client";

import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CommandBlock } from "./command-block";
import { TrackedGitHubLink } from "./tracked-github-link";
import { TrackedNpmLink } from "./tracked-npm-link";
import { TerminalDemo } from "./terminal-demo";
import { HeroFade } from "./motion/reveal";
import { CLI_VERSION, PRIMARY_INSTALL_CMD, RELEASE_NOTES_URL } from "@/data/product";

/** Shared width for hero copy, command bar, and terminal */
const HERO_CONTENT_WIDTH = "mx-auto w-full max-w-3xl";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.35]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.14),transparent_55%)]"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-8 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-3xl"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -14, 0],
                scale: [1, 1.03, 1],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[360px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-3xl"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 12, 0],
                y: [0, -8, 0],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className={`${HERO_CONTENT_WIDTH} text-center`}>
          <HeroFade delay={0.05}>
            <TrackedGitHubLink
              source="hero"
              href={RELEASE_NOTES_URL}
              className="group mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 shadow-glow-sm transition hover:border-emerald-400/40 hover:bg-emerald-500/15"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              What&apos;s new in v{CLI_VERSION}
              <ExternalLink
                className="h-3 w-3 opacity-60 transition group-hover:opacity-100"
                aria-hidden
              />
            </TrackedGitHubLink>
          </HeroFade>
          <HeroFade delay={0.12}>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Ship full-stack apps in seconds, not weekends
            </h1>
          </HeroFade>
          <HeroFade delay={0.2}>
            <p className="mt-6 w-full text-pretty text-lg leading-relaxed text-zinc-400 sm:text-xl">
              The opinionated CLI that scaffolds typed, end-to-end architectures. Shared Zod
              contracts, Next.js App Router, NestJS API, Prisma migrations, shadcn/ui, JWT auth,
              health checks, tests, optional production Docker images, and generated GitHub Actions
              CI—out of the box.
            </p>
          </HeroFade>
        </div>

        <HeroFade delay={0.28} className={`${HERO_CONTENT_WIDTH} mt-10`}>
          <CommandBlock command={PRIMARY_INSTALL_CMD} elevated variant="bar" />
        </HeroFade>

        <HeroFade delay={0.35}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02] hover:bg-emerald-400"
            >
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <TrackedNpmLink
              source="hero"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            >
              View on npm
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </TrackedNpmLink>
          </div>
        </HeroFade>

        <HeroFade delay={0.45} className={`${HERO_CONTENT_WIDTH} relative mt-14`}>
          <TerminalDemo className="max-w-none" />
        </HeroFade>
      </div>
    </section>
  );
}
