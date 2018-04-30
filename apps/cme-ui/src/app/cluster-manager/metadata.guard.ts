import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ClusterManagerService, MetaDataService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { first, mapTo, switchMap, delay, tap } from 'rxjs/operators';

@Injectable()
export class MetadataGuard implements CanActivate {
  private _backendIsUp = false;

  constructor(
    private clusterManager: ClusterManagerService,
    private metadata: MetaDataService,
    private router: Router,
    private logger: LogService
  ) {
    this.clusterManager.connectionChanged$.subscribe(() => (this._backendIsUp = false));
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._backendIsUp) {
      return true;
    }

    return this.clusterManager.hasCurrentConnection$.pipe(
      first(),
      switchMap(x => {
        return this.metadata.isBackendReachable();
      }),
      tap(reachable => {
        this._backendIsUp = reachable;
        if (!reachable) {
          this.router.navigate(['/cluster-not-reachable']);
        }
      })
    );
  }
}
