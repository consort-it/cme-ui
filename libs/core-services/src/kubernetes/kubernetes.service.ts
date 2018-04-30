import { Injectable } from '@angular/core';
import { KubernetesService as KubernetesBackendService, Namespace, Service } from '@cme2/connector-kubernetes';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';

import { NotificationService, NotificationType } from '../notification';
import { K8sNamespace, K8sService, K8sServiceStatus } from './model';
import { ClusterManagerService } from '../cluster-manager';

@Injectable()
export class KubernetesService {
  private _map = new Map<string, Subject<K8sService>>();
  private _allServicesMap = new Map<string, Subject<K8sService[]>>();

  private _requestInFlight = false;

  private _refreshRequestCount = 0;
  private _refreshIntervalId: number | undefined;

  constructor(
    private logger: LogService,
    private kubernetes: KubernetesBackendService,
    private notificationService: NotificationService,
    private clusterManager: ClusterManagerService
  ) {
    this.clusterManager.connectionChanged$.subscribe(() => {
      this._map.clear();
      this._allServicesMap.clear();
    });
  }

  public getNamespaces(): Observable<K8sNamespace[]> {
    return this.kubernetes.getNamespaces().pipe(
      map((backendNs: Namespace[]) => {
        return backendNs.map(this.mapBackendNamespace2K8sNamespace);
      })
    );
  }

  public getService(namespaceId: string, serviceName: string): Observable<K8sService> {
    return this.getSubjectFor(namespaceId, serviceName);
  }

  /**
   * Start the background refresh task. This can be called multiple times (from different components).
   * But don't forget to call stopRefresh() in your component's ngOnDestroy() method.
   */
  public startRefresh(): void {
    this._refreshRequestCount++;
    if (!this._refreshIntervalId) {
      this._refreshIntervalId = window.setInterval(() => this.refresh(), 5000);
    }
  }

  /**
   * Stops the background refresh task if there are no more other components waiting for fresh data.
   */
  public stopRefresh(): void {
    this._refreshRequestCount--;
    if (this._refreshRequestCount < 0) {
      this._refreshRequestCount = 0;
    }
    if (this._refreshRequestCount === 0 && this._refreshIntervalId) {
      window.clearInterval(this._refreshIntervalId);
      this._refreshIntervalId = undefined;
    }
  }

  public getAllServices(namespaceId: string): Observable<K8sService[]> {
    return this.getSubjectForAll(namespaceId);
  }

  private refresh(): void {
    for (const key of this._allServicesMap.keys()) {
      this.refreshAllServicesFromBackend(key);
    }
  }

  private getMapKey(namespaceId: string, serviceName: string): string {
    return `${namespaceId}__${serviceName}`;
  }

  private getServiceNameFromMapKey(mapKey: string): string {
    return mapKey.split('__')[1];
  }

  private refreshAllServicesFromBackend(namespaceId: string): void {
    if (this._requestInFlight) {
      return;
    }
    this._requestInFlight = true;
    const subject = this.getSubjectForAll(namespaceId);
    this.kubernetes
      .getServices(namespaceId)
      .pipe(
        first(),
        map((backendServices: Service[]) => {
          return backendServices.map(this.mapBackendService2K8sService);
        })
      )
      .subscribe(
        services => {
          subject.next(services);
          services.forEach(svc => {
            const svcSubj = this.getSubjectFor(namespaceId, svc.name);
            svcSubj.next(svc);
          });
          this.notifyRemovedServices(namespaceId, services);
          this._requestInFlight = false;
        },
        (err: any) => {
          this.logger.error(`Could not refresh kubernetes status for ns '${namespaceId}'`, err);
          const message = err.error && err.error.message ? err.error.message : 'unknown error';
          this.notificationService.addNotification(
            'K8s ns status refresh error',
            `Could not refresh service status in namespace '${namespaceId}': ${message}`,
            NotificationType.Warning
          );
          this._requestInFlight = false;
        }
      );
  }

  /**
   * Finds all service subject which have already been requested but are not
   * in the current K8s status message any more. It sends a "I'm gone" message
   * to these subjects.
   * @param namespaceId
   * @param servicesInK8s
   */
  private notifyRemovedServices(namespaceId: string, servicesInK8s: K8sService[]) {
    const cachedKeys: string[] = [...this._map.keys()];
    cachedKeys.forEach(key => {
      if (servicesInK8s.find(x => this.getMapKey(namespaceId, x.name) === undefined)) {
        const subj: Subject<K8sService> = this._map.get(key)!;
        subj.next({
          name: this.getServiceNameFromMapKey(key),
          instances: 0,
          version: undefined,
          status: K8sServiceStatus.Unknown
        });
      }
    });
  }

  private getSubjectFor(namespaceId: string, serviceName: string): Subject<K8sService> {
    const key = this.getMapKey(namespaceId, serviceName);
    if (this._map.has(key)) {
      return this._map.get(key)!;
    }
    const subject = new ReplaySubject<K8sService>(1);
    this._map.set(key, subject);
    setTimeout(() => this.refreshAllServicesFromBackend(namespaceId), 0);
    return subject;
  }

  private getSubjectForAll(namespaceId: string): Subject<K8sService[]> {
    const key = namespaceId;
    if (this._allServicesMap.has(key)) {
      return this._allServicesMap.get(key)!;
    }
    const subject = new ReplaySubject<K8sService[]>(1);
    this._allServicesMap.set(key, subject);
    this.refreshAllServicesFromBackend(namespaceId);
    return subject;
  }

  private mapBackendNamespace2K8sNamespace(backendNs: Namespace): K8sNamespace {
    return {
      ...backendNs
    };
  }

  private mapBackendService2K8sService(backendService: Service): K8sService {
    const frontendService: K8sService = {
      name: backendService.name,
      instances: backendService.instances,
      version: backendService.version,
      status: backendService.status as K8sServiceStatus,
      reason: backendService.reason
    };
    return frontendService;
  }
}
