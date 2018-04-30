import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { LogService } from '@cme2/logging';
import { JiraService, SolutionPaletteService } from '../../../shared';
import { switchMap, filter, takeUntil } from 'rxjs/operators';
import { JiraIssue } from '@cme2/connector-jira';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { WINDOW_TOKEN } from './ticket-tokens';

@Component({
  selector: 'cme-open-tickets',
  templateUrl: './open-tickets.component.html',
  styleUrls: ['./open-tickets.component.scss']
})
export class OpenTicketsComponent implements OnInit, OnDestroy {
  public issues$: Observable<JiraIssue[]>;
  private _destroy$$ = new Subject<void>();

  constructor(
    private readonly logger: LogService,
    private readonly jiraService: JiraService,
    public readonly paletteService: SolutionPaletteService,
    @Inject(WINDOW_TOKEN) private readonly windowRef: Window
  ) {
    this.issues$ = of([]);
  }

  ngOnInit() {
    this.issues$ = this.paletteService.microserviceNameSelection$.pipe(
      takeUntil(this._destroy$$),
      filter(x => !!x),
      switchMap(serviceName => {
        return this.jiraService.getIssuesByTag(serviceName!);
      })
    );
  }

  ngOnDestroy() {
    this._destroy$$.next();
  }

  onTicketClick(issue: JiraIssue): void {
    this.windowRef.open(issue.url, '_blank');
  }
}
