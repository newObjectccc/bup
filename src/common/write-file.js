const path = require('path');
const fs = require('fs');
const process = require('process');

function writeRootFileByTemp(temp, filename) {
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();
    const normalaizePath = path.join(cwd, filename);
    fs.writeFile(normalaizePath, temp, (err) => {
      reject(err);
    });
    resolve(`Setting done! check out ${filename}.`);
  });
}

module.exports = writeRootFileByTemp;
