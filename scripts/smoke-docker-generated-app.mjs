#!/usr/bin/env node
import execa from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'stackforge-docker-smoke-'));
const appName = 'smoke-docker-postgresql';
const appDir = path.join(tmpRoot, appName);

const compose = (args, options = {}) =>
  execa('docker', ['compose', ...args], {
    cwd: appDir,
    stdio: 'inherit',
    ...options,
  });

async function waitForJson(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      lastError = new Error(`${url} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(
    `Timed out waiting for ${url}: ${lastError instanceof Error ? lastError.message : lastError}`,
  );
}

async function waitForOk(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = new Error(`${url} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(
    `Timed out waiting for ${url}: ${lastError instanceof Error ? lastError.message : lastError}`,
  );
}

async function studioRequest(requestId, action, data) {
  const response = await fetch('http://127.0.0.1:5555/api', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      requestId,
      channel: 'prisma',
      action,
      payload: { data },
    }),
  });

  if (!response.ok) {
    throw new Error(`Prisma Studio returned HTTP ${response.status}`);
  }

  return response.json();
}

console.log(`\n[docker-smoke] temp dir: ${tmpRoot}\n`);

try {
  await execa(
    'node',
    [
      path.join(repoRoot, 'bin/create-stackforge-app.js'),
      appName,
      '-y',
      '--docker',
      '--no-install',
      '--database',
      'postgresql',
      '--preset',
      'dashboard',
      '--cwd',
      tmpRoot,
    ],
    { cwd: repoRoot, stdio: 'inherit' },
  );

  console.log('[docker-smoke] pnpm install (create lockfile)…');
  await execa('pnpm', ['install'], { cwd: appDir, stdio: 'inherit' });

  console.log('[docker-smoke] build images…');
  await compose(['build', 'web', 'api', 'prisma-studio']);

  console.log('[docker-smoke] start stack…');
  await compose(['up', '-d', 'postgres', 'api', 'prisma-studio', 'web']);

  const health = await waitForJson('http://127.0.0.1:3001/health');
  if (health.status !== 'ok' || health.database !== 'up') {
    throw new Error(`Unexpected API health response: ${JSON.stringify(health)}`);
  }

  await waitForOk('http://127.0.0.1:5555');

  const dmmf = await studioRequest(0, 'getDMMF', null);
  const schemaHash = dmmf?.payload?.data?.schemaHash;
  if (dmmf?.payload?.error || !schemaHash) {
    throw new Error(`Unable to load Prisma Studio schema: ${JSON.stringify(dmmf?.payload)}`);
  }

  const findMany = await studioRequest(1, 'clientRequest', {
    schemaHash,
    modelName: 'User',
    operation: 'findMany',
    args: {},
  });
  if (findMany?.payload?.error || !Array.isArray(findMany?.payload?.data)) {
    throw new Error(`Prisma Studio findMany failed: ${JSON.stringify(findMany?.payload)}`);
  }

  console.log('\n[docker-smoke] PASS\n');
} catch (error) {
  console.error('\n[docker-smoke] FAIL');
  console.error(error instanceof Error ? error.message : error);
  await compose(['logs', '--no-color', '--tail=200']).catch(() => {});
  process.exitCode = 1;
} finally {
  await compose(['down', '--volumes', '--remove-orphans']).catch(() => {});
  await fs.remove(tmpRoot).catch(() => {});
}
