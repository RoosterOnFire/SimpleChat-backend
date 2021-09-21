import chalk from 'chalk';
import { randomBytes } from 'crypto';

const log = console.log;

export function createRndId() {
  return randomBytes(16).toString('hex');
}

export function logInfo(message: string) {
  log(`[${chalk.blue('INFO')}] ${message}`);
}

export function logAdmin(message: string) {
  log(`[${chalk.green('ADMIN')}] ${message}`);
}

export function logDatabase(message: string) {
  log(`[${chalk.yellow('DB')}] ${message}`);
}
