const Command = require('commander');
import choosePkgMgr from '../common/choose-pkg-manager.js';
import installPlugin from '../common/install-plugin.js';
import isFileExistInRoot from '../common/is-file-exist.js';
import { startOraWithTemp, stderrHdr, stdoutHdr } from '../helper/output.js';
import { settingChangelogOptions } from './changelog-common.js';
const program = new Command();

program
  .option('-c, --custom', 'if specify, will create standard-version-updater.js to customize')
  .action(async ({ custom }) => {
    let downloadPluginOra
    try {
      if (!isFileExistInRoot('package.json')) throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr()

      // install standard-version
      downloadPluginOra = startOraWithTemp('Download plugin...')
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'standard-version'
      })
      downloadPluginOra.succeed(installPlugRes)

      // setting husky
      await settingChangelogOptions(pkgManager, custom)
    } catch (error) {
      downloadPluginOra?.fail()
      stderrHdr(error)
    }
  });

program.parse();
