const fs = require('fs');
const asyncOutput = require('../helper/output.js');
const choicesPrompt = require('../common/choices-prompt.js');
const execCmd = require('../common/exec-cmd.js');

const BASE_CLONE_URL = 'https://github.com/newObjectccc';

const boilerplate = {
  action: async () => {
    let cloneBoilerplateOra, downloadPluginOra;
    const { startOraWithTemp, stderrHdr, stdoutHdr } = await asyncOutput();
    try {
      const { framework } = await choicesPrompt('framework', [
        { title: 'vscode-boilerplate', value: 'vscode-extension-boilerplate' },
        { title: 'chrome-boilerplate', value: 'chrome-extension-boilerplate' },
        { title: 'electron-boilerplate', value: 'electron-react-ts-vite-template' },
        { title: 'next-gen-web-boilerplate', value: 'next-gen-web-project' }
      ]);
      await execCmd({
        cmdStr: `git clone ${BASE_CLONE_URL}/${framework}.git .`,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        errMsg: `Failed to clone ${framework}!`
      });
      cloneBoilerplateOra = startOraWithTemp('boilerplate has installed!');
      fs.rmSync('.git', { recursive: true });
      await execCmd({
        cmdStr: 'git init && git add .',
        stdoutHdr: (data) => stdoutHdr(data, cloneBoilerplateOra),
        errMsg: 'Failed to init git!'
      });
      cloneBoilerplateOra.succeed('boilerplate initail successed!');
    } catch (error) {
      stderrHdr(error);
      downloadPluginOra?.fail();
      cloneBoilerplateOra?.fail();
    }
  }
};

module.exports = boilerplate;
