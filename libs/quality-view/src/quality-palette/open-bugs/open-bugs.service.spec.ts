import { JiraBackendService, JiraIssue } from '@cme2/connector-jira';
import { MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { OpenBugsService } from './open-bugs.service';

describe('OpenBugsService', () => {
  const expected1: JiraIssue = {
    key: 'test1-service',
    title: 'Test Issue 1',
    status: 'open',
    updated: new Date(),
    url: 'https://jira.example.com'
  };

  const expected2: JiraIssue = {
    key: 'test2-service',
    title: 'Test Issue 2',
    status: 'open',
    updated: new Date(),
    url: 'https://jira.example.com'
  };

  it('should return correct results when backend returns good data', (done: DoneFn) => {
    const mockJiraBackend = mock(JiraBackendService);

    when(mockJiraBackend.getIssues('test1-service', anything())).thenReturn(of([expected1]));
    when(mockJiraBackend.getIssues('test2-service', anything())).thenReturn(of([expected2]));

    const sut = new OpenBugsService(new MockLogService(), instance(mockJiraBackend));

    sut.getOpenBugs(['test1-service-v1', 'test2-service-v3']).subscribe(results => {
      expect(results.length).toEqual(2);
      expect(results[0]).toEqual(expected1);
      expect(results[1]).toEqual(expected2);
      done();
    });
  });

  it('should return correct results when backend returns an error', (done: DoneFn) => {
    const mockJiraBackend = mock(JiraBackendService);

    when(mockJiraBackend.getIssues('test1-service', anything())).thenReturn(of([expected1]));
    when(mockJiraBackend.getIssues('test2-service', anything())).thenReturn(of([expected2]));
    when(mockJiraBackend.getIssues('failing-service', anything())).thenReturn(_throw('backend error'));

    const sut = new OpenBugsService(new MockLogService(), instance(mockJiraBackend));

    sut.getOpenBugs(['test1-service-v1', 'test2-service-v3']).subscribe(results => {
      expect(results.length).toEqual(2);
      expect(results[0]).toEqual(expected1);
      expect(results[1]).toEqual(expected2);
      done();
    });
  });
});
