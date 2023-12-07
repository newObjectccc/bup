import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

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

export default writeRootFileByTemp;
