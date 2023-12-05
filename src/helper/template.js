export const ESLINT_TEMPLATE = {
  cjs: (fwk) => `
    module.exports = {
      // 指定为根配置文件
      root: true,
      // 指定运行环境
      env: {
        node: true
      },
      ${ESLINT_EXTENSION_ON_FRAMEWORK[fwk + 'Tmp']},
      // 使用Babel作为解析器
      parserOptions: {
        parser: 'babel-eslint'
      },
      rules: {
        // 自定义规则可以在这里添加
        // 例如，可以使用 "vue/no-unused-components" 来禁止未使用的组件
        'vue/no-unused-components': 'error',
        // 强制使用单引号
        quotes: ['error', 'single'],
        // 强制使用分号
        semi: ['error', 'always'],
        // 可以添加更多eslint规则...
      }
    }
  `,
  js: (fwk) => `
    module.exports = {
      // 指定为根配置文件
      root: true,
      // 指定运行环境
      env: {
        node: true
      },
      ${ESLINT_EXTENSION_ON_FRAMEWORK[fwk + 'Tmp']},
      // 使用Babel作为解析器
      parserOptions: {
        parser: 'babel-eslint'
      },
      rules: {
        // 自定义规则可以在这里添加
        // 例如，可以使用 "vue/no-unused-components" 来禁止未使用的组件
        'vue/no-unused-components': 'error',
        // 强制使用单引号
        quotes: ['error', 'single'],
        // 强制使用分号
        semi: ['error', 'always'],
        // 可以添加更多eslint规则...
      }
    }
  `,
  mjs: (fwk) => `
    export default {
      // 指定为根配置文件
      root: true,
      // 指定运行环境
      env: {
        node: true
      },
      ${ESLINT_EXTENSION_ON_FRAMEWORK[fwk + 'Tmp']},
      parserOptions: {
        // 使用Babel作为解析器
        parser: 'babel-eslint',
        // 使用ES6 module
        sourceType: 'module'
      },
      rules: {
        // 自定义规则可以在这里添加
        // 例如，可以使用 "vue/no-unused-components" 来禁止未使用的组件
        'vue/no-unused-components': 'error',
        // 强制使用单引号
        quotes: ['error', 'single'],
        // 强制使用分号
        semi: ['error', 'always']
        // 可以添加更多eslint规则...
      }
    };
  `,
  json: (fwk) => `
    {
      "root": true,
      "env": {
        "node": true
      },
      "extends": ${ESLINT_EXTENSION_ON_FRAMEWORK[fwk].replaceAll('\'', '\"')},
      "parserOptions": {
        "parser": "babel-eslint"
      },
      "rules": {
        "vue/no-unused-components": "error",
        "quotes": ["error", "single"],
        "semi": ["error", "always"]
      }
    }
  `,
  yaml: (fwk) => {
    const tmp = ``
    ESLINT_EXTENSION_ON_FRAMEWORK[fwk].map((ext, idx) => {
      if (idx > 0) {
        tmp = `
          ${tmp}
          - ${ext.replaceAll('\'', '')}
        `
      }
      if (idx === 0) {
        tmp = `- ${ext.replaceAll('\'', '')}`
      }
    })
    return `
    root: true
    env:
      node: true
    extends:
      ${tmp}
    parserOptions:
      parser: babel-eslint
    rules:
      vue/no-unused-components: error
      quotes:
        - error
        - single
      semi:
        - error
        - always
  `
  },
  yml: (fwk) => {
    const tmp = ``
    ESLINT_EXTENSION_ON_FRAMEWORK[fwk].map((ext, idx) => {
      if (idx > 0) {
        tmp = `
          ${tmp}
          - ${ext.replaceAll('\'', '')}
        `
      }
      if (idx === 0) {
        tmp = `- ${ext.replaceAll('\'', '')}`
      }
    })
    return `
      root: true
      env:
        node: true
      extends:
        ${tmp}
      parserOptions:
        parser: babel-eslint
      rules:
        vue/no-unused-components: error
        quotes:
          - error
          - single
        semi:
          - error
          - always
    `
  }
}

export const ESLINT_EXTENSION_ON_FRAMEWORK = {
  vueTmp: `
    extends: [
      'plugin:vue/essential',
      'eslint:recommended',
      '@vue/prettier'
    ]
  `,
  vue: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier'
  ],
  react: '',
  angular: ''
}
