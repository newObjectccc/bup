import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ora from 'ora';
import prompts from 'prompts';
import execCmd from '../common/exec-cmd.js';
import installPlugin from '../common/install-plugin.js';
import isPackageJsonExist from '../common/is-package-exist.js';
import { stdoutHdr } from '../helper/output.js';

const settingHuskyOra = ora({
  text: `Setting husky...`,
});

const settingCommitCfgOra = ora({
  text: `Setting commitlint...`,
})

export async function execSettingHuskyAndCommitlint(pkgManager) {
  if (!isPackageJsonExist()) return
  settingHuskyOra.start()
  settingHuskyOra.spinner = 'moon'
  settingHuskyOra.prefixText = chalk.dim('[info]')
  await execCmd({
    cmdStr: `npm pkg set scripts.prepare="husky install"`,
    errMsg: 'Set scripts.prepare fail'
  })
  await execCmd({
    cmdStr: 'npm run prepare',
    errMsg: 'Run prepare fail'
  })
  await execCmd({
    cmdStr: `npx husky add .husky/commit-msg "npx --no-install commitlint --edit "$1""`,
    errMsg: 'Run prepare fail'
  })
  settingHuskyOra.succeed('Set husky succeed!')

  // install prompt-cli if needed & set commintlint
  const res = await isPromptToCommit()
  settingCommitCfgOra.start()
  settingCommitCfgOra.spinner = 'moon'
  settingCommitCfgOra.prefixText = chalk.dim('[info]')
  if (res?.isPrompt) {
    await installPlugin({
      pkgManager,
      stdoutHdr: (data) => stdoutHdr(data, settingCommitCfgOra),
      plugin: '@commitlint/prompt-cli'
    })
    await execCmd({
      cmdStr: `npm pkg set scripts.commit="commit"`,
      stdoutHdr: (data) => stdoutHdr(data, settingCommitCfgOra),
      errMsg: 'Set scripts.commit fail'
    })
  }
  const execRes = await settingCommitlintConfig()
  if (!execRes) {
    settingCommitCfgOra.fail('You should use bup under the root directory of the project!')
    return
  }
  settingCommitCfgOra.succeed(execRes)
  return true
}

// set commitlint.config.js
function settingCommitlintConfig() {
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();
    const filename = path.join(cwd, 'commitlint.config.js')
    const tmp = `
      module.exports = {
        extends: ['@commitlint/config-conventional'],
        // 添加你的规则 
        rules: {
          // 'type-enum': ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
        },
        // // 如果你需要忽略某个特殊的commit, 但不建议
        // // ignores: [(commit) => commit === ''],
      }
    `
    fs.writeFile(filename, tmp, (err) => {
      reject(err)
    })
    resolve(`All done! check out commitlint.config.js and customize.`)
  })
}

// choose prompt or not
async function isPromptToCommit() {
  const res = await prompts([
    {
      type: 'confirm',
      name: 'isPrompt',
      message: 'do you like use pormpt to commit?',
      initial: true
    }
  ])
  return res
}