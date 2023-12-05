import ora from 'ora';
import execCmd from '../common/exec-cmd.js';
import installPlugin from '../common/install-plugin.js';
import { startOraWithTemp, stdoutHdr } from '../helper/output.js';

const settingChangelogOra = ora({
  text: `Setting changelog...`,
});

const customOra = ora({
  text: `Setting standard-version-updater.js...`,
})

export async function settingChangelogOptions(pkgManager, custom) {

  startOraWithTemp(settingChangelogOra)
  await execCmd({
    cmdStr: `npm pkg set scripts.difflog="standard-version"`,
    stdoutHdr: (data) => stdoutHdr(data, settingChangelogOra),
    errMsg: 'Set scripts.difflog fail'
  })

  if (custom) {
    startOraWithTemp(customOra)
    await installPlugin({
      pkgManager,
      stdoutHdr: (data) => stdoutHdr(data, customOra),
      plugin: 'detect-newline detect-indent stringify-package'
    })
    customOra.text = 'Set .versionrc.js...'
    await writeFileByTemp(`
      const tracker = {
        filename: 'VERSION_TRACKER.json',
        updater: require('./standard-version-updater.js')
      }

      module.exports = {
        bumpFiles: [tracker],
        packageFiles: [tracker]
      }
    `, '.versionrc.js')
    customOra.text = 'Set VERSION_TRACKER.json...'
    await writeFileByTemp(`
      {
        "tracker": {
          "package": {
            "version": "1.0.0"
          }
        }
      }
    `, 'VERSION_TRACKER.json')
    customOra.text = 'Set standard-version-updater.js...'
    await writeFileByTemp(`
      const stringifyPackage = require('stringify-package')
      const detectIndent = require('detect-indent')
      const detectNewline = require('detect-newline')

      module.exports.readVersion = function (contents) {
        return JSON.parse(contents).tracker.package.version;
      }

      module.exports.writeVersion = function (contents, version) {
        const json = JSON.parse(contents)
        let indent = detectIndent(contents).indent
        let newline = detectNewline(contents)
        json.tracker.package.version = version
        return stringifyPackage(json, indent, newline)
      }
    `, 'standard-version-updater.js')
    customOra.succeed('Set standard-version customize succeed!')
    return true
  }

}
