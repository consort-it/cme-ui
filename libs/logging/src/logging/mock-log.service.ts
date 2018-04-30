import { Injectable } from '@angular/core';
import { LogAppender } from './log-appender';
import { ConsoleAppender } from './console-appender';
import { LogService } from './log.service';

/**
 * Can be used for tests. Does nothing.
 */
@Injectable()
export class MockLogService extends LogService {
  assert(value: any, message?: string, optionalParam?: any): void {}

  dir(obj: any, options?: NodeJS.InspectOptions): void {}

  error(message?: any, optionalParam?: any): void {}

  info(message?: any, optionalParam?: any): void {}

  debug(message?: any, optionalParam?: any): void {}

  log(message?: any, optionalParam?: any): void {}

  time(label: string): void {}

  timeEnd(label: string): void {}

  trace(message?: any, optionalParam?: any): void {}

  warn(message?: any, optionalParam?: any): void {}
}
