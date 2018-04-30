import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LogService } from '@cme2/logging';
import { describePact } from '@cme2/testing';
import { Matchers, PactWeb } from '@pact-foundation/pact-web';
import { instance, mock, when, verify, anyString } from 'ts-mockito';
import {
  KubernetesService as KubernetesBackendService,
  Namespace,
  Service,
  ErrorResponse
} from '@cme2/connector-kubernetes';

import { KubernetesService } from './kubernetes.service';
import {
  NotificationService,
  ClusterManagerService,
  K8sNamespace,
  K8sService,
  K8sServiceStatus,
  NotificationType
} from '@cme2/core-services';
import { never } from 'rxjs/observable/never';
import { skip } from 'rxjs/operators/skip';

describePact('KubernetesService pact', 'kubernetes-adapter', (provider: PactWeb, pactTestModule: Type<any>) => {
  beforeEach(() => {
    const mockClusterManagerService = mock(ClusterManagerService);
    when(mockClusterManagerService.connectionChanged$).thenReturn(never());

    TestBed.overrideModule(pactTestModule, {
      add: {
        providers: [
          KubernetesBackendService,
          KubernetesService,
          NotificationService,
          { provide: LogService, useFactory: () => instance(mock(LogService)) },
          { provide: ClusterManagerService, useFactory: () => instance(mockClusterManagerService) }
        ]
      }
    });
  });

  describe('getNamespaces()', () => {
    it('should return an empty list if no namespaces exist', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has no namespaces',
          uponReceiving: 'a request to GET namespaces',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces'
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

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getNamespaces().subscribe(
        response => {
          expect(response).toEqual([]);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return all namespaces if existing', async (done: DoneFn) => {
      const expectedNamespaces: Array<K8sNamespace> = [{ id: 'ID1', name: 'name1' }, { id: 'ID2', name: 'name2' }];

      await provider
        .addInteraction({
          state: 'provider has existing namespaces',
          uponReceiving: 'a request to GET namespaces',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces'
          },
          willRespondWith: {
            status: 200,
            body: Matchers.somethingLike(expectedNamespaces),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getNamespaces().subscribe(
        response => {
          expect(response).toEqual(expectedNamespaces);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });

  describe('getAllServices()', () => {
    it('should add notification if namespace does not exist', async (done: DoneFn) => {
      const expectedErrorResponse: ErrorResponse = {
        code: 'KA-1234',
        status: 400,
        message: 'an error message',
        location: 'somewhere',
        time: 'now' // this should be date-time in swagger!
      };

      await provider
        .addInteraction({
          state: 'provider has no namespace NAMESPACEID',
          uponReceiving: 'a request to GET all services of the non-existing namespace NAMESPACEID',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces/NAMESPACEID/services'
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

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getAllServices('NAMESPACEID').subscribe();
      const notificationService = TestBed.get(NotificationService) as NotificationService;
      notificationService.notifications$.pipe(skip(1)).subscribe(notifications => {
        expect(
          notifications.find(notification => notification.description.includes(expectedErrorResponse.message))
        ).toBeDefined();
        done();
      });
    });

    it('should return an empty list if no services exist in the given namespace', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has a namespace without services',
          uponReceiving: 'a request to GET all services of the empty namespace',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces/NAMESPACEID/services'
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

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getAllServices('NAMESPACEID').subscribe(
        response => {
          expect(response).toEqual([]);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return all services in the given namespace if existing', async (done: DoneFn) => {
      const expectedServices: Array<K8sService> = [
        { instances: 1, name: 'my-service-v1', status: K8sServiceStatus.Running, version: '1' },
        { instances: 1, name: 'my-service-2-v1', status: K8sServiceStatus.Broken, version: undefined }
      ];

      await provider
        .addInteraction({
          state: 'provider has a namespace NAMESPACEID with services',
          uponReceiving: 'a request to GET all services of namespace NAMESPACEID',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces/NAMESPACEID/services'
          },
          willRespondWith: {
            status: 200,
            body: Matchers.somethingLike(expectedServices),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getAllServices('NAMESPACEID').subscribe(
        response => {
          expect(response).toEqual(
            expectedServices.map(service => {
              service.reason = undefined;
              return service;
            })
          );
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });

  describe('getService()', () => {
    it('should add notification if an error occurs', async (done: DoneFn) => {
      const expectedErrorResponse: ErrorResponse = {
        code: 'KA-1234',
        status: 500,
        message: 'an error message',
        location: 'somewhere',
        time: 'now' // this should be date-time in swagger!
      };

      await provider
        .addInteraction({
          state: 'provider is in an arbitrary state',
          uponReceiving: 'a request to GET all services of a namespace that cause an internal provider error',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces/NAMESPACEID/services'
          },
          willRespondWith: {
            status: 500,
            body: Matchers.somethingLike(expectedErrorResponse),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getService('NAMESPACEID', 'someservice').subscribe();
      const notificationService = TestBed.get(NotificationService) as NotificationService;
      notificationService.notifications$.pipe(skip(1)).subscribe(notifications => {
        expect(
          notifications.find(notification => notification.description.includes(expectedErrorResponse.message))
        ).toBeDefined();
        done();
      });
    });

    it('should return all services in the given namespace if existing', async (done: DoneFn) => {
      const expectedServices: Array<K8sService> = [
        { instances: 1, name: 'my-service-v1', status: K8sServiceStatus.Running, version: '1' }
      ];

      await provider
        .addInteraction({
          state: 'provider has a namespace NAMESPACEID with service my-service-v1',
          uponReceiving: 'a request to GET all services of namespace NAMESPACEID',
          withRequest: {
            method: 'GET',
            path: '/api/v1/kubernetes-adapter/namespaces/NAMESPACEID/services'
          },
          willRespondWith: {
            status: 200,
            body: Matchers.somethingLike(expectedServices),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const kubernetesService = TestBed.get(KubernetesService) as KubernetesService;
      kubernetesService.getService('NAMESPACEID', 'my-service-v1').subscribe(
        response => {
          const expectedService = { ...expectedServices[0], reason: undefined };
          expect(response).toEqual(expectedService);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });
});
