import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { JiraIssue } from '@cme2/connector-jira';
import { MetaDataService } from '@cme2/core-services';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { empty } from 'rxjs/observable/empty';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { OpenBugsService } from '../open-bugs.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'cme-open-bugs',
  templateUrl: './open-bugs.component.html',
  styleUrls: ['./open-bugs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenBugsComponent implements OnInit, OnDestroy {
  private _destroyer$$ = new Subject<void>();

  openBugs$: Observable<JiraIssue[]> = empty();
  loading$ = new BehaviorSubject<boolean>(true);

  constructor(private metadata: MetaDataService, private openBugs: OpenBugsService) {}

  ngOnInit() {
    this.openBugs$ = this.metadata.currentServices$.pipe(
      takeUntil(this._destroyer$$),
      tap(() => {
        this.loading$.next(true);
      }),
      switchMap(names => this.openBugs.getOpenBugs(names)),
      tap(() => {
        this.loading$.next(false);
      })
    );
  }

  ngOnDestroy() {
    this._destroyer$$.next();
  }

  onBugClick(bug: JiraIssue) {
    if (bug.url) {
      window.open(bug.url, '_blank');
    }
  }
}
