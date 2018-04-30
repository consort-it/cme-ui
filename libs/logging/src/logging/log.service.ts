import { Injectable } from '@angular/core';
import { LogAppender } from './log-appender';
import { ConsoleAppender } from './console-appender';

/**
 * Can be used as a replacement for console.log.
 */
@Injectable()
export class LogService implements LogAppender {
  private _appenders: LogAppender[] = [];

  constructor() {
    this._appenders.push(new ConsoleAppender());
  }

  assert(value: any, message?: string, optionalParam?: any): void {
    this._appenders.forEach(x => x.assert(value, message, optionalParam));
  }

  dir(obj: any, options?: NodeJS.InspectOptions): void {
    this._appenders.forEach(x => x.dir(obj, options));
  }

  error(message?: any, optionalParam?: any): void {
    this._appenders.forEach(x => x.error(message, optionalParam));
  }

  info(message?: any, optionalParam?: any): void {
    this._appenders.forEach(x => x.info(message, optionalParam));
  }

  debug(message?: any, optionalParam?: any): void {
    this._appenders.forEach(x => x.debug(message, optionalParam));
  }

  log(message?: any, optionalParam?: any): void {
    this._appenders.forEach(x => x.log(message, optionalParam));
  }

  time(label: string): void {
    this._appenders.forEach(x => x.time(label));
  }

  timeEnd(label: string): void {
    this._appenders.forEach(x => x.timeEnd(label));
  }

  trace(message?: any, optionalParam?: any): void {
    this._appenders.forEach(x => x.trace(message, optionalParam));
  }

  warn(message?: any, optionalParam?: any): void {
    this._appenders.forEach(x => x.warn(message, optionalParam));
  }
}
