#!/usr/bin/env node
import execa from "execa";
import fs from "fs-extra";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { linkLocalCreateStackforgeApp } from "./smoke-link-local-cli.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const tmpRoot = await fs.mkdtemp(
  path.join(os.tmpdir(), "stackforge-resource-smoke-"),
);
const appName = "smoke-resource-post";
const appDir = path.join(tmpRoot, appName);

function stackforge(args, cwd, { inherit = true } = {}) {
  return execa("pnpm", ["exec", "stackforge", ...args], {
    cwd,
    stdio: inherit ? "inherit" : "pipe",
    reject: false,
  });
}

async function readTrackedModifySnapshots(root) {
  const relPaths = [
    "apps/api/prisma/schema.prisma",
    "apps/api/src/app.module.ts",
    "packages/contracts/src/index.ts",
    "stackforge.json",
  ];
  const out = {};
  for (const rel of relPaths) {
    const absolute = path.join(root, rel);
    out[rel] = await fs.readFile(absolute, "utf-8");
  }
  return out;
}

async function assertSnapshotsUnchanged(root, before) {
  for (const [rel, content] of Object.entries(before)) {
    const after = await fs.readFile(path.join(root, rel), "utf-8");
    if (after !== content) {
      throw new Error(`Dry-run modified ${rel}`);
    }
  }
}

console.log(`\n[smoke:resource] temp dir: ${tmpRoot}\n`);

try {
  await execa(
    "node",
    [
      path.join(repoRoot, "bin/create-stackforge-app.js"),
      appName,
      "-y",
      "--no-install",
      "--no-docker",
      "--database",
      "sqlite",
      "--cwd",
      tmpRoot,
    ],
    { cwd: repoRoot, stdio: "inherit" },
  );

  await linkLocalCreateStackforgeApp(appDir, repoRoot);

  console.log("[smoke:resource] pnpm install…");
  await execa("pnpm", ["install"], { cwd: appDir, stdio: "inherit" });

  console.log("[smoke:resource] initial db:setup…");
  await execa("pnpm", ["run", "db:setup"], { cwd: appDir, stdio: "inherit" });

  console.log("[smoke:resource] reserved field id must be rejected…");
  const reservedField = await stackforge(
    ["g", "resource", "item", "--field", "id:string:required"],
    appDir,
    { inherit: false },
  );
  if (reservedField.exitCode === 0) {
    throw new Error("expected --field id:string:required to fail");
  }

  const beforeDryRun = await readTrackedModifySnapshots(appDir);

  console.log("[smoke:resource] pnpm exec stackforge g resource post --dry-run…");
  const dryRun = await stackforge(
    ["g", "resource", "post", "--dry-run"],
    appDir,
  );
  if (dryRun.exitCode !== 0) {
    throw new Error(`dry-run failed: ${dryRun.stderr ?? dryRun.stdout}`);
  }
  await assertSnapshotsUnchanged(appDir, beforeDryRun);

  console.log("[smoke:resource] contracts collision guard…");
  const decoyContracts = path.join(
    appDir,
    "packages",
    "contracts",
    "src",
    "notes.ts",
  );
  await fs.writeFile(decoyContracts, "// decoy\n", "utf-8");
  const collision = await stackforge(
    ["g", "resource", "note", "--field", "title:string:required"],
    appDir,
    { inherit: false },
  );
  if (collision.exitCode === 0) {
    throw new Error("expected collision when contracts file exists");
  }
  const decoyAfter = await fs.readFile(decoyContracts, "utf-8");
  if (decoyAfter !== "// decoy\n") {
    throw new Error("generator overwrote decoy contracts file");
  }
  await fs.remove(decoyContracts);

  console.log("[smoke:resource] pnpm exec stackforge g resource post…");
  const genPost = await stackforge(["g", "resource", "post"], appDir);
  if (genPost.exitCode !== 0) {
    throw new Error("post generation failed");
  }

  console.log("[smoke:resource] duplicate post generation must fail…");
  const dup = await stackforge(["g", "resource", "post"], appDir, {
    inherit: false,
  });
  if (dup.exitCode === 0) {
    throw new Error("duplicate post generation should fail");
  }

  console.log("[smoke:resource] custom resource note with explicit field…");
  const genNote = await stackforge(
    [
      "g",
      "resource",
      "note",
      "--field",
      "title:string:required",
    ],
    appDir,
  );
  if (genNote.exitCode !== 0) {
    throw new Error("note generation failed");
  }

  const apiDir = path.join(appDir, "apps", "api");
  console.log("[smoke:resource] prisma generate + migrate after generator…");
  await execa("pnpm", ["exec", "prisma", "generate"], {
    cwd: apiDir,
    stdio: "inherit",
  });
  await execa("pnpm", ["exec", "prisma", "migrate", "dev", "--name", "add_post"], {
    cwd: apiDir,
    stdio: "inherit",
  });
  await execa("pnpm", ["exec", "prisma", "migrate", "dev", "--name", "add_note"], {
    cwd: apiDir,
    stdio: "inherit",
  });

  console.log("[smoke:resource] contracts build…");
  await execa("pnpm", ["--filter", "./packages/contracts", "run", "build"], {
    cwd: appDir,
    stdio: "inherit",
  });

  console.log("[smoke:resource] API lint + typecheck + test…");
  await execa("pnpm", ["--filter", "./apps/api", "run", "lint"], {
    cwd: appDir,
    stdio: "inherit",
  });
  await execa("pnpm", ["--filter", "./apps/api", "run", "typecheck"], {
    cwd: appDir,
    stdio: "inherit",
  });
  const postSpec = path.join(
    appDir,
    "apps",
    "api",
    "src",
    "posts",
    "posts.service.spec.ts",
  );
  if (!(await fs.pathExists(postSpec))) {
    throw new Error("missing generated posts.service.spec.ts");
  }

  await execa("pnpm", ["--filter", "./apps/api", "run", "test"], {
    cwd: appDir,
    stdio: "inherit",
  });
  await execa(
    "pnpm",
    [
      "--filter",
      "./apps/api",
      "exec",
      "jest",
      "src/posts/posts.service.spec.ts",
      "--runInBand",
    ],
    { cwd: appDir, stdio: "inherit" },
  );

  const manifest = await fs.readJson(path.join(appDir, "stackforge.json"));
  if (!manifest.generatedResources?.some((r) => r.name === "post")) {
    throw new Error("stackforge.json missing generatedResources post entry");
  }
  if (!manifest.generatedResources?.some((r) => r.name === "note")) {
    throw new Error("stackforge.json missing generatedResources note entry");
  }

  console.log("\n[smoke:resource] PASS\n");
} catch (err) {
  console.error("\n[smoke:resource] FAIL");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await fs.remove(tmpRoot).catch(() => {});
}
