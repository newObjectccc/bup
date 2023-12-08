import json from '@rollup/plugin-json';
import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { terser } from 'rollup-plugin-terser';

export default {
  input: Object.fromEntries(
    glob
      .sync('src/**/*.js')
      .map((file) => [
        path.relative('src', file.slice(0, file.length - path.extname(file).length)),
        fileURLToPath(new URL(file, import.meta.url))
      ])
  ),
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [json(), terser()]
};
