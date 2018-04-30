// tslint:disable no-console

import { LogAppender } from './log-appender';

export class ConsoleAppender implements LogAppender {
  assert(value: any, message?: string | undefined, optionalParam?: any): void {
    console.assert(value, message, optionalParam);
  }

  dir(obj: any, options?: NodeJS.InspectOptions | undefined): void {
    console.dir(obj, options);
  }

  error(message?: any, optionalParam?: any): void {
    console.error(message, optionalParam);
  }

  info(message?: any, optionalParam?: any): void {
    console.info(message, optionalParam);
  }

  debug(message?: any, optionalParam?: any): void {
    console.log(message, optionalParam);
  }

  log(message?: any, optionalParam?: any): void {
    console.log(message, optionalParam);
  }

  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  trace(message?: any, optionalParam?: any): void {
    console.debug(message, optionalParam); // debug here because trace would add long stacktraces to console.
  }

  warn(message?: any, optionalParam?: any): void {
    console.warn(message, optionalParam);
  }
}
