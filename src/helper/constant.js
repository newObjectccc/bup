
export const ESLINT_FORMAT_TYPE = ['js', 'mjs', 'json', 'yml']

export const CMD_ON_PKG_MANAGER = {
  pnpm: (plg) => `pnpm add ${plg} -D`,
  yarn: (plg) => `yarn add ${plg} -D`,
  npm: (plg) => `npm install ${plg} -D`,
}

export const DEPS_NEED_TO_INSTALL = {
  vue: ['babel-eslint', 'eslint-plugin-vue'],
  react: ['eslint-plugin-react']
}