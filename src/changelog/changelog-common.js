const execCmd = require('../common/exec-cmd.js');
const installPlugin = require('../common/install-plugin.js');
const writeRootFileByTemp = require('../common/write-file.js');
const asyncOutput = require('../helper/output.js');
const { CHANGELOG_TEMP } = require('../helper/template.js');

async function settingChangelogOptions(pkgManager, custom) {
  const { startOraWithTemp, stdoutHdr } = await asyncOutput();
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
      await writeRootFileByTemp(CHANGELOG_TEMP.versionrc, '.versionrc.js');
      versionrcFileOra.succeed();

      // write VERSION_TRACKER.json
      const trackerFileOra = stdoutHdr('Set VERSION_TRACKER.json...');
      await writeRootFileByTemp(CHANGELOG_TEMP.tracker, 'VERSION_TRACKER.json');
      trackerFileOra.succeed();

      // write standard-version-updater.js
      const updaterFileOra = stdoutHdr('Set standard-version-updater.js...');
      await writeRootFileByTemp(CHANGELOG_TEMP.updater, 'standard-version-updater.js');
      updaterFileOra.succeed();
      customOra.succeed('Edit standard-version-updater.js customize yourself!');
    }
    return true;
  } catch (error) {
    settingChangelogOra?.fail(error);
    customOra?.fail(error);
  }
}

module.exports = settingChangelogOptions;
