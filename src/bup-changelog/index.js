import { Command } from 'commander';
import ora from 'ora';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import installPlugin from '../common/install-plugin.js';
import isFileExistInRoot from '../common/is-file-exist.js';
import { startOraWithTemp, stderrHdr, stdoutHdr } from '../helper/output.js';
import { settingChangelogOptions } from './changelog-common.js';
const program = new Command();

const chiosePkgOra = ora({
  text: 'Choose package Manager',
});

const downloadPluginOra = ora({
  text: 'Download plugin...',
});

program
  .option('-c, --custom', 'if specify, will create standard-version-updater.js to customize')
  .action(async ({ custom }) => {
    try {
      if (!isFileExistInRoot('package.json')) throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr()
      chiosePkgOra.start();
      chiosePkgOra.succeed(`${pkgManager}, nice chiose!`);

      // install standard-version
      startOraWithTemp(downloadPluginOra)
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'standard-version'
      })
      downloadPluginOra.succeed(installPlugRes)

      // setting husky
      await settingChangelogOptions(pkgManager, custom)
    } catch (error) {
      stderrHdr(error, downloadPluginOra)
    }
  });

program.parse();
