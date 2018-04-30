import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { ConnectionCheckResult } from './connection-check-result';
import { FetchService } from './fetch.service';

@Injectable()
export class UiConnectionCheckerService implements OnDestroy {
  private _url2Subject = new Map<string, Subject<ConnectionCheckResult>>();
  private _destroyer$$ = new Subject<void>();

  constructor(private logger: LogService, private fetcher: FetchService) {}

  checkConnection(url: string, interval: number = 10000): Observable<ConnectionCheckResult> {
    const subject = this.getSubjectForUrl(url);
    timer(0, interval)
      .pipe(
        takeUntil(this._destroyer$$),
        switchMap(() => {
          const startTime = Date.now();
          return this.doUrlCheck(url, startTime);
        })
      )
      .subscribe(x => {
        subject.next(x);
      });
    return subject;
  }

  ngOnDestroy() {
    this._destroyer$$.next();
  }

  private doUrlCheck(url: string, startTime: number): Observable<ConnectionCheckResult> {
    return fromPromise(
      this.fetcher.fetch(url, {
        mode: 'no-cors',
        cache: 'no-store',
        credentials: 'omit',
        referrerPolicy: 'no-referrer'
      })
    ).pipe(
      map((res: Response) => {
        const responseTime = Date.now() - startTime;
        // Note: Due to CORS it is not possible to get the content or
        // status code of the response :-(.
        // We have to assume that everything is fine if this does not
        // throw an error. (which it isn't, because this will include 401, 403, etc as well).
        this.logger.trace(`Response when fetching '${url}'`, res);
        return <ConnectionCheckResult>{
          isError: false,
          statusCode: res.status,
          reason: res.statusText,
          responseTime,
          url,
          version: undefined
        };
      }),
      catchError((err: TypeError) => {
        // Note: We will end up here if the url could not be reached via network
        // (e.g. Domain does not exist, connection refused...)
        const responseTime = Date.now() - startTime;
        this.logger.trace(`Error when fetching '${url}'`, err);
        return of(<ConnectionCheckResult>{
          isError: true,
          statusCode: 0,
          reason: err.message + ` (after ${responseTime} ms)`,
          responseTime,
          url,
          version: undefined
        });
      })
    );
  }

  private getSubjectForUrl(url: string): Subject<ConnectionCheckResult> {
    if (!this._url2Subject.has(url)) {
      this._url2Subject.set(url, new ReplaySubject(1));
    }
    return this._url2Subject.get(url)!;
  }
}
