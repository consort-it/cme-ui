import { ErrorHandler, Injectable } from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import { LogService } from '@cme2/logging';
import { NotificationService, NotificationType } from '@cme2/core-services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logService: LogService, private notificationService: NotificationService) {}
  handleError(error: any) {
    const message = error.message ? error.message : error.toString();
    const url = window.location.hash;
    // get the stack trace, lets grab the last 10 stacks only
    StackTrace.fromError(error).then((stackframes: StackTrace.StackFrame[]) => {
      const stackString = stackframes
        .splice(0, 20)
        .map(function(sf: StackTrace.StackFrame) {
          return sf.toString();
        })
        .join('\n');
      // log on the server
      this.logService.error('Uncaught Error:', { message, url, stack: stackString });
      this.notificationService.addNotification('Uncaught error', message, NotificationType.Alert);
    });
    throw error;
  }
}
