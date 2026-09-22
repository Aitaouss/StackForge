export type Preset = "dashboard" | "minimal" | "api";
export type Database = "postgresql" | "sqlite";
export type Runner = "npx" | "pnpm";

export type CreateCommandOptions = {
  runner: Runner;
  pinVersion: boolean;
  projectName: string;
  skipPrompts: boolean;
  preset: Preset;
  database: Database;
  docker: boolean;
  install: boolean;
  cwd: string;
};

/** Matches `create-stackforge-app -y` defaults. */
export const YES_MODE_DEFAULTS = {
  preset: "dashboard" as Preset,
  database: "postgresql" as Database,
  docker: true,
  install: true,
};

function sanitizeProjectName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "my-app";
  return trimmed.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") || "my-app";
}

export function buildCreateCommand(
  options: CreateCommandOptions,
  cliVersion: string,
): string {
  const projectName = sanitizeProjectName(options.projectName);
  const packageSpec = options.pinVersion
    ? `create-stackforge-app@${cliVersion}`
    : "create-stackforge-app@latest";
  const prefix = options.runner === "npx" ? "npx" : "pnpm dlx";
  const parts: string[] = [prefix, packageSpec, projectName];

  if (!options.skipPrompts) {
    return parts.join(" ");
  }

  parts.push("-y");

  if (options.preset !== YES_MODE_DEFAULTS.preset) {
    parts.push("-p", options.preset);
  }
  if (options.database !== YES_MODE_DEFAULTS.database) {
    parts.push("-d", options.database);
  }
  if (options.docker !== YES_MODE_DEFAULTS.docker) {
    parts.push(options.docker ? "--docker" : "--no-docker");
  }
  if (options.install !== YES_MODE_DEFAULTS.install) {
    parts.push(options.install ? "--install" : "--no-install");
  }

  const cwd = options.cwd.trim();
  if (cwd) {
    parts.push("-c", cwd);
  }

  return parts.join(" ");
}

/** Display tokens that wrap as units (keeps e.g. `my-app -y` on one line). */
export function buildCreateCommandParts(
  options: CreateCommandOptions,
  cliVersion: string,
): string[] {
  const projectName = sanitizeProjectName(options.projectName);
  const packageSpec = options.pinVersion
    ? `create-stackforge-app@${cliVersion}`
    : "create-stackforge-app@latest";
  const prefix = options.runner === "npx" ? "npx" : "pnpm dlx";
  const display: string[] = [`${prefix} ${packageSpec}`];

  if (!options.skipPrompts) {
    display.push(projectName);
    return display;
  }

  const flagParts: string[] = ["-y"];

  if (options.preset !== YES_MODE_DEFAULTS.preset) {
    flagParts.push("-p", options.preset);
  }
  if (options.database !== YES_MODE_DEFAULTS.database) {
    flagParts.push("-d", options.database);
  }
  if (options.docker !== YES_MODE_DEFAULTS.docker) {
    flagParts.push(options.docker ? "--docker" : "--no-docker");
  }
  if (options.install !== YES_MODE_DEFAULTS.install) {
    flagParts.push(options.install ? "--install" : "--no-install");
  }

  const cwd = options.cwd.trim();
  if (cwd) {
    flagParts.push("-c", cwd);
  }

  display.push(`${projectName} ${flagParts.join(" ")}`);
  return display;
}

export const BUILDER_DEFAULTS = {
  runner: "npx" as Runner,
  pinVersion: true,
  projectName: "my-app",
  scaffoldMode: "flags" as const,
  preset: YES_MODE_DEFAULTS.preset,
  database: YES_MODE_DEFAULTS.database,
  docker: YES_MODE_DEFAULTS.docker,
  install: YES_MODE_DEFAULTS.install,
  cwd: "",
};

export function presetSummary(preset: Preset): string {
  switch (preset) {
    case "api":
      return "NestJS API only — no apps/web";
    case "minimal":
      return "Web + API with a lighter dashboard";
    default:
      return "Full dashboard, auth UI, and user admin";
  }
}
