import choicesPrompt from './choices-prompt.js';

async function chooseFramework() {
  return choicesPrompt('framework', [
    { title: 'Vue', value: 'vue' },
    { title: 'React', value: 'react' },
  ])
}
export default chooseFramework;