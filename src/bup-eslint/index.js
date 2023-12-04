import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
const program = new Command();


const FORMAT_TYPE = ['js', 'cjs', 'json', 'yaml', 'yml', 'pkg']

const spinner = ora({
  text: `Writting eslintrc...`,
});
const veriEslintParamsStdin = ora({
  text: 'Loading ESLint Options',
});

program
  .option('-f, --format <char>', 'no common eslintrc.js')
  .action(async (fmt) => {
    veriEslintParamsStdin.start();

    await awaFn()
    if (!FORMAT_TYPE.includes(fmt.format)) {
      veriEslintParamsStdin.text = chalk.red('Loading fail')
      veriEslintParamsStdin.fail();
      return
    }

    veriEslintParamsStdin.succeed('Loading succeed');
    await awaFn()
    spinner.prefixText = chalk.dim('[info]');
    spinner.start()
    await awaFn()
    spinner.spinner = 'moon'
    spinner.text = 'Setting ESLint...'
    await awaFn()
    spinner.succeed('All done!')
  });

program.parse();

function awaFn() {
  return new Promise((r, j) => {
    setTimeout(() => {
      r('xxx')
    }, 2000)
  })
}

