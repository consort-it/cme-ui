import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDrawer, MatSidenavModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '@cme2/i18n';
import { PresentationMode, PresentationModeProvider } from '@cme2/shared';
import { ChangeDetectorRefDouble } from '@cme2/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';

import { MainAreaComponent } from './main-area.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationModule } from './navigation/navigation.module';
import { LoggingModule } from '@cme2/logging';

describe('MainAreaComponent', () => {
  let presentationModeProviderMock: PresentationModeProvider;
  let presentationMode$$: BehaviorSubject<PresentationMode>;

  beforeEach(() => {
    presentationMode$$ = new BehaviorSubject<PresentationMode>(PresentationMode.Off);
    presentationModeProviderMock = mock(PresentationModeProvider);
    when(presentationModeProviderMock.presentationMode$).thenReturn(presentationMode$$.asObservable());
    when(presentationModeProviderMock.presentationMode).thenReturn(presentationMode$$.value);
  });

  describe('navigationVisible bindings', () => {
    @Component({
      template: `<cme-main-area [(navigationVisible)]="navigationVisible"></cme-main-area>`
    })
    class TestHostComponent {
      navigationVisible: boolean | undefined = undefined;
    }

    let testHostComponent: TestHostComponent;
    let component: MainAreaComponent;
    let drawerComponent: MatDrawer;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MatSidenavModule, NoopAnimationsModule],
        declarations: [MainAreaComponent, TestHostComponent],
        providers: [
          { provide: ChangeDetectorRef, useValue: new ChangeDetectorRefDouble() },
          { provide: PresentationModeProvider, useFactory: () => instance(presentationModeProviderMock) }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });
      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      testHostComponent = fixture.componentInstance;
      component = fixture.debugElement.query(By.directive(MainAreaComponent)).componentInstance;
      drawerComponent = fixture.debugElement.query(By.directive(MatDrawer)).componentInstance;
    });

    describe('navigationVisible', () => {
      it('should initially have a closed drawer', () => {
        expect(drawerComponent.opened).toBeFalsy();
      });

      it('should open drawer when navigationVisible is true', () => {
        testHostComponent.navigationVisible = true;
        fixture.detectChanges();
        expect(drawerComponent.opened).toBeTruthy();
      });

      it('should close drawer when navigationVisible is false', () => {
        testHostComponent.navigationVisible = true;
        fixture.detectChanges();
        testHostComponent.navigationVisible = false;
        fixture.detectChanges();
        expect(drawerComponent.opened).toBeFalsy();
      });
    });

    describe('navigationVisibleChange', () => {
      it(
        'should emit true when drawer opens',
        fakeAsync(() => {
          drawerComponent.open();
          fixture.detectChanges();
          tick();
          expect(testHostComponent.navigationVisible).toBeTruthy();
        })
      );
    });
  });

  describe('navigation button', () => {
    let component: MainAreaComponent;
    let drawerComponent: MatDrawer;
    let buttonDebugElement: DebugElement;
    let fixture: ComponentFixture<MainAreaComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          MatSidenavModule,
          NoopAnimationsModule,
          LoggingModule.forMocking(),
          HttpClientModule,
          I18nModule.forRoot()
        ],
        declarations: [MainAreaComponent],
        providers: [
          { provide: ChangeDetectorRef, useValue: new ChangeDetectorRefDouble() },
          { provide: PresentationModeProvider, useFactory: () => instance(presentationModeProviderMock) }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });
      fixture = TestBed.createComponent(MainAreaComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      buttonDebugElement = fixture.debugElement.query(By.css('.nav-button'));
      drawerComponent = fixture.debugElement.query(By.directive(MatDrawer)).componentInstance;
    });

    it('should initially show menu icon', () => {
      expect(component.navigationButtonIcon).toBe('menu');
    });

    it(
      'should open drawer on click if menu icon is shown',
      fakeAsync(() => {
        buttonDebugElement.nativeElement.click();
        fixture.detectChanges();
        tick();
        expect(drawerComponent.opened).toBeTruthy();
      })
    );

    it(
      'should close drawer on click if clear icon is shown',
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

    it(
      'should show clear icon when drawer is open',
      fakeAsync(() => {
        drawerComponent.open();
        fixture.detectChanges();
        tick();
        expect(component.navigationButtonIcon).toBe('clear');
      })
    );

    it(
      'should show menu icon when drawer is closed',
      fakeAsync(() => {
        drawerComponent.open();
        fixture.detectChanges();
        tick();
        drawerComponent.close();
        fixture.detectChanges();
        tick();
        expect(component.navigationButtonIcon).toBe('menu');
      })
    );

    it('should be invisible in presentation mode', () => {
      presentationMode$$.next(PresentationMode.On);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.nav-button-container'))).toBeFalsy();
    });

    it('should be visible when not in presentation mode', () => {
      presentationMode$$.next(PresentationMode.On);
      fixture.detectChanges();
      presentationMode$$.next(PresentationMode.Off);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.nav-button-container'))).toBeTruthy();
    });
  });

  describe('navigation entries', () => {
    let component: MainAreaComponent;
    let navigationComponent: NavigationComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          MatSidenavModule,
          NoopAnimationsModule,
          NavigationModule,
          RouterTestingModule,
          LoggingModule.forMocking(),
          HttpClientModule,
          I18nModule.forRoot()
        ],
        declarations: [MainAreaComponent],
        providers: [
          { provide: ChangeDetectorRef, useValue: new ChangeDetectorRefDouble() },
          { provide: PresentationModeProvider, useFactory: () => instance(presentationModeProviderMock) }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });
      const fixture = TestBed.createComponent(MainAreaComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      navigationComponent = fixture.debugElement.query(By.directive(NavigationComponent)).componentInstance;
    });

    it(
      'should close drawer on click',
      fakeAsync(() => {
        component.navigationVisible = true;
        navigationComponent.entrySelected.emit();
        expect(component.navigationVisible).toBeFalsy();
      })
    );
  });

  describe('navigationVisible', () => {
    it('should be set to false when presentation starts', () => {
      const sut = new MainAreaComponent(instance(presentationModeProviderMock), new ChangeDetectorRefDouble());
      sut.ngOnInit();
      sut.navigationVisible = true;

      presentationMode$$.next(PresentationMode.On);
      expect(sut.navigationVisible).toBeFalsy();
    });
  });
});
