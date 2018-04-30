import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorResponse, JiraBackendService, JiraIssue } from '@cme2/connector-jira';
import { LogService } from '@cme2/logging';
import { genericRetryStrategyToken, mockGenericRetryStrategy } from '@cme2/rxjs-utils';
import { JiraService } from '@cme2/solution-view';
import { describePact } from '@cme2/testing';
import { Matchers, PactWeb } from '@pact-foundation/pact-web';
import { instance, mock } from 'ts-mockito';
import {
  HTTP_INTERCEPTORS,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpUserEvent,
  HttpResponse,
  HttpParams,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

describePact('JiraService pact', 'jira-adapter', (provider: PactWeb, pactTestModule: Type<any>) => {
  beforeEach(() => {
    TestBed.overrideModule(pactTestModule, {
      add: {
        providers: [
          JiraService,
          JiraBackendService,
          { provide: LogService, useFactory: () => instance(mock(LogService)) },
          { provide: genericRetryStrategyToken, useValue: mockGenericRetryStrategy }
        ]
      }
    });
  });

  describe('getIssuesByTag()', () => {
    it('should return all jira issues', async (done: DoneFn) => {
      const expectedIssue: JiraIssue = {
        key: 'KEY',
        status: 'STATUS',
        title: 'TITLE',
        updated: new Date(Date.UTC(2018, 6, 5, 4, 3, 2, 1)),
        url: 'https://jirasomewhere.com'
      };

      await provider
        .addInteraction({
          state: 'provider has some issues with tag PACT-TEST-JIRA-TAG',
          uponReceiving: 'a request to GET issues with tag PACT-TEST-JIRA-TAG when issues exist',
          withRequest: {
            method: 'GET',
            path: '/api/v1/jira-adapter/issues',
            query: { tag: 'PACT-TEST-JIRA-TAG' }
          },
          willRespondWith: {
            status: 200,
            body: Matchers.eachLike(expectedIssue),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const jiraService = TestBed.get(JiraService) as JiraService;
      jiraService.getIssuesByTag('PACT-TEST-JIRA-TAG').subscribe(
        response => {
          const logEntryTimestampToDate: (issue: JiraIssue) => JiraIssue = ({ updated, ...rest }) => ({
            updated: new Date(updated),
            ...rest
          });
          expect(response.map(logEntryTimestampToDate)).toEqual([expectedIssue].map(logEntryTimestampToDate));
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return an empty array if no jira issues with given tag are found', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has no issues with tag PACT-TEST-JIRA-TAG-NOT-FOUND',
          uponReceiving: 'a request to GET issues with tag PACT-TEST-JIRA-TAG-NOT-FOUND when no issues exist',
          withRequest: {
            method: 'GET',
            path: '/api/v1/jira-adapter/issues',
            query: { tag: 'PACT-TEST-JIRA-TAG-NOT-FOUND' }
          },
          willRespondWith: {
            status: 200,
            body: [],
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const jiraService = TestBed.get(JiraService) as JiraService;
      jiraService.getIssuesByTag('PACT-TEST-JIRA-TAG-NOT-FOUND').subscribe(
        response => {
          expect(response).toEqual([]);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return nothing if backend responds with error', async (done: DoneFn) => {
      class WrongClientRequestInterceptor implements HttpInterceptor {
        intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
          return next.handle(req.clone({ params: new HttpParams() }));
        }
      }

      TestBed.overrideModule(pactTestModule, {
        add: {
          providers: [{ provide: HTTP_INTERCEPTORS, useClass: WrongClientRequestInterceptor, multi: true }]
        }
      });

      const expectedErrorResponse: ErrorResponse = { code: 'JA-123', message: 'internal error!' };

      await provider
        .addInteraction({
          state: 'provider accepts requests',
          uponReceiving: 'a request to GET issues without providing tag query parameter',
          withRequest: {
            method: 'GET',
            path: '/api/v1/jira-adapter/issues',
            query: {}
          },
          willRespondWith: {
            status: 400,
            body: Matchers.somethingLike(expectedErrorResponse),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const jiraService = TestBed.get(JiraService) as JiraService;
      jiraService.getIssuesByTag('anything').subscribe(undefined, error => done.fail(error), () => done());
    });
  });
});
