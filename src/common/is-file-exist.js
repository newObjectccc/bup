import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function isFileExistInRoot(filename) {
  const cwd = process.cwd();
  const filePath = path.join(cwd, filename)
  const isExist = fs.existsSync(filePath);
  return isExist && path.resolve(filePath)
}

export default isFileExistInRoot