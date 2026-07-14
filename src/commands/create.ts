import { Command } from 'commander';
import { promptProjectConfig } from '../prompts/project.js';
import { generateProject } from '../generators/project.js';
import { error } from '../utils/logger.js';

export function registerCreateCommand(program: Command): void {
  program
    .command('create [project-name]', { isDefault: true })
    .description('Create a new full-stack application')
    .option('-c, --cwd <cwd>', 'working directory', process.cwd())
    .action(async (projectName: string | undefined, options: { cwd: string }) => {
      try {
        const config = await promptProjectConfig(projectName, options.cwd);
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
