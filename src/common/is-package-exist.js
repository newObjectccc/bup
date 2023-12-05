import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function isPackageJsonExist() {
  const cwd = process.cwd();
  const filePath = path.join(cwd, 'package.json')
  const isExist = fs.existsSync(filePath);
  return isExist && filePath
}

export default isPackageJsonExist