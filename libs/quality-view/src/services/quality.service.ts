import { Injectable, OnDestroy } from '@angular/core';
import { QualityBackendService, QualityIndex, QualityStatus } from '@cme2/connector-quality';
import { MetaDataService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { catchError, delay, filter, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DashboardModel } from '../quality-dashboard';

const REFRESH_INTERVAL = 60000;

@Injectable()
export class QualityService implements OnDestroy {
  private _destroyer$$ = new Subject<void>();
  public readonly solutionHealthIndex$: Observable<QualityIndex | undefined>;

  public readonly codeQuality$: Observable<DashboardModel>;
  public readonly buildQuality$: Observable<DashboardModel>;
  public readonly bugsQuality$: Observable<DashboardModel>;
  public readonly smokeTestQuality$: Observable<DashboardModel>;
  public readonly contractsQuality$: Observable<DashboardModel>;
  public readonly vulnerabilityQuality$: Observable<DashboardModel>;
  public readonly end2EndQuality$: Observable<DashboardModel>;
  public readonly logQuality$: Observable<DashboardModel>;

  constructor(private logger: LogService, private backend: QualityBackendService, private metadata: MetaDataService) {
    const trigger$: Observable<string[]> = merge(timer(10, REFRESH_INTERVAL), this.metadata.currentServices$).pipe(
      takeUntil(this._destroyer$$),
      switchMap(() => this.metadata.currentServices$),
      filter(x => !!x)
    );

    this.solutionHealthIndex$ = trigger$.pipe(
      switchMap(serviceNames => {
        return this.backend.getQualityIndex(serviceNames).pipe(
          catchError((err, caught) => {
            return of(undefined);
          })
        );
      }),
      shareReplay(1)
    );

    this.codeQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.CodeQuality)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.buildQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.Builds)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.bugsQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.Bugs)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.smokeTestQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.SmokeTests)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.contractsQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.Contracts)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.vulnerabilityQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.Vulnerabilities)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.end2EndQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.End2End)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );

    this.logQuality$ = trigger$.pipe(
      delay(this.getRandomDelay()),
      switchMap(services => this.getBackendData(services, QualityStatus.CategoryEnum.Logs)),
      map(x => this.map2DashboardModel(x)),
      shareReplay(1)
    );
  }

  public ngOnDestroy() {
    this._destroyer$$.next();
    this.logger.trace(`QualityService destroyed`);
  }

  private getRandomDelay(): number {
    return Math.round(Math.random() * 200);
  }

  private map2DashboardModel(backendModel: QualityStatus): DashboardModel {
    const healthIndex = this.getHealthIndex(backendModel.status);
    return <DashboardModel>{
      healthIndex,
      issueCount: backendModel.issueCount,
      generatedAt: backendModel.generatedAt
    };
  }

  private getBackendData(services: string[], category: QualityStatus.CategoryEnum): Observable<QualityStatus> {
    return this.backend.getQualityStatusForCategory(services, category).pipe(
      catchError(err => {
        this.logger.warn(`error while fetching '${category}' information`, err);
        return of(<QualityStatus>{
          generatedAt: new Date(),
          status: QualityStatus.StatusEnum.Unknown,
          category
        });
      })
    );
  }

  private getHealthIndex(status: QualityStatus.StatusEnum): number | undefined {
    switch (status) {
      case QualityStatus.StatusEnum.Passed:
        return 100;
      case QualityStatus.StatusEnum.Warning:
        return 50;
      case QualityStatus.StatusEnum.Failed:
        return 0;
      default:
        return undefined;
    }
  }
}
