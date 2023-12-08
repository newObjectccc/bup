#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const program = new Command();

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
