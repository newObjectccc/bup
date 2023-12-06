import { Command } from 'commander';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import installPlugin from '../common/install-plugin.js';
import isFileExistInRoot from '../common/is-file-exist.js';
import { startOraWithTemp, stderrHdr, stdoutHdr } from '../helper/output.js';
import { execSettingHuskyAndCommitlint } from './commitlint-common.js';
const program = new Command();

program
  .action(async () => {
    try {
      if (!isFileExistInRoot('package.json')) throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr()

      // install commitlint
      const downloadPluginOra = startOraWithTemp('Download plugin...')
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'husky commitlint @commitlint/config-conventional @commitlint/cli'
      })
      downloadPluginOra.succeed(installPlugRes)

      // setting husky
      await execSettingHuskyAndCommitlint(pkgManager)
    } catch (error) {
      stderrHdr(error, settingCommitlintOra)
    }
  });

program.parse();
