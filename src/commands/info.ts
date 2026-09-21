import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { readManifest, resolveAppPath } from '../manifest.js';
import { info, success } from '../utils/logger.js';

interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function readPkg(dir: string): Promise<PackageJson | null> {
  const pkgPath = path.join(dir, 'package.json');
  if (!(await fs.pathExists(pkgPath))) {
    return null;
  }
  return fs.readJson(pkgPath) as PackageJson;
}

function pickVersion(pkg: PackageJson | null, name: string): string | undefined {
  if (!pkg) return undefined;
  return pkg.dependencies?.[name] ?? pkg.devDependencies?.[name];
}

export function registerInfoCommand(program: Command): void {
  program
    .command('info')
    .description('Print StackForge manifest and stack versions for support')
    .option('-c, --cwd <cwd>', 'project directory', process.cwd())
    .action(async (options: { cwd: string }) => {
      const manifest = await readManifest(options.cwd);
      const apiDir = resolveAppPath(options.cwd, manifest, 'api');
      const apiPkg = await readPkg(apiDir);

      success('StackForge project');
      info(`  stackforge.json schema: ${manifest.schemaVersion}`);
      info(`  create-stackforge-app: ${manifest.stackforgeVersion}`);
      info(`  preset: ${manifest.preset ?? '(none)'}`);
      info(`  database: ${manifest.database}`);
      info(`  docker: ${manifest.docker}`);
      info(`  apps.api: ${manifest.apps.api}`);
      info(`  apps.web: ${manifest.apps.web ?? '(none)'}`);
      if (manifest.orm) {
        info(`  orm: ${manifest.orm}`);
      }
      if (manifest.features && Object.keys(manifest.features).length > 0) {
        info(`  features: ${JSON.stringify(manifest.features)}`);
      }

      if (apiPkg) {
        info('');
        info('API stack (from apps/api/package.json):');
        info(`  package: ${apiPkg.name ?? 'unknown'}`);
        for (const dep of ['@nestjs/core', '@prisma/client', 'prisma'] as const) {
          const v = pickVersion(apiPkg, dep);
          if (v) info(`  ${dep}: ${v}`);
        }
      }

      if (manifest.apps.web) {
        const webDir = resolveAppPath(options.cwd, manifest, 'web');
        const webPkg = await readPkg(webDir);
        if (webPkg) {
          info('');
          info('Web stack (from apps/web/package.json):');
          info(`  package: ${webPkg.name ?? 'unknown'}`);
          for (const dep of ['next', 'react'] as const) {
            const v = pickVersion(webPkg, dep);
            if (v) info(`  ${dep}: ${v}`);
          }
        }
      }
    });
}
