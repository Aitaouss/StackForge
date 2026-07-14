#!/usr/bin/env node

import { Command } from 'commander';
import { registerCreateCommand } from './commands/create.js';

const program = new Command();

program
  .name('create-fullstack-app')
  .description('Scaffold a production-ready full-stack application')
  .version('1.0.0');

registerCreateCommand(program);

program.parse();
