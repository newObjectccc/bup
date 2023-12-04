import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function isPackageJsonExist() {
  const cwd = process.cwd();
  const isExist = fs.existsSync(path.join(cwd, 'package.json'));
  return isExist
}

export default isPackageJsonExist