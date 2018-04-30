import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MonthOfYear } from '@cme2//shared';

@Component({
  selector: 'cme-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CostsComponent {
  monthOfYear: MonthOfYear;

  constructor(private cdr: ChangeDetectorRef) {
    const now = new Date();
    this.monthOfYear = new MonthOfYear(now.getFullYear(), now.getMonth());
  }

  previousMonth() {
    this.monthOfYear = this.monthOfYear.previousMonth();
    this.cdr.markForCheck();
  }

  nextMonth() {
    this.monthOfYear = this.monthOfYear.nextMonth();
    this.cdr.markForCheck();
  }
}
