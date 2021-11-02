import chalk from 'chalk';

export function error(msg: string, err?: Error) {
  console.error(chalk.bold(`Error: ${msg}`));
  if (err) {
    console.error(err);
  }
  process.exit(1);
}

export function warn(msg: string) {
  console.log(chalk.yellow(msg));
}

export function log(msg: string = '') {
  console.log(msg);
}
