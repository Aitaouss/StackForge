#!/usr/bin/env node

import { Command } from 'commander';
import { registerDoctorCommand } from './commands/doctor.js';
import { registerGenerateResourceCommand } from './commands/generate-resource.js';
import { registerInfoCommand } from './commands/info.js';
import { getStackforgeVersion } from './utils/stackforge-version.js';
import { error } from './utils/logger.js';

const program = new Command();

program
  .name('stackforge')
  .description('Maintain and inspect StackForge-generated projects')
  .version(getStackforgeVersion());

registerInfoCommand(program);
registerDoctorCommand(program);
registerGenerateResourceCommand(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  if (err instanceof Error) {
    error(err.message);
  } else {
    error('An unknown error occurred.');
  }
  process.exit(1);
});
