import fs from "fs-extra";
import execa from "execa";
import { ProjectConfig } from "../types/index.js";
import { apiDir, featuresForPreset, resolvePreset } from "../layout.js";
import { generateApi } from "./api.js";
import { generateWeb } from "./web.js";
import { generatePackages } from "./packages.js";
import { generateCommonFiles } from "./common.js";
import { generateDockerFiles } from "./docker.js";
import { ensureEmptyDir } from "../utils/file.js";
import { generateJwtSecret } from "../utils/jwt-secret.js";
import { spinner, success, info, error } from "../utils/logger.js";

export async function generateProject(config: ProjectConfig): Promise<void> {
  const projectConfig: ProjectConfig = {
    ...config,
    preset: resolvePreset(config),
    jwtSecret: config.jwtSecret ?? generateJwtSecret(),
  };
  const features = featuresForPreset(projectConfig.preset!);
  const createSpinner = spinner("Creating project directory...");
  createSpinner.start();

  try {
    await ensureEmptyDir(projectConfig.targetDir);
    createSpinner.succeed(
      `Created project directory: ${projectConfig.projectName}`,
    );
  } catch (err) {
    createSpinner.fail("Failed to create project directory");
    throw err;
  }

  try {
    await runStep("Generating shared packages...", () =>
      generatePackages(projectConfig),
    );
    await runStep("Generating API (NestJS)...", () =>
      generateApi(projectConfig),
    );
    if (features.web) {
      await runStep("Generating web (Next.js)...", () =>
        generateWeb(projectConfig),
      );
    }
    await runStep("Generating shared files...", () =>
      generateCommonFiles(projectConfig),
    );
    await runStep("Generating Docker files...", () =>
      generateDockerFiles(projectConfig),
    );
  } catch (err) {
    await cleanup(projectConfig.targetDir);
    throw err;
  }

  if (projectConfig.installDependencies) {
    try {
      await runStep("Installing dependencies...", () =>
        installDependencies(projectConfig.targetDir),
      );
      await runStep("Generating Prisma client...", () =>
        runPrismaGenerate(apiDir(projectConfig.targetDir)),
      );
    } catch (err) {
      error(
        "Dependency installation failed. You can install them manually by running `pnpm install` in the project directory.",
      );
      throw err;
    }
  }

  printSuccess(projectConfig, features.web);
}

async function runStep<T>(message: string, fn: () => Promise<T>): Promise<T> {
  const stepSpinner = spinner(message);
  stepSpinner.start();

  try {
    const result = await fn();
    stepSpinner.succeed(message.replace("...", ""));
    return result;
  } catch (err) {
    stepSpinner.fail(message.replace("...", ""));
    throw err;
  }
}

async function installDependencies(cwd: string): Promise<void> {
  try {
    await execa("corepack", ["enable"], { cwd, stdio: "ignore" });
  } catch {
    // corepack may already be enabled or unavailable; pnpm install below will surface real errors
  }
  await execa("pnpm", ["install"], { cwd, stdio: "ignore" });
}

async function runPrismaGenerate(cwd: string): Promise<void> {
  await execa("pnpm", ["prisma", "generate"], {
    cwd,
    stdio: "ignore",
  });
}

async function cleanup(targetDir: string): Promise<void> {
  try {
    await fs.remove(targetDir);
  } catch {
    // ignore cleanup errors
  }
}

function printSuccess(config: ProjectConfig, includeWeb: boolean): void {
  success(`Successfully created ${config.projectName}`);
  info(`Location: ${config.targetDir}`);
  info(`Preset: ${config.preset}`);
  info("");
  info("Next steps:");
  info(`  cd ${config.projectName}`);

  if (!config.installDependencies) {
    info("  pnpm install");
  }

  if (config.database === "postgresql") {
    if (config.docker) {
      info("  docker compose up -d postgres");
    } else {
      info("  Start PostgreSQL and verify apps/api/.env DATABASE_URL");
    }
  }

  info("  pnpm run db:setup");
  info("  pnpm dev");

  if (config.docker) {
    info("  Or run the full stack: docker compose up --build -d");
  }
  info("");
  if (includeWeb) {
    info("Web: http://localhost:3002");
  }
  info("API: http://localhost:3001");
  info("API Docs: http://localhost:3001/docs");
  info("Diagnostics: pnpm run doctor");
  if (config.database === "postgresql" && config.docker) {
    info("Prisma Studio: http://localhost:5555 (via docker compose up -d)");
  } else {
    info(
      "Prisma Studio: http://localhost:5555 (run 'pnpm db:studio' in apps/api/)",
    );
  }
}
