#!/usr/bin/env node

import { Command } from 'commander';
import { registerCreateCommand } from './commands/create.js';
import { getStackforgeVersion } from './utils/stackforge-version.js';

const program = new Command();

program
  .name('create-stackforge-app')
  .description('Scaffold a production-ready full-stack application')
  .version(getStackforgeVersion());

registerCreateCommand(program);

program.parse();
