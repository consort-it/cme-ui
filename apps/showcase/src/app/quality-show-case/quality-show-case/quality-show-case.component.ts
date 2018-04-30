import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cme-quality-show-case',
  templateUrl: './quality-show-case.component.html',
  styleUrls: ['./quality-show-case.component.scss']
})
export class QualityShowCaseComponent implements OnInit {
  healthIndex1 = 75;
  healthIndex2 = 25;

  healthIndex3 = 0;

  healthIndex4 = 100;

  ngOnInit() {}
}
