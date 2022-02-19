import chalk from "chalk";

const log = console.log;

export function logInfo(message: string, from?: string) {
  const chalkFrom = from ? `[${chalk.blue(from)}]` : "";

  log(`[${chalk.blue("INFO")}]${chalkFrom} ${message}`);
}

export function logAdmin(message: string, from?: string) {
  const chalkFrom = from ? `[${chalk.green(from)}]` : "";

  log(`[${chalk.green("ADMIN")}]${chalkFrom} ${message}`);
}

export function logDatabase(message: string, from?: string) {
  const chalkFrom = from ? `[${chalk.yellow(from)}]` : "";

  if (process.env.DB_LOG === "long") {
    log(`[${chalk.yellow("DB")}]${chalkFrom} ${message}`);
  } else if (process.env.DB_LOG === "short") {
    log(`[${chalk.yellow("DB")}]${chalkFrom} call to db`);
  }
}

export function logError(error: Error, from?: string) {
  const chalkFrom = from ? `[${chalk.red(from)}]` : "";

  log(`[${chalk.red("ERROR")}]${chalkFrom} ${error?.message}`);
  log(error?.stack);
}
