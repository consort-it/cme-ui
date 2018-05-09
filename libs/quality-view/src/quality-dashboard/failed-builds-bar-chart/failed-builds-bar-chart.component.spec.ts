import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedBuildsBarChartComponent } from './failed-builds-bar-chart.component';

describe('FailedBuildsBarChartComponent', () => {
  let component: FailedBuildsBarChartComponent;
  let fixture: ComponentFixture<FailedBuildsBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedBuildsBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedBuildsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
