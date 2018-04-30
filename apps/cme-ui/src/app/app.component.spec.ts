import { RouterOutlet } from '@angular/router';
import { PresentationMode, PresentationModeProvider } from '@cme2/shared';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';

import { AppRoutingService } from './app-routing.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  describe('getPresentationAnimationState()', () => {
    it('should return undefined if not in presentation mode', () => {
      const presentationModeProviderMock = mock(PresentationModeProvider);
      when(presentationModeProviderMock.presentationMode).thenReturn(PresentationMode.Off);

      const sut = new AppComponent(instance(presentationModeProviderMock), instance(mock(AppRoutingService)));

      expect(sut.getPresentationAnimationState(null!)).toBeUndefined();
    });

    it('should return page name from route data if in presentation mode', () => {
      const presentationModeProviderMock = mock(PresentationModeProvider);
      when(presentationModeProviderMock.presentationMode).thenReturn(PresentationMode.On);
      const routerOutletMock = mock(RouterOutlet);
      when(routerOutletMock.activatedRouteData).thenReturn({ pageName: 'test-page' });

      const sut = new AppComponent(instance(presentationModeProviderMock), instance(mock(AppRoutingService)));

      expect(sut.getPresentationAnimationState(instance(routerOutletMock))).toBe('test-page');
    });
  });
});
