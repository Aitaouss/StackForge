import {
  Box,
  Database,
  Layers,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Layers,
    title: "Full-stack monorepo",
    description:
      "pnpm workspaces wire Next.js 14 (App Router) and NestJS with a clean separation between frontend and API.",
    className: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Turnkey authentication",
    description:
      "JWT registration, login, guards, and protected users API—ready to extend for your product.",
  },
  {
    icon: Database,
    title: "Prisma + multi-DB",
    description:
      "PostgreSQL or SQLite with migrations, Prisma Studio in Docker for PostgreSQL setups.",
  },
  {
    icon: Sparkles,
    title: "Production UI",
    description: "Tailwind CSS and shadcn/ui components with Lucide icons pre-configured.",
  },
  {
    icon: Box,
    title: "Containerization",
    description:
      "Optional docker-compose for database, backend, frontend, and Prisma Studio services.",
    className: "md:col-span-2",
  },
  {
    icon: Terminal,
    title: "CI-friendly CLI",
    description:
      "Non-interactive flags for pipelines: -y, --database, --docker, --install, and --cwd.",
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
            One command generates a typed full-stack foundation—no weeks of boilerplate wiring.
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
