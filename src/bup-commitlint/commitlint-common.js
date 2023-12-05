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
  res?.isPrompt && await installPlugin({
    pkgManager,
    stdoutHdr: (data) => stdoutHdr(data, settingCommitCfgOra),
    plugin: '@commitlint/prompt-cli @commitlint/cz-commitlint'
  })
  await execCmd({
    cmdStr: `npm pkg set scripts.commit="commit"`,
    stdoutHdr: (data) => stdoutHdr(data, settingCommitCfgOra),
    errMsg: 'Set scripts.commit fail'
  })
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
      export default {
        extends: ['@commitlint/config-conventional'],
        // 添加你的规则 
        rules: {
          'type-enum': ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
        },
        // // 如果你需要忽略某个特殊的commit, 但不建议
        // ignores: [(commit) => commit === ''],
        // // 自定义你的 prompt, Documentation => https://commitlint.js.org/#/reference-prompt
        // prompt: {
        //   settings: {},
        //   messages: {
        //     skip: ':skip',
        //     max: 'upper %d chars',
        //     min: '%d chars at least',
        //     emptyWarning: 'can not be empty',
        //     upperLimitWarning: 'over limit',
        //     lowerLimitWarning: 'below limit'
        //   },
        //   questions: {
        //     type: {
        //       description: "Select the type of change that you're committing:",
        //       enum: {
        //         feat: {
        //           description: 'A new feature',
        //           title: 'Features',
        //           emoji: '✨',
        //         },
        //         fix: {
        //           description: 'A bug fix',
        //           title: 'Bug Fixes',
        //           emoji: '🐛',
        //         },
        //         docs: {
        //           description: 'Documentation only changes',
        //           title: 'Documentation',
        //           emoji: '📚',
        //         },
        //         style: {
        //           description: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
        //           title: 'Styles',
        //           emoji: '💎',
        //         },
        //         refactor: {
        //           description: 'A code change that neither fixes a bug nor adds a feature',
        //           title: 'Code Refactoring',
        //           emoji: '📦',
        //         },
        //         perf: {
        //           description: 'A code change that improves performance',
        //           title: 'Performance Improvements',
        //           emoji: '🚀',
        //         },
        //         test: {
        //           description: 'Adding missing tests or correcting existing tests',
        //           title: 'Tests',
        //           emoji: '🚨',
        //         },
        //         build: {
        //           description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
        //           title: 'Builds',
        //           emoji: '🛠',
        //         },
        //         ci: {
        //           description: 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
        //           title: 'Continuous Integrations',
        //           emoji: '⚙️',
        //         },
        //         chore: {
        //           description: "Other changes that don't modify src or test files",
        //           title: 'Chores',
        //           emoji: '♻️',
        //         },
        //         revert: {
        //           description: 'Reverts a previous commit',
        //           title: 'Reverts',
        //           emoji: '🗑',
        //         },
        //       },
        //     },
        //     scope: {
        //       description:
        //         'What is the scope of this change (e.g. component or file name)',
        //     },
        //     subject: {
        //       description: 'Write a short, imperative tense description of the change',
        //     },
        //     body: {
        //       description: 'Provide a longer description of the change',
        //     },
        //     isBreaking: {
        //       description: 'Are there any breaking changes?',
        //     },
        //     breakingBody: {
        //       description:
        //         'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
        //     },
        //     breaking: {
        //       description: 'Describe the breaking changes',
        //     },
        //     isIssueAffected: {
        //       description: 'Does this change affect any open issues?',
        //     },
        //     issuesBody: {
        //       description:
        //         'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
        //     },
        //     issues: {
        //       description: 'Add issue references (e.g. "fix #123", "re #123".)',
        //     },
        //   },
        // },
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