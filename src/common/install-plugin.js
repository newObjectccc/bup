import { exec } from 'node:child_process';
import { CMD_ON_PKG_MANAGER } from '../helper/constant.js';

async function installPlugin(options) {
  return new Promise((resolve, reject) => {
    const { pkgManager, stdoutHdr, plugin } = options
    const normalaizePlug = Array.isArray(plugin) ? plugin.join(' ') : plugin
    const cmd = exec(CMD_ON_PKG_MANAGER[pkgManager](normalaizePlug))
    cmd.stdout.on('data', (data) => {
      stdoutHdr(data)
    })
    cmd.stderr.on('data', (data) => {
      reject(data)
    })
    cmd.on('close', (code) => {
      code == 0 && resolve(`Download plugin succeed!`)
      reject(code)
    })
  })
}

export default installPlugin