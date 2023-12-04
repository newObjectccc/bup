import prompts from 'prompts';

async function choosePkgMgr() {
  const res = await prompts([
    {
      type: 'select',
      name: 'pkgManager',
      message: 'which package tool do you prefer?',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'pnpm', value: 'pnpm' },
      ]
    }
  ])
  return res
}
export default choosePkgMgr;