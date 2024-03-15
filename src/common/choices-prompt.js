const prompts = require('prompts');

async function choicesPrompt(name, choices) {
  const res = await prompts([
    {
      type: 'select',
      name,
      message: `which ${name} do you prefer?`,
      choices
    }
  ]);
  return res;
}

module.exports = choicesPrompt;
