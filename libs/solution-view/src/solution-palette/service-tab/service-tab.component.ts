import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ClusterManagerService, K8sServiceStatus, MetaDataService, MetadataService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { AvailabilityCheckerService, UiConnectionCheckerService, FetchService } from '../../shared';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AddServiceDialogComponent } from '../../add-service-dialog/add-service-dialog.component';
import { SolutionPaletteService } from '../../shared/solution-palette.service';

@Component({
  selector: 'cme-service-tab',
  templateUrl: './service-tab.component.html',
  styleUrls: ['./service-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AvailabilityCheckerService, UiConnectionCheckerService, FetchService]
})
export class ServiceTabComponent implements OnInit, OnDestroy {
  private _selectedService: MetadataService | undefined;

  public reason$: Observable<string | undefined>;

  private _killer$$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly metadataService: MetaDataService,
    private readonly availabilityCheckerService: AvailabilityCheckerService,
    public readonly paletteService: SolutionPaletteService,
    private readonly clusterManager: ClusterManagerService,
    private logger: LogService
  ) {
    const namespaces$ = this.clusterManager.currentConnection$.pipe(map(x => x.namespace));
    this.reason$ = combineLatest(namespaces$, this.paletteService.microserviceSelection$).pipe(
      takeUntil(this._killer$$),
      switchMap(values => {
        if (values[1] === undefined) {
          return of(undefined);
        } else {
          return this.availabilityCheckerService.getServiceAvailability(values[0], values[1]!).pipe(
            takeUntil(this._killer$$),
            map(kubeInfo => {
              if (kubeInfo.status !== K8sServiceStatus.Running) {
                return kubeInfo.reason;
              }
              return undefined;
            })
          );
        }
      })
    );
  }

  get selectedServiceName(): string {
    return this._selectedService ? this._selectedService.name : '';
  }

  ngOnInit() {
    this.paletteService.microserviceSelection$
      .pipe(takeUntil(this._killer$$))
      .subscribe(service => (this._selectedService = service));
  }

  ngOnDestroy() {
    this._killer$$.next();
  }

  addNewService() {
    this.dialog.open(AddServiceDialogComponent, {
      width: '400px',
      closeOnNavigation: false
    });
  }

  deleteService() {
    if (this._selectedService) {
      const serviceName = this._selectedService.name;
      this.metadataService.deleteService(this._selectedService.name).subscribe(() => {
        this.logger.debug(`service '${serviceName}' deleted from project.`);
      });
    }
  }
}
