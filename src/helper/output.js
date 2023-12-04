
import chalk from 'chalk';

export function stdoutHdr(ins, data) {
  ins.prefixText = chalk.dim('[info]');
  ins.text = chalk.bgBlueBright.bold(data)
}

export function stderrHdr(ins, data) {
  ins.prefixText = chalk.bgRedBright('[ERROR]');
  ins.text = chalk.redBright(`${data ?? 'Something went wrong! please send us some issues!'}`)
  ins.fail();
}