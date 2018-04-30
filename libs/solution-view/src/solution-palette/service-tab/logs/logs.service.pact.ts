import { fdescribePact, describePact } from '@cme2/testing';
import { PactWeb, Matchers } from '@pact-foundation/pact-web';
import { Type } from '@angular/core';
import { LogEntry } from '@cme2/connector-cloudwatch-logs';
import { TestBed } from '@angular/core/testing';
import { LogsService } from './logs.service';
import { LogsModule } from './logs.module';
import { ApiModule, CloudwatchLogsService } from '@cme2/connector-cloudwatch-logs';

describePact('LogsService pact', 'cloudwatch-logs-adapter', (provider: PactWeb, pactTestModule: Type<any>) => {
  beforeEach(() => {
    TestBed.overrideModule(pactTestModule, {
      add: {
        imports: [LogsModule],
        providers: [CloudwatchLogsService]
      }
    });
  });

  describe('getLogsByMicroService()', () => {
    it('should return logs for the microservice with given name', async (done: DoneFn) => {
      const expectedLog: LogEntry = {
        timestamp: new Date(Date.UTC(2018, 4, 1, 2, 3, 4, 5)),
        status: LogEntry.StatusEnum.INFO,
        message: 'a log message'
      };

      await provider
        .addInteraction({
          state: 'provider has logs for microservice with name MICROSERVICE-NAME',
          uponReceiving: 'a request to GET logs for microservice MICROSERVICE-NAME',
          withRequest: {
            method: 'GET',
            path: '/api/v1/cloudwatch-logs-adapter/MICROSERVICE-NAME'
          },
          willRespondWith: {
            status: 200,
            body: Matchers.eachLike(expectedLog),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));
      const logsService = TestBed.get(LogsService) as LogsService;
      logsService.getLogsByMicroService('MICROSERVICE-NAME').subscribe(
        response => {
          // don't know why, but timestamp is a string after being pressed through the pact provider
          const logEntryTimestampToDate: (logEntry: LogEntry) => LogEntry = ({ timestamp, ...rest }) => ({
            timestamp: new Date(timestamp),
            ...rest
          });
          expect(response.map(logEntryTimestampToDate)).toEqual([expectedLog].map(logEntryTimestampToDate));
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });
});
