import { Command } from 'commander';
import { promptProjectConfig } from '../prompts/project.js';
import { generateProject } from '../generators/project.js';
import { error } from '../utils/logger.js';
import { DatabaseType, StackforgePreset } from '../types/index.js';

interface CreateCommandOptions {
  cwd: string;
  database?: string;
  docker?: boolean;
  install?: boolean;
  yes?: boolean;
  preset?: string;
}

const PRESETS: StackforgePreset[] = ['minimal', 'api', 'dashboard'];

const DATABASE_TYPES: DatabaseType[] = ['postgresql', 'sqlite'];

function parseDatabase(value: string | undefined): DatabaseType | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!DATABASE_TYPES.includes(value as DatabaseType)) {
    throw new Error(
      `Invalid database "${value}". Valid options: ${DATABASE_TYPES.join(', ')}.`,
    );
  }
  return value as DatabaseType;
}

function parsePreset(value: string | undefined): StackforgePreset | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!PRESETS.includes(value as StackforgePreset)) {
    throw new Error(
      `Invalid preset "${value}". Valid options: ${PRESETS.join(', ')}.`,
    );
  }
  return value as StackforgePreset;
}

export function registerCreateCommand(program: Command): void {
  program
    .command('create [project-name]', { isDefault: true })
    .description('Create a new full-stack application')
    .option('-c, --cwd <cwd>', 'working directory', process.cwd())
    .option('-d, --database <database>', 'database type (postgresql or sqlite)')
    .option('--docker', 'generate Docker support')
    .option('--no-docker', 'skip Docker support')
    .option('--install', 'install dependencies automatically')
    .option('--no-install', 'skip dependency installation')
    .option('-y, --yes', 'skip all prompts and use defaults')
    .option(
      '-p, --preset <preset>',
      'project preset (minimal, api, dashboard)',
      'dashboard',
    )
    .action(async (projectName: string | undefined, options: CreateCommandOptions) => {
      try {
        const config = await promptProjectConfig(projectName, options.cwd, {
          database: parseDatabase(options.database),
          docker: options.docker,
          installDependencies: options.install,
          yes: options.yes,
          preset: parsePreset(options.preset),
        });
        await generateProject(config);
      } catch (err) {
        if (err instanceof Error) {
          error(err.message);
        } else {
          error('An unknown error occurred.');
        }
        process.exit(1);
      }
    });
}
