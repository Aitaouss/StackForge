import { CommandBlock } from "./command-block";

export function UsageDocs() {
  return (
    <section id="usage" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          How to use create-stackforge-app
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Install nothing globally—run via npx. Generated apps use pnpm workspaces (Node 18+).
        </p>

        <div className="mt-12 space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">1. Scaffold a new project</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Answer prompts for name, description, database, Docker, and dependency installation.
            </p>
            <div className="mt-4">
              <CommandBlock command="npx create-stackforge-app@latest" elevated />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-100">2. Enable pnpm (if needed)</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Corepack ships with Node.js and can activate pnpm for generated projects.
            </p>
            <div className="mt-4 space-y-3">
              <CommandBlock command="corepack enable" />
              <CommandBlock command="corepack prepare pnpm@9 --activate" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-100">3. Run the generated app</h3>
            <div className="mt-4 space-y-3">
              <CommandBlock command="cd my-app && pnpm install && pnpm dev" />
              <CommandBlock command="cd my-app && docker compose up -d" />
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Use Docker when you scaffolded with Docker support and PostgreSQL.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-100">4. Develop the CLI itself</h3>
            <p className="mt-2 text-sm text-zinc-400">
              From the StackForge repository root, build and run the local binary.
            </p>
            <div className="mt-4 space-y-3">
              <CommandBlock command="pnpm install" />
              <CommandBlock command="pnpm run build" />
              <CommandBlock command="node ./bin/create-stackforge-app.js" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
