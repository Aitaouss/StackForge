import type { Database } from "./build-create-command";

export type ScaffoldStep = {
  command: string;
  label: string;
};

export function buildScaffoldSteps(options: {
  skipPrompts: boolean;
  install: boolean;
  database: Database;
  docker: boolean;
}): ScaffoldStep[] {
  if (!options.skipPrompts) {
    return [
      {
        command: "pnpm run db:setup",
        label: "After the wizard finishes, set up the database from the project root",
      },
      { command: "pnpm dev", label: "Start development (contracts + apps)" },
      { command: "pnpm run doctor", label: "Verify environment and manifest" },
    ];
  }

  const steps: ScaffoldStep[] = [];

  if (!options.install) {
    steps.push({ command: "pnpm install", label: "Install workspace dependencies" });
  }

  if (options.database === "postgresql" && options.docker) {
    steps.push({
      command: "docker compose up -d postgres",
      label: "Start Postgres from generated Compose before migrations",
    });
  }

  steps.push({
    command: "pnpm run db:setup",
    label: "Generate Prisma client and apply dev migrations",
  });

  steps.push({ command: "pnpm dev", label: "Run from project root (watches contracts)" });
  steps.push({ command: "pnpm run doctor", label: "Check Node, pnpm, env, and paths" });

  return steps;
}
