import { Command } from 'commander';
import path from 'node:path';
import ora from 'ora';
import choicesPrompt from '../common/choices-prompt.js';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import execCmd from '../common/exec-cmd.js';
import installPlugin from '../common/install-plugin.js';
import isFileExistInRoot from '../common/is-file-exist.js';
import readdirToString from '../common/readdir-to-string.js';
import writeFileByTemp from '../common/write-file.js';
import { startOraWithTemp, stderrHdr, stdoutHdr } from '../helper/output.js';
import { LINTSTAGED_TEMP } from '../helper/template.js';
const program = new Command();

const chiosePkgOra = ora({
  text: 'Choose package Manager',
});
const settingHuskyOra = ora({
  text: `Setting husky...`,
});
const downloadPluginOra = ora({
  text: 'Download plugin...',
});
const settingLintstagedrcOra = ora({
  text: 'Setting lintstagedrc...',
});

program
  .action(async () => {
    try {
      if (!isFileExistInRoot('package.json')) throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr()
      chiosePkgOra.start();
      chiosePkgOra.succeed(`${pkgManager}, nice chiose!`);

      // install lint-staged
      startOraWithTemp(downloadPluginOra)
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'lint-staged husky'
      })
      downloadPluginOra.succeed(installPlugRes)

      // set husky & lint-staged
      startOraWithTemp(settingHuskyOra)
      await execCmd({
        cmdStr: `npm pkg set scripts.prepare="husky install"`,
        errMsg: 'Set scripts.prepare fail'
      })
      await execCmd({
        cmdStr: 'npm run prepare',
        errMsg: 'Run prepare fail'
      })
      await execCmd({
        cmdStr: `npx husky add .husky/pre-commit "npx lint-staged"`,
        errMsg: 'Run husky add .husky/pre-commit fail'
      })
      settingHuskyOra.succeed('Set husky lint-staged succeed!')

      // setting lint-staged
      const { format } = await choicesPrompt('format', [
        { title: 'json', value: 'json' },
        { title: 'yml', value: 'yml' },
        { title: 'cjs', value: 'cjs' },
        { title: 'mjs', value: 'mjs' },
      ])

      // find eslint and prettier config
      startOraWithTemp(settingLintstagedrcOra)
      const [files, err] = readdirToString(path.resolve('./'))
      if (err) settingLintstagedrcOra.fail('Readdir failed!')

      if (!/eslint/.test(files)) {
        ora({ text: 'you have no eslint, please execute bup eslint!' }).warn()
      }
      if (!/prettier/.test(files)) {
        ora({ text: 'you have no prettier, please execute bup prettier!' }).warn()
      }

      // write commitlint.config.js
      const execRes = await writeFileByTemp(LINTSTAGED_TEMP[format], `lintstagedrc.${format}`)
      settingLintstagedrcOra.succeed(execRes)
    } catch (error) {
      settingHuskyOra.fail()
      downloadPluginOra.fail()
      stderrHdr(error, settingLintstagedrcOra)
    }
  });

program.parse();
