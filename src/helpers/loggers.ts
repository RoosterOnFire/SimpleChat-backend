import chalk from 'chalk';

const log = console.log;

export function logInfo(message: string) {
  log(`[${chalk.blue('INFO')}] ${message}`);
}

export function logAdmin(message: string) {
  log(`[${chalk.green('ADMIN')}] ${message}`);
}

export function logDatabase(message: string) {
  log(`[${chalk.yellow('DB')}] ${message}`);
}
