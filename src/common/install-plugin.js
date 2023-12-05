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
    cmd.on('close', (code) => {
      if (code === 0) {
        resolve(`Download ${normalaizePlug} succeed!`)
      } else {
        reject(`Installing ${normalaizePlug} went wrong!`)
      }
    })
  })
}

export default installPlugin