import { Injectable } from '@angular/core';
import { Environment, FeatureToggleBackendService } from '@cme2/connector-feature-toggle-service';
import { ClusterManagerService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';

import { SolutionPaletteService } from '../../../shared/solution-palette.service';
import { FeatureToggle } from './feature-toggle';
import { normalizeServiceName } from '@cme2/rxjs-utils';
import { catchError } from 'rxjs/operators/catchError';
import { Subject } from 'rxjs/Subject';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { retryWhen } from 'rxjs/operators/retryWhen';

@Injectable()
export class FeatureToggleService {
  public readonly featureToggles$: Observable<FeatureToggle[]>;
  public readonly fetching$: Observable<boolean>;
  public readonly error$$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly error$ = this.error$$.asObservable();

  constructor(
    private featureToggleBackend: FeatureToggleBackendService,
    paletteService: SolutionPaletteService,
    clusterManagementService: ClusterManagerService,
    private logger: LogService
  ) {
    this.featureToggles$ = combineLatest(
      clusterManagementService.currentConnection$,
      paletteService.microserviceNameSelection$
    ).pipe(
      switchMap(([connection, selection]) => {
        if (!connection || !selection) {
          logger.debug(
            `[FeatureToggleService] no service selected or no environment defined; selection: '${selection}', env: '${
              connection.environment
            }'.`
          );
          this.error$$.next(undefined);
          return of([]);
        }
        const normalizedSelection = normalizeServiceName(selection);
        return featureToggleBackend.getFeatureToggles(normalizedSelection).pipe(
          map(
            featureToggleEnvironments =>
              featureToggleEnvironments.find(e => e.name === connection.environment) ||
              ({ name: '', toggles: [] } as Environment)
          ),
          map(featureToggleEnvironment =>
            featureToggleEnvironment.toggles.map(toggle => ({
              toggleName: toggle.name,
              toggleValue: toggle.value,
              featureDescription: toggle.description,
              serviceName: normalizedSelection,
              environment: connection.environment
            }))
          ),
          tap(featureToggles =>
            logger.debug(
              `[FeatureToggleService] feature toggles for service '${normalizedSelection}', env '${
                connection.environment
              }':`,
              featureToggles
            )
          ),
          catchError((e: HttpErrorResponse) => this.handleError(e))
        );
      })
    );

    this.fetching$ = this.featureToggles$.pipe(map(() => false), startWith(true));
  }

  private handleError(e: HttpErrorResponse) {
    this.logger.error(`[FeatureToggleService] Error while retrieving toggles: `, e);
    let message = '';
    if (e.error && e.error.message) {
      message = e.error.message;
    } else {
      message = JSON.stringify(e.error);
    }
    this.error$$.next(message);
    return of([]);
  }

  public setFeatureToggle(serviceName: string, environment: string, toggleName: string, newValue: boolean) {
    serviceName = normalizeServiceName(serviceName);
    this.logger.debug(
      `[FeatureToggleService] changing feature toggle '${toggleName}' of '${serviceName}' in env '${environment}' to new value: `,
      newValue
    );
    this.featureToggleBackend.setFeatureToggle(serviceName, environment, toggleName, newValue).subscribe();
  }
}
