import { K8sService, K8sServiceStatus, KubernetesService, MetadataServiceType } from '@cme2/core-services';
import { LogService, MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ConnectionCheckResult, UiConnectionCheckerService } from '../ui-connection-checker';
import { AvailabilityCheckerService } from './availability-checker.service';

describe('AvailabilityCheckerService', () => {
  it('should stop K8s service refresh when destroyed', () => {
    const mockK8sService = mock(KubernetesService);
    const mockUiConnectionService = mock(UiConnectionCheckerService);

    const sut = new AvailabilityCheckerService(
      instance(mockK8sService),
      instance(mockUiConnectionService),
      new MockLogService()
    );

    sut.ngOnDestroy();

    verify(mockK8sService.stopRefresh()).once(); //NOSONAR
  });

  it('should log unknown serviceTypes', () => {
    const mockK8sService = mock(KubernetesService);
    const mockUiConnectionService = mock(UiConnectionCheckerService);
    const mockLogService = mock(LogService);

    const sut = new AvailabilityCheckerService(
      instance(mockK8sService),
      instance(mockUiConnectionService),
      instance(mockLogService)
    );

    sut.getServiceAvailability('test', {
      serviceType: 'something new' as any,
      name: 'test-service'
    });

    verify(mockLogService.error(anything(), anything())).once(); //NOSONAR
  });

  it('should return valid data when it is a UI service with url', (done: Function) => {
    const mockK8sService = mock(KubernetesService);

    const mockUiConnectionService = mock(UiConnectionCheckerService);
    when(mockUiConnectionService.checkConnection('http://www.example.com')).thenReturn(
      of(<ConnectionCheckResult>{
        isError: false,
        url: 'http://www.example.com',
        statusCode: 200,
        responseTime: 42,
        reason: 'works'
      })
    );

    const sut = new AvailabilityCheckerService(
      instance(mockK8sService),
      instance(mockUiConnectionService),
      new MockLogService()
    );

    sut
      .getServiceAvailability('test', {
        name: 'test',
        serviceType: MetadataServiceType.UI,
        url: 'http://www.example.com'
      })
      .subscribe(res => {
        expect(res.status).toEqual(K8sServiceStatus.Running);
        expect(res.reason).toEqual('works');
        done();
      });
  });

  it('should return valid data when it is a UI service without url', (done: Function) => {
    const mockK8sService = mock(KubernetesService);
    const mockUiConnectionService = mock(UiConnectionCheckerService);

    const sut = new AvailabilityCheckerService(
      instance(mockK8sService),
      instance(mockUiConnectionService),
      new MockLogService()
    );

    sut
      .getServiceAvailability('test', {
        name: 'test',
        serviceType: MetadataServiceType.UI
      })
      .subscribe(res => {
        expect(res.status).toEqual(K8sServiceStatus.Unknown);
        done();
      });
  });

  it('should return valid data when it is a Backend service', (done: Function) => {
    const mockK8sService = mock(KubernetesService);
    const mockUiConnectionService = mock(UiConnectionCheckerService);
    when(mockK8sService.getService('test', 'test-service')).thenReturn(
      of(<K8sService>{
        status: K8sServiceStatus.Running,
        reason: 'whatever',
        name: 'test-service',
        instances: 1,
        version: 'testversion'
      })
    );

    const sut = new AvailabilityCheckerService(
      instance(mockK8sService),
      instance(mockUiConnectionService),
      new MockLogService()
    );

    sut
      .getServiceAvailability('test', {
        name: 'test-service',
        serviceType: MetadataServiceType.Backend
      })
      .subscribe(res => {
        expect(res.status).toEqual(K8sServiceStatus.Running);
        expect(res.reason).toEqual('whatever');
        expect(res.version).toEqual('testversion');
        done();
      });
  });
});
