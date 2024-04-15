const fs = require('fs');
const path = require('path');
const process = require('process');
const { ESLINT_FORMAT_TYPE } = require('../helper/constant.js');
const installPlugin = require('../common/install-plugin.js');
const isFileExistInRoot = require('../common/is-file-exist.js');
const { ESLINT_TEMPLATE } = require('../helper/template.js');

async function installEslint(options) {
  const hasPackageJson = isFileExistInRoot('package.json');
  if (!hasPackageJson) throw new Error('There is no package.json in the current folder!');
  return await installPlugin({ ...options, plugin: 'eslint' });
}

function settingEslintrc(options) {
  const { fmt, fwk } = options;
  return new Promise((resolve, reject) => {
    if (!ESLINT_FORMAT_TYPE.includes(fmt))
      reject(`Parameter "--format" must be one of "${ESLINT_FORMAT_TYPE.join('|')}"`);
    const cwd = process.cwd();
    const filename = path.join(cwd, `.eslintrc.${fmt}`);
    const tmp = ESLINT_TEMPLATE[`${fwk}_${fmt}`];
    fs.writeFile(filename, tmp, (err) => {
      reject(err);
    });
    resolve(`Setting eslintrc.${fmt}`);
  });
}

module.exports = {
  installEslint,
  settingEslintrc
};
