import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { JiraBackendService } from '@cme2/connector-jira';
import { MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { JiraService, REFRESH_INTERVAL } from './jira.service';
import { genericRetryStrategy } from '@cme2/rxjs-utils';

describe('JiraService', () => {
  let jiraBackendMock: JiraBackendService | undefined;

  beforeEach(() => {
    jiraBackendMock = mock(JiraBackendService);
  });

  [
    { input: 'metadata-service-v1', expected: 'metadata-service' },
    { input: 'metadata-service-v2', expected: 'metadata-service' },
    { input: 'metadata-service-v10', expected: 'metadata-service' },
    { input: 'metadata-service', expected: 'metadata-service' }
  ].forEach(tc => {
    it(
      `should normalize tags '${tc.input}' -> '${tc.expected}'`,
      fakeAsync(() => {
        when(jiraBackendMock!.getIssues(anything())).thenReturn(of([]));
        const jiraInstance = instance(jiraBackendMock);
        const sut = new JiraService(new MockLogService(), jiraInstance!, genericRetryStrategy);

        sut
          .getIssuesByTag(tc.input)
          .pipe(first())
          .subscribe();
        tick(0);
        verify(jiraBackendMock!.getIssues(tc.expected)).once();
        discardPeriodicTasks();
      })
    );
  });

  it(
    `should periodically call the backend`,
    fakeAsync(() => {
      when(jiraBackendMock!.getIssues(anything())).thenReturn(of([]));
      const jiraInstance = instance(jiraBackendMock);
      const sut = new JiraService(new MockLogService(), jiraInstance!, genericRetryStrategy);

      sut
        .getIssuesByTag('test')
        .pipe(first())
        .subscribe();
      tick(REFRESH_INTERVAL);
      verify(jiraBackendMock!.getIssues('test')).times(2);
      discardPeriodicTasks();
    })
  );
});
