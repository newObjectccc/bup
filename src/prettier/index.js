const fs = require('fs');
const path = require('path');
const choicesPrompt = require('../common/choices-prompt.js');
const choosePkgMgr = require('../common/choose-pkg-manager.js');
const execCmd = require('../common/exec-cmd.js');
const installPlugin = require('../common/install-plugin.js');
const isFileExistInRoot = require('../common/is-file-exist.js');
const readdirToString = require('../common/readdir-to-string.js');
const writeRootFileByTemp = require('../common/write-file.js');
const asyncOutput = require('../helper/output.js');
const { PRETTIER_TEMP } = require('../helper/template.js');

const prettier = {
  action: async () => {
    let settingHuskyOra, downloadPluginOra, settingPrettierOra, downloadEslintPlgOra;
    const { startOraWithTemp, stderrHdr, stdoutHdr } = await asyncOutput();
    const { default: ora } = await import('ora');
    try {
      if (!isFileExistInRoot('package.json'))
        throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr();

      // install prettier
      downloadPluginOra = startOraWithTemp('Download plugin...');
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'prettier husky@9.0.11'
      });
      downloadPluginOra.succeed(installPlugRes);
      downloadPluginOra = null;

      // read dir
      const [files, err] = readdirToString(path.resolve('./'));
      if (err) throw new Error(`Readdir failed! ${err}}`);

      // install & set eslint-plugin-prettier eslint-config-prettier if has eslint
      const eslintrcFilename = files.split(',').find((fname) => /\.eslintrc/.test(fname));
      if (eslintrcFilename) {
        downloadEslintPlgOra = startOraWithTemp('Download plugin...');
        const installPlugRes = await installPlugin({
          pkgManager,
          stdoutHdr: (data) => stdoutHdr(data, downloadEslintPlgOra),
          plugin: 'eslint-plugin-prettier eslint-config-prettier'
        });
        downloadEslintPlgOra.succeed(installPlugRes);
        downloadEslintPlgOra = null;

        // set plugin if .eslintrc format is json|js|mjs|cjs
        if (['json', 'js', 'mjs', 'cjs'].includes(eslintrcFilename.split('.').at(-1))) {
          const filePath = isFileExistInRoot(eslintrcFilename);
          let eslintcfg = fs.readFileSync(filePath, 'utf-8');
          eslintcfg = eslintcfg.replace(
            /((extends:|"extends":)\s*\[[^\]]*)/,
            `$1"plugin:prettier/recommended", $2`
          );
          await writeRootFileByTemp(eslintcfg, eslintrcFilename);
        } else {
          ora({
            text: `your .eslintrc format isn't avaliable to fix,\n you need push "prettier" into extends array.`
          }).warn();
        }
      }

      // set husky if no .husky
      if (!/\.husky/.test(files)) {
        settingHuskyOra = startOraWithTemp(`Setting husky...`);
        await execCmd({
          cmdStr: `npm pkg set scripts.prepare="husky"`,
          errMsg: 'Set scripts.prepare fail'
        });
        await execCmd({
          cmdStr: 'npm run prepare',
          errMsg: 'Run prepare fail'
        });
        settingHuskyOra.succeed('Set husky succeed!');
      }

      // set prettier for lint-staged if needed
      const lintstagedrcFilename = files.split(',').find((fname) => /\.lintstagedrc/.test(fname));
      if (lintstagedrcFilename) {
        // set lintstaged if .lintstagedrc format is json|js|mjs|cjs
        if (['json', 'js', 'mjs', 'cjs'].includes(lintstagedrcFilename.split('.').at(-1))) {
          const lintstagedFilePath = isFileExistInRoot(lintstagedrcFilename);
          let lintstagedcfg = fs.readFileSync(lintstagedFilePath, 'utf-8');
          lintstagedcfg = lintstagedcfg.replace(/\[([^\]]*)/g, `["prettier --write", $1`);
          await writeRootFileByTemp(lintstagedcfg, lintstagedrcFilename);
        } else {
          ora({
            text: `your .lintstagedrc format isn't avaliable to fix,\n you need push "prettier --write" into "lintstagedrc".`
          }).warn();
        }
      } else {
        await execCmd({
          cmdStr: `echo npx prettier . --write > .husky/pre-commit`,
          errMsg:
            'Run echo "npx prettier . --write" > .husky/pre-commit failed, check out your .git directory!'
        });
      }

      // choose prettierrc format
      const { format } = await choicesPrompt('format', [
        { title: 'json', value: 'json' },
        { title: 'rc', value: 'rc' },
        { title: 'cjs', value: 'cjs' },
        { title: 'mjs', value: 'mjs' }
      ]);

      // write prettierrc
      settingPrettierOra = startOraWithTemp('Setting .prettierrc...');
      await writeRootFileByTemp(PRETTIER_TEMP[format], `.prettierrc.${format}`);
      await writeRootFileByTemp(PRETTIER_TEMP.ignore, `.prettierignore`);
      settingPrettierOra.succeed('Setting prettier succeed!');
    } catch (error) {
      downloadPluginOra?.fail();
      settingHuskyOra?.fail();
      settingPrettierOra?.fail();
      downloadEslintPlgOra?.fail();
      stderrHdr(error);
    }
  }
};

module.exports = prettier;
