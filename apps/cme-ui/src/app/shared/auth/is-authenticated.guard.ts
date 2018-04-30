import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { first, map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { LogService } from '@cme2/logging';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private auth: AuthService, private log: LogService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const subject = new Subject<boolean>();

    this.auth
      .accessToken()
      .then(token => {
        subject.next(true);
        subject.complete();
      })
      .catch(err => {
        this.log.error('Guard failed to get token.', err);
        subject.next(false);
        subject.complete();
      });

    return subject;
  }
}
