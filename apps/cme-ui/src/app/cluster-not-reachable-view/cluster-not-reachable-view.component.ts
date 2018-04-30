import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { MetaDataService } from '@cme2/core-services';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { switchMap, catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { LogService } from '@cme2/logging';

const RECHECK_INTERVAL = 5000;

@Component({
  selector: 'cme-cluster-not-reachable-view',
  templateUrl: './cluster-not-reachable-view.component.html',
  styleUrls: ['./cluster-not-reachable-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClusterNotReachableViewComponent implements OnInit, OnDestroy {
  public backendReachable$: Observable<boolean>;
  private _subscription = Subscription.EMPTY;

  constructor(
    private readonly logger: LogService,
    private readonly metadata: MetaDataService,
    private readonly router: Router
  ) {
    this.backendReachable$ = timer(10000, RECHECK_INTERVAL).pipe(
      switchMap(_ => {
        return this.metadata.isBackendReachable();
      }),
      catchError((err, caught) => {
        return of(false);
      })
    );
  }

  ngOnInit() {
    this._subscription = this.backendReachable$.pipe(filter(reachable => reachable === true)).subscribe(reachable => {
      this.logger.info('Regained connection to metadata-service. Redirecting to home page.');
      this.router.navigate(['/home']);
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
