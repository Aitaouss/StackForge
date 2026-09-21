import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';
import { readManifest, resolveAppPath } from '../manifest.js';
import { error, info, success, warning } from '../utils/logger.js';

interface DoctorOptions {
  cwd: string;
}

function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

export function registerDoctorCommand(program: Command): void {
  program
    .command('doctor')
    .description('Check Node, tooling, env, and StackForge project health')
    .option('-c, --cwd <cwd>', 'project directory', process.cwd())
    .action(async (options: DoctorOptions) => {
      const issues: string[] = [];
      const notes: string[] = [];

      const nodeMajor = Number(process.versions.node.split('.')[0]);
      if (nodeMajor < 18) {
        issues.push(`Node.js ${process.versions.node} — require Node >= 18`);
      } else {
        info(`Node.js ${process.versions.node} OK`);
      }

      try {
        const pnpm = await execa('pnpm', ['--version'], { reject: false });
        if (pnpm.exitCode === 0) {
          info(`pnpm ${pnpm.stdout.trim()} OK`);
        } else {
          issues.push('pnpm not found — enable corepack or install pnpm');
        }
      } catch {
        issues.push('pnpm not found — enable corepack or install pnpm');
      }

      let manifest;
      try {
        manifest = await readManifest(options.cwd);
        info(`stackforge.json schema v${manifest.schemaVersion} OK`);
      } catch (err) {
        error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }

      if (manifest.schemaVersion < 2) {
        notes.push(
          'Legacy layout (frontend/backend). See docs/MIGRATION-monorepo.md to move to apps/*.',
        );
      }

      const apiDir = resolveAppPath(options.cwd, manifest, 'api');
      if (!(await fs.pathExists(apiDir))) {
        issues.push(`Missing API app at ${manifest.apps.api}`);
      } else {
        info(`API path ${manifest.apps.api} OK`);
      }

      if (manifest.apps.web) {
        const webDir = resolveAppPath(options.cwd, manifest, 'web');
        if (!(await fs.pathExists(webDir))) {
          issues.push(`Missing web app at ${manifest.apps.web}`);
        } else {
          info(`Web path ${manifest.apps.web} OK`);
        }
      }

      const envPath = path.join(apiDir, '.env');
      if (!(await fs.pathExists(envPath))) {
        issues.push('Missing apps/api/.env — copy from .env.example');
      } else {
        const env = parseEnvFile(await fs.readFile(envPath, 'utf8'));
        if (!env.DATABASE_URL) {
          issues.push('DATABASE_URL is not set in apps/api/.env');
        } else {
          info('DATABASE_URL set OK');
        }
        const jwt = env.JWT_SECRET;
        if (!jwt || jwt.length < 32) {
          issues.push('JWT_SECRET missing or shorter than 32 characters in apps/api/.env');
        } else if (jwt.includes('change-me') || jwt === 'your-secret-key') {
          warning('JWT_SECRET looks like a placeholder — rotate before production');
        } else {
          info('JWT_SECRET length OK');
        }
      }

      if (manifest.apps.web) {
        const webEnvExample = path.join(resolveAppPath(options.cwd, manifest, 'web'), '.env.local');
        const webEnv = path.join(resolveAppPath(options.cwd, manifest, 'web'), '.env.local.example');
        if (!(await fs.pathExists(webEnvExample)) && !(await fs.pathExists(webEnv))) {
          notes.push('Web env: ensure NEXT_PUBLIC_API_URL is set in apps/web/.env.local');
        }
      }

      if (manifest.docker) {
        const docker = await execa('docker', ['info'], { reject: false, stdio: 'ignore' });
        if (docker.exitCode !== 0) {
          notes.push('Docker enabled in manifest but docker CLI/daemon not reachable');
        } else {
          info('Docker daemon reachable OK');
        }
      }

      info('');
      if (issues.length === 0) {
        success('Doctor: no blocking issues found');
      } else {
        error(`Doctor: ${issues.length} issue(s) found`);
        for (const item of issues) {
          error(`  • ${item}`);
        }
      }
      for (const note of notes) {
        warning(`  • ${note}`);
      }

      if (issues.length > 0) {
        process.exit(1);
      }
    });
}
