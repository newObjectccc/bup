const choicesPrompt = require('./choices-prompt.js');

async function choosePkgMgr() {
  return choicesPrompt('pkgManager', [
    { title: 'npm', value: 'npm' },
    { title: 'yarn', value: 'yarn' },
    { title: 'pnpm', value: 'pnpm' }
  ]);
}

module.exports = choosePkgMgr;
