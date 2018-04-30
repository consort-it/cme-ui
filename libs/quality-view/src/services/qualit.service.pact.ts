import { describePact } from '@cme2/testing';
import { PactWeb, Matchers } from '@pact-foundation/pact-web';
import { Type } from '@angular/core';
import { MetaDataService } from '@cme2/core-services';
import { mock, when, instance } from 'ts-mockito/lib/ts-mockito';
import { of } from 'rxjs/observable/of';
import { TestBed } from '@angular/core/testing';
import { MockLogService, LogService } from '@cme2/logging';
import { QualityBackendService } from '@cme2/connector-quality';
import { QualityService } from './quality.service';
import { tap } from 'rxjs/operators';

describePact('QualityService pact', 'quality-adapter', (provider: PactWeb, pactTestModule: Type<any>) => {
  beforeEach(() => {
    const mockMetaDataService = mock(MetaDataService);
    when(mockMetaDataService.currentServices$).thenReturn(of(['test1-service', 'test2-service']));
    const mockMetaDataServiceInstance = instance(mockMetaDataService);

    TestBed.overrideModule(pactTestModule, {
      add: {
        providers: [
          QualityService,
          QualityBackendService,
          { provide: LogService, useClass: MockLogService },
          { provide: MetaDataService, useFactory: () => mockMetaDataServiceInstance }
        ]
      }
    });
  });

  describe('solutionHealthIndex$', () => {
    it('should return a quality index', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has calculated a quality index',
          uponReceiving: 'a request to GET qualityIndex',
          withRequest: {
            method: 'GET',
            path: '/api/v1/quality-adapter/qualityIndex/test1-service%2Ctest2-service'
          },
          willRespondWith: {
            status: 200,
            body: {
              generatedAt: Matchers.ISO8601_DATETIME_FORMAT,
              value: Matchers.integer(0)
            },
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const qualityService = TestBed.get(QualityService) as QualityService;
      qualityService.solutionHealthIndex$.subscribe(
        response => {
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return undefined when there is an internal problem', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has an internal problem',
          uponReceiving: 'a request to GET qualityIndex',
          withRequest: {
            method: 'GET',
            path: '/api/v1/quality-adapter/qualityIndex/test1-service%2Ctest2-service'
          },
          willRespondWith: {
            status: 500,
            body: {
              code: 'QA-34234',
              message: Matchers.somethingLike('bla bla')
            },
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const qualityService = TestBed.get(QualityService) as QualityService;
      qualityService.solutionHealthIndex$.subscribe(
        response => {
          expect(response).toBeUndefined();
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });

  describe('codeQuality$', () => {
    it('should return a DashboardModel with valid passed data', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has passed CodeQuality data',
          uponReceiving: 'a request to GET status',
          withRequest: {
            method: 'GET',
            path: '/api/v1/quality-adapter/status/CodeQuality/test1-service%2Ctest2-service'
          },
          willRespondWith: {
            status: 200,
            body: {
              generatedAt: Matchers.ISO8601_DATETIME_FORMAT,
              category: 'CodeQuality',
              status: 'Passed',
              issueCount: 0,
              ref: Matchers.somethingLike('http://sonar.test.com'),
              details: [
                {
                  serviceName: 'test1-service',
                  status: 'Passed',
                  ref: 'https://sonar.test.com?app=test1-service'
                }
              ]
            },
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const qualityService = TestBed.get(QualityService) as QualityService;
      qualityService.codeQuality$.subscribe(
        response => {
          expect(response.healthIndex).toEqual(100);
          expect(response.issueCount).toEqual(0);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return a DashboardModel with valid warning data', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has warning CodeQuality data',
          uponReceiving: 'a request to GET status',
          withRequest: {
            method: 'GET',
            path: '/api/v1/quality-adapter/status/CodeQuality/test1-service%2Ctest2-service'
          },
          willRespondWith: {
            status: 200,
            body: {
              generatedAt: Matchers.ISO8601_DATETIME_FORMAT,
              category: 'CodeQuality',
              status: 'Warning',
              issueCount: 2,
              ref: Matchers.somethingLike('http://sonar.test.com'),
              details: [
                {
                  serviceName: 'test1-service',
                  status: 'Warning',
                  ref: 'https://sonar.test.com?app=test1-service'
                }
              ]
            },
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const qualityService = TestBed.get(QualityService) as QualityService;
      qualityService.codeQuality$.subscribe(
        response => {
          expect(response.healthIndex).toEqual(50);
          expect(response.issueCount).toEqual(2);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return a DashboardModel with valid fail data', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has failed CodeQuality data',
          uponReceiving: 'a request to GET status',
          withRequest: {
            method: 'GET',
            path: '/api/v1/quality-adapter/status/CodeQuality/test1-service%2Ctest2-service'
          },
          willRespondWith: {
            status: 200,
            body: {
              generatedAt: Matchers.ISO8601_DATETIME_FORMAT,
              category: 'CodeQuality',
              status: 'Failed',
              issueCount: 3,
              ref: Matchers.somethingLike('http://sonar.test.com'),
              details: [
                {
                  serviceName: 'test1-service',
                  status: 'Failed',
                  ref: 'https://sonar.test.com?app=test1-service'
                }
              ]
            },
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const qualityService = TestBed.get(QualityService) as QualityService;
      qualityService.codeQuality$.subscribe(
        response => {
          expect(response.healthIndex).toEqual(0);
          expect(response.issueCount).toEqual(3);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });
});
