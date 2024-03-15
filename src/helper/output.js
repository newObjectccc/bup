async function main() {
  const { default: chalk } = await import('chalk');
  const { default: ora } = await import('ora');

  function stdoutHdr(data, ins) {
    let ctx = ins;
    if (!ctx) {
      ctx = ora();
      ctx.start();
    }
    ctx.prefixText = chalk.dim('[info]');
    ctx.text = chalk.bgBlueBright.bold(data);
    if (ctx) return ctx;
  }

  function stderrHdr(data, ins) {
    let ctx = ins;
    if (!ctx) {
      ctx = ora();
      ctx.start();
    }
    ctx.prefixText = chalk.bgRedBright('[ERROR]');
    ctx.text = chalk.redBright(`${data ?? 'Something went wrong! please send us some issues!'}`);
    ctx.fail();
  }

  function startOraWithTemp(text) {
    const oraIns = ora({ text });
    oraIns.start();
    oraIns.spinner = 'moon';
    oraIns.prefixText = chalk.dim('[info]');
    return oraIns;
  }

  return {
    startOraWithTemp,
    stderrHdr,
    stdoutHdr
  };
}

module.exports = main;
