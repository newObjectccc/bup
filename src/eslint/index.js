const chooseFramework = require('../common/choose-framework.js');
const choosePkgMgr = require('../common/choose-pkg-manager.js');
const installPlugin = require('../common/install-plugin.js');
const { DEPS_NEED_TO_INSTALL, ESLINT_FORMAT_TYPE } = require('../helper/constant.js');
const asyncOutput = require('../helper/output.js');
const { installEslint, settingEslintrc } = require('./eslint-common.js');

const eslint = {
  option: ['-f, --format <char>', 'default eslintrc.js if no specify'],
  action: async (fmt) => {
    const { startOraWithTemp, stderrHdr, stdoutHdr } = await asyncOutput();
    const { default: chalk } = await import('chalk');
    let loadingEslintOra, settingEslintOra, downloadPluginOra;
    try {
      // verify whether the parameters are valid
      if (fmt.format === void 0) fmt.format = 'js';
      if (!ESLINT_FORMAT_TYPE.includes(fmt.format)) {
        stderrHdr(
          ` Parameter "--format" must be one of "${ESLINT_FORMAT_TYPE.join('|')}"`,
          loadingEslintOra
        );
        return;
      }

      // download eslint
      const { pkgManager } = await choosePkgMgr();
      loadingEslintOra = startOraWithTemp('Download eslint');
      await installEslint({ pkgManager, stdoutHdr: (data) => stdoutHdr(data, loadingEslintOra) });
      loadingEslintOra.succeed('ESLint download succeed');

      // choose framework
      const fwk = await chooseFramework();

      // setting eslintrc
      settingEslintOra = startOraWithTemp(`Setting eslint...`);
      settingEslintOra.text = chalk.green('Setting ESLint...');
      const writeRes = await settingEslintrc({ fmt: fmt.format, fwk: fwk.framework });
      settingEslintOra.succeed(`${writeRes} succeed!`);

      // install plugin
      downloadPluginOra = startOraWithTemp('Download plugin');
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: DEPS_NEED_TO_INSTALL[fwk.framework]
      });
      downloadPluginOra.succeed(`${installPlugRes}, all completed!`);
    } catch (error) {
      loadingEslintOra?.fail();
      settingEslintOra?.fail();
      downloadPluginOra?.fail();
      stderrHdr(error);
    }
  }
};

module.exports = eslint;
