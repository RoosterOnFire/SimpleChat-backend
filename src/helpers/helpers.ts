import { randomBytes } from 'crypto';

export function createRndId() {
  return randomBytes(16).toString('hex');
}

export function logInfo(message: string) {
  console.log(`[INFO] ${message}`);
}

export function logAdmin(message: string) {
  console.log(`[ADMIN] ${message}`);
}

export function logDatabase(message: string) {
  console.log(`[DB] ${message}`);
}
