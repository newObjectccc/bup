import { Command } from 'commander';
import ora from 'ora';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import installPlugin from '../common/install-plugin.js';
import isPackageJsonExist from '../common/is-package-exist.js';
import { stderrHdr, stdoutHdr } from '../helper/output.js';
import { execSettingHuskyAndCommitlint } from './commitlint-common.js';
const program = new Command();

const chiosePkgOra = ora({
  text: 'Choose package Manager',
});

const downloadPluginOra = ora({
  text: 'Download plugin...',
});

program
  .option('-c, --custom', 'if specify, will use cz-customizable to customize')
  .action(async ({ custom }) => {
    try {
      if (!isPackageJsonExist()) throw new Error('There is no package.json in the current folder!');
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
      await execSettingHuskyAndCommitlint(pkgManager)

      // customize
      if (custom) {
        //...
      }
    } catch (error) {
      chiosePkgOra.fail()
      stderrHdr(error, downloadPluginOra)
    }
  });

program.parse();
