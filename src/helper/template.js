export const ESLINT_TEMPLATE = {
  vue_js: `
    module.exports = {
      // 指定为根配置文件
      root: true,
      // 指定运行环境
      env: {
        node: true
      },
      extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/prettier'
      ],
      // 使用Babel作为解析器
      parserOptions: {
        parser: '@babel/eslint-parser'
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
  vue_mjs: `
    export default {
      // 指定为根配置文件
      root: true,
      // 指定运行环境
      env: {
        node: true
      },
      extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/prettier'
      ],
      parserOptions: {
        // 使用Babel作为解析器
        parser: '@babel/eslint-parser',
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
  vue_json: `
    {
      "root": true,
      "env": {
        "node": true
      },
      "extends": [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/prettier"
      ],
      "parserOptions": {
        "parser": "@babel/eslint-parser"
      },
      "rules": {
        "vue/no-unused-components": "error",
        "quotes": ["error", "single"],
        "semi": ["error", "always"]
      }
    }
  `,
  vue_yml: `
    root: true
    env:
      node: true
    extends:
      - plugin:vue/essential
      - eslint:recommended
      - @vue/prettier
    parserOptions:
      parser: @babel/eslint-parser
    rules:
      vue/no-unused-components: error
      quotes:
        - error
        - single
      semi:
        - error
        - always
  `,
  react_js: `
    module.exports = {
      env: {
        browser: true,
        es6: true,
        node: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      plugins: [
        'react',
      ],
      rules: {
        // 在这里可以添加自定义的 ESLint 规则
      },
      settings: {
        react: {
          version: 'detect', // 自动检测所安装的 React 版本
        },
      },
    };  
  `,
  react_mjs: `
    export default {
      env: {
        browser: true,
        es6: true,
        node: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      plugins: [
        'react',
      ],
      rules: {
        // 在这里可以添加自定义的 ESLint 规则
      },
      settings: {
        react: {
          version: 'detect', // 自动检测所安装的 React 版本
        },
      },
    };
  `,
  react_json: `
    {
      "env": {
        "browser": true,
        "es6": true,
        "node": true
      },
      "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
      ],
      "parserOptions": {
        "ecmaFeatures": {
          "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
      },
      "plugins": [
        "react"
      ],
      "rules": {
        // 在这里可以添加自定义的 ESLint 规则
      },
      "settings": {
        "react": {
          "version": "detect" // 自动检测所安装的 React 版本
        }
      }
    }  
  `,
  react_yml: `
    env:
      browser: true
      es6: true
      node: true
    extends:
      - 'eslint:recommended'
      - 'plugin:react/recommended'
    parserOptions:
      ecmaFeatures:
        jsx: true
      ecmaVersion: 2018
      sourceType: 'module'
    plugins:
      - 'react'
    rules:
      # 在这里可以添加自定义的 ESLint 规则
    settings:
      react:
        version: 'detect' # 自动检测所安装的 React 版本  
  `,
}

export const CHANGELOG_TEMP = {
  updater: `
    const stringifyPackage = require('stringify-package')
    const detectIndent = require('detect-indent')
    const detectNewline = require('detect-newline')

    module.exports.readVersion = function (contents) {
      return JSON.parse(contents).tracker.package.version;
    }

    module.exports.writeVersion = function (contents, version) {
      const json = JSON.parse(contents)
      let indent = detectIndent(contents).indent
      let newline = detectNewline(contents)
      json.tracker.package.version = version
      return stringifyPackage(json, indent, newline)
    }
  `,
  tracker: `
    {
      "tracker": {
        "package": {
          "version": "1.0.0"
        }
      }
    }
  `,
  versionrc: `
    const tracker = {
      filename: 'VERSION_TRACKER.json',
      updater: require('./standard-version-updater.js')
    }

    module.exports = {
      bumpFiles: [tracker],
      packageFiles: [tracker]
    }
  `
}