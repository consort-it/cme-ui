import { Injectable } from '@angular/core';
import { JiraBackendService, JiraIssue } from '@cme2/connector-jira';
import { LogService } from '@cme2/logging';
import { normalizeServiceName } from '@cme2/rxjs-utils';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class OpenBugsService {
  constructor(private logger: LogService, private jiraBackend: JiraBackendService) {}

  getOpenBugs(serviceNames: string[]): Observable<JiraIssue[]> {
    const normalizedServiceNames = serviceNames.map(normalizeServiceName);

    return forkJoin(...normalizedServiceNames.map(name => this.getOpenBugsForService(name))).pipe(
      map(issues => {
        const allIssues: JiraIssue[] = [];
        issues.forEach(innerIssues => {
          allIssues.push(...innerIssues);
        });
        return allIssues;
      })
    );
  }

  private getOpenBugsForService(serviceName: string): Observable<JiraIssue[]> {
    return this.jiraBackend.getIssues(serviceName, 'open').pipe(
      catchError(err => {
        this.logger.warn(`Could not get open jira bugs for '${serviceName}'`, err);
        return of<JiraIssue[]>([]);
      })
    );
  }
}
