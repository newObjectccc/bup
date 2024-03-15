const choicesPrompt = require('./choices-prompt.js');

async function chooseFramework() {
  return choicesPrompt('framework', [
    { title: 'Vue', value: 'vue' },
    { title: 'React', value: 'react' }
  ]);
}

module.exports = chooseFramework;
