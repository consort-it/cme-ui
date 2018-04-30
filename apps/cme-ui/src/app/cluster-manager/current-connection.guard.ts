import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ClusterManagerService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

@Injectable()
export class CurrentConnectionGuard implements CanActivate {
  constructor(private clusterManager: ClusterManagerService, private router: Router, private logger: LogService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const resultPromise = new Promise<boolean>((resolve, reject) => {
      this.clusterManager.hasCurrentConnection$.pipe(first()).subscribe(x => {
        if (x) {
          resolve(x);
        } else {
          this.logger.info('No current connection is set, redirecting to Cluster Connection Setup page.');
          this.router.navigate(['/setupclusterconnection']);
          resolve(false);
        }
      });
    });
    return resultPromise;
  }
}
