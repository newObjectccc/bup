#! /usr/local/env node
const choosePkgMgr = require('../common/choose-pkg-manager.js');
const installPlugin = require('../common/install-plugin.js');
const isFileExistInRoot = require('../common/is-file-exist.js');
const { startOraWithTemp, stderrHdr, stdoutHdr } = require('../helper/output.js');
const execSettingHuskyAndCommitlint = require('./commitlint-common.js');

const commitlint = {
  action: async () => {
    let settingCommitlintOra, downloadPluginOra;
    try {
      if (!isFileExistInRoot('package.json'))
        throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr();

      // install commitlint
      const downloadPluginOra = startOraWithTemp('Download plugin...');
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'husky@9.0.11 commitlint @commitlint/config-conventional @commitlint/cli'
      });
      downloadPluginOra.succeed(installPlugRes);

      // setting husky
      await execSettingHuskyAndCommitlint(pkgManager);
    } catch (error) {
      downloadPluginOra?.fail();
      settingCommitlintOra?.fail();
      stderrHdr(error);
    }
  }
};

module.exports = commitlint;
