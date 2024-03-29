const ESLINT_FORMAT_TYPE = ['js', 'mjs', 'json', 'yml'];

const CMD_ON_PKG_MANAGER = {
  pnpm: (plg) => `pnpm add ${plg} -D`,
  yarn: (plg) => `yarn add ${plg} -D`,
  npm: (plg) => `npm install ${plg} -D`
};

const DEPS_NEED_TO_INSTALL = {
  vue: ['@babel/eslint-parser', 'eslint-plugin-vue'],
  react: ['eslint-plugin-react']
};

module.exports = {
  ESLINT_FORMAT_TYPE,
  CMD_ON_PKG_MANAGER,
  DEPS_NEED_TO_INSTALL
};
