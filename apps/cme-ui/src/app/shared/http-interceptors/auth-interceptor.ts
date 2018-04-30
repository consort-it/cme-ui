import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap, first, catchError, distinctUntilChanged } from 'rxjs/operators';
import { LogService } from '@cme2/logging';
import { ClusterManagerService } from '@cme2/core-services';

/**
 * Adds an Authorization header to every HTTP request going to a configured K8s connection url.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _validHostnames: string[] = [];

  constructor(
    private authService: AuthService,
    private clusterManager: ClusterManagerService,
    private log: LogService
  ) {
    this.clusterManager.availableConnections$.pipe(distinctUntilChanged()).subscribe(conns => {
      this._validHostnames = conns.map(conn => conn.hostname);
      this.log.debug(`AuthInterceptor got new urls which need tokens:`, this._validHostnames);
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return fromPromise(this.authService.accessToken()).pipe(
      first(),
      mergeMap(token => {
        const headers: any = {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        };

        if (this.hostnameNeedsBearerToken(req.url)) {
          headers.Authorization = 'Bearer ' + token;
        }

        // Clone the request and set the new header in one step.
        const authReq = req.clone({
          setHeaders: headers
        });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
      })
    );
  }

  private hostnameNeedsBearerToken(url: string): boolean {
    return this._validHostnames.find(x => url.startsWith(x)) !== undefined;
  }
}
