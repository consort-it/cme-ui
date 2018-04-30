import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MetadataProject, MetaDataService, ClusterManagerService } from '@cme2/core-services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'cme-project-dropdown',
  templateUrl: './project-dropdown.component.html',
  styleUrls: ['./project-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDropdownComponent implements OnInit, OnDestroy {
  private _destroyer$$ = new Subject<void>();
  public projects$: Observable<MetadataProject[]>;
  public readonly currentProject$: Observable<MetadataProject>;

  constructor(
    private metaDataService: MetaDataService,
    private clusterManager: ClusterManagerService,
    private cdr: ChangeDetectorRef
  ) {
    this.projects$ = metaDataService.getProjects();
    this.currentProject$ = metaDataService.currentProject$;
  }

  public setCurrentProject(project: MetadataProject) {
    this.metaDataService.setCurrentProject(project);
  }

  ngOnInit() {
    this.metaDataService.currentProject$
      .pipe(takeUntil(this._destroyer$$))
      .subscribe(project => this.refreshProjects());
    merge(this.clusterManager.connectionChanged$, this.clusterManager.hasCurrentConnection$)
      .pipe(takeUntil(this._destroyer$$))
      .subscribe(() => this.refreshProjects());
  }

  ngOnDestroy() {
    this._destroyer$$.next();
  }

  private refreshProjects(): void {
    this.projects$ = this.metaDataService.getProjects();
    this.cdr.markForCheck();
  }
}
