#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

program
  .name('bup')
  .version('0.0.1')
  .description('bup is useful scaffold to help you setting your project')
  .command('eslint', 'start setting eslint')
  .command('prettier', 'start setting prettier')
  .command('lint-staged', 'start setting lint-staged')
  .command('commitlint', 'start setting commitlint')


program.parse();