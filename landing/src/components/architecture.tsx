import { Reveal } from "@/components/motion/reveal";

const TREE = `my-app/
├── apps/
│   ├── api/              # NestJS + Prisma + JWT
│   └── web/              # Next.js 14 App Router
├── packages/
│   ├── contracts/        # Zod schemas + shared API types
│   ├── typescript-config/
│   ├── eslint-config/
│   └── ui/               # shared stub
├── .github/workflows/ci.yml
├── stackforge.json       # manifest v2
├── docker-compose.yml
├── AGENTS.md
└── pnpm-workspace.yaml`;

const POINTS = [
  {
    title: "Shared contracts",
    body: "packages/contracts defines Zod schemas and inferred types—nestjs-zod DTOs in apps/api and typed services in apps/web.",
  },
  {
    title: "Authentication included",
    body: "Register and login UI, JWT guards, /auth/me hydration, middleware, and hashed passwords—a secure baseline you can extend.",
  },
  {
    title: "Presets & diagnostics",
    body: "dashboard, minimal, or api-only scaffolds; then pnpm run doctor and pnpm run info inside the project.",
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Architecture at a glance
          </h2>
          <p className="mt-4 text-zinc-400">
            A pnpm workspace with apps/ and packages/ so the web app, API, contracts, and shared
            config stay easy to navigate.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.08} y={20}>
            <div className="glass overflow-hidden rounded-xl transition duration-300 hover:border-emerald-500/20">
              <div className="border-b border-white/10 px-4 py-2 font-mono text-xs text-zinc-500">
                project structure
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-emerald-200/90 sm:text-sm">
                {TREE}
              </pre>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {POINTS.map((point, index) => (
              <Reveal key={point.title} delay={0.12 + index * 0.08} y={16}>
                <div className="glass rounded-xl p-5 transition duration-300 hover:border-teal-500/20 hover:shadow-glow-sm">
                  <h3 className="font-semibold text-zinc-100">{point.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
