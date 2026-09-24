import { Command } from "commander";
import { runGenerateResource } from "../resource/generate.js";
import { error } from "../utils/logger.js";

export interface GenerateResourceCliOptions {
  cwd: string;
  field?: string[];
  dryRun?: boolean;
}

export function registerGenerateResourceCommand(program: Command): void {
  const generate = program
    .command("generate")
    .description("Generate code in an existing project");
  generate.alias("g");

  generate
    .command("resource")
    .description("Add a CRUD resource (Prisma + Nest + contracts)")
    .argument("<name>", "Resource name (singular, e.g. post)")
    .option("-c, --cwd <cwd>", "project root directory", process.cwd())
    .option(
      "--field <def>",
      "Field: name:type:required (string|int|float|decimal)",
      (value: string, prev: string[] = []) => [...prev, value],
      [],
    )
    .option("--dry-run", "Print planned file changes without writing", false)
    .action(async (name: string, options: GenerateResourceCliOptions) => {
      try {
        await runGenerateResource({
          cwd: options.cwd,
          name,
          fields: options.field ?? [],
          dryRun: Boolean(options.dryRun),
        });
      } catch (err) {
        error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
