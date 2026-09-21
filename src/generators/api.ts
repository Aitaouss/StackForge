import fs from "fs-extra";
import path from "path";
import { ProjectConfig } from "../types/index.js";
import {
  apiDir,
  featuresForPreset,
  npmScope,
  resolvePreset,
} from "../layout.js";
import { renderTemplate, getTemplatePath } from "../utils/file.js";

async function copyPrismaMigrations(
  config: ProjectConfig,
  apiRoot: string,
  templateDir: string,
): Promise<void> {
  const provider = config.database === "postgresql" ? "postgresql" : "sqlite";
  const migrationsDir = path.join(apiRoot, "prisma", "migrations");
  const initDir = path.join(migrationsDir, "20250319000000_init");

  await fs.ensureDir(initDir);

  const lockFile =
    provider === "postgresql"
      ? "migration_lock.toml"
      : "migration_lock.sqlite.toml";

  await fs.copy(
    path.join(templateDir, "prisma", "migrations", lockFile),
    path.join(migrationsDir, "migration_lock.toml"),
  );

  await fs.copy(
    path.join(
      templateDir,
      "prisma",
      "migrations",
      "20250319000000_init",
      `migration.${provider}.sql`,
    ),
    path.join(initDir, "migration.sql"),
  );
}

export async function generateApi(config: ProjectConfig): Promise<void> {
  const apiRoot = apiDir(config.targetDir);
  const templateDir = getTemplatePath("api");
  const preset = resolvePreset(config);
  const features = featuresForPreset(preset);
  const scope = npmScope(config.projectName);

  const data = {
    projectName: config.projectName,
    projectDescription: config.projectDescription,
    database: config.database,
    databaseUrl:
      config.database === "postgresql"
        ? "postgresql://postgres:postgres@localhost:5433/app"
        : "file:./dev.db",
    jwtSecret: config.jwtSecret,
    scope,
    includeUserAdmin: features.userAdmin,
    includeProfileApi: features.profilePages,
  };

  const files: { template: string; output: string }[] = [
    {
      template: "package.json.ejs",
      output: path.join(apiRoot, "package.json"),
    },
    {
      template: "tsconfig.json.ejs",
      output: path.join(apiRoot, "tsconfig.json"),
    },
    {
      template: "nest-cli.json.ejs",
      output: path.join(apiRoot, "nest-cli.json"),
    },
    {
      template: ".eslintrc.js.ejs",
      output: path.join(apiRoot, ".eslintrc.js"),
    },
    { template: ".prettierrc.ejs", output: path.join(apiRoot, ".prettierrc") },
    { template: ".env.ejs", output: path.join(apiRoot, ".env") },
    {
      template: ".env.example.ejs",
      output: path.join(apiRoot, ".env.example"),
    },
    {
      template: "src/main.ts.ejs",
      output: path.join(apiRoot, "src", "main.ts"),
    },
    {
      template: "src/app.module.ts.ejs",
      output: path.join(apiRoot, "src", "app.module.ts"),
    },
    {
      template: "src/config/env.schema.ts.ejs",
      output: path.join(apiRoot, "src", "config", "env.schema.ts"),
    },
    {
      template: "src/common/filters/http-exception.filter.ts.ejs",
      output: path.join(
        apiRoot,
        "src",
        "common",
        "filters",
        "http-exception.filter.ts",
      ),
    },
    {
      template: "src/common/middleware/request-id.middleware.ts.ejs",
      output: path.join(
        apiRoot,
        "src",
        "common",
        "middleware",
        "request-id.middleware.ts",
      ),
    },
    {
      template: "src/health/health.module.ts.ejs",
      output: path.join(apiRoot, "src", "health", "health.module.ts"),
    },
    {
      template: "src/health/health.controller.ts.ejs",
      output: path.join(apiRoot, "src", "health", "health.controller.ts"),
    },
    {
      template: "src/health/health.service.ts.ejs",
      output: path.join(apiRoot, "src", "health", "health.service.ts"),
    },
    {
      template: "src/prisma/prisma.module.ts.ejs",
      output: path.join(apiRoot, "src", "prisma", "prisma.module.ts"),
    },
    {
      template: "src/prisma/prisma.service.ts.ejs",
      output: path.join(apiRoot, "src", "prisma", "prisma.service.ts"),
    },
    {
      template: "src/auth/auth.module.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "auth.module.ts"),
    },
    {
      template: "src/auth/auth.controller.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "auth.controller.ts"),
    },
    {
      template: "src/auth/auth.service.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "auth.service.ts"),
    },
    {
      template: "src/auth/auth.service.spec.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "auth.service.spec.ts"),
    },
    {
      template: "src/auth/auth.guard.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "auth.guard.ts"),
    },
    {
      template: "src/auth/jwt.strategy.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "jwt.strategy.ts"),
    },
    {
      template: "src/auth/dto/register.dto.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "dto", "register.dto.ts"),
    },
    {
      template: "src/auth/dto/login.dto.ts.ejs",
      output: path.join(apiRoot, "src", "auth", "dto", "login.dto.ts"),
    },
    {
      template: "prisma/schema.prisma.ejs",
      output: path.join(apiRoot, "prisma", "schema.prisma"),
    },
    {
      template: "test/jest-e2e.json.ejs",
      output: path.join(apiRoot, "test", "jest-e2e.json"),
    },
    {
      template: "test/app.e2e-spec.ts.ejs",
      output: path.join(apiRoot, "test", "app.e2e-spec.ts"),
    },
  ];

  if (features.profilePages) {
    files.push(
      {
        template: "src/auth/dto/update-profile.dto.ts.ejs",
        output: path.join(
          apiRoot,
          "src",
          "auth",
          "dto",
          "update-profile.dto.ts",
        ),
      },
      {
        template: "src/auth/dto/change-password.dto.ts.ejs",
        output: path.join(
          apiRoot,
          "src",
          "auth",
          "dto",
          "change-password.dto.ts",
        ),
      },
    );
  }

  if (features.userAdmin) {
    files.push(
      {
        template: "src/users/users.module.ts.ejs",
        output: path.join(apiRoot, "src", "users", "users.module.ts"),
      },
      {
        template: "src/users/users.controller.ts.ejs",
        output: path.join(apiRoot, "src", "users", "users.controller.ts"),
      },
      {
        template: "src/users/users.service.ts.ejs",
        output: path.join(apiRoot, "src", "users", "users.service.ts"),
      },
      {
        template: "src/users/dto/create-user.dto.ts.ejs",
        output: path.join(apiRoot, "src", "users", "dto", "create-user.dto.ts"),
      },
      {
        template: "src/users/dto/update-user.dto.ts.ejs",
        output: path.join(apiRoot, "src", "users", "dto", "update-user.dto.ts"),
      },
    );
  }

  if (config.docker) {
    files.push(
      { template: "Dockerfile.ejs", output: path.join(apiRoot, "Dockerfile") },
      {
        template: ".dockerignore.ejs",
        output: path.join(apiRoot, ".dockerignore"),
      },
    );
  }

  for (const file of files) {
    await renderTemplate({
      templateDir,
      templateName: file.template,
      outputPath: file.output,
      data,
    });
  }

  await copyPrismaMigrations(config, apiRoot, templateDir);
}

/** @deprecated use generateApi */
export const generateBackend = generateApi;
