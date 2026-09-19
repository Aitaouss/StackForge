#!/usr/bin/env node
/**
 * Smoke-test a fresh generated app (Phase 0 CI).
 * Usage: node scripts/smoke-generated-app.mjs postgresql|sqlite
 */
import execa from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const database = process.argv[2];

if (database !== 'postgresql' && database !== 'sqlite') {
  console.error('Usage: node scripts/smoke-generated-app.mjs postgresql|sqlite');
  process.exit(1);
}

const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'stackforge-smoke-'));
const appName = `smoke-${database}`;
const appDir = path.join(tmpRoot, appName);

console.log(`\n[smoke] temp dir: ${tmpRoot}`);
console.log(`[smoke] database: ${database}\n`);

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
  if (manifest.schemaVersion !== 1) {
    throw new Error(`Expected schemaVersion 1, got ${manifest.schemaVersion}`);
  }
  if (manifest.database !== database) {
    throw new Error(`Expected database ${database}, got ${manifest.database}`);
  }
  if (typeof manifest.stackforgeVersion !== 'string' || !manifest.stackforgeVersion) {
    throw new Error('stackforge.json missing stackforgeVersion');
  }
  if (!('preset' in manifest)) {
    throw new Error('stackforge.json missing preset field');
  }
  if (!(await fs.pathExists(path.join(appDir, 'AGENTS.md')))) {
    throw new Error('Missing AGENTS.md');
  }
  if (!(await fs.pathExists(path.join(appDir, '.stackforge', 'README.md')))) {
    throw new Error('Missing .stackforge/README.md');
  }

  console.log('[smoke] manifest OK:', manifest);

  console.log('[smoke] pnpm install…');
  await execa('pnpm', ['install'], { cwd: appDir, stdio: 'inherit' });

  const backendDir = path.join(appDir, 'backend');

  if (database === 'postgresql' && process.env.GITHUB_ACTIONS === 'true') {
    const envPath = path.join(backendDir, '.env');
    let env = await fs.readFile(envPath, 'utf8');
    env = env.replace('localhost:5433', 'localhost:5432');
    await fs.writeFile(envPath, env);
  }

  console.log('[smoke] prisma generate + db push…');
  await execa('pnpm', ['exec', 'prisma', 'generate'], { cwd: backendDir, stdio: 'inherit' });
  await execa('pnpm', ['exec', 'prisma', 'db', 'push', '--accept-data-loss'], {
    cwd: backendDir,
    stdio: 'inherit',
  });

  console.log('[smoke] backend build…');
  await execa('pnpm', ['--filter', './backend', 'run', 'build'], {
    cwd: appDir,
    stdio: 'inherit',
  });

  console.log('[smoke] frontend build…');
  await execa('pnpm', ['--filter', './frontend', 'run', 'build'], {
    cwd: appDir,
    stdio: 'inherit',
  });

  // Lint / test / typecheck expand in Phase 1B when configs and tests exist in templates.
  console.log('\n[smoke] PASS:', database);
} catch (err) {
  console.error('\n[smoke] FAIL:', database);
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await fs.remove(tmpRoot).catch(() => {});
}
