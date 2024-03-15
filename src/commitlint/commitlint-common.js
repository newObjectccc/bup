const prompts = require('prompts');
const choicesPrompt = require('../common/choices-prompt.js');
const execCmd = require('../common/exec-cmd.js');
const installPlugin = require('../common/install-plugin.js');
const writeRootFileByTemp = require('../common/write-file.js');
const asyncOutput = require('../helper/output.js');
const { COMMITLINT_TEMP } = require('../helper/template.js');

async function execSettingHuskyAndCommitlint(pkgManager) {
  const { startOraWithTemp, stdoutHdr } = await asyncOutput();
  const settingHuskyOra = startOraWithTemp(`Setting husky...`);
  try {
    await execCmd({
      cmdStr: `npm pkg set scripts.prepare="husky"`,
      errMsg: 'Set scripts.prepare fail'
    });
    await execCmd({
      cmdStr: 'npm run prepare',
      errMsg: 'Run prepare fail'
    });
    await execCmd({
      cmdStr: `echo npx --no-install commitlint --edit $1 > .husky/commit-msg`,
      errMsg:
        'Run echo "npx --no-install commitlint --edit $1" > .husky/commit-msg failed, check out your .git directory!'
    });
  } catch (error) {
    settingHuskyOra.fail();
    throw error;
  }
  settingHuskyOra.succeed('Set husky succeed!');

  // install prompt-cli if needed & set commintlint
  const { isPrompt } = await isPromptToCommit();
  if (isPrompt) {
    const installPromptCliOra = startOraWithTemp(`Install prompt-cli...`);
    try {
      const installRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, installPromptCliOra),
        plugin: '@commitlint/prompt-cli'
      });
      await execCmd({
        cmdStr: `npm pkg set scripts.commit="commit"`,
        stdoutHdr: (data) => stdoutHdr(data, installPromptCliOra),
        errMsg: 'Set scripts.commit fail'
      });
      installPromptCliOra.succeed(installRes);
    } catch (error) {
      settingCommitCfgOra.fail();
      installPromptCliOra.fail();
      throw error;
    }
  }
  // choose format
  const { format } = await choicesPrompt('format', [
    { title: 'cjs', value: 'cjs' },
    { title: 'mjs', value: 'mjs' }
  ]);
  // write commitlint.config.js
  const settingCommitCfgOra = startOraWithTemp(`Setting commitlint...`);
  const execRes = await writeRootFileByTemp(COMMITLINT_TEMP[format], 'commitlint.config.js');
  if (!execRes) {
    settingCommitCfgOra.fail();
    throw new Error('You should use bup under the root directory of the project!');
  }
  settingCommitCfgOra.succeed(execRes);
  return true;
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
  ]);
  return res;
}

module.exports = execSettingHuskyAndCommitlint;
