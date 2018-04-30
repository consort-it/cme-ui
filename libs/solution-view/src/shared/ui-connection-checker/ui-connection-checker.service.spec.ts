import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { anyString, anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { FetchService } from './fetch.service';
import { UiConnectionCheckerService } from './ui-connection-checker.service';

describe('UiConnectionCheckerService', () => {
  it(
    'should emit valid ConnectionCheckResult when valid HttpResponse is returned',
    fakeAsync(() => {
      const mockFetcher = mock(FetchService);
      when(mockFetcher.fetch(anyString(), anything())).thenReturn(
        Promise.resolve(<Response>{
          status: 0,
          statusText: ''
        })
      );

      const sut = new UiConnectionCheckerService(new MockLogService(), instance(mockFetcher));

      sut.checkConnection('http://test.com', 5000).subscribe(res => {
        expect(res.isError).toBeFalsy();
        expect(res.statusCode).toBe(0);
      });
      tick(0);
      discardPeriodicTasks();
    })
  );
});
