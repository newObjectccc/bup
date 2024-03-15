#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const changelog = require('./changelog/index.js');
const commitlint = require('./commitlint/index.js');
const eslint = require('./eslint/index.js');
const prettier = require('./prettier/index.js');
const lintstaged = require('./lint-staged/index.js');
const program = new Command();

const pkgPath = path.resolve(path.join(__dirname, '../package.json'));
const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

program
  .name('bup')
  .description('bup is help you setting your project development dependencies!')
  .version(`v${packageJson?.version ?? '0.0.1'}`)
  .command('bup', { isDefault: true })
  .description('bup --help')
  .action(() => {
    program.outputHelp();
  });

program.command('bup commitlint', 'start setting commitlint').action(commitlint.action);
program.command('bup prettier', 'start setting prettier').action(prettier.action);
program.command('bup lint-staged', 'start setting lint-staged').action(lintstaged.action);
program
  .command('bup changelog', 'start setting changelog')
  .option(...changelog.option)
  .action(changelog.action);
program
  .command('bup eslint', 'start setting eslint')
  .option(...eslint.option)
  .action(eslint.action);

program.parse();
