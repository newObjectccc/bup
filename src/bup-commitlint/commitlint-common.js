import execCmd from '../common/exec-cmd.js';
import isPackageJsonExist from '../common/is-package-exist.js';
import { stdoutHdr } from '../helper/output.js';


export async function execSettingHuskyAndCommitlint() {
  if (!isPackageJsonExist()) return
  await execCmd({ cmdStr: `npm pkg set scripts.prepare="husky install"`, stdoutHdr, errMsg: 'Set scripts.prepare fail' })
  await execCmd({ cmdStr: 'npm run prepare', stdoutHdr, errMsg: 'Run prepare fail' })
  await execCmd({ cmdStr: `npx husky add .husky/commit-msg "npx --no-install commitlint --edit "$1""`, stdoutHdr, errMsg: 'Run prepare fail' })
  await execCmd({ cmdStr: `echo export default {extends: ['@commitlint/config-conventional']} > commitlint.config.js`, stdoutHdr, errMsg: '' })
  return 'Husky setting succeed!'
}