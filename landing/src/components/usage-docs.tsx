import Link from "next/link";
import { CommandBlock } from "./command-block";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    title: "1. Scaffold a new project",
    body: "Answer prompts for name, description, database, Docker, and dependency installation.",
    blocks: [{ command: "npx create-stackforge-app@latest", elevated: true }],
  },
  {
    title: "2. Enable pnpm (if needed)",
    body: "Corepack ships with Node.js and can activate pnpm for generated projects.",
    blocks: [{ command: "corepack enable" }, { command: "corepack prepare pnpm@9 --activate" }],
  },
  {
    title: "3. Run the generated app",
    body: "Run development commands from the project root so packages/contracts is built and watched.",
    blocks: [
      { command: "cd my-app && pnpm install && pnpm dev" },
      { command: "cd my-app && docker compose up -d" },
    ],
    footer: "Use Docker when you scaffolded with Docker support and PostgreSQL.",
  },
  {
    title: "4. Verify and customize",
    body: "Check diagnostics, then extend auth, API routes, or UI from the monorepo baseline.",
    blocks: [
      { command: "cd my-app && npx stackforge doctor" },
      { command: "cd my-app && npx stackforge info" },
    ],
    footerLink: true,
  },
];

export function UsageDocs() {
  return (
    <section id="usage" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            How to use create-stackforge-app
          </h2>
          <p className="mt-4 text-zinc-400">
            Install nothing globally—run via npx. Generated apps use pnpm workspaces (Node 18+).{" "}
            <Link
              href="/docs"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              Full documentation →
            </Link>
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={0.08 + index * 0.06} y={18}>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">{step.title}</h3>
                {"body" in step && step.body ? (
                  <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
                ) : null}
                <div className="mt-4 space-y-3">
                  {step.blocks.map((block) => (
                    <CommandBlock
                      key={block.command}
                      command={block.command}
                      elevated={"elevated" in block ? block.elevated : undefined}
                    />
                  ))}
                </div>
                {"footer" in step && step.footer ? (
                  <p className="mt-3 text-sm text-zinc-500">{step.footer}</p>
                ) : null}
                {"footerLink" in step && step.footerLink ? (
                  <p className="mt-3 text-sm text-zinc-500">
                    Read{" "}
                    <Link href="/docs" className="text-emerald-400 underline underline-offset-2">
                      full documentation
                    </Link>{" "}
                    for presets, contracts, and Docker.
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
