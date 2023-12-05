import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
import chooseFramework from '../common/choose-framework.js';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import { ESLINT_FORMAT_TYPE } from '../helper/constant.js';
import { stderrHdr, stdoutHdr } from '../helper/output.js';
import { installEslint, settingEslintrc } from './eslint-common.js';
const program = new Command();

const settingEslintOra = ora({
  text: `Setting eslint...`,
});
const loadingEslintOra = ora({
  text: 'Download ESLint',
});

program
  .option('-f, --format <char>', 'no common eslintrc.js')
  .action(async (fmt) => {
    try {
      // verify whether the parameters are valid
      if (fmt.format === void 0) fmt.format = 'js'
      if (!ESLINT_FORMAT_TYPE.includes(fmt.format)) {
        stderrHdr(loadingEslintOra, ` Parameter "--format" must be one of "${ESLINT_FORMAT_TYPE.join('|')}"`)
        return
      }

      // download eslint
      const { pkgManager } = await choosePkgMgr()
      loadingEslintOra.start();
      await installEslint({ pkgManager, stdoutHdr: (data) => stdoutHdr(loadingEslintOra, data) })
      loadingEslintOra.succeed('ESLint download succeed');

      const fwk = chooseFramework()
      // setting eslintrc
      settingEslintOra.prefixText = chalk.dim('[info]');
      settingEslintOra.start()
      settingEslintOra.spinner = 'moon'
      settingEslintOra.text = chalk.green('Setting ESLint...')
      const writeRes = await settingEslintrc({ fmt: fmt.format, fwk })
      settingEslintOra.succeed(`${writeRes}, completed!`)
    } catch (error) {
      stderrHdr(loadingEslintOra)
      stderrHdr(settingEslintOra)
    }
  });

program.parse();
