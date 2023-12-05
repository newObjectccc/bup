import { exec } from 'node:child_process'

function execCmd({ cmdStr, stdoutHdr, errMsg }) {
  return new Promise((res, rej) => {
    const cmd = exec(cmdStr)
    let oraCtx = null
    cmd.stdout.on('data', (data) => {
      oraCtx = stdoutHdr?.(data, oraCtx)
    })
    cmd.on('close', (code) => {
      if (code === 0) {
        oraCtx?.succeed()
        res(`perform command succeed!`)
      } else {
        oraCtx?.fail()
        rej(errMsg ?? "Something went wrong!")
      }
    })
  })
}

export default execCmd