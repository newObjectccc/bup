import prompts from 'prompts';

// choose prompt or not
async function confirmPrompt(message) {
  const res = await prompts([
    {
      type: 'confirm',
      name: 'bool',
      message,
      initial: true
    }
  ]);
  return res;
}

export default confirmPrompt;
