import { Injectable, OnDestroy } from '@angular/core';
import {
  K8sService,
  K8sServiceStatus,
  KubernetesService,
  MetadataService,
  MetadataServiceType
} from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { UiConnectionCheckerService } from '../ui-connection-checker';

@Injectable()
export class AvailabilityCheckerService implements OnDestroy {
  constructor(
    private k8sService: KubernetesService,
    private uiConnectionChecker: UiConnectionCheckerService,
    private logger: LogService
  ) {
    this.k8sService.startRefresh();
  }

  ngOnDestroy() {
    this.k8sService.stopRefresh();
    this.logger.debug('AvailabilityCheckerService destroyed');
  }

  getServiceAvailability(namespace: string, service?: MetadataService): Observable<K8sService> {
    if (service) {
      switch (service.serviceType) {
        case MetadataServiceType.Backend:
          return this.k8sService.getService(namespace, service.name);
        case MetadataServiceType.UI:
          return this.checkUi(service);
        default:
          this.logger.error(
            `Unknown serviceType '${service.serviceType}' in service '${service.name}' (namespace: ${namespace})`,
            service
          );
      }
    }
    return empty<K8sService>();
  }

  private checkUi(service: MetadataService): Observable<K8sService> {
    if (service.url) {
      return this.uiConnectionChecker.checkConnection(service.url).pipe(
        map(x => {
          return <K8sService>{
            instances: 1,
            status: x.isError ? K8sServiceStatus.Broken : K8sServiceStatus.Running,
            name: service ? service.name : 'unknown',
            version: x.version,
            reason: x.reason
          };
        })
      );
    } else {
      return of(<K8sService>{
        instances: 0,
        status: K8sServiceStatus.Unknown,
        name: service.name,
        version: undefined
      });
    }
  }
}
