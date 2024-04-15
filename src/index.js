#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const changelog = require('./changelog/index.js');
const commitlint = require('./commitlint/index.js');
const eslint = require('./eslint/index.js');
const prettier = require('./prettier/index.js');
const lintstaged = require('./lint-staged/index.js');
const boilerplate = require('./boilerplate/index.js');
const program = new Command();

const pkgPath = path.resolve(path.join(__dirname, '../package.json'));
const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

program
  .name('bup')
  .description('bup is help you setting your project development dependencies!')
  .version(`v${packageJson?.version ?? '0.0.1'}`)
  .usage('<command>');

program
  .command('commitlint')
  .description('install commitlint and setting commitlint.config.js')
  .action(commitlint.action);
program
  .command('prettier')
  .description('install prettier and setting .prettierrc')
  .action(prettier.action);
program
  .command('lint-staged')
  .description('install lint-staged and setting .lintstagedrc')
  .action(lintstaged.action);
program
  .command('changelog')
  .description('install standard-version and setting .versionrc.js')
  .action(changelog.action);
program.command('eslint').description('install eslint and setting .eslintrc').action(eslint.action);
program
  .command('boilerplate')
  .description('install boilerplate with preset that you want')
  .action(boilerplate.action);

program.parse();
