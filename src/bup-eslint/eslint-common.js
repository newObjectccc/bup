import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import installPlugin from '../common/install-plugin.js';
import isPackageJsonExist from '../common/is-package-exist.js';
import { ESLINT_FORMAT_TYPE } from '../helper/constant.js';
import { ESLINT_TEMPLATE } from '../helper/template.js';

export async function installEslint(options) {
  const hasPackageJson = isPackageJsonExist()
  if (!hasPackageJson) reject('There is no package.json in the current folder!')
  return await installPlugin({ ...options, plugin: 'eslint' })
}

export function settingEslintrc(options) {
  const { fmt, fwk } = options
  return new Promise((resolve, reject) => {
    if (!ESLINT_FORMAT_TYPE.includes(fmt)) reject(`Parameter "--format" must be one of "${ESLINT_FORMAT_TYPE.join('|')}"`)
    const cwd = process.cwd();
    const filename = path.join(cwd, `eslintrc.${fmt}`)
    const tmp = ESLINT_TEMPLATE[`${fwk}_${fmt}`]
    fs.writeFile(filename, tmp, (err) => {
      reject(err)
    })
    resolve(`Setting eslintrc.${fmt}`)
  })
}