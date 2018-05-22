import { Component, OnInit } from '@angular/core';
import { MetaDataService, MetadataProject, NotificationService, NotificationType } from '@cme2/core-services';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil, map, first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'cme-context-tab',
  templateUrl: './context-tab.component.html',
  styleUrls: ['./context-tab.component.scss']
})
export class ContextTabComponent implements OnInit {
  private _destroyer$$ = new Subject<void>();

  diagram$: Observable<string> = of('');

  constructor(private meta: MetaDataService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.diagram$ = this.meta.currentProject$.pipe(
      takeUntil(this._destroyer$$),
      map(x => (x.context ? x.context : ''))
    );
  }

  save(value: any) {
    if (value.diagram !== undefined) {
      this.meta.currentProject$
        .pipe(
          takeUntil(this._destroyer$$),
          first(),
          switchMap(project => {
            project.context = value.diagram;
            return this.meta.updateProject(project.id, project);
          })
        )
        .subscribe(
          () => void 0,
          err => {
            this.notificationService.addNotification(
              'Error saving context diagram',
              'Could not save context diagram. Reason: ' + err.toString(),
              NotificationType.Alert
            );
          }
        );
    }
  }
}
