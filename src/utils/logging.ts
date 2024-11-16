import { existsSync, mkdirSync, promises } from "fs";
import { exit } from "process";

export class Logger {
  private path: string;
  private scope: string;

  constructor(scope: string) {
    const date = new Date();
    this.path = `logs/${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
    this.scope = scope;

    if (!existsSync("logs")) mkdirSync("logs");
  }

  private async writeToFile(msg: string) {
    await promises.appendFile(this.path, `${this.scope}: ${msg}\n`);
  }

  private formatMsg(msg: string) : string {
    const date = new Date();
    return `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} - ${date.getDay()}.${date.getMonth()}.${date.getFullYear()} --- ${msg}`;
  }

  public debug(msg: string) {
    const format = this.formatMsg(msg);
    this.writeToFile(format);
    console.debug(`${this.scope}: [DEBUG] ${format}`);
  }

  public info(msg: string) {
    const format = this.formatMsg(msg);
    this.writeToFile(format);
    console.info(`${this.scope}: [INFO] ${format}`);
  }

  public warn(msg: string) {
    const format = this.formatMsg(msg);
    this.writeToFile(format);
    console.warn(`${this.scope}: \x1b[33m[WARNING]\x1b[0m ${format}`);
  }

  public error(msg: string) {
    const format = this.formatMsg(msg);
    this.writeToFile(format);
    console.error(`${this.scope}: \x1b[31m[ERROR]\x1b[0m ${format}`);
  }

  public fatal(msg: string, exitCode: number = 1) {
    const format = this.formatMsg(msg);
    this.writeToFile(format);
    this.writeToFile(`Exiting with exit code ${exitCode}...`);
    console.error(`${this.scope}: \x1b[41m[FATAL ERROR]\x1b[0m ${format}`);
    exit(exitCode);
  }
}
