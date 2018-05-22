import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDrawer } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoggingModule, LogService } from '@cme2/logging';
import { PresentationMode, PresentationModeProvider, ViewContainerModule } from '@cme2/shared';
import { ChangeDetectorRefDouble } from '@cme2/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';

import { ViewContainerComponent } from './view-container.component';

describe('ViewContainerComponent', () => {
  let presentationModeProviderMock: PresentationModeProvider;
  let presentationMode$$: BehaviorSubject<PresentationMode>;

  beforeEach(() => {
    presentationMode$$ = new BehaviorSubject<PresentationMode>(PresentationMode.Off);
    presentationModeProviderMock = mock(PresentationModeProvider);
    when(presentationModeProviderMock.presentationMode$).thenReturn(presentationMode$$.asObservable());
    when(presentationModeProviderMock.presentationMode).thenReturn(presentationMode$$.value);
  });

  describe('palette button', () => {
    let component: ViewContainerComponent;
    let drawerComponent: MatDrawer;
    let buttonDebugElement: DebugElement;
    let fixture: ComponentFixture<ViewContainerComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ViewContainerModule, NoopAnimationsModule, LoggingModule.forMocking()],
        providers: [
          { provide: ChangeDetectorRef, useValue: new ChangeDetectorRefDouble() },
          { provide: PresentationModeProvider, useFactory: () => instance(presentationModeProviderMock) }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });
      fixture = TestBed.createComponent(ViewContainerComponent);
      component = fixture.componentInstance;
      component.contentChild = {};
      component.paletteChild = {};
      fixture.detectChanges();
      buttonDebugElement = fixture.debugElement.query(By.css('.subheader__palette-button'));
      drawerComponent = fixture.debugElement.query(By.directive(MatDrawer)).componentInstance;
    });

    it('should show build icon if palette is closed', () => {
      component.paletteVisible = false;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.innerText).toBe('build');
    });

    it('should show clear icon if palette is open', () => {
      component.paletteVisible = true;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.innerText).toBe('clear');
    });

    it(
      'should open palette on click if palette is closed',
      fakeAsync(() => {
        buttonDebugElement.nativeElement.click();
        fixture.detectChanges();
        tick();
        expect(drawerComponent.opened).toBeTruthy();
      })
    );

    it(
      'should close palette on click if palette is open',
      fakeAsync(() => {
        buttonDebugElement.nativeElement.click();
        fixture.detectChanges();
        tick();
        buttonDebugElement.nativeElement.click();
        fixture.detectChanges();
        tick();
        expect(drawerComponent.opened).toBeFalsy();
      })
    );

    it('should be invisible in presentation mode', () => {
      presentationMode$$.next(PresentationMode.On);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.subheader__palette-button'))).toBeFalsy();
    });

    it('should be visible when not in presentation mode', () => {
      presentationMode$$.next(PresentationMode.On);
      fixture.detectChanges();
      presentationMode$$.next(PresentationMode.Off);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.subheader__palette-button'))).toBeTruthy();
    });
  });

  describe('without palette', () => {
    it('should not show palette button', () => {
      TestBed.configureTestingModule({
        imports: [ViewContainerModule, NoopAnimationsModule, LoggingModule.forMocking()],
        providers: [
          { provide: ChangeDetectorRef, useValue: new ChangeDetectorRefDouble() },
          { provide: PresentationModeProvider, useFactory: () => instance(presentationModeProviderMock) }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });
      const fixture = TestBed.createComponent(ViewContainerComponent);
      const component = fixture.componentInstance;
      component.contentChild = {};
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.subheader__palette-button'))).toBeNull();
    });
  });

  describe('paletteVisible', () => {
    it('should be set to false when presentation starts', () => {
      const sut = new ViewContainerComponent(
        instance(presentationModeProviderMock),
        new ChangeDetectorRefDouble(),
        document,
        instance(mock(LogService))
      );
      sut.ngOnInit();
      sut.paletteVisible = true;

      presentationMode$$.next(PresentationMode.On);
      expect(sut.paletteVisible).toBeFalsy();
    });

    it('should be set to true when key e is pressed', () => {
      const sut = new ViewContainerComponent(
        instance(presentationModeProviderMock),
        new ChangeDetectorRefDouble(),
        document,
        instance(mock(LogService))
      );
      sut.ngOnInit();
      sut.paletteVisible = false;

      const event = new KeyboardEvent('keyup', {
        code: 'KeyE'
      });
      document.dispatchEvent(event);
      expect(sut.paletteVisible).toBeTruthy();
    });

    it('should be set to false when key e is pressed twice', () => {
      const sut = new ViewContainerComponent(
        instance(presentationModeProviderMock),
        new ChangeDetectorRefDouble(),
        document,
        instance(mock(LogService))
      );
      sut.ngOnInit();
      sut.paletteVisible = false;

      const event = new KeyboardEvent('keyup', {
        code: 'KeyE'
      });
      document.dispatchEvent(event);
      document.dispatchEvent(event);
      expect(sut.paletteVisible).toBeFalsy();
    });
  });
});
