import chalk from 'chalk';
import ora, { Ora } from 'ora';

export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function success(message: string): void {
  console.log(chalk.green('✔'), message);
}

export function warning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function error(message: string): void {
  console.error(chalk.red('✖'), message);
}

export function spinner(text: string): Ora {
  return ora({ text, spinner: 'dots' });
}
