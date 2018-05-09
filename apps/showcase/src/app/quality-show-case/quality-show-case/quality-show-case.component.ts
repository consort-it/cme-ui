import { Component } from '@angular/core';

@Component({
  selector: 'cme-quality-show-case',
  templateUrl: './quality-show-case.component.html',
  styleUrls: ['./quality-show-case.component.scss']
})
export class QualityShowCaseComponent {
  healthIndex1 = 75;
  healthIndex2 = 25;

  healthIndex3 = 0;

  healthIndex4 = 100;

  indicatorCount1 = 9;
  indicatorCount2 = 7;
}
