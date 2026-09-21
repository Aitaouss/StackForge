#!/usr/bin/env node
/**
 * Smoke-test a fresh generated app.
 * Usage: node scripts/smoke-generated-app.mjs <sqlite|postgresql> [preset]
 *   preset: dashboard (default) | minimal | api
 */
import execa from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const database = process.argv[2];
const preset = process.argv[3] ?? 'dashboard';

const PRESETS = ['dashboard', 'minimal', 'api'];

if (database !== 'postgresql' && database !== 'sqlite') {
  console.error('Usage: node scripts/smoke-generated-app.mjs postgresql|sqlite [preset]');
  process.exit(1);
}

if (!PRESETS.includes(preset)) {
  console.error(`Invalid preset "${preset}". Valid: ${PRESETS.join(', ')}`);
  process.exit(1);
}

const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'stackforge-smoke-'));
const appName = `smoke-${preset}-${database}`;
const appDir = path.join(tmpRoot, appName);

console.log(`\n[smoke] temp dir: ${tmpRoot}`);
console.log(`[smoke] database: ${database}`);
console.log(`[smoke] preset: ${preset}\n`);

try {
  await execa(
    'node',
    [
      path.join(repoRoot, 'bin/create-stackforge-app.js'),
      appName,
      '-y',
      '--no-docker',
      '--no-install',
      '--database',
      database,
      '--preset',
      preset,
      '--cwd',
      tmpRoot,
    ],
    { cwd: repoRoot, stdio: 'inherit' },
  );

  const manifestPath = path.join(appDir, 'stackforge.json');
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error('Missing stackforge.json in generated project');
  }

  const manifest = await fs.readJson(manifestPath);
  if (manifest.schemaVersion !== 2) {
    throw new Error(`Expected schemaVersion 2, got ${manifest.schemaVersion}`);
  }
  if (manifest.database !== database) {
    throw new Error(`Expected database ${database}, got ${manifest.database}`);
  }
  if (manifest.preset !== preset) {
    throw new Error(`Expected preset ${preset}, got ${manifest.preset}`);
  }
  if (manifest.apps?.api !== 'apps/api') {
    throw new Error('Expected apps.api === apps/api');
  }
  if (preset === 'api' && manifest.apps?.web !== null) {
    throw new Error('API preset should not include web app');
  }
  if (preset !== 'api' && manifest.apps?.web !== 'apps/web') {
    throw new Error('Expected apps.web === apps/web');
  }
  if (!(await fs.pathExists(path.join(appDir, 'AGENTS.md')))) {
    throw new Error('Missing AGENTS.md');
  }
  if (!(await fs.pathExists(path.join(appDir, 'packages', 'typescript-config', 'base.json')))) {
    throw new Error('Missing packages/typescript-config');
  }
  if (!(await fs.pathExists(path.join(appDir, 'packages', 'contracts', 'src', 'index.ts')))) {
    throw new Error('Missing packages/contracts');
  }

  console.log('[smoke] manifest OK:', manifest);

  console.log('[smoke] pnpm install…');
  await execa('pnpm', ['install'], { cwd: appDir, stdio: 'inherit' });

  const apiDir = path.join(appDir, 'apps', 'api');

  if (database === 'postgresql' && process.env.GITHUB_ACTIONS === 'true') {
    const envPath = path.join(apiDir, '.env');
    let env = await fs.readFile(envPath, 'utf8');
    env = env.replace('localhost:5433', 'localhost:5432');
    await fs.writeFile(envPath, env);
  }

  console.log('[smoke] prisma generate + migrate deploy…');
  await execa('pnpm', ['exec', 'prisma', 'generate'], { cwd: apiDir, stdio: 'inherit' });
  await execa('pnpm', ['run', 'db:deploy'], { cwd: apiDir, stdio: 'inherit' });

  console.log('[smoke] API lint + typecheck + test…');
  await execa('pnpm', ['--filter', './apps/api', 'run', 'lint'], { cwd: appDir, stdio: 'inherit' });
  await execa('pnpm', ['--filter', './apps/api', 'run', 'typecheck'], {
    cwd: appDir,
    stdio: 'inherit',
  });
  await execa('pnpm', ['--filter', './apps/api', 'run', 'test'], { cwd: appDir, stdio: 'inherit' });
  await execa('pnpm', ['--filter', './apps/api', 'run', 'test:e2e'], {
    cwd: appDir,
    stdio: 'inherit',
  });

  if (preset !== 'api') {
    console.log('[smoke] web lint + typecheck…');
    await execa('pnpm', ['--filter', './apps/web', 'run', 'lint'], {
      cwd: appDir,
      stdio: 'inherit',
    });
    await execa('pnpm', ['--filter', './apps/web', 'run', 'typecheck'], {
      cwd: appDir,
      stdio: 'inherit',
    });
  }

  console.log('[smoke] build…');
  await execa('pnpm', ['--filter', './apps/api', 'run', 'build'], {
    cwd: appDir,
    stdio: 'inherit',
  });
  if (preset !== 'api') {
    await execa('pnpm', ['--filter', './apps/web', 'run', 'build'], {
      cwd: appDir,
      stdio: 'inherit',
    });
  }

  console.log('[smoke] stackforge info + doctor…');
  await execa('node', [path.join(repoRoot, 'bin/stackforge.js'), 'info'], {
    cwd: appDir,
    stdio: 'inherit',
  });
  await execa('node', [path.join(repoRoot, 'bin/stackforge.js'), 'doctor'], {
    cwd: appDir,
    stdio: 'inherit',
  });

  console.log('\n[smoke] PASS:', database, preset);
} catch (err) {
  console.error('\n[smoke] FAIL:', database, preset);
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await fs.remove(tmpRoot).catch(() => {});
}
