import {
  Activity,
  Box,
  Database,
  Layers,
  ShieldCheck,
  TestTube2,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Layers,
    title: "Full-stack monorepo",
    description:
      "pnpm workspaces wire Next.js 14 (App Router) and NestJS 10 with shared scripts: dev, lint, typecheck, test, and build.",
    className: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Auth you can trust",
    description:
      "Bcrypt passwords, random JWT_SECRET per project, /auth/me hydration, login redirects, and protected users API.",
  },
  {
    icon: Database,
    title: "Prisma migrations",
    description:
      "PostgreSQL or SQLite with migrate deploy, Docker Postgres on :5433, and Prisma Studio in compose.",
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
      "Jest unit tests, Supertest e2e, ESLint on frontend and backend, plus .github/workflows/ci.yml in every app.",
  },
  {
    icon: Box,
    title: "Docker that runs",
    description:
      "docker compose up --build for Postgres, API, Next.js, and Studio—fixed in v1.1.1 for production start.",
    className: "md:col-span-2",
  },
  {
    icon: Terminal,
    title: "CLI & manifest",
    description:
      "Non-interactive flags (-y, --database, --docker), stackforge.json, and AGENTS.md for tooling and extend workflows.",
    className: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Everything you need to start shipping
          </h2>
          <p className="mt-4 text-zinc-400">
            One command generates a typed full-stack foundation—auth, data layer, security, tests,
            and deploy paths included.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "glass group rounded-xl p-6 transition duration-300 hover:scale-[1.01] hover:border-emerald-500/25 hover:shadow-glow-sm",
                feature.className,
              )}
            >
              <feature.icon
                className="h-8 w-8 text-emerald-400/90 transition group-hover:text-emerald-300"
                aria-hidden
              />
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
