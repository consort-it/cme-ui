import { Router } from '@angular/router';
import { ClusterManagerService } from '@cme2/core-services';
import { MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';

import { CurrentConnectionGuard } from './current-connection.guard';

describe('CurrentConnectionGuard', () => {
  it('should return Promise<true> when allowed', (done: DoneFn) => {
    const routerMock: Router = mock(Router);
    const routerInstance: Router = instance(routerMock);

    const clusterManagerMock: ClusterManagerService = mock(ClusterManagerService);
    when(clusterManagerMock.hasCurrentConnection$).thenReturn(of(true));
    const clusterManagerInstance: ClusterManagerService = instance(clusterManagerMock);

    const mockLog = new MockLogService();

    const sut = new CurrentConnectionGuard(clusterManagerInstance, routerInstance, mockLog);

    const result: Promise<boolean> = <Promise<boolean>>sut.canActivate(null as any, null as any);

    result.then(res => {
      if (res) {
        done();
      } else {
        done.fail();
      }
    });
  });

  it('should return Promise<false> when no current connection is present', (done: DoneFn) => {
    const routerMock: Router = mock(Router);
    const routerInstance: Router = instance(routerMock);

    const clusterManagerMock: ClusterManagerService = mock(ClusterManagerService);
    when(clusterManagerMock.hasCurrentConnection$).thenReturn(of(false));
    const clusterManagerInstance: ClusterManagerService = instance(clusterManagerMock);

    const mockLog = new MockLogService();

    const sut = new CurrentConnectionGuard(clusterManagerInstance, routerInstance, mockLog);

    const result: Promise<boolean> = <Promise<boolean>>sut.canActivate(null as any, null as any);

    result.then(res => {
      if (!res) {
        done();
      } else {
        done.fail();
      }
    });
  });

  it('should call router.navigate when no current connection is present', (done: DoneFn) => {
    const routerMock: Router = mock(Router);
    const routerInstance: Router = instance(routerMock);

    const clusterManagerMock: ClusterManagerService = mock(ClusterManagerService);
    when(clusterManagerMock.hasCurrentConnection$).thenReturn(of(false));
    const clusterManagerInstance: ClusterManagerService = instance(clusterManagerMock);

    const mockLog = new MockLogService();

    const sut = new CurrentConnectionGuard(clusterManagerInstance, routerInstance, mockLog);

    const result: Promise<boolean> = <Promise<boolean>>sut.canActivate(null as any, null as any);

    result.then(res => {
      verify(routerMock.navigate(anything())).once();
      done();
    });
  });
});
