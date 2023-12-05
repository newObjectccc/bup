import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import isPackageJsonExist from '../common/is-package-exist.js';
import { CMD_ON_PKG_MANAGER, ESLINT_FORMAT_TYPE } from '../helper/constant.js';
import { ESLINT_TEMPLATE } from '../helper/template.js';

export async function installEslint(options) {
  return new Promise((resolve, reject) => {
    const hasPackageJson = isPackageJsonExist()
    if (!hasPackageJson) reject('There is no package.json in the current folder!')
    const { pkgManager, stdoutHdr } = options
    const cmd = exec(CMD_ON_PKG_MANAGER[pkgManager])
    cmd.stdout.on('data', (data) => {
      stdoutHdr(data)
    })
    cmd.stderr.on('data', (data) => {
      reject(data)
    })
    cmd.on('close', (code) => {
      resolve(code)
    })
  })
}

export function settingEslintrc(options) {
  const { fmt, fwk } = options
  return new Promise((resolve, reject) => {
    if (!ESLINT_FORMAT_TYPE.includes(fmt)) reject('Parameter "--format" must be one of "js|cjs|json|yaml|yml|pkg"')
    if (fmt === 'pkg') {
      // ...add package.json
      return
    }
    const cwd = process.cwd();
    const filename = path.join(cwd, `eslintrc.${fmt}`)
    const tmpFn = ESLINT_TEMPLATE[fmt]
    const fwkExts = ESLINT_EXTENSION_ON_FRAMEWORK[fwk]
    const tmp = tmpFn(fwkExts)
    fs.writeFile(filename, tmp, (err) => {
      reject(err)
    })
    resolve(`Setting eslintrc.${fmt}`)
  })
}