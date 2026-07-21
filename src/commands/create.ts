import { Command } from 'commander';
import { promptProjectConfig } from '../prompts/project.js';
import { generateProject } from '../generators/project.js';
import { error } from '../utils/logger.js';
import { DatabaseType } from '../types/index.js';

interface CreateCommandOptions {
  cwd: string;
  database?: string;
  docker?: boolean;
  install?: boolean;
  yes?: boolean;
}

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
    .action(async (projectName: string | undefined, options: CreateCommandOptions) => {
      try {
        const config = await promptProjectConfig(projectName, options.cwd, {
          database: parseDatabase(options.database),
          docker: options.docker,
          installDependencies: options.install,
          yes: options.yes,
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
