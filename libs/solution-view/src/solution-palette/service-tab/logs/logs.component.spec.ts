import { ChangeDetectorRef } from '@angular/core';
import { LogEntry } from '@cme2/connector-cloudwatch-logs';
import { LogService } from '@cme2/logging';
import { ChangeDetectorRefDouble } from '@cme2/testing';
import { from } from 'rxjs/observable/from';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, instance, mock, when } from 'ts-mockito';

import { SolutionPaletteService } from '../../../shared';
import { LogsComponent } from './logs.component';
import { LogsService } from './logs.service';

describe('LogsComponent', () => {
  describe('logState', () => {
    it(`should initially be 'log--loading'`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(never());

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(mock(LogsService)),
        instance(mock(LogService)),
        instance(mock(ChangeDetectorRef))
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--loading');
    });

    it(`'should be 'log--notfound' if no microservice is selected`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(of(undefined));

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(mock(LogsService)),
        instance(mock(LogService)),
        new ChangeDetectorRefDouble()
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--notfound');
    });

    it(`'should be 'log--loading' while waiting for LogsService to return logs for selected microservice`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(of('test-service'));
      const cloudwatchLogServiceMock = mock(LogsService);
      when(cloudwatchLogServiceMock.getLogsByMicroService('test-service')).thenReturn(never());

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(cloudwatchLogServiceMock),
        instance(mock(LogService)),
        new ChangeDetectorRefDouble()
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--loading');
    });

    it(`'should be 'log--found' if LogsService returns logs for selected microservice`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(of('test-service'));
      const cloudwatchLogServiceMock = mock(LogsService);
      when(cloudwatchLogServiceMock.getLogsByMicroService('test-service')).thenReturn(
        of([{ status: LogEntry.StatusEnum.INFO } as LogEntry])
      );

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(cloudwatchLogServiceMock),
        instance(mock(LogService)),
        new ChangeDetectorRefDouble()
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--found');
    });

    it(`'should be 'log--notfound' if LogsService returns no logs for selected microservice`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(of('test-service'));
      const cloudwatchLogServiceMock = mock(LogsService);
      when(cloudwatchLogServiceMock.getLogsByMicroService('test-service')).thenReturn(of([]));

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(cloudwatchLogServiceMock),
        instance(mock(LogService)),
        new ChangeDetectorRefDouble()
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--notfound');
    });

    it(`'should be 'log--error' if LogsService returns an error for selected microservice`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(of('test-service'));
      const cloudwatchLogServiceMock = mock(LogsService);
      when(cloudwatchLogServiceMock.getLogsByMicroService('test-service')).thenReturn(_throw({}));

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(cloudwatchLogServiceMock),
        instance(mock(LogService)),
        new ChangeDetectorRefDouble()
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--error');
    });

    it(`should recover from getLogsByMicroService error`, () => {
      const solutionPaletteServiceMock = mock(SolutionPaletteService);
      when(solutionPaletteServiceMock.microserviceNameSelection$).thenReturn(from(['test-service1', 'test-service2']));

      const cloudwatchLogServiceMock = mock(LogsService);
      when(cloudwatchLogServiceMock.getLogsByMicroService(anyString()))
        .thenReturn(_throw({}))
        .thenReturn(of([]));

      const sut = new LogsComponent(
        instance(solutionPaletteServiceMock),
        instance(cloudwatchLogServiceMock),
        instance(mock(LogService)),
        new ChangeDetectorRefDouble()
      );

      sut.ngOnInit();
      expect(sut.logState).toBe('log--notfound');
    });
  });
});
