const TREE = `my-app/
├── backend/           # NestJS + JWT + Prisma
│   ├── src/auth/
│   ├── src/users/
│   └── prisma/schema.prisma
├── frontend/          # Next.js 14 App Router
│   ├── src/app/
│   └── src/components/ui/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── README.md
└── .env.example`;

const POINTS = [
  {
    title: "Typed API boundary",
    body: "Axios services on the frontend talk to NestJS controllers with DTO validation on every route.",
  },
  {
    title: "Auth end-to-end",
    body: "Register and login pages, JWT strategy, guards, and protected user endpoints included.",
  },
  {
    title: "Deploy your way",
    body: "Run locally with pnpm dev or bring up PostgreSQL and services with docker compose up -d.",
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          Architecture at a glance
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          A deliberate monorepo layout so frontend, backend, and infrastructure stay easy to navigate.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="glass overflow-hidden rounded-xl">
            <div className="border-b border-white/10 px-4 py-2 font-mono text-xs text-zinc-500">
              project structure
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-emerald-200/90 sm:text-sm">
              {TREE}
            </pre>
          </div>

          <div className="flex flex-col gap-4">
            {POINTS.map((point) => (
              <div
                key={point.title}
                className="glass rounded-xl p-5 transition hover:border-teal-500/20"
              >
                <h3 className="font-semibold text-zinc-100">{point.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
