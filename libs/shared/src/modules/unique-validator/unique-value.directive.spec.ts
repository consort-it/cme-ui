import { UniqueValueDirective } from './unique-value.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
@Component({
  template: `<form #form1="ngForm">
              <input  [unique]="values"
                      name="value"
                      #valueRef="ngModel"
                      [(ngModel)]="value">
            </form>`
})
class TestComponent {
  values: string[] = [];
  value = '';
}

describe('MinMaxValueDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [TestComponent, UniqueValueDirective],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  }));

  it('should be valid when the given value is unique', async(() => {
    testComponent.values = ['foo', 'bar'];
    testComponent.value = 'baz';

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const ngModel = fixture.debugElement.query(By.css('input[name=value]')).references['valueRef'];
      expect(ngModel.valid).toBe(true);
    });
  }));

  it('should be invalid when the given value is not unique', async(() => {
    testComponent.values = ['foo', 'bar'];
    testComponent.value = 'foo';

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const ngModel = fixture.debugElement.query(By.css('input[name=value]')).references['valueRef'];
      expect(ngModel.valid).toBe(false);
    });
  }));
});
