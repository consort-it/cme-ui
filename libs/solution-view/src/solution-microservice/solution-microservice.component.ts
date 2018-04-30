import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ClusterManagerService,
  K8sService,
  K8sServiceStatus,
  KubernetesService,
  MetadataService,
  MetadataServiceType
} from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JiraService, SelectedPaletteTab, SolutionPaletteService } from '../shared';
import { AvailabilityCheckerService, UiConnectionCheckerService, FetchService } from '../shared';

@Component({
  selector: 'cme-solution-microservice',
  templateUrl: './solution-microservice.component.html',
  styleUrls: ['./solution-microservice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AvailabilityCheckerService, UiConnectionCheckerService, FetchService]
})
export class SolutionMicroserviceComponent implements OnInit, OnDestroy {
  private _destroy$$ = new Subject<void>();

  @Input() service: MetadataService | undefined;
  public running = false;
  public broken = false;
  public version: string | undefined;

  @HostBinding('attr.title') public reason: string | undefined;

  public readonly selected$: Observable<boolean>;

  public ticketCount$: Observable<number>;

  constructor(
    private logger: LogService,
    private paletteService: SolutionPaletteService,
    private clusterManager: ClusterManagerService,
    private availabilityChecker: AvailabilityCheckerService,
    private jiraService: JiraService,
    private cdr: ChangeDetectorRef
  ) {
    this.selected$ = this.paletteService.microserviceSelection$.pipe(
      map(selectedService => !!selectedService && !!this.service && selectedService.name === this.service.name)
    );
    this.ticketCount$ = of(0);
  }

  @HostListener('click')
  onclick() {
    if (this.service) {
      this.paletteService.microserviceSelection = this.service;
      this.paletteService.tabSelection = SelectedPaletteTab.Service;
    }
  }

  ngOnInit() {
    this.clusterManager.currentConnection$
      .pipe(
        takeUntil(this._destroy$$),
        tap(() => {
          // reset initial state when cluster changes
          this.resetState();
        }),
        switchMap(conn => {
          return this.availabilityChecker.getServiceAvailability(conn.namespace, this.service);
        })
      )
      .subscribe((kubeInfo: K8sService) => {
        this.version = kubeInfo.version;
        this.running = kubeInfo.status === K8sServiceStatus.Running;
        this.broken = this.isBroken(kubeInfo.status);
        this.reason = this.running ? undefined : kubeInfo.reason;
        this.cdr.markForCheck();
      });

    if (this.service) {
      this.ticketCount$ = this.jiraService
        .getIssuesByTag(this.service.name)
        .pipe(takeUntil(this._destroy$$), map(issues => issues.length));
    }
  }

  ngOnDestroy() {
    this._destroy$$.next();
  }

  private isBroken(status: K8sServiceStatus): boolean {
    return (
      status === K8sServiceStatus.Broken ||
      status === K8sServiceStatus.Stopped ||
      status === K8sServiceStatus.Initializing
    );
  }

  private resetState(): void {
    this.version = undefined;
    this.running = false;
    this.broken = false;
    this.cdr.markForCheck();
  }
}
