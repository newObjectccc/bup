import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import installPlugin from '../common/install-plugin.js';
import { stderrHdr, stdoutHdr } from '../helper/output.js';
import { execSettingHuskyAndCommitlint } from './commitlint-common.js';
const program = new Command();

const chiosePkgOra = ora({
  text: 'Choose package Manager',
});
const settingHuskyOra = ora({
  text: `Setting husky...`,
});
const settingCommitlintRuleOra = ora({
  text: `Setting eslint...`,
});
const downloadPluginOra = ora({
  text: 'Download plugin...',
});

program
  .option('-c, --custom', 'default false if no specify')
  .action(async (argv) => {
    try {
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr()
      chiosePkgOra.start();
      chiosePkgOra.succeed(`${pkgManager}, nice chiose!`);

      // install commitlint
      downloadPluginOra.start()
      downloadPluginOra.spinner = 'moon'
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'husky commitlint @commitlint/config-conventional @commitlint/cli'
      })
      downloadPluginOra.succeed(installPlugRes)

      // setting husky
      settingHuskyOra.start()
      settingHuskyOra.spinner = 'moon'
      settingHuskyOra.prefixText = chalk.dim('[info]')
      const succeedMsg = await execSettingHuskyAndCommitlint()
      if (!succeedMsg) {
        settingHuskyOra.fail('You should use bup under the root directory of the project!')
        return
      }
      settingHuskyOra.succeed(succeedMsg)

      // check wheather need customize lint rules
      if (argv.custom) {
        // setting commitlint rule
        settingCommitlintRuleOra.start()
        settingCommitlintRuleOra.prefixText = chalk.dim('[info]');
        settingCommitlintRuleOra.spinner = 'moon'
        settingCommitlintRuleOra.text = chalk.green('Setting custom rules...')
        const writeRes = await installPlugin({
          pkgManager,
          stdoutHdr: (data) => stdoutHdr(data, settingCommitlintRuleOra),
          plugin: ''
        })
        settingCommitlintRuleOra.succeed(`${writeRes} succeed!`)
      }
    } catch (error) {
      chiosePkgOra.fail()
      settingCommitlintRuleOra.fail()
      stderrHdr(error, downloadPluginOra)
    }
  });

program.parse();
