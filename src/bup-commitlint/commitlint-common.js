import prompts from 'prompts';
import choicesPrompt from '../common/choices-prompt.js';
import execCmd from '../common/exec-cmd.js';
import installPlugin from '../common/install-plugin.js';
import writeRootFileByTemp from '../common/write-file.js';
import { startOraWithTemp, stdoutHdr } from '../helper/output.js';
import { COMMITLINT_TEMP } from '../helper/template.js';

export async function execSettingHuskyAndCommitlint(pkgManager) {
  const settingHuskyOra = startOraWithTemp(`Setting husky...`);
  try {
    await execCmd({
      cmdStr: `npm pkg set scripts.prepare="husky install"`,
      errMsg: 'Set scripts.prepare fail'
    });
    await execCmd({
      cmdStr: 'npm run prepare',
      errMsg: 'Run prepare fail'
    });
    await execCmd({
      cmdStr: `npx husky add .husky/commit-msg "npx --no-install commitlint --edit "$1""`,
      errMsg: 'Run husky add .husky/commit-msg fail, check out your .git directory!'
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
