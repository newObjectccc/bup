const choosePkgMgr = require('../common/choose-pkg-manager.js');
const installPlugin = require('../common/install-plugin.js');
const isFileExistInRoot = require('../common/is-file-exist.js');
const asyncOutput = require('../helper/output.js');
const settingChangelogOptions = require('./changelog-common.js');

const changelog = {
  option: ['-c, --custom', 'if specify, will create standard-version-updater.js to customize'],
  action: async ({ custom }) => {
    const { startOraWithTemp, stderrHdr, stdoutHdr } = await asyncOutput();
    let downloadPluginOra;
    try {
      if (!isFileExistInRoot('package.json'))
        throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr();

      // install standard-version
      downloadPluginOra = startOraWithTemp('Download plugin...');
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'standard-version'
      });
      downloadPluginOra.succeed(installPlugRes);

      // setting husky
      await settingChangelogOptions(pkgManager, custom);
    } catch (error) {
      downloadPluginOra?.fail();
      stderrHdr(error);
    }
  }
};

module.exports = changelog;
