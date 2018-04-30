import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaletteToolbarButtonComponent } from './palette-toolbar-button.component';

describe('PaletteToolbarButtonComponent', () => {
  @Component({
    template: `
            <cme-palette-toolbar-button [disabled]="disable" (click)="click()"></cme-palette-toolbar-button>`
  })
  class TestHostComponent {
    disable = false;
    clicked = false;

    click() {
      this.clicked = true;
    }
  }

  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let component: PaletteToolbarButtonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, PaletteToolbarButtonComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    component = testHostFixture.debugElement.query(By.directive(PaletteToolbarButtonComponent)).componentInstance;
    testHostFixture.detectChanges();
  });

  it('should emit clicks', () => {
    const element = testHostFixture.nativeElement.querySelector('button');
    element.dispatchEvent(new Event('click'));

    expect(testHostComponent.clicked).toBe(true);
  });

  it('should not emit clicks when the button is disabled', () => {
    testHostComponent.disable = true;
    testHostFixture.detectChanges();
    const element = testHostFixture.nativeElement.querySelector('button');
    element.dispatchEvent(new Event('click'));

    expect(testHostComponent.clicked).toBe(false);
  });
});
