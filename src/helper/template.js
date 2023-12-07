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
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: [
        "react",
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
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: [
        "react",
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
        "ecmaVersion": 'latest',
        "sourceType": "module"
      },
      "plugins": [
        "react",
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
      ecmaVersion: 'latest',
      sourceType: 'module'
    plugins:
      - 'react'
    rules:
      # 在这里可以添加自定义的 ESLint 规则
    settings:
      react:
        version: 'detect' # 自动检测所安装的 React 版本  
  `
};

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
};

export const COMMITLINT_TEMP = {
  cjs: `
    module.exports = {
      extends: ['@commitlint/config-conventional'],
      // 添加你的规则 
      rules: {
        // 'type-enum': ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
      },
      // // 如果你需要忽略某个特殊的commit, 但不建议
      // // ignores: [(commit) => commit === ''],
    }
  `,
  mjd: `
    export default {
      extends: ['@commitlint/config-conventional'],
      // 添加你的规则 
      rules: {
        // 'type-enum': ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
      },
      // // 如果你需要忽略某个特殊的commit, 但不建议
      // // ignores: [(commit) => commit === ''],
    }
  `
};

export const LINTSTAGED_TEMP = {
  json: `
    {
      "*.{js,cjs,mjs,jsx,ts,tsx,vue}": ["eslint --fix"]
    }
  `,
  cjs: `
    module.exports = {
      "*.{js,cjs,mjs,jsx,ts,tsx,vue}": ["eslint --fix"]
    }
  `,
  mjs: `
    export default {
      "*.{js,cjs,mjs,jsx,ts,tsx,vue}": ["eslint --fix"]
    }
  `,
  yml: `
    "*.{js,cjs,mjs,jsx,ts,tsx,vue}":
      - eslint --fix
  `
};

export const PRETTIER_TEMP = {
  json: JSON.stringify({
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    trailingComma: 'none',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'always',
    requirePragma: false,
    insertPragma: false,
    proseWrap: 'preserve',
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf'
  }),
  mjs: `export default {
    // 一行最多 100 字符
    printWidth: 100,
    // 使用 2 个空格缩进
    tabWidth: 2,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // 使用单引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾不需要逗号
    trailingComma: 'none',
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
  }`,
  cjs: `module.exports = {
    // 一行最多 100 字符
    printWidth: 100,
    // 使用 2 个空格缩进
    tabWidth: 2,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // 使用单引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾不需要逗号
    trailingComma: 'none',
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
  }`,
  rc: `
    # 一行最多 100 字符
    printWidth: 100,
    # 使用 2 个空格缩进
    tabWidth: 2,
    # 不使用缩进符，而使用空格
    useTabs: false,
    # 行尾需要有分号
    semi: true,
    # 使用单引号
    singleQuote: true,
    # 对象的 key 仅在必要时用引号
    quoteProps: "as-needed",
    # jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    # 末尾不需要逗号
    trailingComma: "none",
    # 大括号内的首尾需要空格
    bracketSpacing: true,
    # jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    # 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: "always",
    # 不需要写文件开头的 @prettier
    requirePragma: false,
    # 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    # 使用默认的折行标准
    proseWrap: 'preserve',
    # 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    # 换行符使用 lf
    endOfLine: 'lf'
  `,
  ignore: `
    node_modules
    dist
    *.lock
    .husky
    .eslintrc.*
    .gitignore
    .npmignore
    .lintstagedrc.*
    commintlint.config.*
    CHANGELOG.md
    LICENSE
  `
};
