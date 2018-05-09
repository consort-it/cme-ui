import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cme-failed-builds-bar-chart',
  templateUrl: './failed-builds-bar-chart.component.html',
  styleUrls: ['./failed-builds-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FailedBuildsBarChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
