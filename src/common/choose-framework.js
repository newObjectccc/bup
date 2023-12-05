import prompts from 'prompts';

async function chooseFramework() {
  const res = await prompts([
    {
      type: 'select',
      name: 'framework',
      message: 'which framework do you prefer?',
      choices: [
        { title: 'Vue', value: 'vue' },
        { title: 'React', value: 'react' },
        { title: 'Angular', value: 'angular' },
      ]
    }
  ])
  return res
}
export default chooseFramework;