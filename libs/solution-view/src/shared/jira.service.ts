import { Injectable, Inject } from '@angular/core';
import { LogService } from '@cme2/logging';
import { JiraBackendService, JiraIssue } from '@cme2/connector-jira';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { switchMap, takeUntil, shareReplay, tap, catchError, retryWhen } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { empty } from 'rxjs/observable/empty';
import { genericRetryStrategyToken, GenericRetryStrategy } from '@cme2/rxjs-utils';

export const REFRESH_INTERVAL = 60000; // exported because of test...

@Injectable()
export class JiraService {
  private _cache = new Map<string, Observable<JiraIssue[]>>();
  private _reload$$ = new Subject<void>();

  constructor(
    private readonly logger: LogService,
    private readonly jiraBackend: JiraBackendService,
    @Inject(genericRetryStrategyToken) private genericRetryStrategy: GenericRetryStrategy
  ) {}

  getIssuesByTag(tagName: string): Observable<JiraIssue[]> {
    const normalizedTagName = this.normalizeTagName(tagName);
    this.logger.debug(`Normalizing '${tagName}' to '${normalizedTagName}'`);
    if (!this._cache.has(normalizedTagName)) {
      this.logger.debug(`${normalizedTagName} not found in cache, creating observable.`);
      const timer$ = timer(0, REFRESH_INTERVAL);
      const loader$ = timer$.pipe(
        switchMap(() => this.jiraBackend.getIssues(normalizedTagName)),
        tap(x => {
          this.logger.debug(`Jira backend for '${normalizedTagName}' returned`, x);
        }),
        retryWhen(
          this.genericRetryStrategy({
            maxRetryAttempts: 5,
            scalingDuration: 10000,
            logger: message => this.logger.warn(message)
          })
        ),
        catchError((err, caught) => {
          this.logger.warn(`Jira backend returned error for tag '${normalizedTagName}', ignoring.`, err);
          return empty<JiraIssue[]>();
        }),
        takeUntil(this._reload$$),
        shareReplay(1)
      );
      this._cache.set(normalizedTagName, loader$);
    }
    return this._cache.get(normalizedTagName)!;
  }

  refreshNow(): void {
    this.logger.debug(`Jira backend force refresh`);
    this._reload$$.next();
    this._cache.clear();
  }

  /**
   * Removes a version from the end. E.g.
   * if something like 'some-service-v3' comes in, 'some-service' is returned.
   * @param tagName
   */
  private normalizeTagName(tagName: string): string {
    const result = /(.*?)(\-v\d+)$/.exec(tagName);

    if (result === null) {
      // tagName has no '-v1' or similar at the end
      return tagName;
    }

    return result[1]; // the first matching group (everything before '-v1')
  }
}
