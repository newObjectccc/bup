import execCmd from '../common/exec-cmd.js';
import installPlugin from '../common/install-plugin.js';
import writeFileByTemp from '../common/write-file.js';
import { startOraWithTemp, stdoutHdr } from '../helper/output.js';
import { CHANGELOG_TEMP } from '../helper/template.js';

export async function settingChangelogOptions(pkgManager, custom) {
  let settingChangelogOra, customOra;
  try {
    // set script difflog
    settingChangelogOra = startOraWithTemp(`Setting changelog...`);
    await execCmd({
      cmdStr: `npm pkg set scripts.difflog="standard-version"`,
      stdoutHdr: (data) => stdoutHdr(data, settingChangelogOra),
      errMsg: 'Set scripts.difflog fail'
    });
    settingChangelogOra.succeed();

    // customize
    if (custom) {
      // install detect-newline detect-indent stringify-package
      customOra = startOraWithTemp(`Setting standard-version-updater.js...`);
      const installRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, customOra),
        plugin: 'detect-newline@3.1.0 detect-indent@6.1.0 stringify-package'
      });
      customOra.succeed(installRes);

      // srite .versionrc.js
      const versionrcFileOra = stdoutHdr('Set .versionrc.js...');
      await writeFileByTemp(CHANGELOG_TEMP.versionrc, '.versionrc.js');
      versionrcFileOra.succeed();

      // write VERSION_TRACKER.json
      const trackerFileOra = stdoutHdr('Set VERSION_TRACKER.json...');
      await writeFileByTemp(CHANGELOG_TEMP.tracker, 'VERSION_TRACKER.json');
      trackerFileOra.succeed();

      // write standard-version-updater.js
      const updaterFileOra = stdoutHdr('Set standard-version-updater.js...');
      await writeFileByTemp(CHANGELOG_TEMP.updater, 'standard-version-updater.js');
      updaterFileOra.succeed();
      customOra.succeed('Edit standard-version-updater.js customize yourself!');
    }
    return true;
  } catch (error) {
    settingChangelogOra?.fail(error);
    customOra?.fail(error);
  }
}
