import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';
import { ProjectConfig } from '../types/index.js';
import { generateBackend } from './backend.js';
import { generateFrontend } from './frontend.js';
import { generateCommonFiles } from './common.js';
import { generateDockerFiles } from './docker.js';
import { ensureEmptyDir } from '../utils/file.js';
import { generateJwtSecret } from '../utils/jwt-secret.js';
import { spinner, success, info, error } from '../utils/logger.js';

export async function generateProject(config: ProjectConfig): Promise<void> {
  const projectConfig: ProjectConfig = {
    ...config,
    jwtSecret: config.jwtSecret ?? generateJwtSecret(),
  };
  const createSpinner = spinner('Creating project directory...');
  createSpinner.start();

  try {
    await ensureEmptyDir(projectConfig.targetDir);
    createSpinner.succeed(`Created project directory: ${projectConfig.projectName}`);
  } catch (err) {
    createSpinner.fail('Failed to create project directory');
    throw err;
  }

  try {
    await runStep('Generating backend files...', () => generateBackend(projectConfig));
    await runStep('Generating frontend files...', () => generateFrontend(projectConfig));
    await runStep('Generating shared files...', () => generateCommonFiles(projectConfig));
    await runStep('Generating Docker files...', () => generateDockerFiles(projectConfig));
  } catch (err) {
    await cleanup(projectConfig.targetDir);
    throw err;
  }

  if (projectConfig.installDependencies) {
    try {
      await runStep('Installing root dependencies...', () =>
        installDependencies(projectConfig.targetDir),
      );
      await runStep('Installing backend dependencies...', () =>
        installDependencies(path.join(projectConfig.targetDir, 'backend')),
      );
      await runStep('Installing frontend dependencies...', () =>
        installDependencies(path.join(projectConfig.targetDir, 'frontend')),
      );
      await runStep('Generating Prisma client...', () =>
        runPrismaGenerate(path.join(projectConfig.targetDir, 'backend')),
      );
    } catch (err) {
      error(
        'Dependency installation failed. You can install them manually by running `pnpm install` in the project directory.',
      );
      throw err;
    }
  }

  printSuccess(projectConfig);
}

async function runStep<T>(
  message: string,
  fn: () => Promise<T>,
): Promise<T> {
  const stepSpinner = spinner(message);
  stepSpinner.start();

  try {
    const result = await fn();
    stepSpinner.succeed(message.replace('...', ''));
    return result;
  } catch (err) {
    stepSpinner.fail(message.replace('...', ''));
    throw err;
  }
}

async function installDependencies(cwd: string): Promise<void> {
  try {
    await execa('corepack', ['enable'], { cwd, stdio: 'ignore' });
  } catch {
    // corepack may already be enabled or unavailable; pnpm install below will surface real errors
  }
  await execa('pnpm', ['install'], { cwd, stdio: 'ignore' });
}

async function runPrismaGenerate(cwd: string): Promise<void> {
  await execa('pnpm', ['prisma', 'generate'], {
    cwd,
    stdio: 'ignore',
  });
}

async function cleanup(targetDir: string): Promise<void> {
  try {
    await fs.remove(targetDir);
  } catch {
    // ignore cleanup errors
  }
}

function printSuccess(config: ProjectConfig): void {
  success(`Successfully created ${config.projectName}`);
  info(`Location: ${config.targetDir}`);
  info('');
  info('Next steps:');
  info(`  cd ${config.projectName}`);

  if (!config.installDependencies) {
    info('  pnpm install');
    info('  cd backend && pnpm prisma generate');
  }

  if (config.database === 'postgresql') {
    info('  docker compose up -d postgres');
    info('  cd backend && pnpm prisma migrate dev');
  } else {
    info('  cd backend && pnpm prisma migrate dev');
  }

  if (config.docker && !config.installDependencies) {
    info('  Run pnpm install at the project root before docker compose build (requires pnpm-lock.yaml).');
  }

  info('  pnpm dev');
  info('');
  info('Frontend: http://localhost:3002');
  info('Backend API: http://localhost:3001');
  info('API Docs: http://localhost:3001/docs');
  if (config.database === 'postgresql' && config.docker) {
    info('Prisma Studio: http://localhost:5555 (via docker compose up -d)');
  } else {
    info("Prisma Studio: http://localhost:5555 (run 'pnpm db:studio' in backend/)");
  }
}
