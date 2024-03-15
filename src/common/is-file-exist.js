const path = require('path');
const process = require('process');
const fs = require('fs');

function isFileExistInRoot(filename) {
  const cwd = process.cwd();
  const filePath = path.join(cwd, filename);
  const isExist = fs.existsSync(filePath);
  return isExist && path.resolve(filePath);
}

module.exports = isFileExistInRoot;
