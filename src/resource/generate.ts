import fs from 'fs-extra';
import path from 'path';
import { readManifest, resolveAppPath } from '../manifest.js';
import { getStackforgeVersion } from '../utils/stackforge-version.js';
import { info, success } from '../utils/logger.js';
import { renderContractsFile } from './codegen/contracts.js';
import { appendPrismaModel, renderPrismaModelBlock } from './codegen/prisma.js';
import {
  renderController,
  renderCreateDto,
  renderModule,
  renderService,
  renderServiceSpec,
  renderUpdateDto,
} from './codegen/nest.js';
import { resolveFields } from './fields.js';
import { resourceNaming, validateResourceName } from './naming.js';
import { buildResourcePlan } from './plan.js';
import type { GeneratedResourceRecord, GenerateResourceContext, PlannedFileChange } from './types.js';

async function readPackageScope(apiRoot: string): Promise<string> {
  const pkgPath = path.join(apiRoot, 'package.json');
  const pkg = (await fs.readJson(pkgPath)) as { name?: string };
  if (typeof pkg.name === 'string' && pkg.name.includes('/')) {
    return pkg.name.split('/')[0];
  }
  throw new Error(`Could not read npm scope from ${pkgPath}`);
}

function assertManifestV2(manifest: Awaited<ReturnType<typeof readManifest>>): void {
  if (manifest.schemaVersion !== 2) {
    throw new Error(`stackforge g resource requires stackforge.json schemaVersion 2.`);
  }
}

async function assertNoCollision(
  projectRoot: string,
  apiRoot: string,
  contractsRoot: string,
  naming: ReturnType<typeof resourceNaming>,
  plan: PlannedFileChange[],
): Promise<void> {
  const manifestPath = path.join(projectRoot, 'stackforge.json');
  const raw = await fs.readJson(manifestPath);
  const existing = (raw.generatedResources ?? []) as GeneratedResourceRecord[];
  if (existing.some((r) => r.name === naming.singular)) {
    throw new Error(`Resource "${naming.singular}" is already registered in stackforge.json.`);
  }

  const moduleDir = path.join(apiRoot, 'src', naming.plural);
  if (await fs.pathExists(moduleDir)) {
    throw new Error(`API module directory already exists: ${naming.plural}/`);
  }

  const contractsFile = path.join(contractsRoot, 'src', `${naming.plural}.ts`);
  if (await fs.pathExists(contractsFile)) {
    throw new Error(
      `Contracts file already exists: packages/contracts/src/${naming.plural}.ts`,
    );
  }

  for (const step of plan) {
    if (step.action !== 'CREATE') {
      continue;
    }
    const absolute = path.join(projectRoot, step.path);
    if (await fs.pathExists(absolute)) {
      throw new Error(`Refusing to overwrite existing file: ${step.path}`);
    }
  }

  const schemaPath = path.join(apiRoot, 'prisma', 'schema.prisma');
  const schema = await fs.readFile(schemaPath, 'utf-8');
  if (schema.includes(`model ${naming.pascal} `) || schema.includes(`model ${naming.pascal}\n`)) {
    throw new Error(`Prisma model ${naming.pascal} already exists in schema.prisma.`);
  }
}

function patchAppModule(content: string, ctx: GenerateResourceContext): string {
  const { naming } = ctx;
  const importLine = `import { ${naming.pascal}Module } from './${naming.plural}/${naming.plural}.module';`;
  if (content.includes(`${naming.pascal}Module`)) {
    return content;
  }

  if (!content.includes("import { AuthModule } from './auth/auth.module';")) {
    throw new Error(
      'Could not patch app.module.ts: expected AuthModule import from the StackForge API template.',
    );
  }

  let next = content;
  if (!next.includes(importLine)) {
    next = next.replace(
      /import { AuthModule } from '\.\/auth\/auth\.module';/,
      `$&\n${importLine}`,
    );
  }

  if (!next.includes(`${naming.pascal}Module,`)) {
    if (next.includes('UsersModule,')) {
      next = next.replace(/(UsersModule,\n)/, `$1    ${naming.pascal}Module,\n`);
    } else if (next.includes('AuthModule,')) {
      next = next.replace(/(AuthModule,\n)/, `$1    ${naming.pascal}Module,\n`);
    } else {
      throw new Error(
        'Could not patch app.module.ts: expected UsersModule or AuthModule in imports array.',
      );
    }
  }

  if (!next.includes(importLine) || !next.includes(`${naming.pascal}Module,`)) {
    throw new Error(`Failed to register ${naming.pascal}Module in app.module.ts.`);
  }

  return next;
}

function patchContractsIndex(content: string, plural: string): string {
  const exportLine = `export * from './${plural}';`;
  if (content.includes(exportLine)) {
    return content;
  }
  return `${content.trimEnd()}\n${exportLine}\n`;
}

function patchManifest(
  raw: Record<string, unknown>,
  naming: ReturnType<typeof resourceNaming>,
): Record<string, unknown> {
  const list = (raw.generatedResources ?? []) as GeneratedResourceRecord[];
  const entry: GeneratedResourceRecord = {
    name: naming.singular,
    plural: naming.plural,
    addedAt: new Date().toISOString().slice(0, 10),
    stackforgeVersion: getStackforgeVersion(),
  };
  return {
    ...raw,
    generatedResources: [...list, entry],
  };
}

type PendingWrite = {
  absolute: string;
  content: string;
  kind: 'create' | 'modify';
  previous?: string;
};

async function applyPendingWrites(
  writes: PendingWrite[],
  resourceModuleDir: string,
): Promise<void> {
  const applied: PendingWrite[] = [];
  try {
    for (const write of writes) {
      if (write.kind === 'create') {
        await fs.ensureDir(path.dirname(write.absolute));
      }
      applied.push(write);
      await fs.writeFile(write.absolute, write.content, 'utf-8');
    }
  } catch (err) {
    for (const write of [...applied].reverse()) {
      try {
        if (write.kind === 'create') {
          await fs.remove(write.absolute);
        } else if (write.previous !== undefined) {
          await fs.writeFile(write.absolute, write.previous, 'utf-8');
        }
      } catch {
        // best-effort rollback
      }
    }
    await fs.remove(resourceModuleDir).catch(() => {});
    throw err;
  }
}

async function buildPendingWrites(ctx: GenerateResourceContext): Promise<PendingWrite[]> {
  const { projectRoot, apiRoot, contractsRoot, naming } = ctx;
  const apiSrc = path.join(apiRoot, 'src');
  const resourceDir = path.join(apiSrc, naming.plural);

  const schemaPath = path.join(apiRoot, 'prisma', 'schema.prisma');
  const appModulePath = path.join(apiSrc, 'app.module.ts');
  const indexPath = path.join(contractsRoot, 'src', 'index.ts');
  const manifestPath = path.join(projectRoot, 'stackforge.json');

  const schemaBefore = await fs.readFile(schemaPath, 'utf-8');
  const appModuleBefore = await fs.readFile(appModulePath, 'utf-8');
  const indexBefore = await fs.readFile(indexPath, 'utf-8');
  const manifestBefore = await fs.readJson(manifestPath);
  const manifestBeforeText = JSON.stringify(manifestBefore, null, 2) + '\n';

  const schemaAfter = appendPrismaModel(schemaBefore, renderPrismaModelBlock(ctx));
  const appModuleAfter = patchAppModule(appModuleBefore, ctx);
  const indexAfter = patchContractsIndex(indexBefore, naming.plural);
  const manifestAfter = patchManifest(manifestBefore as Record<string, unknown>, naming);
  const manifestAfterText = JSON.stringify(manifestAfter, null, 2) + '\n';

  return [
    {
      absolute: path.join(resourceDir, `${naming.plural}.module.ts`),
      content: renderModule(ctx),
      kind: 'create',
    },
    {
      absolute: path.join(resourceDir, `${naming.plural}.controller.ts`),
      content: renderController(ctx),
      kind: 'create',
    },
    {
      absolute: path.join(resourceDir, `${naming.plural}.service.ts`),
      content: renderService(ctx),
      kind: 'create',
    },
    {
      absolute: path.join(resourceDir, 'dto', `create-${naming.singular}.dto.ts`),
      content: renderCreateDto(ctx),
      kind: 'create',
    },
    {
      absolute: path.join(resourceDir, 'dto', `update-${naming.singular}.dto.ts`),
      content: renderUpdateDto(ctx),
      kind: 'create',
    },
    {
      absolute: path.join(resourceDir, `${naming.plural}.service.spec.ts`),
      content: renderServiceSpec(ctx),
      kind: 'create',
    },
    {
      absolute: path.join(contractsRoot, 'src', `${naming.plural}.ts`),
      content: renderContractsFile(ctx),
      kind: 'create',
    },
    {
      absolute: schemaPath,
      content: schemaAfter,
      kind: 'modify',
      previous: schemaBefore,
    },
    {
      absolute: appModulePath,
      content: appModuleAfter,
      kind: 'modify',
      previous: appModuleBefore,
    },
    {
      absolute: indexPath,
      content: indexAfter,
      kind: 'modify',
      previous: indexBefore,
    },
    {
      absolute: manifestPath,
      content: manifestAfterText,
      kind: 'modify',
      previous: manifestBeforeText,
    },
  ];
}

export type RunGenerateResourceOptions = {
  cwd: string;
  name: string;
  fields: string[];
  dryRun: boolean;
};

export async function runGenerateResource(options: RunGenerateResourceOptions): Promise<void> {
  const projectRoot = path.resolve(options.cwd);
  validateResourceName(options.name);
  const naming = resourceNaming(options.name);
  const fields = resolveFields(naming.singular, options.fields);

  const manifest = await readManifest(projectRoot);
  assertManifestV2(manifest);
  const apiRoot = resolveAppPath(projectRoot, manifest, 'api');
  const contractsRoot = path.join(projectRoot, 'packages', 'contracts');

  if (!(await fs.pathExists(contractsRoot))) {
    throw new Error('Missing packages/contracts — is this a StackForge monorepo project?');
  }

  const scope = await readPackageScope(apiRoot);

  const ctx: GenerateResourceContext = {
    projectRoot,
    apiRoot,
    contractsRoot,
    scope,
    naming,
    fields,
    dryRun: options.dryRun,
  };

  const plan = buildResourcePlan(ctx);

  for (const step of plan) {
    if (step.action === 'MODIFY') {
      const absolute = path.join(projectRoot, step.path);
      if (!(await fs.pathExists(absolute))) {
        throw new Error(`Expected file to modify is missing: ${step.path}`);
      }
    }
  }

  await assertNoCollision(projectRoot, apiRoot, contractsRoot, naming, plan);

  if (options.dryRun) {
    for (const step of plan) {
      info(`${step.action}  ${step.path}`);
    }
    return;
  }

  const writes = await buildPendingWrites(ctx);
  const resourceModuleDir = path.join(apiRoot, 'src', naming.plural);
  await applyPendingWrites(writes, resourceModuleDir);

  success(`Generated resource "${naming.singular}" (${naming.plural}).`);
  info(
    `Next: pnpm --filter ./apps/api exec prisma migrate dev --name add_${naming.singular}`,
  );
  info('Then: pnpm --filter ./packages/contracts run build && pnpm dev');
}
