const path = require('path');
const choicesPrompt = require('../common/choices-prompt.js');
const choosePkgMgr = require('../common/choose-pkg-manager.js');
const execCmd = require('../common/exec-cmd.js');
const installPlugin = require('../common/install-plugin.js');
const isFileExistInRoot = require('../common/is-file-exist.js');
const readdirToString = require('../common/readdir-to-string.js');
const writeRootFileByTemp = require('../common/write-file.js');
const asyncOutput = require('../helper/output.js');
const { LINTSTAGED_TEMP } = require('../helper/template.js');

const lintstaged = {
  action: async () => {
    let settingHuskyOra, downloadPluginOra, settingLintstagedrcOra;
    const { startOraWithTemp, stderrHdr, stdoutHdr } = await asyncOutput();
    const { default: ora } = await import('ora');
    try {
      if (!isFileExistInRoot('package.json'))
        throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr();

      // install lint-staged
      downloadPluginOra = startOraWithTemp('Download plugin...');
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'lint-staged husky@9.0.11'
      });
      downloadPluginOra.succeed(installPlugRes);
      downloadPluginOra = null;

      // set husky & lint-staged
      settingHuskyOra = startOraWithTemp(`Setting husky...`);
      await execCmd({
        cmdStr: `npm pkg set scripts.prepare="husky"`,
        errMsg: 'Set scripts.prepare fail'
      });
      await execCmd({
        cmdStr: 'npm run prepare',
        errMsg: 'Run prepare fail'
      });
      await execCmd({
        cmdStr: `echo npx lint-staged > .husky/pre-commit`,
        errMsg:
          'Run echo "npx lint-staged" > .husky/pre-commit failed, check out your .git directory!'
      });
      settingHuskyOra.succeed('Set husky lint-staged succeed!');

      // setting lint-staged
      const { format } = await choicesPrompt('format', [
        { title: 'json', value: 'json' },
        { title: 'yml', value: 'yml' },
        { title: 'cjs', value: 'cjs' },
        { title: 'mjs', value: 'mjs' }
      ]);

      // find eslint and prettier config
      settingLintstagedrcOra = startOraWithTemp('Setting .lintstagedrc...');
      const [files, err] = readdirToString(path.resolve('./'));
      if (err) settingLintstagedrcOra.fail('Readdir failed!');

      if (!/\.eslintrc/.test(files)) {
        ora({ text: 'you have no eslint, please execute bup eslint!' }).warn();
      }
      if (!/\.prettierrc/.test(files)) {
        ora({ text: 'you have no prettier, please execute bup prettier!' }).warn();
      }

      // write commitlint.config.js
      const execRes = await writeRootFileByTemp(LINTSTAGED_TEMP[format], `.lintstagedrc.${format}`);
      settingLintstagedrcOra.succeed(execRes);
    } catch (error) {
      downloadPluginOra?.fail();
      settingHuskyOra?.fail();
      settingLintstagedrcOra?.fail();
      stderrHdr(error);
    }
  }
};

module.exports = lintstaged;
