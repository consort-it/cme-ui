import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PresentationProgressBarComponent } from './presentation-progress-bar.component';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { PresentationModeProvider, PresentationMode } from '@cme2/shared';
import { ChangeDetectorRefDouble } from '@cme2/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';

describe('PresentationProgressBarComponent', () => {
  describe('progress', () => {
    it('should initially be "off"', () => {
      const presentationModeProviderMock = mock(PresentationModeProvider);
      when(presentationModeProviderMock.presentationMode$).thenReturn(never());
      when(presentationModeProviderMock.currentPage$).thenReturn(never());

      const sut = new PresentationProgressBarComponent(
        instance(presentationModeProviderMock),
        new ChangeDetectorRefDouble()
      );
      sut.ngOnInit();

      expect(sut.progress).toBe('off');
    });

    it(
      'should be "animate" when presentationMode$ starts',
      fakeAsync(() => {
        const presentationMode$$ = new Subject<PresentationMode>();
        const presentationModeProviderMock = mock(PresentationModeProvider);
        when(presentationModeProviderMock.presentationMode$).thenReturn(presentationMode$$.asObservable());
        when(presentationModeProviderMock.currentPage$).thenReturn(never());

        const sut = new PresentationProgressBarComponent(
          instance(presentationModeProviderMock),
          new ChangeDetectorRefDouble()
        );
        sut.ngOnInit();
        presentationMode$$.next(PresentationMode.On);

        tick();
        expect(sut.progress).toBe('animate');
      })
    );

    it(
      'should be set to "off" for one tick when presentationMode$ is started and currentPage$ emits',
      fakeAsync(() => {
        const presentationModeProviderMock = mock(PresentationModeProvider);
        when(presentationModeProviderMock.presentationMode$).thenReturn(of(PresentationMode.On));
        const currentPage$$ = new Subject<string>();
        when(presentationModeProviderMock.currentPage$).thenReturn(currentPage$$.asObservable());

        const sut = new PresentationProgressBarComponent(
          instance(presentationModeProviderMock),
          new ChangeDetectorRefDouble()
        );
        sut.ngOnInit();

        tick();
        currentPage$$.next('test-page');
        expect(sut.progress).toBe('off');
        tick();
        expect(sut.progress).toBe('animate');
      })
    );
  });
});
