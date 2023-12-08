#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
const program = new Command();
const __dirname = dirname(fileURLToPath(import.meta.url));

const pkgPath = path.resolve(path.join(__dirname, '../package.json'));
const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

program
  .name('bup')
  .version(`v${packageJson?.version ?? '0.0.1'}`)
  .description('bup is help you setting your project development dependencies!')
  .command('eslint', 'start setting eslint')
  .command('changelog', 'start setting changelog')
  .command('prettier', 'start setting prettier')
  .command('lint-staged', 'start setting lint-staged')
  .command('commitlint', 'start setting commitlint')
  .command('check', 'start check out your project projective deps!');

program.parse();
