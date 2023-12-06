
import chalk from 'chalk';
import ora from 'ora';

export function stdoutHdr(data, ins) {
  let ctx = ins
  if (!ctx) {
    ctx = ora();
    ctx.start()
  }
  ctx.prefixText = chalk.dim('[info]');
  ctx.text = chalk.bgBlueBright.bold(data)
  if (ctx) return ctx
}

export function stderrHdr(data, ins) {
  let ctx = ins
  if (!ctx) {
    ctx = ora();
    ctx.start()
  }
  ctx.prefixText = chalk.bgRedBright('[ERROR]');
  ctx.text = chalk.redBright(`${data ?? 'Something went wrong! please send us some issues!'}`)
  ctx.fail();
}

export function startOraWithTemp(text) {
  const oraIns = ora({ text })
  oraIns.start()
  oraIns.spinner = 'moon'
  oraIns.prefixText = chalk.dim('[info]')
  return oraIns
}