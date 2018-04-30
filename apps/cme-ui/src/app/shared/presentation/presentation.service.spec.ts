import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LogService } from '@cme2/logging';
import { PresentationMode } from '@cme2/shared';
import { first } from 'rxjs/operators';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { PresentationService } from '.';
import { pageDuration } from './presentation.service';

describe('PresentationService', () => {
  describe('presentationMode', () => {
    it('should initially be Off', () => {
      const sut = new PresentationService(instance(mock(Router)), instance(mock(LogService)));

      expect(sut.presentationMode).toBe(PresentationMode.Off);
    });

    it('should be On if set to On', () => {
      const sut = new PresentationService(instance(mock(Router)), instance(mock(LogService)));
      sut.presentationMode = PresentationMode.On;

      expect(sut.presentationMode).toBe(PresentationMode.On);
    });

    it(
      'should start presentation via router navigation if set to On',
      fakeAsync(() => {
        const routerMock = mock(Router);
        when(routerMock.config).thenReturn([
          {
            path: '',
            data: { containsPresentationModePages: true },
            children: [
              { path: 'view1', data: { shouldShowInPresentationMode: true, pageName: 'view1' } },
              { path: 'view2', data: { shouldShowInPresentationMode: true, pageName: 'view2' } },
              { path: 'view3-should-not-be-presented', data: { shouldShowInPresentationMode: false } },
              { path: 'view4-should-not-be-presented' }
            ]
          }
        ]);
        const sut = new PresentationService(instance(routerMock), instance(mock(LogService)));
        sut.presentationMode = PresentationMode.On;
        tick(pageDuration * 2);
        sut.presentationMode = PresentationMode.Off;
        verify(routerMock.navigate(deepEqual(['/view1']))).twice();
        verify(routerMock.navigate(deepEqual(['/view2']))).once();
      })
    );

    it(
      'should show only routes with shouldShowInPresentationMode in presentation mode',
      fakeAsync(() => {
        const routerMock = mock(Router);
        when(routerMock.config).thenReturn([
          {
            path: '',
            data: { containsPresentationModePages: true },
            children: [
              { path: 'view1', data: { shouldShowInPresentationMode: true, pageName: 'view1' } },
              { path: 'view3-should-not-be-presented', data: { shouldShowInPresentationMode: false } },
              { path: 'view4-should-not-be-presented' }
            ]
          }
        ]);
        const sut = new PresentationService(instance(routerMock), instance(mock(LogService)));
        sut.presentationMode = PresentationMode.On;
        tick(pageDuration);
        sut.presentationMode = PresentationMode.Off;
        verify(routerMock.navigate(deepEqual(['/view1']))).twice();
      })
    );
  });

  describe('presentatioMode$', () => {
    it('should emit current PresentatioMode on subscribe', () => {
      const sut = new PresentationService(instance(mock(Router)), instance(mock(LogService)));
      let actualPresentationMode: any;
      sut.presentationMode$.pipe(first()).subscribe((mode: PresentationMode) => {
        actualPresentationMode = mode;
      });
      expect(actualPresentationMode).toBe(PresentationMode.Off);
    });
    it('should emit new PresentatioMode when slideshowMode changes', () => {
      const sut = new PresentationService(instance(mock(Router)), instance(mock(LogService)));
      let actualPresentationMode: any;
      sut.presentationMode$.pipe(first()).subscribe((mode: PresentationMode) => {
        actualPresentationMode = mode;
      });
      sut.presentationMode = PresentationMode.On;
      expect(actualPresentationMode).toBe(PresentationMode.Off);
    });
  });
});
