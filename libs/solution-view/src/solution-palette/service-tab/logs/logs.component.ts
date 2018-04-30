import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorResponse, LogEntry } from '@cme2/connector-cloudwatch-logs';
import { LogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { SolutionPaletteService } from '../../../shared';
import { LogsService } from './logs.service';

interface LogLine extends Readonly<LogEntry> {
  readonly class: 'log__entry--info' | 'log__entry--error';
}

function logEntriesToLogLines(logs: LogEntry[]): LogLine[] {
  return logs.map(({ status, ...rest }) => {
    return {
      class: `log__entry--${status.toLowerCase()}`,
      ...rest
    } as LogLine;
  });
}

@Component({
  selector: 'cme-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsComponent implements OnInit, OnDestroy {
  private logs: LogLine[] | undefined = undefined;
  public errorMessage: string | undefined = undefined;
  private subscription = Subscription.EMPTY;

  public readonly timestampFormat = of('shortDate');

  public constructor(
    private paletteService: SolutionPaletteService,
    private logsService: LogsService,
    private log: LogService,
    private cdr: ChangeDetectorRef
  ) {}

  public get logLines(): LogLine[] {
    return this.logs || [];
  }

  public get logState(): 'log--loading' | 'log--found' | 'log--notfound' | 'log--error' {
    if (this.errorMessage) {
      return 'log--error';
    } else if (!this.logs) {
      return 'log--loading';
    } else if (this.logs.length === 0) {
      return 'log--notfound';
    } else {
      return 'log--found';
    }
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.subscription = this.paletteService.microserviceNameSelection$
      .pipe(
        distinctUntilChanged(),
        tap(() => this.resetLogsAndErrorMessage()),
        switchMap(selectedMicroservice => this.selectedMicroserviceToLogEntries(selectedMicroservice))
      )
      .subscribe(logs => this.setLogs(logEntriesToLogLines(logs)), error => this.setErrorMessage(error));
  }

  private fetchLogs(): void {
    this.subscription.unsubscribe();
    this.subscription = this.paletteService.microserviceNameSelection$
      .pipe(
        distinctUntilChanged(),
        tap(() => this.resetLogsAndErrorMessage()),
        switchMap(selectedMicroservice => this.selectedMicroserviceToLogEntries(selectedMicroservice))
      )
      .subscribe(logs => this.setLogs(logEntriesToLogLines(logs)), error => this.setErrorMessage(error));
  }

  private resetLogsAndErrorMessage() {
    this.setErrorMessage(undefined);
    this.setLogs(undefined);
  }

  private selectedMicroserviceToLogEntries(selectedMicroservice: string | undefined) {
    if (!selectedMicroservice) {
      return of([]);
    }
    return this.logsService.getLogsByMicroService(selectedMicroservice).pipe(
      catchError((error, caught) => {
        this.setErrorMessage(error);
        return of([]);
      })
    );
  }

  private setLogs(logs: LogLine[] | undefined): void {
    this.logs = logs;
    this.cdr.detectChanges();
  }

  private setErrorMessage(error: undefined | HttpErrorResponse): void {
    if (error === undefined) {
      this.errorMessage = undefined;
    } else if (typeof error.error === 'string') {
      this.errorMessage = error.error;
    } else {
      try {
        const connectorErrorResponse: ErrorResponse = error.error;
        this.errorMessage = connectorErrorResponse.message;
        this.log.debug('[Logs] CloudwatchLogsService returned ErrorResponse: ', error);
      } catch (e) {
        this.errorMessage = `Error ${error.type}: ${JSON.stringify(error.error)}`;
        this.log.error('Could not get error message from error response', e);
      }
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = Subscription.EMPTY;
  }
}
