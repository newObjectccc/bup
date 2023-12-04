import fs from 'node:fs';
import process from 'node:process';

export function handler(options) {
  const cwd = process.cwd
  console.log(fs);
}