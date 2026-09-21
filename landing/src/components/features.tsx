"use client";

import {
  Activity,
  Box,
  Database,
  FileCode2,
  Layers,
  ShieldCheck,
  TestTube2,
  Terminal,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    icon: Layers,
    title: "Full-stack monorepo",
    description:
      "pnpm workspaces under apps/web and apps/api plus packages/* — shared dev, lint, typecheck, test, and build scripts.",
    className: "sm:col-span-2",
  },
  {
    icon: FileCode2,
    title: "Shared Zod contracts",
    description:
      "packages/contracts keeps NestJS DTO validation and web API types aligned—one source of truth for auth and users.",
  },
  {
    icon: ShieldCheck,
    title: "Secure auth baseline",
    description:
      "End-to-end JWT authentication: bcrypt passwords, /auth/me hydration, login redirects, and protected users API.",
  },
  {
    icon: Database,
    title: "Prisma migrations",
    description:
      "PostgreSQL or SQLite with migrate deploy, Docker Postgres on :5433, and Prisma Studio in compose (localhost-only).",
  },
  {
    icon: Activity,
    title: "Production baseline",
    description:
      "GET /health, Zod env validation, Helmet, rate limits, request IDs, and consistent API error responses.",
  },
  {
    icon: TestTube2,
    title: "Tests & CI template",
    description:
      "Jest unit tests, Supertest e2e, ESLint on web and API, plus .github/workflows/ci.yml in every app.",
  },
  {
    icon: Box,
    title: "Docker that runs",
    description:
      "Multi-stage production images for API and web, PostgreSQL health checks, migrations, and localhost-only Prisma Studio.",
  },
  {
    icon: Terminal,
    title: "CLI, presets & manifest",
    description:
      "--preset dashboard | minimal | api, stackforge.json v2, stackforge doctor/info, and AGENTS.md for tooling.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

export function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Everything you need to start shipping
          </h2>
          <p className="mt-4 text-zinc-400">
            One command generates a typed full-stack foundation—shared contracts, auth, data layer,
            security, tests, and deploy paths included.
          </p>
        </Reveal>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          {FEATURES.map((feature) => (
            <motion.article
              key={feature.title}
              variants={reduceMotion ? undefined : cardVariants}
              className={cn(
                "glass group rounded-xl p-6 transition duration-300 hover:scale-[1.01] hover:border-emerald-500/25 hover:shadow-glow-sm",
                feature.className,
              )}
            >
              <feature.icon
                className="h-8 w-8 text-emerald-400/90 transition group-hover:scale-105 group-hover:text-emerald-300"
                aria-hidden
              />
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
