import { Month } from './month.enum';

export class MonthOfYear {
  constructor(public readonly year: number, public readonly month: Month) {}

  public nextMonth(): MonthOfYear {
    if (this.month === Month.December) {
      return new MonthOfYear(this.year + 1, Month.January);
    } else {
      return new MonthOfYear(this.year, this.month + 1);
    }
  }

  public previousMonth(): MonthOfYear {
    if (this.month === Month.January) {
      return new MonthOfYear(this.year - 1, Month.December);
    } else {
      return new MonthOfYear(this.year, this.month - 1);
    }
  }
}
