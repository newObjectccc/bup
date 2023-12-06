#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'node:fs';
import isFileExistInRoot from './common/is-file-exist.js';
const program = new Command();

const pkgPath = isFileExistInRoot('package.json');
const packageJson = pkgPath && JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

program
  .name('bup')
  .version(`v${packageJson?.version ?? '0.0.1'}`)
  .description('bup is useful scaffold to help you setting your project')
  .command('eslint', 'start setting eslint')
  .command('changelog', 'start setting changelog')
  .command('prettier', 'start setting prettier')
  .command('lint-staged', 'start setting lint-staged')
  .command('commitlint', 'start setting commitlint')


program.parse();