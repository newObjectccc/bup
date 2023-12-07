import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import choicesPrompt from '../common/choices-prompt.js';
import choosePkgMgr from '../common/choose-pkg-manager.js';
import execCmd from '../common/exec-cmd.js';
import installPlugin from '../common/install-plugin.js';
import isFileExistInRoot from '../common/is-file-exist.js';
import readdirToString from '../common/readdir-to-string.js';
import writeFileByTemp from '../common/write-file.js';
import { startOraWithTemp, stderrHdr, stdoutHdr } from '../helper/output.js';
import { PRETTIER_TEMP } from '../helper/template.js';
const program = new Command();

program
  .action(async () => {
    let settingHuskyOra, downloadPluginOra, settingPrettierOra, downloadEslintPlgOra
    try {
      if (!isFileExistInRoot('package.json')) throw new Error('There is no package.json in the current folder!');
      // chiose pakcage manager
      const { pkgManager } = await choosePkgMgr()

      // install prettier
      downloadPluginOra = startOraWithTemp('Download plugin...')
      const installPlugRes = await installPlugin({
        pkgManager,
        stdoutHdr: (data) => stdoutHdr(data, downloadPluginOra),
        plugin: 'prettier husky'
      })
      downloadPluginOra.succeed(installPlugRes)
      downloadPluginOra = null

      // read dir 
      const [files, err] = readdirToString(path.resolve('./'))
      if (err) throw new Error(`Readdir failed! ${err}}`)

      // install & set eslint-plugin-prettier if has eslint
      const eslintrcFilename = files.split(',').find(fname => /\.eslintrc/.test(fname))
      if (eslintrcFilename) {
        downloadEslintPlgOra = startOraWithTemp('Download plugin...')
        const installPlugRes = await installPlugin({
          pkgManager,
          stdoutHdr: (data) => stdoutHdr(data, downloadEslintPlgOra),
          plugin: 'eslint-plugin-prettier'
        })
        downloadEslintPlgOra.succeed(installPlugRes)
        downloadEslintPlgOra = null
        // set plugin if .eslintrc format is json|js
        if (['json', 'js', 'mjs', 'cjs'].includes(eslintrcFilename.split('.').at(-1))) {
          const filePath = isFileExistInRoot(eslintrcFilename)
          let eslintcfg = fs.readFileSync(filePath)
          eslintcfg = JSON.parse(eslintcfg)
          eslintcfg.extends.push("prettier")
          await writeFileByTemp(JSON.stringify(eslintcfg), filePath)
        } else {
          ora({ text: `your .eslintrc format isn't avaliable to fix,\n you need push "prettier" into extends array.` }).warn()
        }
      }

      // set husky if no .husky
      if (!/\.husky/.text(files)) {
        settingHuskyOra = startOraWithTemp(`Setting husky...`)
        await execCmd({
          cmdStr: `npm pkg set scripts.prepare="husky install"`,
          errMsg: 'Set scripts.prepare fail'
        })
        await execCmd({
          cmdStr: 'npm run prepare',
          errMsg: 'Run prepare fail'
        })
        await execCmd({
          cmdStr: `npx husky add .husky/pre-commit "npx prettier . --write"`,
          errMsg: 'Run husky add .husky/pre-commit fail, check out your .git directory!'
        })
        settingHuskyOra.succeed('Set husky succeed!')
      }

      // choose prettierrc format
      const { format } = await choicesPrompt('format', [
        { title: 'json', value: 'json' },
        { title: 'rc', value: 'rc' },
        { title: 'cjs', value: 'cjs' },
        { title: 'mjs', value: 'mjs' },
      ])

      // write prettierrc
      settingPrettierOra = startOraWithTemp('Setting .prettierrc...')
      const execRes = await writeFileByTemp(PRETTIER_TEMP[format], `.prettierrc.${format}`)
      settingPrettierOra.succeed(execRes)
    } catch (error) {
      downloadPluginOra?.fail()
      settingHuskyOra?.fail()
      settingPrettierOra?.fail()
      downloadEslintPlgOra?.fail()
      stderrHdr(error)
    }
  });

program.parse();

