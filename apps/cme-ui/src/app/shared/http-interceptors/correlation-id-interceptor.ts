import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../auth';

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/**
 * This interceptor adds something like a "session id" as HTTP header
 * (X-Correlation-Id) to each HTTP request. Can be used to correlate calls
 * to different Microservices with this GUI session.
 */
@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  private _sessionId: string;

  constructor(authService: AuthService) {
    this._sessionId = guid();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      // setHeaders: {
      //   'X-Correlation-Id': this._sessionId
      // }
    });
    return next.handle(authReq);
  }
}
